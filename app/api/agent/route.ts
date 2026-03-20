import OpenAI from 'openai';
import { buildSystemPrompt, buildReasoningPrompt, buildReactionPrompt } from '@/lib/prompts';
import { AgentRequest } from '@/lib/claude';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_SESSION = 50;
const SESSION_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + SESSION_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_SESSION) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return new Response('API key not configured', { status: 500 });
  }

  const sessionId = request.headers.get('x-session-id') || 'anonymous';
  if (!checkRateLimit(sessionId)) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  let body: AgentRequest;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid request body', { status: 400 });
  }

  const { scenarioTitle, variables, claudeContext, type } = body;

  const systemPrompt = buildSystemPrompt(scenarioTitle, variables);
  const userPrompt =
    type === 'reasoning'
      ? buildReasoningPrompt(claudeContext)
      : buildReactionPrompt(claudeContext);

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1',
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await client.chat.completions.create({
          model: 'grok-3-fast',
          max_tokens: 300,
          stream: true,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        });

        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        console.error('API error:', error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: 'API error' })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
