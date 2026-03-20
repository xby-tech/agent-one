'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Decision } from '@/lib/scenarios/types';

interface DecisionPanelProps {
  decision: Decision;
  onChoose: (optionId: string) => void;
  disabled?: boolean;
}

export default function DecisionPanel({
  decision,
  onChoose,
  disabled = false,
}: DecisionPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    if (disabled || selectedId) return;
    setSelectedId(optionId);
    onChoose(optionId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-t border-[#D2D2D7] p-4 md:p-6"
    >
      <h3 className="text-sm font-semibold text-[#1D1D1F] mb-3">
        {decision.prompt}
      </h3>
      <div className="grid gap-2 md:grid-cols-3">
        {decision.options.map((option, i) => {
          const isSelected = selectedId === option.id;
          const isOther = selectedId && !isSelected;
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              onMouseEnter={() => !disabled && setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleSelect(option.id)}
              disabled={disabled || !!selectedId}
              className={`text-left rounded-xl border p-4 transition-all duration-200 ${
                isSelected
                  ? 'border-[#0071E3] bg-[#0071E3]/5 ring-1 ring-[#0071E3]'
                  : isOther
                  ? 'border-[#D2D2D7]/50 bg-[#F5F5F7]/50 opacity-50'
                  : hoveredId === option.id
                  ? 'border-[#0071E3]/40 bg-[#0071E3]/[0.02]'
                  : 'border-[#D2D2D7] bg-white hover:border-[#0071E3]/20'
              } ${disabled || selectedId ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-semibold text-[#0071E3]">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm font-medium text-[#1D1D1F]">
                  {option.label}
                </span>
              </div>
              <p className="text-xs text-[#6E6E73] leading-relaxed ml-8">
                {option.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
