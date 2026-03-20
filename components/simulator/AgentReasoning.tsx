'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AgentReasoningProps {
  text: string;
  isStreaming: boolean;
}

export default function AgentReasoning({ text, isStreaming }: AgentReasoningProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-2 h-2 rounded-full ${
            isStreaming ? 'bg-[#34C759] animate-pulse' : 'bg-[#6E6E73]'
          }`}
        />
        <h2 className="text-xs font-mono font-semibold text-[#6E6E73] tracking-widest uppercase">
          Agent Reasoning
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto reasoning-scroll"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[15px] text-[#33ff33] leading-relaxed whitespace-pre-wrap"
        >
          <span className="text-[#1a8a1a] mr-2">&gt;</span>
          {text}
          {isStreaming && (
            <span className="cursor-blink inline-block w-[7px] h-[15px] bg-[#33ff33] ml-[2px] align-text-bottom" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
