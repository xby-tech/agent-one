'use client';

import { useEffect, useState } from 'react';
import HeroTitle from '@/components/landing/HeroTitle';
import ScenarioCard from '@/components/landing/ScenarioCard';
import { scenarioMeta } from '@/lib/scenarios';
import { isScenarioUnlocked, isScenarioCompleted } from '@/lib/progress';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#FAFAFA]">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8">
        <HeroTitle />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
          {scenarioMeta.map((scenario, i) => (
            <ScenarioCard
              key={scenario.id}
              id={scenario.id}
              title={scenario.title}
              subtitle={scenario.subtitle}
              difficulty={scenario.difficulty}
              index={i}
              unlocked={mounted ? isScenarioUnlocked(scenario.id) : i === 0}
              completed={mounted ? isScenarioCompleted(scenario.id) : false}
            />
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-[#6E6E73]">
        Built by Ben Yamin | Coded with Claude Code | Live reasoning via Grok
      </footer>
    </div>
  );
}
