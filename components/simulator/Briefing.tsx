'use client';

import { motion } from 'framer-motion';
import TypewriterText from '@/components/shared/TypewriterText';

interface BriefingProps {
  instruction: string;
  onComplete: () => void;
}

export default function Briefing({ instruction, onComplete }: BriefingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center flex-1 min-h-screen bg-[#1D1D1F] p-8"
    >
      <div className="max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-mono text-[#6E6E73] tracking-widest uppercase mb-6"
        >
          Incoming Instruction
        </motion.div>
        <div className="text-xl md:text-2xl font-mono text-[#F5F5F7] leading-relaxed mb-8">
          <TypewriterText
            text={`"${instruction}"`}
            speed={20}
            delay={600}
            onComplete={() => setTimeout(onComplete, 1000)}
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-[#6E6E73] font-mono"
        >
          Processing...
        </motion.div>
      </div>
    </motion.div>
  );
}
