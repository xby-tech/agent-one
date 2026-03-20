import OpenAI from 'openai';
import { themeConfigs } from '@/lib/scenarios/themes';
import { validateGeneratedScenario } from '@/lib/engine/validate';

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  let body: { scenarioId: string; previousStorylines?: string[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const theme = themeConfigs[body.scenarioId];
  if (!theme) {
    return Response.json({ error: 'Unknown scenario' }, { status: 400 });
  }

  const stepPatternDesc = theme.stepPattern
    .map((t, i) => `${i + 1}. ${t}`)
    .join('\n');

  const previousNote = body.previousStorylines?.length
    ? `\nDo NOT generate a scenario similar to any of these previous storylines:\n${body.previousStorylines.map((s) => `- ${s}`).join('\n')}`
    : '';

  const systemPrompt = `You are a scenario designer for an AI payment agent training simulator called Agent-One. You generate structured JSON scenarios that teach payment infrastructure concepts through realistic decision-making. Your scenarios must be realistic, educational, and present genuine trade-offs at each decision point. Set the scenario in Australia with AUD currency.`;

  const userPrompt = `Generate a complete NEW scenario for the theme: ${theme.theme} (${theme.title})
Difficulty: ${theme.difficulty}

DOMAIN CONTEXT:
${theme.domainContext}

STEP SEQUENCE (follow this exact pattern):
${stepPatternDesc}

INFRASTRUCTURE CONCEPTS TO REFERENCE:
${theme.keyInfrastructure.join(', ')}

EXAMPLE STORYLINES FOR INSPIRATION (pick something different):
${theme.exampleStorylines.map((s) => `- ${s}`).join('\n')}
${previousNote}

RULES:
- Generate a completely new storyline with specific realistic details (real product names, realistic prices, real-world merchants)
- Each decision step must have EXACTLY 3 options with unique ids (e.g. "opt-1a", "opt-1b", "opt-1c")
- EXACTLY ONE option per decision must have "isOptimal": true — this should be the genuinely best choice from a payments infrastructure perspective
- Each option needs: id, label, description, isOptimal, nextStepId (pointing to the next step's id), claudeReasoningPrompt, claudeReactionPrompt
- claudeReasoningPrompt: context for the AI to reason about before this option is shown
- claudeReactionPrompt: context for the AI to narrate what happens after this option is chosen
- Data signals in agentVisionData use types: merchant, payment, risk, compliance, network, human
- The briefing step should have 2-3 data signals summarizing the task
- Each data_reveal step should have 2-6 data signals revealing new information
- The outcome step needs a claudeContext summarizing the scenario conclusion
- humanInstruction should be a natural first-person request from the human to their AI agent
- keyInsight should be 2-3 sentences about the payment infrastructure lesson learned
- realWorldContext should be 2-3 sentences about how this works in the real world today

OUTPUT: Return ONLY valid JSON (no markdown, no code fences) matching this schema:
{
  "humanInstruction": "string",
  "variables": {},
  "keyInsight": "string",
  "realWorldContext": "string",
  "steps": [
    {
      "id": "string",
      "type": "briefing|data_reveal|decision|outcome",
      "agentVisionData": [{"label":"string","value":"string","type":"string","revealDelay":0}],
      "decision": {"prompt":"string","options":[{"id":"string","label":"string","description":"string","isOptimal":false,"nextStepId":"string","claudeReasoningPrompt":"string","claudeReactionPrompt":"string"}]},
      "claudeContext": "string"
    }
  ]
}

For non-decision steps, omit the "decision" field entirely. For briefing/outcome steps, include agentVisionData only if relevant.`;

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1',
  });

  try {
    const completion = await client.chat.completions.create({
      model: 'grok-4-1-fast-reasoning',
      max_tokens: 16000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content || '';

    // Extract JSON — handle possible markdown fences
    let jsonStr = content;
    const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1];
    }
    const jsonObjMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonObjMatch) {
      console.error('Generate: No JSON found in response');
      return Response.json({ error: 'Generation failed - no JSON in response' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonObjMatch[0]);

    // Auto-fix common LLM output issues
    if (Array.isArray(parsed.steps)) {
      for (const step of parsed.steps) {
        // Fix missing claudeContext — use context, description, or generate from data
        if (!step.claudeContext || step.claudeContext.length < 20) {
          step.claudeContext = step.context || step.description || step.narrative
            || `The agent is at step "${step.id}" (${step.type}). Analyze the available data and reason through the payment infrastructure implications.`;
        }
        // Fix missing reasoning/reaction prompts on decision options
        if (step.decision?.options) {
          for (const opt of step.decision.options) {
            if (!opt.claudeReasoningPrompt) {
              opt.claudeReasoningPrompt = opt.reasoningPrompt || opt.reasoning
                || `Consider the implications of choosing: ${opt.label}. ${opt.description || ''}`;
            }
            if (!opt.claudeReactionPrompt) {
              opt.claudeReactionPrompt = opt.reactionPrompt || opt.reaction
                || `The agent chose: ${opt.label}. Narrate what happens next in the payment flow.`;
            }
          }
        }
      }
    }

    const validation = validateGeneratedScenario(parsed);

    if (!validation.valid) {
      console.error('Generate: Validation failed:', validation.errors);
      return Response.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error) {
    console.error('Generate API error:', error instanceof Error ? error.message : error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
