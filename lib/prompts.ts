import { ScenarioVariant } from '@/lib/scenarios/types';

export function buildSystemPrompt(
  scenarioTitle: string,
  variables: ScenarioVariant
): string {
  const variableContext = Object.entries(variables)
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n');

  return `You are an AI payment agent reasoning through a transaction. You think in first person ("I") and reason through payments infrastructure with precision and insight.

You are currently working on: ${scenarioTitle}

ACTIVE SCENARIO VARIABLES (this playthrough):
${variableContext}

Use these specific details in your reasoning. Reference the actual merchant name, product, amounts, etc.

Guidelines:
- Think in first person as the AI agent
- Reference real payments infrastructure accurately: Visa Cloud Token Framework, 3DS 2.0, CE3.0, Visa Direct, AUSTRAC, account updater, network tokens, cryptograms, etc.
- Be concise but insightful. 3-5 sentences maximum.
- Show genuine reasoning about trade-offs, not just listing options
- When recommending a choice, explain the payments logic behind it`;
}

export function buildReasoningPrompt(claudeContext: string): string {
  return `${claudeContext}

Provide your reasoning as the AI agent. Think through the payments infrastructure implications. End with which option you would choose and why.`;
}

export function buildReactionPrompt(claudeContext: string): string {
  return `${claudeContext}

Narrate what happens next from the agent's perspective. Describe the technical payment flow that follows this decision. Reference real infrastructure (tokenisation, scheme messaging, clearing, settlement) where appropriate. Keep it vivid but accurate. 3-5 sentences.`;
}
