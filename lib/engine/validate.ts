import type { Step } from '@/lib/scenarios/types';

const VALID_STEP_TYPES = ['briefing', 'data_reveal', 'decision', 'outcome'] as const;
const VALID_SIGNAL_TYPES = ['merchant', 'payment', 'risk', 'compliance', 'network', 'human'] as const;

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateGeneratedScenario(data: {
  humanInstruction?: string;
  keyInsight?: string;
  realWorldContext?: string;
  steps?: Step[];
}): ValidationResult {
  const errors: string[] = [];

  if (!data.humanInstruction || data.humanInstruction.length < 10) {
    errors.push('Missing or too short humanInstruction');
  }
  if (!data.keyInsight || data.keyInsight.length < 20) {
    errors.push('Missing or too short keyInsight');
  }
  if (!data.realWorldContext || data.realWorldContext.length < 20) {
    errors.push('Missing or too short realWorldContext');
  }

  if (!Array.isArray(data.steps) || data.steps.length < 4) {
    errors.push('Steps must be an array with at least 4 items');
    return { valid: false, errors };
  }

  const steps = data.steps;

  // First step must be briefing, last must be outcome
  if (steps[0].type !== 'briefing') {
    errors.push('First step must be briefing');
  }
  if (steps[steps.length - 1].type !== 'outcome') {
    errors.push('Last step must be outcome');
  }

  const stepIds = new Set(steps.map((s) => s.id));

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    // Validate step type
    if (!VALID_STEP_TYPES.includes(step.type as typeof VALID_STEP_TYPES[number])) {
      errors.push(`Step ${i}: invalid type "${step.type}"`);
    }

    // Validate id
    if (!step.id || typeof step.id !== 'string') {
      errors.push(`Step ${i}: missing or invalid id`);
    }

    // Validate claudeContext
    if (!step.claudeContext || step.claudeContext.length < 20) {
      errors.push(`Step ${i}: missing or too short claudeContext`);
    }

    // Validate data signals
    if (step.agentVisionData) {
      for (const signal of step.agentVisionData) {
        if (!signal.label || !signal.value) {
          errors.push(`Step ${i}: data signal missing label or value`);
        }
        if (!VALID_SIGNAL_TYPES.includes(signal.type as typeof VALID_SIGNAL_TYPES[number])) {
          errors.push(`Step ${i}: invalid signal type "${signal.type}"`);
        }
      }
    }

    // Validate decisions
    if (step.type === 'decision') {
      if (!step.decision) {
        errors.push(`Step ${i}: decision step missing decision object`);
        continue;
      }
      if (!step.decision.prompt) {
        errors.push(`Step ${i}: decision missing prompt`);
      }
      if (!Array.isArray(step.decision.options) || step.decision.options.length < 2) {
        errors.push(`Step ${i}: decision must have at least 2 options`);
        continue;
      }

      const optimalCount = step.decision.options.filter((o) => o.isOptimal).length;
      if (optimalCount !== 1) {
        errors.push(`Step ${i}: decision must have exactly 1 optimal option, found ${optimalCount}`);
      }

      for (const opt of step.decision.options) {
        if (!opt.id || !opt.label || !opt.description) {
          errors.push(`Step ${i}: option missing id, label, or description`);
        }
        if (!opt.claudeReasoningPrompt || !opt.claudeReactionPrompt) {
          errors.push(`Step ${i}: option missing reasoning or reaction prompt`);
        }
        if (opt.nextStepId && !stepIds.has(opt.nextStepId)) {
          // Auto-fix: point to the next step in sequence
          const nextIdx = i + 1 < steps.length ? i + 1 : i;
          opt.nextStepId = steps[nextIdx].id;
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
