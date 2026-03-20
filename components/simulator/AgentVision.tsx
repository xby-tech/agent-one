'use client';

import { motion, AnimatePresence } from 'framer-motion';
import DataSignal from './DataSignal';
import type { Step } from '@/lib/scenarios/types';

interface AgentVisionProps {
  step: Step;
  humanInstruction: string;
}

export default function AgentVision({ step, humanInstruction }: AgentVisionProps) {
  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] p-4 md:p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#0071E3] animate-pulse" />
        <h2 className="text-xs font-mono font-semibold text-[#6E6E73] tracking-widest uppercase">
          Agent Vision
        </h2>
      </div>

      {/* Human instruction - always visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl border border-[#D2D2D7] p-4 mb-4"
      >
        <div className="text-[10px] font-mono font-semibold text-[#5AC8FA] tracking-widest uppercase mb-2">
          Human Instruction
        </div>
        <p className="text-sm text-[#1D1D1F] leading-relaxed italic">
          &ldquo;{humanInstruction}&rdquo;
        </p>
      </motion.div>

      {/* Data signals */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          {step.agentVisionData?.map((signal, i) => (
            <DataSignal key={`${step.id}-${i}`} signal={signal} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
