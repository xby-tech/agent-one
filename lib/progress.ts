import { ScenarioProgress } from '@/lib/scenarios/types';

const STORAGE_KEY = 'agent-one-progress';

export function getProgress(): Record<string, ScenarioProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function isScenarioUnlocked(scenarioId: string): boolean {
  const scenarioOrder = ['scenario-1', 'scenario-2', 'scenario-3', 'scenario-4'];
  const idx = scenarioOrder.indexOf(scenarioId);
  if (idx === 0) return true;
  const prevId = scenarioOrder[idx - 1];
  const progress = getProgress();
  return progress[prevId]?.completed ?? false;
}

export function isScenarioCompleted(scenarioId: string): boolean {
  const progress = getProgress();
  return progress[scenarioId]?.completed ?? false;
}

export function saveDecision(scenarioId: string, stepId: string, choiceId: string) {
  const progress = getProgress();
  if (!progress[scenarioId]) {
    progress[scenarioId] = { scenarioId, completed: false, decisions: [] };
  }
  progress[scenarioId].decisions.push({ stepId, choiceId });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function completeScenario(scenarioId: string, score: number) {
  const progress = getProgress();
  if (!progress[scenarioId]) {
    progress[scenarioId] = { scenarioId, completed: false, decisions: [] };
  }
  progress[scenarioId].completed = true;
  progress[scenarioId].score = score;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
