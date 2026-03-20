import type { Scenario } from './types';

// Scenario metadata for the landing page (steps loaded lazily)
export const scenarioMeta: {
  id: string;
  title: string;
  subtitle: string;
  difficulty: Scenario['difficulty'];
}[] = [
  {
    id: 'scenario-1',
    title: 'Buy This For Me',
    subtitle: 'Navigate an e-commerce checkout as an AI agent. Handle tokens, 3DS, fraud flags, and budget limits.',
    difficulty: 'Beginner',
  },
  {
    id: 'scenario-2',
    title: 'Keep My Subscription Running',
    subtitle: 'Manage multiple recurring payments while your human travels. Handle expiries, declines, and anomalies.',
    difficulty: 'Intermediate',
  },
  {
    id: 'scenario-3',
    title: 'Send Money Home',
    subtitle: 'Execute a cross-border remittance across competing rails, compliance checkpoints, and FX volatility.',
    difficulty: 'Advanced',
  },
  {
    id: 'scenario-4',
    title: 'Fight This Charge',
    subtitle: 'Investigate and dispute a charge. But the evidence might not support your human\'s claim.',
    difficulty: 'Expert',
  },
];

export async function loadScenario(id: string): Promise<Scenario> {
  switch (id) {
    case 'scenario-1':
      return (await import('./scenario1')).default;
    case 'scenario-2':
      return (await import('./scenario2')).default;
    case 'scenario-3':
      return (await import('./scenario3')).default;
    case 'scenario-4':
      return (await import('./scenario4')).default;
    default:
      throw new Error(`Unknown scenario: ${id}`);
  }
}
