'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TypewriterText from '@/components/shared/TypewriterText';

const lines = [
  'You are an AI agent.',
  'Your human has given you a task.',
  'Complete the transaction.',
];

export default function HeroTitle() {
  const [currentLine, setCurrentLine] = useState(0);

  return (
    <div className="flex flex-col items-center gap-3 py-16 md:py-24">
      <div className="text-center space-y-2">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i <= currentLine ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {i <= currentLine ? (
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
                {i < currentLine ? (
                  line
                ) : (
                  <TypewriterText
                    text={line}
                    speed={45}
                    delay={i === 0 ? 500 : 0}
                    onComplete={() => {
                      if (i < lines.length - 1) {
                        setTimeout(() => setCurrentLine(i + 1), 400);
                      }
                    }}
                    showCursor={i === currentLine}
                  />
                )}
              </h1>
            ) : (
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F] invisible">
                {line}
              </h1>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
