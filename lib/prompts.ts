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

export function buildReviewPrompt(claudeContext: string, reasoningLog: string): string {
  const logSection = reasoningLog ? `\nReasoning context:\n${reasoningLog}\n` : '';
  return `Here are the decisions made during this scenario:

${claudeContext}
${logSection}
Based on the decisions above, provide a brief performance review. Respond in EXACTLY this JSON format, no other text:
{"right":["bullet 1","bullet 2","bullet 3"],"wrong":["bullet 1","bullet 2"]}

Rules:
- "right": 2-4 bullets on what the agent did well (good reasoning, optimal choices, correct infrastructure knowledge)
- "wrong": 1-3 bullets on mistakes, suboptimal choices, or missed considerations. If all decisions were optimal, note areas where the reasoning could have been deeper.
- Each bullet should be 1 short sentence, written in second person ("You chose...", "You correctly identified...")
- Be specific, referencing actual decisions and payment concepts from the scenario`;
}
