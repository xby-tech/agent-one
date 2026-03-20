import { ScenarioVariant, ScenarioInstance, Scenario } from '@/lib/scenarios/types';
import { hydrateSteps } from './hydrate';
import { scenario1Variants } from '@/lib/variables/scenario1-variants';
import { scenario2Variants } from '@/lib/variables/scenario2-variants';
import { scenario3Variants } from '@/lib/variables/scenario3-variants';
import { scenario4Variants } from '@/lib/variables/scenario4-variants';

const variantPools: Record<string, ScenarioVariant[]> = {
  'scenario-1': scenario1Variants,
  'scenario-2': scenario2Variants,
  'scenario-3': scenario3Variants,
  'scenario-4': scenario4Variants,
};

export function selectVariant(scenarioId: string): ScenarioVariant {
  const pool = variantPools[scenarioId];
  if (!pool || pool.length === 0) {
    throw new Error(`No variant pool for scenario: ${scenarioId}`);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function initScenario(scenario: Scenario): ScenarioInstance {
  const variables = selectVariant(scenario.id);
  const steps = hydrateSteps(scenario.steps, variables);
  return { scenarioId: scenario.id, variables, steps };
}
