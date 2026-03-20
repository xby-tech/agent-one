'use client';

import { motion } from 'framer-motion';
import type { DataSignal as DataSignalType } from '@/lib/scenarios/types';

const typeColors: Record<DataSignalType['type'], string> = {
  merchant: 'border-l-[#0071E3]',
  payment: 'border-l-[#34C759]',
  risk: 'border-l-[#FF3B30]',
  compliance: 'border-l-[#FF9F0A]',
  network: 'border-l-[#AF52DE]',
  human: 'border-l-[#5AC8FA]',
};

const typeLabels: Record<DataSignalType['type'], string> = {
  merchant: 'MERCHANT',
  payment: 'PAYMENT',
  risk: 'RISK',
  compliance: 'COMPLIANCE',
  network: 'NETWORK',
  human: 'HUMAN',
};

interface DataSignalProps {
  signal: DataSignalType;
  index: number;
}

export default function DataSignal({ signal, index }: DataSignalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: (signal.revealDelay ?? index * 150) / 1000 }}
      className={`border-l-2 ${typeColors[signal.type]} bg-white rounded-r-lg p-3 mb-2`}
    >
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-[10px] font-mono font-semibold text-[#6E6E73] tracking-widest">
          {typeLabels[signal.type]}
        </span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-[#6E6E73]">{signal.label}</span>
        <span className="text-sm font-mono font-medium text-[#1D1D1F]">{signal.value}</span>
      </div>
    </motion.div>
  );
}
