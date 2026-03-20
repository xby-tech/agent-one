'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  scenarioTitle: string;
}

export default function ProgressBar({ current, total, scenarioTitle }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="bg-white border-b border-[#D2D2D7] px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
          AGENT_ONE
        </span>
        <span className="text-xs text-[#6E6E73]">|</span>
        <span className="text-sm text-[#6E6E73]">{scenarioTitle}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#0071E3] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs font-mono text-[#6E6E73]">
          {current + 1}/{total}
        </span>
      </div>
    </div>
  );
}
