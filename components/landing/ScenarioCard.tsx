'use client';

import { motion } from 'framer-motion';
import Badge, { StatusBadge } from '@/components/shared/Badge';
import Link from 'next/link';

interface ScenarioCardProps {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  index: number;
  unlocked: boolean;
  completed: boolean;
}

export default function ScenarioCard({
  id,
  title,
  subtitle,
  difficulty,
  index,
  unlocked,
  completed,
}: ScenarioCardProps) {
  const status = completed ? 'completed' : unlocked ? 'available' : 'locked';

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
      whileHover={unlocked ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' } : {}}
      className={`relative rounded-2xl border p-6 transition-all duration-300 ${
        unlocked
          ? 'border-[#D2D2D7] bg-white cursor-pointer hover:border-[#0071E3]/30'
          : 'border-[#D2D2D7]/50 bg-[#F5F5F7]/50 cursor-not-allowed'
      }`}
    >
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px] z-10">
          <svg
            className="w-8 h-8 text-[#D2D2D7]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-[#6E6E73] uppercase tracking-widest">
          Scenario {index + 1}
        </span>
        <StatusBadge status={status} />
      </div>

      <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">{title}</h3>
      <p className="text-sm text-[#6E6E73] mb-4 leading-relaxed">{subtitle}</p>

      <Badge difficulty={difficulty} />
    </motion.div>
  );

  if (unlocked) {
    return <Link href={`/scenario/${id}`}>{card}</Link>;
  }

  return card;
}
