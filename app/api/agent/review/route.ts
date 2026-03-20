import OpenAI from 'openai';
import { buildSystemPrompt, buildReviewPrompt } from '@/lib/prompts';
import { AgentRequest } from '@/lib/claude';

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return Response.json({ right: ['Completed the scenario'], wrong: [] }, { status: 200 });
  }

  let body: AgentRequest;
  try {
    body = await request.json();
  } catch (e) {
    console.error('Review body parse failed:', e);
    return Response.json({ right: ['Completed the scenario'], wrong: [] }, { status: 200 });
  }

  const { scenarioTitle, variables, claudeContext, reasoningLog } = body;

  // Grok's data leakage filter blocks reasoning logs containing card numbers
  // and addresses. Only send the decision summary (no PII) instead of the full log.
  const safeVariables: Record<string, string | number | string[]> = {};
  for (const [k, v] of Object.entries(variables)) {
    if (['cardLast4', 'shippingAddress', 'address', 'expiry'].includes(k)) continue;
    safeVariables[k] = v;
  }

  const systemPrompt = buildSystemPrompt(scenarioTitle, safeVariables);
  const userPrompt = buildReviewPrompt(claudeContext, '');

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1',
  });

  try {
    const completion = await client.chat.completions.create({
      model: 'grok-4-1-fast-reasoning',
      max_tokens: 400,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content || '';
    // Extract JSON from response (may have markdown code fences)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return Response.json({
          right: Array.isArray(parsed.right) ? parsed.right : [],
          wrong: Array.isArray(parsed.wrong) ? parsed.wrong : [],
        });
      } catch {
        // JSON parse failed
      }
    }

    return Response.json({ right: ['Completed the scenario'], wrong: [] });
  } catch (error) {
    console.error('Review API error:', error instanceof Error ? error.message : error);
    return Response.json({ right: ['Completed the scenario'], wrong: [] });
  }
}
