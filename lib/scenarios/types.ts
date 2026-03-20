export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  humanInstructionTemplate: string;
  steps: StepTemplate[];
}

export interface ScenarioVariant {
  [key: string]: string | number | string[];
}

export interface ScenarioInstance {
  scenarioId: string;
  variables: ScenarioVariant;
  steps: Step[];
}

export interface StepTemplate {
  id: string;
  type: 'briefing' | 'data_reveal' | 'decision' | 'outcome';
  agentVisionDataTemplates?: DataSignalTemplate[];
  decisionTemplate?: DecisionTemplate;
  claudeContextTemplate: string;
}

export interface Step {
  id: string;
  type: 'briefing' | 'data_reveal' | 'decision' | 'outcome';
  agentVisionData?: DataSignal[];
  decision?: Decision;
  claudeContext: string;
}

export interface DataSignalTemplate {
  label: string;
  valueTemplate: string;
  type: 'merchant' | 'payment' | 'risk' | 'compliance' | 'network' | 'human';
  revealDelay?: number;
}

export interface DataSignal {
  label: string;
  value: string;
  type: 'merchant' | 'payment' | 'risk' | 'compliance' | 'network' | 'human';
  revealDelay?: number;
}

export interface DecisionTemplate {
  promptTemplate: string;
  options: DecisionOptionTemplate[];
}

export interface Decision {
  prompt: string;
  options: DecisionOption[];
}

export interface DecisionOptionTemplate {
  id: string;
  labelTemplate: string;
  descriptionTemplate: string;
  isOptimal?: boolean;
  nextStepId: string;
  claudeReasoningPromptTemplate: string;
  claudeReactionPromptTemplate: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  isOptimal?: boolean;
  nextStepId: string;
  claudeReasoningPrompt: string;
  claudeReactionPrompt: string;
}

export interface GeneratedScenario {
  id: string;
  humanInstruction: string;
  variables: Record<string, string | number>;
  keyInsight: string;
  realWorldContext: string;
  steps: Step[];
}

export interface ScenarioProgress {
  scenarioId: string;
  completed: boolean;
  decisions: { stepId: string; choiceId: string }[];
  score?: number;
}
