'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface ReasoningEntry {
  label: string;
  text: string;
}

interface AgentReasoningProps {
  history: ReasoningEntry[];
  text: string;
  isStreaming: boolean;
  currentLabel: string;
}

export default function AgentReasoning({ history, text, isStreaming, currentLabel }: AgentReasoningProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text]);

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
        {/* Collapsed history entries */}
        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            <button
              onClick={() => toggleExpanded(i)}
              className="flex items-center gap-2 w-full text-left font-mono text-xs text-[#1a8a1a] hover:text-[#33ff33] transition-colors py-1"
            >
              <span className="text-[10px]">{expandedIndexes.has(i) ? '▼' : '▶'}</span>
              <span>{entry.label}</span>
            </button>
            {expandedIndexes.has(i) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="font-mono text-[13px] text-[#1a8a1a] leading-relaxed whitespace-pre-wrap pl-5 pb-2 border-l border-[#1a3a1a] ml-1"
              >
                {entry.text}
              </motion.div>
            )}
          </div>
        ))}

        {/* Current live reasoning */}
        {(text || isStreaming) && (
          <>
            {history.length > 0 && (
              <div className="flex items-center gap-2 font-mono text-xs text-[#33ff33] py-1 mb-1">
                <span className="text-[10px]">▼</span>
                <span>{currentLabel}</span>
              </div>
            )}
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
          </>
        )}

        {/* Empty state */}
        {!text && !isStreaming && history.length === 0 && (
          <div className="font-mono text-[15px] text-[#33ff33] leading-relaxed whitespace-pre-wrap">
            <span className="text-[#1a8a1a] mr-2">&gt;</span>
            <span className="cursor-blink inline-block w-[7px] h-[15px] bg-[#33ff33] ml-[2px] align-text-bottom" />
          </div>
        )}
      </div>
    </div>
  );
}
