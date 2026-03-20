import {
  ScenarioVariant,
  StepTemplate,
  Step,
  DataSignalTemplate,
  DataSignal,
  DecisionTemplate,
  Decision,
  DecisionOptionTemplate,
  DecisionOption,
} from '@/lib/scenarios/types';

function interpolate(template: string, variables: ScenarioVariant): string {
  return template.replace(/\{\{(\w+(?:\.\w+)*(?:\([^)]*\))?)\}\}/g, (_, expr) => {
    // Handle simple variable references
    const key = expr.split('.')[0].split('(')[0];
    const value = variables[key];
    if (value === undefined) return `{{${expr}}}`;

    // Handle array joining
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    // Handle number formatting
    if (typeof value === 'number') {
      if (expr.includes('toLocaleString')) {
        return value.toLocaleString();
      }
      if (expr.includes('toFixed')) {
        const match = expr.match(/toFixed\((\d+)\)/);
        const digits = match ? parseInt(match[1]) : 2;
        return value.toFixed(digits);
      }
    }

    // Handle expressions like (price - budget).toFixed(2)
    if (expr.includes('-') || expr.includes('+')) {
      return String(value);
    }

    return String(value);
  });
}

function hydrateDataSignal(
  template: DataSignalTemplate,
  variables: ScenarioVariant
): DataSignal {
  return {
    label: interpolate(template.label, variables),
    value: interpolate(template.valueTemplate, variables),
    type: template.type,
    revealDelay: template.revealDelay,
  };
}

function hydrateDecisionOption(
  template: DecisionOptionTemplate,
  variables: ScenarioVariant
): DecisionOption {
  return {
    id: template.id,
    label: interpolate(template.labelTemplate, variables),
    description: interpolate(template.descriptionTemplate, variables),
    isOptimal: template.isOptimal,
    nextStepId: template.nextStepId,
    claudeReasoningPrompt: interpolate(template.claudeReasoningPromptTemplate, variables),
    claudeReactionPrompt: interpolate(template.claudeReactionPromptTemplate, variables),
  };
}

function hydrateDecision(
  template: DecisionTemplate,
  variables: ScenarioVariant
): Decision {
  return {
    prompt: interpolate(template.promptTemplate, variables),
    options: template.options.map((o) => hydrateDecisionOption(o, variables)),
  };
}

export function hydrateStep(
  template: StepTemplate,
  variables: ScenarioVariant
): Step {
  return {
    id: template.id,
    type: template.type,
    agentVisionData: template.agentVisionDataTemplates?.map((d) =>
      hydrateDataSignal(d, variables)
    ),
    decision: template.decisionTemplate
      ? hydrateDecision(template.decisionTemplate, variables)
      : undefined,
    claudeContext: interpolate(template.claudeContextTemplate, variables),
  };
}

export function hydrateSteps(
  templates: StepTemplate[],
  variables: ScenarioVariant
): Step[] {
  return templates.map((t) => hydrateStep(t, variables));
}
