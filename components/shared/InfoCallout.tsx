'use client';

import { motion } from 'framer-motion';

interface InfoCalloutProps {
  title: string;
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'insight';
}

const variants = {
  info: { border: 'border-[#0071E3]/20', bg: 'bg-[#0071E3]/5', icon: 'ℹ' },
  warning: { border: 'border-[#FF9F0A]/20', bg: 'bg-[#FF9F0A]/5', icon: '⚠' },
  success: { border: 'border-[#34C759]/20', bg: 'bg-[#34C759]/5', icon: '✓' },
  insight: { border: 'border-[#AF52DE]/20', bg: 'bg-[#AF52DE]/5', icon: '💡' },
};

export default function InfoCallout({
  title,
  children,
  variant = 'info',
}: InfoCalloutProps) {
  const style = variants[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border ${style.border} ${style.bg} p-4`}
    >
      <div className="flex items-start gap-3">
        <span className="text-base mt-0.5">{style.icon}</span>
        <div>
          <h4 className="text-sm font-semibold text-[#1D1D1F] mb-1">{title}</h4>
          <div className="text-sm text-[#6E6E73] leading-relaxed">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
