'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DataSignal from './DataSignal';
import type { DataSignal as DataSignalType } from '@/lib/scenarios/types';

export interface VisionHistoryEntry {
  stepId: string;
  label: string;
  signals: DataSignalType[];
}

interface AgentVisionProps {
  history: VisionHistoryEntry[];
  currentStepId: string;
  currentSignals: DataSignalType[];
  currentLabel: string;
  humanInstruction: string;
}

export default function AgentVision({ history, currentStepId, currentSignals, currentLabel, humanInstruction }: AgentVisionProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] p-4 md:p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#0071E3] animate-pulse" />
        <h2 className="text-xs font-mono font-semibold text-[#6E6E73] tracking-widest uppercase">
          Agent Vision
        </h2>
      </div>

      {/* Human instruction - always visible */}
      <div className="bg-white rounded-xl border border-[#D2D2D7] p-4 mb-4">
        <div className="text-[10px] font-mono font-semibold text-[#5AC8FA] tracking-widest uppercase mb-2">
          Human Instruction
        </div>
        <p className="text-sm text-[#1D1D1F] leading-relaxed italic">
          &ldquo;{humanInstruction}&rdquo;
        </p>
      </div>

      {/* History entries — all collapsible */}
      {history.map((entry, i) => {
        const isExpanded = expandedIndexes.has(i);

        return (
          <div key={entry.stepId} className="mb-2">
            <button
              onClick={() => toggleExpanded(i)}
              className="flex items-center gap-2 w-full text-left text-xs font-mono text-[#6E6E73] hover:text-[#1D1D1F] transition-colors py-1.5 px-2 rounded-lg hover:bg-white/60"
            >
              <span className="text-[10px]">{isExpanded ? '▼' : '▶'}</span>
              <span className="tracking-wider uppercase font-semibold">{entry.label}</span>
              <span className="text-[#D2D2D7] ml-auto">{entry.signals.length} signals</span>
            </button>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1 pl-4 pb-2 opacity-70"
              >
                {entry.signals.map((signal, si) => (
                  <DataSignal key={`${entry.stepId}-${si}`} signal={signal} index={0} />
                ))}
              </motion.div>
            )}
          </div>
        );
      })}

      {/* Current step signals — skip if already in history */}
      {currentSignals.length > 0 && !history.some((e) => e.stepId === currentStepId) && (
        <motion.div
          key={currentLabel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          {currentSignals.map((signal, i) => (
            <DataSignal key={`current-${i}`} signal={signal} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
