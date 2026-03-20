'use client';

import { motion } from 'framer-motion';
import InfoCallout from '@/components/shared/InfoCallout';
import Link from 'next/link';

interface OutcomeDecision {
  stepId: string;
  choiceId: string;
  label: string;
  wasOptimal: boolean;
}

export interface ReviewData {
  right: string[];
  wrong: string[];
}

interface OutcomeProps {
  scenarioId: string;
  scenarioTitle: string;
  success: boolean;
  decisions: OutcomeDecision[];
  keyInsight: string;
  realWorldContext: string;
  nextScenarioId?: string;
  onReplay: () => void;
  review: ReviewData | null;
  reviewLoading: boolean;
}

export default function Outcome({
  scenarioTitle,
  success,
  decisions,
  keyInsight,
  realWorldContext,
  nextScenarioId,
  onReplay,
  review,
  reviewLoading,
}: OutcomeProps) {
  const optimalCount = decisions.filter((d) => d.wasOptimal).length;
  const score = Math.round((optimalCount / decisions.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full bg-[#FAFAFA] p-6 md:p-12 overflow-y-auto"
    >
      <div className="max-w-2xl mx-auto">
        {/* Result header */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div
            className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl ${
              success
                ? 'bg-[#34C759]/10 text-[#34C759]'
                : 'bg-[#FF9F0A]/10 text-[#FF9F0A]'
            }`}
          >
            {success ? '✓' : '!'}
          </div>
          <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-1">
            {success ? 'Transaction Complete' : 'Transaction Escalated'}
          </h2>
          <p className="text-sm text-[#6E6E73]">{scenarioTitle}</p>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-[#D2D2D7] p-6 mb-6"
        >
          <div className="text-center mb-4">
            <span className="text-4xl font-semibold text-[#0071E3]">{score}%</span>
            <p className="text-xs text-[#6E6E73] mt-1">Optimal Decisions</p>
          </div>
          <div className="space-y-2">
            {decisions.map((d, i) => (
              <div
                key={d.stepId}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    d.wasOptimal
                      ? 'bg-[#34C759]/10 text-[#34C759]'
                      : 'bg-[#FF9F0A]/10 text-[#FF9F0A]'
                  }`}
                >
                  {d.wasOptimal ? '✓' : '~'}
                </span>
                <span className="text-[#6E6E73]">Decision {i + 1}:</span>
                <span className="text-[#1D1D1F] font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Review */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-[#D2D2D7] p-6 mb-6"
        >
          <h3 className="text-sm font-semibold text-[#1D1D1F] uppercase tracking-wider mb-4">
            Performance Review
          </h3>

          {reviewLoading ? (
            <div className="flex items-center gap-3 py-4 justify-center">
              <div className="w-4 h-4 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#6E6E73]">Grok is reviewing your decisions...</span>
            </div>
          ) : review ? (
            <div className="space-y-4">
              {review.right.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#34C759] uppercase tracking-wider mb-2">
                    What went right
                  </h4>
                  <ul className="space-y-1.5">
                    {review.right.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#1D1D1F]">
                        <span className="text-[#34C759] mt-0.5 shrink-0">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {review.wrong.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#FF9F0A] uppercase tracking-wider mb-2">
                    What could improve
                  </h4>
                  <ul className="space-y-1.5">
                    {review.wrong.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#1D1D1F]">
                        <span className="text-[#FF9F0A] mt-0.5 shrink-0">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </motion.div>

        {/* Key insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <InfoCallout title="Key Insight" variant="insight">
            {keyInsight}
          </InfoCallout>
        </motion.div>

        {/* Real world context */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <InfoCallout title="What Actually Happens Today" variant="info">
            {realWorldContext}
          </InfoCallout>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={onReplay}
            className="px-6 py-3 rounded-full border border-[#D2D2D7] text-sm font-medium text-[#6E6E73] hover:border-[#1D1D1F] hover:text-[#1D1D1F] transition-colors"
          >
            Replay Scenario
          </button>
          {nextScenarioId ? (
            <Link
              href={`/scenario/${nextScenarioId}`}
              className="px-6 py-3 rounded-full bg-[#0071E3] text-sm font-medium text-white hover:bg-[#0062CC] transition-colors text-center"
            >
              Next Scenario →
            </Link>
          ) : (
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-[#0071E3] text-sm font-medium text-white hover:bg-[#0062CC] transition-colors text-center"
            >
              Back to Menu
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
