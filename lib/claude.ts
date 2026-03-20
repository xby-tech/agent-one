import { ScenarioVariant } from '@/lib/scenarios/types';

export interface AgentRequest {
  scenarioId: string;
  scenarioTitle: string;
  variables: ScenarioVariant;
  claudeContext: string;
  type: 'reasoning' | 'reaction';
}

export async function streamAgentResponse(
  request: AgentRequest,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch('/api/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    onChunk(`[Error: ${response.status} - ${errorText || 'API request failed'}]`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // Parse SSE events
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) onChunk(`[Error: ${parsed.error}]`);
          else if (parsed.text) onChunk(parsed.text);
        } catch {
          // Not JSON, treat as raw text
          if (data.trim()) onChunk(data);
        }
      }
    }
  }
}
