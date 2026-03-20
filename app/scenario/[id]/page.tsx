'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { loadScenario } from '@/lib/scenarios';
import { initScenario, pickRandomFlow } from '@/lib/engine/randomise';
import { streamAgentResponse, fetchAgentReview, type AgentRequest, type ReviewResult } from '@/lib/claude';
import { isScenarioUnlocked, saveDecision, completeScenario } from '@/lib/progress';
import type { Scenario, ScenarioInstance, Step, DecisionOption } from '@/lib/scenarios/types';
import ProgressBar from '@/components/simulator/ProgressBar';
import Briefing from '@/components/simulator/Briefing';
import AgentVision from '@/components/simulator/AgentVision';
import AgentReasoning, { type ReasoningEntry } from '@/components/simulator/AgentReasoning';
import DecisionPanel from '@/components/simulator/DecisionPanel';
import Outcome, { type ReviewData } from '@/components/simulator/Outcome';

const scenarioTitles: Record<string, string> = {
  'scenario-1': 'Scenario 1: Buy This For Me',
  'scenario-2': 'Scenario 2: Keep My Subscription Running',
  'scenario-3': 'Scenario 3: Send Money Home',
  'scenario-4': 'Scenario 4: Fight This Charge',
};

const nextScenarios: Record<string, string | undefined> = {
  'scenario-1': 'scenario-2',
  'scenario-2': 'scenario-3',
  'scenario-3': 'scenario-4',
  'scenario-4': undefined,
};

const keyInsights: Record<string, string> = {
  'scenario-1':
    'Authentication is the hardest unsolved problem in agentic commerce. Network tokens and cryptograms provide a trust layer, but 3DS step-up challenges designed for humans create a fundamental gap. Agents need new delegated authentication frameworks.',
  'scenario-2':
    'Card lifecycle management is far more complex than it appears. Account updater services, token provisioning, and proactive credential rotation form an invisible infrastructure layer. Agents managing subscriptions need deep integration with scheme-level services.',
  'scenario-3':
    'Cross-border payments are a maze of compliance, competing rails, and trade-offs between speed, cost, and regulatory requirements. An agent needs deep contextual understanding of corridors, not just API access.',
  'scenario-4':
    'Disputes aren\'t just technical workflows. Agents face ethical complexity, evidence assessment, and the tension between serving the human and doing the right thing. The Visa CE3.0 framework adds procedural structure, but judgement calls remain.',
};

const realWorldContexts: Record<string, string> = {
  'scenario-1':
    'Today, no AI agent can independently complete an online purchase end-to-end. 3DS challenges, CAPTCHAs, and fraud detection systems are designed to verify human presence. The industry is actively developing agent-specific authentication standards, with Visa\'s Cloud Token Framework and delegated authentication being early building blocks.',
  'scenario-2':
    'Account updater services (like Visa Account Updater) already handle billions of credential updates annually, preventing declined transactions when cards are reissued. But they operate merchant-by-merchant with varying adoption. An agent managing subscriptions would need to bridge gaps where automatic updates haven\'t propagated.',
  'scenario-3':
    'Cross-border payments currently involve a patchwork of rails with different speed, cost, and compliance characteristics. Visa Direct can deliver funds in minutes to 190+ countries, but amount limits and corridor-specific rules apply. SWIFT gpi has improved transparency but remains slower. The compliance layer (KYC, AML, sanctions screening) adds friction that agents cannot shortcut.',
  'scenario-4':
    'Visa\'s CE3.0 (Compelling Evidence 3.0) dispute framework requires specific evidence types and follows strict timelines. Filing a false or friendly-fraud dispute can result in the cardholder losing dispute rights and facing merchant blacklisting. Today this process is largely manual, with bank agents guiding customers through evidence gathering.',
};

