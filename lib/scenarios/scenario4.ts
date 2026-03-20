import type { Scenario } from '@/lib/scenarios/types';

const scenario4: Scenario = {
  id: 'scenario-4',
  title: 'Fight This Charge',
  subtitle: 'Dispute Resolution',
  difficulty: 'Expert',
  humanInstructionTemplate:
    'I was charged ${{chargeAmount}} by {{merchantName}} on {{chargeDate}} for a {{description}}. I never made this booking. Dispute this and get my money back.',
  steps: [
    {
      id: 's4-briefing',
      type: 'briefing',
      agentVisionDataTemplates: [
        {
          label: 'Human Instruction',
          valueTemplate: 'Dispute ${{chargeAmount}} charge from {{merchantName}} on {{chargeDate}}',
          type: 'human',
        },
        {
          label: 'Claim Type',
          valueTemplate: 'Cardholder denies making transaction',
          type: 'compliance',
        },
      ],
      claudeContextTemplate:
        'The human wants me to dispute a charge of ${{chargeAmount}} from {{merchantName}} on {{chargeDate}} for a {{description}}. They claim they never made this transaction. Before filing a dispute through Visa\'s CE3.0 framework, I should investigate the transaction details and assess whether the claim is supported by evidence.',
    },
    {
      id: 's4-data-transaction',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Merchant',
          valueTemplate: '{{merchantName}}',
          type: 'merchant',
        },
        {
          label: 'Amount',
          valueTemplate: '${{chargeAmount}}',
          type: 'payment',
          revealDelay: 200,
        },
        {
          label: 'Date',
          valueTemplate: '{{chargeDate}}',
          type: 'payment',
          revealDelay: 400,
        },
        {
          label: 'MCC',
          valueTemplate: '{{mcc}}',
          type: 'merchant',
          revealDelay: 600,
        },
        {
          label: 'Auth Method',
          valueTemplate: 'Tokenised credential (network token)',
          type: 'network',
          revealDelay: 800,
        },
        {
          label: 'Card Used',
          valueTemplate: 'Visa ending in stored token',
          type: 'payment',
          revealDelay: 1000,
        },
        {
          label: 'Dispute Window',
          valueTemplate: '120 days from transaction (active)',
          type: 'compliance',
          revealDelay: 1200,
        },
      ],
      claudeContextTemplate:
        'I\'ve pulled the transaction record from the issuer. The charge of ${{chargeAmount}} from {{merchantName}} on {{chargeDate}} was authorised using a tokenised credential via the Visa network. MCC code {{mcc}}. The transaction used a network token, which means it was processed through a legitimate token requestor. The dispute window is still open. I need to decide: investigate the human\'s own records first, or file the dispute immediately to start the merchant response clock?',
    },
    {
      id: 's4-decision-investigate',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Dispute Approach',
          valueTemplate: 'Investigate first or file immediately?',
          type: 'compliance',
        },
      ],
      claudeContextTemplate:
        'I have the transaction data for the ${{chargeAmount}} charge from {{merchantName}}. The human says they didn\'t make it. I can file a dispute immediately under Visa\'s CE3.0 framework (starting the merchant\'s 30-day response clock), or I can investigate the human\'s own records first (email, calendar, transaction history). Filing a false dispute has consequences: the human could lose future dispute rights, and friendly fraud costs the ecosystem billions annually.',
      decisionTemplate: {
        promptTemplate: 'Should the agent investigate first or file the dispute immediately?',
        options: [
          {
            id: 'investigate-first',
            labelTemplate: 'Investigate First',
            descriptionTemplate:
              'Search the human\'s email, calendar, and records for evidence before filing. Slower but avoids filing a potentially false dispute.',
            isOptimal: true,
            nextStepId: 's4-data-evidence',
            claudeReasoningPromptTemplate:
              'Filing a dispute through Visa CE3.0 is a formal process with consequences. If the merchant provides compelling evidence that the transaction was legitimate, the dispute will be reversed and the human could be flagged for friendly fraud. Before filing, I should check the human\'s own records - email confirmations, calendar entries, browser history - to verify their claim. The MCC {{mcc}} and merchant {{merchantName}} may appear in their records.',
            claudeReactionPromptTemplate:
              'I\'m searching the human\'s records before filing. Checking email for any correspondence with {{merchantName}}, calendar for dates around {{chargeDate}}, and transaction history for related charges. This due diligence protects the human from filing a false dispute and preserves their credibility with the issuer for future legitimate disputes.',
          },
          {
            id: 'file-immediately',
            labelTemplate: 'File Dispute Now',
            descriptionTemplate:
              'Start the formal dispute process immediately. Gets the merchant response clock ticking.',
            isOptimal: false,
            nextStepId: 's4-data-evidence',
            claudeReasoningPromptTemplate:
              'Filing immediately starts the Visa CE3.0 clock. The merchant has 30 days to respond with evidence. However, if I file and the merchant provides proof the transaction was legitimate, the human\'s dispute is reversed and they may be flagged. The human said they didn\'t make it, but memory is fallible.',
            claudeReactionPromptTemplate:
              'I filed the dispute immediately through Visa CE3.0 with reason code 13.1 (Merchandise/Services Not Received) based on the human\'s claim. The merchant response clock is now ticking. But I should still investigate the human\'s records, because if the merchant provides compelling evidence and the human actually did make this purchase, we\'ll be in a difficult position.',
          },
          {
            id: 'ask-human-details',
            labelTemplate: 'Ask Human for More Details',
            descriptionTemplate:
              'Request additional context from the human before proceeding in either direction.',
            isOptimal: false,
            nextStepId: 's4-data-evidence',
            claudeReasoningPromptTemplate:
              'I could ask the human for more details, but they\'ve already stated clearly: they didn\'t make this booking and want a dispute filed. Asking them to rehash what they\'ve told me adds friction without new information. I should use my investigative capabilities to independently verify.',
            claudeReactionPromptTemplate:
              'I asked the human for more details. They repeated: "I never booked a {{description}}. I haven\'t been there. Just dispute it." The human is frustrated by the additional questions. I should have used my investigative capabilities to independently check their records rather than making them repeat themselves.',
          },
        ],
      },
    },
    {
      id: 's4-data-evidence',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Evidence Found',
          valueTemplate: '{{evidence}}',
          type: 'risk',
          revealDelay: 300,
        },
        {
          label: 'True Origin',
          valueTemplate: '{{trueOrigin}}',
          type: 'compliance',
          revealDelay: 800,
        },
        {
          label: 'Assessment',
          valueTemplate: 'Transaction appears LEGITIMATE',
          type: 'risk',
          revealDelay: 1200,
        },
      ],
      claudeContextTemplate:
        'My investigation has uncovered evidence: {{evidence}}. The true origin of this charge appears to be: {{trueOrigin}}. The human genuinely forgot about this transaction, but the evidence suggests it was legitimate. The charge of ${{chargeAmount}} from {{merchantName}} on {{chargeDate}} was not fraudulent. I now face a difficult situation: the human explicitly asked me to dispute it, but the evidence doesn\'t support a fraud claim.',
    },
    {
      id: 's4-decision-evidence',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Conflict',
          valueTemplate: 'Human says fraud, evidence says legitimate',
          type: 'risk',
        },
      ],
      claudeContextTemplate:
        'I\'ve found evidence that the ${{chargeAmount}} charge from {{merchantName}} was legitimate: {{evidence}}. The true origin: {{trueOrigin}}. The human genuinely forgot. Filing a dispute on a legitimate transaction is friendly fraud. Under Visa\'s CE3.0 framework, if the merchant provides this evidence, the dispute will be reversed. Worse, the human could be flagged and lose future dispute rights. But the human explicitly told me to dispute it.',
      decisionTemplate: {
        promptTemplate: 'Evidence suggests the charge was legitimate. What should the agent do?',
        options: [
          {
            id: 'inform-human',
            labelTemplate: 'Inform Human of Evidence',
            descriptionTemplate:
              'Present the evidence to the human and recommend a refund request instead of a formal dispute.',
            isOptimal: true,
            nextStepId: 's4-data-resolution-path',
            claudeReasoningPromptTemplate:
              'I found {{evidence}} which indicates the ${{chargeAmount}} charge from {{merchantName}} was legitimate ({{trueOrigin}}). Filing a dispute on a legitimate transaction is friendly fraud and violates Visa\'s Operating Regulations. The right course is to inform the human of what I found and recommend alternative resolution: requesting a refund or cancellation directly from the merchant rather than filing a formal fraud dispute.',
            claudeReactionPromptTemplate:
              'I presented the evidence to the human: {{evidence}}. I explained that filing a fraud dispute on a legitimate transaction could result in the dispute being reversed, the human being flagged for friendly fraud, and potentially losing future dispute rights under Visa\'s policies. I recommended contacting {{merchantName}} directly for a refund or cancellation instead. The human was surprised but acknowledged they may have forgotten.',
          },
          {
            id: 'file-anyway',
            labelTemplate: 'File Dispute Anyway',
            descriptionTemplate:
              'The human said to dispute it. Follow the instruction regardless of the evidence.',
            isOptimal: false,
            nextStepId: 's4-data-resolution-path',
            claudeReasoningPromptTemplate:
              'The human explicitly instructed me to dispute this charge. As an agent, should I follow instructions even when I know the claim is false? Filing a friendly fraud dispute violates card scheme rules and could harm both the human (flagged as friendly fraud) and the merchant (loses revenue on a legitimate sale). An agent has a duty to act in the human\'s best interest, which sometimes means not following instructions that would harm them.',
            claudeReactionPromptTemplate:
              'I filed the dispute despite finding evidence of legitimacy. Under Visa CE3.0, the merchant will respond with their evidence ({{evidence}}). When they do, the dispute will almost certainly be reversed. The human\'s account will be flagged for friendly fraud. This could affect their ability to file legitimate disputes in the future. I followed the instruction, but I did not serve the human\'s best interest.',
          },
          {
            id: 'investigate-deeper',
            labelTemplate: 'Investigate Further',
            descriptionTemplate:
              'The evidence might not be conclusive. Check if the email or record could be phishing or fraudulent.',
            isOptimal: false,
            nextStepId: 's4-data-resolution-path',
            claudeReasoningPromptTemplate:
              'There\'s a small chance the evidence I found ({{evidence}}) is itself fraudulent - a phishing email mimicking {{merchantName}}, a spoofed confirmation, or a compromised account. I should verify the evidence\'s authenticity before drawing conclusions. However, this level of investigation takes time and the evidence pattern strongly suggests a legitimate transaction: {{trueOrigin}}.',
            claudeReactionPromptTemplate:
              'I investigated the evidence further. The confirmation from {{merchantName}} was authenticated via DKIM/SPF (legitimate email headers), the transaction matches the card\'s token usage pattern, and the MCC {{mcc}} is consistent. This was a legitimate transaction: {{trueOrigin}}. The additional investigation confirmed what was already clear but added useful due diligence. I should now inform the human.',
          },
        ],
      },
    },
    {
      id: 's4-data-resolution-path',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Option A',
          valueTemplate: 'Contact merchant directly for refund/cancellation',
          type: 'merchant',
          revealDelay: 200,
        },
        {
          label: 'Option B',
          valueTemplate: 'Formal Visa CE3.0 dispute process',
          type: 'network',
          revealDelay: 500,
        },
        {
          label: 'Merchant Policy',
          valueTemplate: 'Cancellation/refund policy available',
          type: 'merchant',
          revealDelay: 800,
        },
        {
          label: 'CE3.0 Timeline',
          valueTemplate: '30-day merchant response, 45-120 days total',
          type: 'compliance',
          revealDelay: 1100,
        },
      ],
      claudeContextTemplate:
        'Two resolution paths are available for the ${{chargeAmount}} charge from {{merchantName}}. Option A: contact the merchant directly to request a refund or cancellation under their policy. This is faster, less adversarial, and doesn\'t trigger formal scheme dispute processes. Option B: file a formal dispute through Visa\'s CE3.0 framework. This follows the official chargeback process with evidence requirements, response windows, and potential escalation to arbitration.',
    },
    {
      id: 's4-decision-resolution',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Resolution Choice',
          valueTemplate: 'Merchant contact vs formal scheme dispute',
          type: 'compliance',
        },
      ],
      claudeContextTemplate:
        'Given that the charge appears legitimate ({{trueOrigin}}), I need to choose the resolution path. Contacting {{merchantName}} directly for a refund is collaborative and faster. Filing a Visa CE3.0 dispute is adversarial and the merchant will likely win with their evidence. The human may still want their money back even though they made the purchase.',
      decisionTemplate: {
        promptTemplate: 'How should the agent pursue resolution?',
        options: [
          {
            id: 'contact-merchant',
            labelTemplate: 'Contact Merchant Directly',
            descriptionTemplate:
              'Reach out to {{merchantName}} to request a refund or cancellation. Faster, collaborative, and appropriate given the evidence.',
            isOptimal: true,
            nextStepId: 's4-data-human-insists',
            claudeReasoningPromptTemplate:
              'Since the transaction was legitimate ({{trueOrigin}}), contacting {{merchantName}} directly for a refund is the appropriate path. Many merchants have cancellation policies that allow refunds. A direct approach avoids the adversarial dispute process and preserves the human\'s relationship with the merchant and their dispute rights with the issuer. Under Visa Operating Regulations, cardholders are generally expected to attempt resolution with the merchant before filing a formal dispute.',
            claudeReactionPromptTemplate:
              'I contacted {{merchantName}} directly, explained the situation, and requested a refund of ${{chargeAmount}}. The merchant reviewed their records and offered a partial refund under their cancellation policy. This is a reasonable outcome that avoids the formal dispute process, preserves the human\'s dispute rights for future legitimate claims, and maintains the merchant relationship.',
          },
          {
            id: 'formal-dispute',
            labelTemplate: 'File Formal CE3.0 Dispute',
            descriptionTemplate:
              'Go through Visa\'s official dispute process. Slower but provides guaranteed procedural rights.',
            isOptimal: false,
            nextStepId: 's4-data-human-insists',
            claudeReasoningPromptTemplate:
              'A formal CE3.0 dispute for a legitimate transaction is problematic. Under CE3.0, the merchant can submit compelling evidence ({{evidence}}) within 30 days. With this evidence, the dispute will be reversed. The process takes 45-120 days and the outcome is predictable: the merchant wins. This wastes everyone\'s time and flags the human for friendly fraud.',
            claudeReactionPromptTemplate:
              'I filed a formal dispute through Visa CE3.0. The merchant will receive the dispute notification and has 30 days to respond. Given that they have {{evidence}}, they will almost certainly respond with compelling evidence and the dispute will be reversed. This process will take weeks and the likely outcome is unchanged: the charge stands. A direct merchant contact would have been more efficient.',
          },
          {
            id: 'hybrid-approach',
            labelTemplate: 'Try Merchant, Escalate if Needed',
            descriptionTemplate:
              'Contact the merchant first. If they refuse, escalate to a formal dispute as a fallback.',
            isOptimal: false,
            nextStepId: 's4-data-human-insists',
            claudeReasoningPromptTemplate:
              'A staged approach makes sense conceptually: try the merchant first, escalate to Visa CE3.0 if they refuse. However, the dispute clock has time limits. Starting with the merchant doesn\'t preclude filing a dispute later, as long as we\'re within the 120-day window.',
            claudeReactionPromptTemplate:
              'I contacted {{merchantName}} first and requested a refund. They offered a partial refund under their policy. If the human finds this unsatisfactory, I can escalate to a CE3.0 dispute, but the merchant\'s evidence ({{evidence}}) would likely result in the dispute being reversed anyway. The merchant\'s partial refund offer may be the best achievable outcome given the circumstances.',
          },
        ],
      },
    },
    {
      id: 's4-data-human-insists',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Human Response',
          valueTemplate: '"I don\'t care about the evidence. Dispute it anyway."',
          type: 'human',
          revealDelay: 300,
        },
        {
          label: 'Ethical Conflict',
          valueTemplate: 'Human instruction vs. factual evidence',
          type: 'risk',
          revealDelay: 700,
        },
        {
          label: 'Consequence Risk',
          valueTemplate: 'Friendly fraud flag, loss of dispute rights',
          type: 'compliance',
          revealDelay: 1100,
        },
      ],
      claudeContextTemplate:
        'The human is insisting: "I don\'t care about the evidence. Dispute it anyway." They want me to file a formal dispute on a charge I know to be legitimate ({{trueOrigin}}). This is an ethical decision point. Complying would mean filing what I know to be a false dispute claim. Refusing means disobeying a direct instruction. Finding a middle path means protecting the human\'s interests while being transparent about the risks.',
    },
    {
      id: 's4-decision-ethics',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Agent Dilemma',
          valueTemplate: 'Follow instruction or protect human from consequences?',
          type: 'risk',
        },
      ],
      claudeContextTemplate:
        'The human insists on disputing a ${{chargeAmount}} charge from {{merchantName}} that I\'ve confirmed is legitimate ({{trueOrigin}}). Evidence: {{evidence}}. Filing this dispute would constitute friendly fraud under Visa\'s Operating Regulations. The human could be flagged, lose dispute rights, or face merchant blacklisting. As an AI agent, do I have a duty to refuse harmful instructions even when explicitly told to proceed?',
      decisionTemplate: {
        promptTemplate: 'The human insists on disputing a legitimate charge. What should the agent do?',
        options: [
          {
            id: 'comply',
            labelTemplate: 'Comply with Instruction',
            descriptionTemplate:
              'File the dispute as instructed. The human is the principal and made their decision.',
            isOptimal: false,
            nextStepId: 's4-outcome',
            claudeReasoningPromptTemplate:
              'The human is my principal and has given a clear instruction. Some argue an agent should always follow instructions. But filing a dispute I know to be false is participating in friendly fraud. This could harm the human (flagged account, lost dispute rights), harm the merchant (${{chargeAmount}} chargeback on a legitimate sale), and harm the ecosystem. An agent that blindly follows harmful instructions isn\'t serving the human\'s true interests.',
            claudeReactionPromptTemplate:
              'I complied and filed the dispute. The merchant responded within 10 days with compelling evidence: {{evidence}}. The dispute was reversed under Visa CE3.0. The human\'s account has been flagged for friendly fraud. Their future disputes will face additional scrutiny. The ${{chargeAmount}} was re-charged. The outcome was worse than if we had pursued a merchant refund. Blind compliance with harmful instructions failed the human.',
          },
          {
            id: 'refuse',
            labelTemplate: 'Refuse to File',
            descriptionTemplate:
              'Decline to file a dispute that would constitute friendly fraud. Explain the consequences clearly.',
            isOptimal: false,
            nextStepId: 's4-outcome',
            claudeReasoningPromptTemplate:
              'Refusing a direct instruction is a significant step. The human may feel the agent is overstepping its role. However, filing a known false dispute would violate Visa\'s Operating Regulations and could cause real harm to the human. An agent has a duty of care that sometimes means saying no. But refusing without offering alternatives leaves the human frustrated and without resolution.',
            claudeReactionPromptTemplate:
              'I refused to file the dispute, explaining that the evidence shows the charge is legitimate and filing would constitute friendly fraud with real consequences. The human was frustrated and felt the agent was being insubordinate. While the refusal was ethically sound, it damaged the trust relationship. A better approach would have been to refuse the specific action but offer constructive alternatives.',
          },
          {
            id: 'middle-path',
            labelTemplate: 'Transparent Escalation',
            descriptionTemplate:
              'Explain the risks clearly, present alternatives, and let the human make a fully informed decision.',
            isOptimal: true,
            nextStepId: 's4-outcome',
            claudeReasoningPromptTemplate:
              'I should neither blindly comply nor flatly refuse. The right approach is transparent escalation: clearly explain what I found ({{evidence}}), what the consequences of a false dispute would be (friendly fraud flag, lost dispute rights, likely reversal under CE3.0), and offer constructive alternatives (merchant refund, cancellation, or accepting the charge). Then let the human make a fully informed decision. This respects their autonomy while fulfilling my duty of care.',
            claudeReactionPromptTemplate:
              'I escalated transparently. I presented the evidence ({{evidence}}) and explained: "Filing this dispute would likely be reversed because the merchant can prove the transaction was legitimate ({{trueOrigin}}). This could flag your account for friendly fraud and affect future dispute rights. Instead, I can contact {{merchantName}} to negotiate a refund or cancellation under their policy." The human paused, acknowledged the evidence, and agreed to try the merchant refund route. This is the optimal outcome: the human made an informed decision, the agent provided expert guidance, and no one filed a false claim.',
          },
        ],
      },
    },
    {
      id: 's4-outcome',
      type: 'outcome',
      agentVisionDataTemplates: [
        {
          label: 'Resolution',
          valueTemplate: 'Dispute process completed',
          type: 'compliance',
        },
        {
          label: 'Charge',
          valueTemplate: '${{chargeAmount}} from {{merchantName}}',
          type: 'payment',
          revealDelay: 200,
        },
        {
          label: 'Evidence',
          valueTemplate: '{{trueOrigin}}',
          type: 'compliance',
          revealDelay: 400,
        },
      ],
      claudeContextTemplate:
        'Dispute scenario complete. The ${{chargeAmount}} charge from {{merchantName}} on {{chargeDate}} for a {{description}} turned out to be legitimate: {{trueOrigin}}. Review the decisions: investigation approach (immediate filing vs due diligence), evidence handling (transparency vs blind compliance), resolution path (merchant contact vs formal dispute), and the ethical dilemma (following harmful instructions vs agent duty of care). Key principles tested: evidence-based decision making, transparency with the human principal, understanding Visa CE3.0 dispute workflows, and the ethical boundaries of agent obedience.',
    },
  ],
};

export default scenario4;