export default function ScenarioPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;
  const abortRef = useRef<AbortController | null>(null);

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [instance, setInstance] = useState<ScenarioInstance | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [phase, setPhase] = useState<'briefing' | 'active' | 'outcome'>('briefing');
  const [reasoningText, setReasoningText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [reasoningHistory, setReasoningHistory] = useState<ReasoningEntry[]>([]);
  const [currentReasoningLabel, setCurrentReasoningLabel] = useState('');
  const reasoningLabelRef = useRef('');
  const [decisions, setDecisions] = useState<
    { stepId: string; choiceId: string; label: string; wasOptimal: boolean }[]
  >([]);
  const [decisionDisabled, setDecisionDisabled] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [review, setReview] = useState<ReviewData | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [flowHumanInstruction, setFlowHumanInstruction] = useState('');
  const [flowKeyInsight, setFlowKeyInsight] = useState('');
  const [flowRealWorldContext, setFlowRealWorldContext] = useState('');

  const reasoningTextRef = useRef('');
  const lastSavedTextRef = useRef('');
  const saveReasoningAndReset = useCallback((newLabel: string) => {
    const text = reasoningTextRef.current;
    if (text.trim() && text !== lastSavedTextRef.current) {
      lastSavedTextRef.current = text;
      setReasoningHistory((h) => [...h, { label: reasoningLabelRef.current || 'Reasoning', text }]);
    }
    reasoningTextRef.current = '';
    setReasoningText('');
    reasoningLabelRef.current = newLabel;
    setCurrentReasoningLabel(newLabel);
  }, []);

  // Load scenario — pick random flow from pool, fallback to hardcoded
  useEffect(() => {
    if (!scenarioId) return;
    if (!isScenarioUnlocked(scenarioId)) {
      router.push('/');
      return;
    }
    let cancelled = false;
    pickRandomFlow(scenarioId)
      .then((flow) => {
        if (cancelled) return;
        setInstance({ scenarioId, variables: flow.variables, steps: flow.steps });
        setFlowHumanInstruction(flow.humanInstruction);
        setFlowKeyInsight(flow.keyInsight);
        setFlowRealWorldContext(flow.realWorldContext);
      })
      .catch(() => {
        if (cancelled) return;
        loadScenario(scenarioId).then((s) => {
          if (cancelled) return;
          setScenario(s);
          setInstance(initScenario(s));
        });
      });
    return () => { cancelled = true; };
  }, [scenarioId, router]);

  const currentStep: Step | null =
    instance && currentStepIndex < instance.steps.length
      ? instance.steps[currentStepIndex]
      : null;

  const humanInstruction = flowHumanInstruction
    || (instance && scenario
      ? scenario.humanInstructionTemplate.replace(
          /\{\{(\w+)\}\}/g,
          (_, key) => {
            const val = instance.variables[key];
            if (Array.isArray(val)) return val.join(', ');
            if (typeof val === 'number') return val.toLocaleString();
            return String(val ?? '');
          }
        )
      : '');

  // Auto-advance for briefing and data_reveal steps
  useEffect(() => {
    if (!currentStep || phase !== 'active') return;
    if (currentStep.type === 'briefing') {
      // Briefing step in active phase: auto-advance after a short delay
      const timer = setTimeout(() => {
        if (instance && currentStepIndex < instance.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
    if (currentStep.type === 'data_reveal') {
      // Generate reasoning for data reveal
      if (instance) {
        saveReasoningAndReset(`Step ${currentStepIndex + 1}: Analysis`);
        setIsStreaming(true);
        const controller = new AbortController();
        abortRef.current = controller;
        const request: AgentRequest = {
          scenarioId,
          scenarioTitle: scenarioTitles[scenarioId] || '',
          variables: instance.variables,
          claudeContext: currentStep.claudeContext,
          type: 'reasoning',
        };
        streamAgentResponse(
          request,
          (text) => { reasoningTextRef.current += text; setReasoningText((prev) => prev + text); },
          controller.signal
        )
          .catch(() => {})
          .finally(() => {
            setIsStreaming(false);
            // Auto-advance after reasoning completes
            setTimeout(() => {
              if (currentStepIndex < instance.steps.length - 1) {
                setCurrentStepIndex((prev) => prev + 1);
              }
            }, 2000);
          });
      }
    } else if (currentStep.type === 'decision') {
      // Generate pre-decision reasoning
      if (instance && !reasoningTextRef.current) {
        saveReasoningAndReset(`Step ${currentStepIndex + 1}: Decision`);
        setIsStreaming(true);
        const controller = new AbortController();
        abortRef.current = controller;
        const request: AgentRequest = {
          scenarioId,
          scenarioTitle: scenarioTitles[scenarioId] || '',
          variables: instance.variables,
          claudeContext: currentStep.claudeContext,
          type: 'reasoning',
        };
        streamAgentResponse(
          request,
          (text) => { reasoningTextRef.current += text; setReasoningText((prev) => prev + text); },
          controller.signal
        )
          .catch(() => {})
          .finally(() => setIsStreaming(false));
      }
    } else if (currentStep.type === 'outcome') {
      setPhase('outcome');
      if (instance) {
        const optimalCount = decisions.filter((d) => d.wasOptimal).length;
        const score = Math.round((optimalCount / Math.max(decisions.length, 1)) * 100);
        completeScenario(scenarioId, score);

        // Build reasoning log from history + current text
        const fullLog = [
          ...reasoningHistory.map((e) => `[${e.label}]\n${e.text}`),
          ...(reasoningTextRef.current.trim() ? [`[Current]\n${reasoningTextRef.current}`] : []),
        ].join('\n\n');

        const decisionSummary = decisions
          .map((d, i) => `Decision ${i + 1}: ${d.label} (${d.wasOptimal ? 'optimal' : 'suboptimal'})`)
          .join('\n');

        setReviewLoading(true);
        fetchAgentReview({
          scenarioId,
          scenarioTitle: scenarioTitles[scenarioId] || '',
          variables: instance.variables,
          claudeContext: decisionSummary,
          type: 'review',
          reasoningLog: fullLog,
        }).then((result) => {
          setReview(result);
          setReviewLoading(false);
        });
      }
    }

    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, phase]);

  const handleDecision = useCallback(
    (optionId: string) => {
      if (!currentStep?.decision || !instance) return;
      setDecisionDisabled(true);

      const option = currentStep.decision.options.find((o) => o.id === optionId);
      if (!option) return;

      saveDecision(scenarioId, currentStep.id, optionId);
      setDecisions((prev) => [
        ...prev,
        {
          stepId: currentStep.id,
          choiceId: optionId,
          label: option.label,
          wasOptimal: option.isOptimal ?? false,
        },
      ]);

      // Stream reaction - save current reasoning first
      saveReasoningAndReset(`Reaction: ${option.label}`);
      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;
      const request: AgentRequest = {
        scenarioId,
        scenarioTitle: scenarioTitles[scenarioId] || '',
        variables: instance.variables,
        claudeContext: option.claudeReactionPrompt,
        type: 'reaction',
      };
      streamAgentResponse(
        request,
        (text) => { reasoningTextRef.current += text; setReasoningText((prev) => prev + text); },
        controller.signal
      )
        .catch(() => {})
        .finally(() => {
          setIsStreaming(false);
          // Advance to next step after reaction
          setTimeout(() => {
            setDecisionDisabled(false);
            setShowChoices(false);
            saveReasoningAndReset('');
            if (currentStepIndex < instance.steps.length - 1) {
              setCurrentStepIndex((prev) => prev + 1);
            }
          }, 2500);
        });
    },
    [currentStep, instance, scenario, scenarioId, currentStepIndex]
  );

  const handleReplay = () => {
    setInstance(null);
    setCurrentStepIndex(0);
    setPhase('briefing');
    setReasoningText('');
    setReasoningHistory([]);
    setCurrentReasoningLabel('');
    reasoningLabelRef.current = '';
    reasoningTextRef.current = '';
    lastSavedTextRef.current = '';
    setDecisions([]);
    setDecisionDisabled(false);
    setShowChoices(false);
    setReview(null);
    setReviewLoading(false);
    setFlowHumanInstruction('');
    setFlowKeyInsight('');
    setFlowRealWorldContext('');
    // Pick a new random flow
    pickRandomFlow(scenarioId)
      .then((flow) => {
        setInstance({ scenarioId, variables: flow.variables, steps: flow.steps });
        setFlowHumanInstruction(flow.humanInstruction);
        setFlowKeyInsight(flow.keyInsight);
        setFlowRealWorldContext(flow.realWorldContext);
      })
      .catch(() => {
        if (scenario) {
          setInstance(initScenario(scenario));
        }
      });
  };

  if (!instance) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1D1D1F]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#6E6E73] font-mono">Loading scenario...</p>
        </div>
      </div>
    );
  }

  if (phase === 'briefing') {
    return (
      <div className="flex-1 flex flex-col min-h-screen">
        <Briefing
          instruction={humanInstruction}
          onComplete={() => setPhase('active')}
        />
      </div>
    );
  }

  if (phase === 'outcome') {
    return (
      <div className="flex-1 flex flex-col">
        <Outcome
          scenarioId={scenarioId}
          scenarioTitle={scenarioTitles[scenarioId] || ''}
          success={decisions.filter((d) => d.wasOptimal).length >= decisions.length / 2}
          decisions={decisions}
          keyInsight={flowKeyInsight || keyInsights[scenarioId] || ''}
          realWorldContext={flowRealWorldContext || realWorldContexts[scenarioId] || ''}
          nextScenarioId={nextScenarios[scenarioId]}
          onReplay={handleReplay}
          review={review}
          reviewLoading={reviewLoading}
        />
      </div>
    );
  }

  if (!currentStep) return null;

  return (
    <div className="flex-1 flex flex-col h-screen">
      <ProgressBar
        current={currentStepIndex}
        total={instance.steps.length}
        scenarioTitle={scenarioTitles[scenarioId] || ''}
      />

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Agent Vision - Left Panel */}
        <div className="flex-1 md:w-[60%] overflow-y-auto">
          <AgentVision step={currentStep} humanInstruction={humanInstruction} />
        </div>

        {/* Agent Reasoning - Right Panel */}
        <div className="md:w-[40%] min-h-[200px] md:min-h-0">
          <AgentReasoning history={reasoningHistory} text={reasoningText} isStreaming={isStreaming} currentLabel={currentReasoningLabel} />
        </div>
      </div>

      {/* Decision Panel */}
      <AnimatePresence>
        {currentStep.type === 'decision' && currentStep.decision && (
          showChoices ? (
            <DecisionPanel
              decision={currentStep.decision}
              onChoose={handleDecision}
              disabled={decisionDisabled || isStreaming}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-white border-t border-[#D2D2D7] p-4 md:p-6 flex justify-center"
            >
              <button
                onClick={() => setShowChoices(true)}
                disabled={isStreaming}
                className="px-8 py-3 rounded-full bg-[#0071E3] text-sm font-medium text-white hover:bg-[#0062CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                What are my choices?
              </button>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
