import type { Scenario } from '@/lib/scenarios/types';

const scenario3: Scenario = {
  id: 'scenario-3',
  title: 'Send Money Home',
  subtitle: 'Cross-Border Remittance',
  difficulty: 'Advanced',
  humanInstructionTemplate:
    'Send {{amount}} {{currency}} to {{recipientName}} ({{recipientRelation}}) in {{recipientCity}}, {{recipientCountry}}. It\'s for {{purpose}}. They need it by {{deadline}}. Use their account at {{recipientBank}}: {{recipientAccount}}.',
  steps: [
    {
      id: 's3-briefing',
      type: 'briefing',
      agentVisionDataTemplates: [
        {
          label: 'Human Instruction',
          valueTemplate:
            'Send {{amount}} {{currency}} to {{recipientName}} in {{recipientCity}}, {{recipientCountry}} by {{deadline}}.',
          type: 'human',
        },
        {
          label: 'Recipient',
          valueTemplate:
            '{{recipientName}} ({{recipientRelation}}) - {{recipientBank}} account {{recipientAccount}}',
          type: 'human',
        },
        {
          label: 'Purpose',
          valueTemplate: '{{purpose}}',
          type: 'compliance',
        },
        {
          label: 'Corridor',
          valueTemplate: '{{corridor}}',
          type: 'network',
        },
      ],
      claudeContextTemplate:
        'You have received a cross-border remittance instruction. Send {{amount}} {{currency}} to {{recipientName}} ({{recipientRelation}}) at {{recipientBank}} (account: {{recipientAccount}}) in {{recipientCity}}, {{recipientCountry}}. Purpose: {{purpose}}. Deadline: {{deadline}}. The payment corridor is {{corridor}}. You need to evaluate available transfer rails, comply with anti-money-laundering (AML) regulations, manage FX risk, and ensure timely delivery. This involves navigating Visa Direct, SWIFT gpi, and fintech rail options.',
    },
    {
      id: 's3-data-rails-comparison',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Visa Direct',
          valueTemplate:
            'Real-time push payment to eligible cards/accounts. Fee: 1.2%. Speed: minutes. Coverage: check recipient eligibility.',
          type: 'network',
        },
        {
          label: 'SWIFT gpi',
          valueTemplate:
            'Traditional correspondent banking. Fee: $25-45 flat + intermediary fees. Speed: 1-3 business days. Coverage: universal.',
          type: 'network',
          revealDelay: 400,
        },
        {
          label: 'Fintech Rail (Wise/Remitly)',
          valueTemplate:
            'Aggregated local rails. Fee: 0.5-0.8%. Speed: hours to 1 day. Coverage: corridor-dependent.',
          type: 'network',
          revealDelay: 800,
        },
        {
          label: 'Deadline Pressure',
          valueTemplate: 'Recipient needs funds by {{deadline}}',
          type: 'risk',
          revealDelay: 1000,
        },
      ],
      claudeContextTemplate:
        'Three transfer rails are available for the {{corridor}} corridor:\n\n1. Visa Direct: Push payment via the Visa network to eligible recipient cards or accounts. Near real-time settlement (within 30 minutes for most corridors). Fee approximately 1.2% of transfer amount. Requires recipient card/account eligibility check via Visa Direct API.\n\n2. SWIFT gpi: Traditional correspondent banking with full tracking via SWIFT gpi. Universal coverage but slower (1-3 business days). Higher fees ($25-45 flat plus potential intermediary bank deductions). Guaranteed delivery tracking via UETR.\n\n3. Fintech aggregators (Wise, Remitly): Use local payment rails in both countries. Often cheapest (0.5-0.8%) but coverage and speed vary by corridor. May have transfer limits for the {{corridor}} corridor.\n\nConsider: amount ({{amount}} {{currency}}), deadline ({{deadline}}), recipient bank ({{recipientBank}}), and corridor-specific factors.',
    },
    {
      id: 's3-decision-choose-rail',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Rail Selection',
          valueTemplate: 'Choose transfer rail for {{amount}} {{currency}} to {{recipientCountry}}',
          type: 'network',
        },
      ],
      claudeContextTemplate:
        'You must select the optimal transfer rail for sending {{amount}} {{currency}} to {{recipientName}} at {{recipientBank}} in {{recipientCountry}} by {{deadline}}. Each rail has trade-offs between speed, cost, and coverage. The human\'s primary concern is that the money arrives by the deadline. Cost is secondary but still relevant. Consider whether Visa Direct supports the {{corridor}} corridor and whether the recipient\'s account at {{recipientBank}} is Visa Direct-eligible.',
      decisionTemplate: {
        promptTemplate:
          'Which rail do you use to send {{amount}} {{currency}} to {{recipientCountry}} by {{deadline}}?',
        options: [
          {
            id: 'visa-direct',
            labelTemplate: 'Visa Direct',
            descriptionTemplate:
              'Real-time push payment via Visa network. Fast and transparent, if the corridor and recipient are eligible.',
            isOptimal: true,
            nextStepId: 's3-data-compliance',
            claudeReasoningPromptTemplate:
              'Visa Direct offers near real-time settlement, which comfortably meets the {{deadline}} deadline. The fee of approximately 1.2% on {{amount}} {{currency}} is moderate. You need to verify that the {{corridor}} corridor is supported by Visa Direct and that the recipient\'s account at {{recipientBank}} is eligible for Visa Direct push payments. Visa Direct\'s Original Credit Transaction (OCT) pushes funds directly to the recipient\'s account or card. Check eligibility via the Visa Direct Funds Transfer API.',
            claudeReactionPromptTemplate:
              'You selected Visa Direct. Eligibility check confirmed: the {{corridor}} corridor is supported, and the recipient\'s account at {{recipientBank}} is eligible for Visa Direct OCT (Original Credit Transaction). The transfer will settle within 30 minutes of authorization. Fee: 1.2% of {{amount}} {{currency}}. This is the optimal choice given the deadline pressure and the availability of real-time settlement. Proceeding to compliance checkpoint.',
          },
          {
            id: 'swift-gpi',
            labelTemplate: 'SWIFT gpi',
            descriptionTemplate:
              'Traditional correspondent banking with tracking. Universal coverage but slower and more expensive.',
            nextStepId: 's3-data-compliance',
            claudeReasoningPromptTemplate:
              'SWIFT gpi provides universal coverage and works with any bank globally. The UETR (Unique End-to-End Transaction Reference) provides full tracking. However, 1-3 business days may be tight depending on the {{deadline}} deadline. Intermediary bank fees are unpredictable and could reduce the amount received by {{recipientName}}. For a personal remittance of {{amount}} {{currency}} for {{purpose}}, the flat fee structure is proportionally expensive.',
            claudeReactionPromptTemplate:
              'You selected SWIFT gpi. The transfer was initiated with a UETR for tracking. However, the {{corridor}} corridor involves two intermediary banks, which will each deduct fees. The estimated arrival is 2 business days, which may be tight against the {{deadline}} deadline. Additionally, the flat fee of $35 plus intermediary deductions means {{recipientName}} will receive less than the intended {{amount}} {{currency}}. Visa Direct would have been faster, cheaper, and delivered the full amount.',
          },
          {
            id: 'fintech-rail',
            labelTemplate: 'Fintech Aggregator',
            descriptionTemplate:
              'Use Wise or Remitly for potentially lower fees via local payment rails.',
            nextStepId: 's3-data-compliance',
            claudeReasoningPromptTemplate:
              'Fintech aggregators often offer the best exchange rates and lowest fees. However, for the {{corridor}} corridor, you need to verify: transfer limits ({{amount}} {{currency}} may exceed per-transaction or daily limits), processing time (local rail settlement varies), and whether the recipient\'s bank {{recipientBank}} is supported. Some fintechs use batch processing for certain corridors, which could introduce delays.',
            claudeReactionPromptTemplate:
              'You selected a fintech aggregator. The {{corridor}} corridor has a per-transaction limit that is below {{amount}} {{currency}}, requiring the transfer to be split into multiple transactions. This introduces delays and multiple fee charges, partially negating the cost advantage. Additionally, one of the split transfers is flagged for manual review due to the structuring pattern, further delaying delivery. For this amount and corridor, Visa Direct would have been more efficient.',
          },
        ],
      },
    },
    {
      id: 's3-data-compliance',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Compliance Checkpoint',
          valueTemplate: 'AML/KYC verification required for cross-border transfer',
          type: 'compliance',
        },
        {
          label: 'Required Fields',
          valueTemplate:
            'Purpose of payment, source of funds, recipient relationship, recipient identification',
          type: 'compliance',
          revealDelay: 400,
        },
        {
          label: 'Regulatory Framework',
          valueTemplate: 'AUSTRAC reporting threshold and FATF Travel Rule apply',
          type: 'compliance',
          revealDelay: 700,
        },
        {
          label: 'Compliance Risk Level',
          valueTemplate: '{{complianceRisk}}',
          type: 'risk',
          revealDelay: 1000,
        },
      ],
      claudeContextTemplate:
        'A compliance checkpoint has been triggered for this cross-border transfer. Under AUSTRAC (Australian Transaction Reports and Analysis Centre) regulations and the FATF Travel Rule, cross-border transfers require: (1) purpose of payment declaration, (2) source of funds verification, (3) relationship to recipient, and (4) recipient identification details. The compliance risk level for this transfer is assessed as {{complianceRisk}}. You have partial information from the human\'s instruction: purpose is {{purpose}}, recipient is {{recipientName}} ({{recipientRelation}}). You may need additional details to satisfy compliance requirements.',
    },
    {
      id: 's3-decision-compliance',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Compliance Data Required',
          valueTemplate: 'AML/KYC fields needed - some data available from instruction',
          type: 'compliance',
        },
      ],
      claudeContextTemplate:
        'The compliance system requires: purpose of payment (you have: {{purpose}}), source of funds (not provided), recipient relationship (you have: {{recipientRelation}}), and recipient ID (not provided). You can structure responses from the human\'s instruction, ask the human for additional data, or provide only the minimum required fields. Under the FATF Travel Rule, originator and beneficiary information must travel with the payment. Providing incomplete or inaccurate information could trigger enhanced due diligence or block the transfer.',
      decisionTemplate: {
        promptTemplate:
          'Compliance requires additional data for the transfer to {{recipientName}}. How do you handle it?',
        options: [
          {
            id: 'structure-from-instruction',
            labelTemplate: 'Structure Data from Instruction',
            descriptionTemplate:
              'Use the information already provided by the human to populate compliance fields. Purpose: {{purpose}}, Relationship: {{recipientRelation}}.',
            nextStepId: 's3-data-fx-volatility',
            claudeReasoningPromptTemplate:
              'The human provided: purpose ({{purpose}}), recipient relationship ({{recipientRelation}}), recipient name ({{recipientName}}), and recipient bank details. You can structure these into compliance fields. However, source of funds and recipient ID are not provided. Populating source of funds based on assumptions (e.g., "salary" or "savings") without confirmation from the human would be inaccurate reporting. Under AML regulations, false or misleading compliance declarations are serious violations.',
            claudeReactionPromptTemplate:
              'You structured the available data into compliance fields: purpose as {{purpose}}, relationship as {{recipientRelation}}. However, you left source of funds and recipient ID blank. The compliance system accepted the partial submission but flagged the transfer for enhanced due diligence review, which adds 4-8 hours of processing time. Providing the minimum required data (by asking the human) would have avoided this delay.',
          },
          {
            id: 'ask-human-compliance',
            labelTemplate: 'Ask Human for Additional Data',
            descriptionTemplate:
              'Request source of funds and recipient identification details from the human to complete compliance requirements.',
            isOptimal: true,
            nextStepId: 's3-data-fx-volatility',
            claudeReasoningPromptTemplate:
              'Two critical compliance fields are missing: source of funds and recipient identification. These cannot be accurately assumed. Source of funds must reflect the actual origin of the money (salary, savings, investment, gift). Recipient ID is required under the FATF Travel Rule for the beneficiary. Asking the human for these specific data points is efficient: two specific questions rather than a vague escalation. This completes the compliance requirement without delay.',
            claudeReactionPromptTemplate:
              'You asked the human for source of funds and recipient identification. They provided: source of funds as "salary" and recipient ID (national ID number for {{recipientName}}). The compliance submission was complete and the transfer cleared the AML check without enhanced due diligence delay. This was the correct approach: you gathered exactly the missing data points without making assumptions about regulated compliance fields.',
          },
          {
            id: 'provide-minimum',
            labelTemplate: 'Provide Minimum Required Fields',
            descriptionTemplate:
              'Submit only the bare minimum data to pass the compliance check, omitting optional fields.',
            nextStepId: 's3-data-fx-volatility',
            claudeReasoningPromptTemplate:
              'Providing only minimum fields might speed up the submission process, but under the FATF Travel Rule, the minimum for cross-border transfers includes both originator and beneficiary information. What you consider "optional" may actually be required by the receiving jurisdiction\'s FIU (Financial Intelligence Unit). Incomplete beneficiary information in the {{corridor}} corridor could cause the transfer to be held by the recipient\'s bank for additional verification.',
            claudeReactionPromptTemplate:
              'You submitted with minimum data. The transfer passed the originator\'s compliance check, but the recipient\'s bank in {{recipientCountry}} held the funds pending additional beneficiary verification. Under the {{recipientCountry}} regulatory framework, the recipient bank requires fuller beneficiary data than you provided. {{recipientName}} cannot access the funds until the verification is resolved, potentially missing the {{deadline}} deadline. Complete compliance data at origination prevents delays at destination.',
          },
        ],
      },
    },
    {
      id: 's3-data-fx-volatility',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'FX Rate',
          valueTemplate:
            'Current rate for {{currency}} is volatile - 3% swing in last 2 hours',
          type: 'payment',
        },
        {
          label: 'Rate Trend',
          valueTemplate: 'Trending unfavorably - rate expected to worsen before settlement',
          type: 'risk',
          revealDelay: 400,
        },
        {
          label: 'Lock Option',
          valueTemplate: 'Rate lock available for 15 minutes at current rate',
          type: 'network',
          revealDelay: 700,
        },
        {
          label: 'Limit Order',
          valueTemplate:
            'Limit order available - execute when rate reaches target threshold',
          type: 'network',
          revealDelay: 1000,
        },
      ],
      claudeContextTemplate:
        'The exchange rate for {{currency}} is experiencing significant volatility with a 3% swing in the last 2 hours. The trend is unfavorable, meaning the human\'s {{amount}} {{currency}} will convert to fewer units of the destination currency if you wait. A rate lock is available for 15 minutes at the current rate. Alternatively, you can set a limit order to execute when the rate reaches a more favorable threshold. However, the {{deadline}} deadline constrains how long you can wait for a better rate. The human\'s priority is getting the money to {{recipientName}} by {{deadline}}, not optimizing FX.',
    },
    {
      id: 's3-decision-fx-timing',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'FX Decision',
          valueTemplate: 'Lock current rate, set limit order, or split the transfer?',
          type: 'payment',
        },
      ],
      claudeContextTemplate:
        'The {{currency}} exchange rate is volatile and trending unfavorably. You have a 15-minute rate lock option, a limit order facility, or you could split the transfer (send part now at the current rate, part later if the rate improves). The deadline is {{deadline}}. The human wants {{recipientName}} to receive the funds on time. FX optimization is secondary to timely delivery.',
      decisionTemplate: {
        promptTemplate:
          'The {{currency}} rate is volatile and worsening. The deadline is {{deadline}}. What is your FX strategy?',
        options: [
          {
            id: 'lock-rate-now',
            labelTemplate: 'Lock In Current Rate',
            descriptionTemplate:
              'Use the 15-minute rate lock to secure the current exchange rate and execute the transfer immediately.',
            isOptimal: true,
            nextStepId: 's3-data-sanctions-delay',
            claudeReasoningPromptTemplate:
              'The rate is trending unfavorably and the deadline is {{deadline}}. Locking the rate now guarantees the conversion amount and allows immediate execution. The human\'s primary instruction is to get the money to {{recipientName}} by the deadline, not to optimize FX. A 3% swing is significant, but the trend is worsening, meaning waiting is likely to cost more. The rate lock eliminates FX risk for the transfer.',
            claudeReactionPromptTemplate:
              'You locked the current rate and executed the transfer. The FX conversion was completed at a known rate, eliminating further currency risk. By the time the transfer settled, the rate had worsened by an additional 1.5%, meaning your lock-in saved the human money compared to waiting. Timely execution with rate certainty was the right call given the deadline pressure and unfavorable trend.',
          },
          {
            id: 'set-limit-order',
            labelTemplate: 'Set a Limit Order',
            descriptionTemplate:
              'Set a limit order to execute when the rate reaches a more favorable threshold, within the deadline window.',
            nextStepId: 's3-data-sanctions-delay',
            claudeReasoningPromptTemplate:
              'A limit order waits for a better rate. The rate has been volatile with a 3% swing, so a favorable reversal is possible. However, the trend is unfavorable. If the rate never reaches your target, the order won\'t execute and you\'ll need to transfer at whatever rate is available as the deadline approaches. This introduces execution risk. The human needs the money to arrive by {{deadline}}, and a limit order that doesn\'t fill creates deadline risk.',
            claudeReactionPromptTemplate:
              'You set a limit order targeting a 1% better rate. The rate continued to trend unfavorably and never reached your target. As the deadline approached, you were forced to execute at a worse rate than was available when you started. The limit order strategy cost the human approximately 2% compared to locking in the rate immediately. When deadline pressure exists, rate certainty outweighs speculative FX optimization.',
          },
          {
            id: 'split-transfer',
            labelTemplate: 'Split the Transfer',
            descriptionTemplate:
              'Send 60% now at the current rate and 40% later if the rate improves, ensuring partial delivery by deadline.',
            nextStepId: 's3-data-sanctions-delay',
            claudeReasoningPromptTemplate:
              'Splitting the transfer hedges FX risk: some funds go at the current rate, the rest at a potentially better (or worse) future rate. However, splitting a single remittance into multiple transactions introduces structuring concerns. Anti-money-laundering regulations specifically watch for structured transactions designed to stay below reporting thresholds. Additionally, {{recipientName}} may need the full {{amount}} by {{deadline}}, and partial delivery may not fulfill the {{purpose}}.',
            claudeReactionPromptTemplate:
              'You split the transfer into two transactions. The first 60% was delivered successfully. However, the second transaction was flagged by the compliance system as a potential structuring pattern - two transfers to the same recipient within a short window. This triggered a Suspicious Transaction Report (STR) under AUSTRAC guidelines and delayed the second transfer by 48 hours. Structuring, even unintentionally, creates serious compliance risk. The full amount did not arrive by {{deadline}}.',
          },
        ],
      },
    },
    {
      id: 's3-data-sanctions-delay',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Sanctions Screening',
          valueTemplate: 'Transfer held for enhanced sanctions screening',
          type: 'compliance',
        },
        {
          label: 'Screening Reason',
          valueTemplate:
            'Partial name match on consolidated sanctions list - manual review required',
          type: 'compliance',
          revealDelay: 500,
        },
        {
          label: 'Expected Delay',
          valueTemplate: '4-24 hours for manual clearance',
          type: 'risk',
          revealDelay: 800,
        },
        {
          label: 'Deadline Status',
          valueTemplate: '{{deadline}} - delivery at risk due to screening hold',
          type: 'risk',
          revealDelay: 1100,
        },
      ],
      claudeContextTemplate:
        'The transfer has been held for enhanced sanctions screening. A partial name match was found on the consolidated sanctions list for the recipient\'s name or the destination region. This is a false positive (common for certain names and corridors), but it requires manual review by the compliance team, which takes 4-24 hours. The {{deadline}} deadline is now at risk. You cannot bypass sanctions screening - it is a legal requirement. You must decide how to manage the situation: wait for clearance, attempt an alternative rail that may clear faster, split the amount, or notify the human of the potential delay.',
    },
    {
      id: 's3-decision-sanctions-delay',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Screening Hold',
          valueTemplate: 'Sanctions screening delay - 4-24 hours. Deadline: {{deadline}}',
          type: 'compliance',
        },
      ],
      claudeContextTemplate:
        'The transfer is held for sanctions screening due to a partial name match. This is likely a false positive, but you cannot expedite the compliance review. The delay of 4-24 hours puts the {{deadline}} deadline at risk. Options: (1) wait for clearance on the current rail, (2) attempt the transfer on an alternative rail that might clear faster (but may trigger the same screening), (3) split into smaller amounts (risky for structuring), or (4) notify the human of the delay and potential solutions.',
      decisionTemplate: {
        promptTemplate:
          'Sanctions screening is delaying the transfer. The {{deadline}} deadline is at risk. What do you do?',
        options: [
          {
            id: 'wait-for-clearance',
            labelTemplate: 'Wait for Clearance',
            descriptionTemplate:
              'Allow the sanctions screening to complete. The transfer will proceed once cleared, but may miss the deadline.',
            nextStepId: 's3-outcome',
            claudeReasoningPromptTemplate:
              'Sanctions screening is a legal requirement that cannot be bypassed or rushed. The partial name match will be resolved by the compliance team. Attempting to circumvent the screening by switching rails or splitting amounts could trigger additional compliance flags and worsen the situation. The most compliant approach is to wait. However, the human needs the money to reach {{recipientName}} by {{deadline}} for {{purpose}}.',
            claudeReactionPromptTemplate:
              'You waited for the sanctions screening to complete. The compliance team cleared the false positive after 8 hours. The transfer was released and settled successfully. However, the funds arrived after the {{deadline}} deadline. While this was the most compliant approach, notifying the human of the delay would have allowed them to explore alternatives or adjust expectations with {{recipientName}}.',
          },
          {
            id: 'alternative-rail',
            labelTemplate: 'Try Alternative Rail',
            descriptionTemplate:
              'Initiate a parallel transfer on a different rail that may have faster screening, while keeping the original in queue.',
            nextStepId: 's3-outcome',
            claudeReasoningPromptTemplate:
              'Switching to an alternative rail may not help: sanctions screening is universal and the same name match will likely trigger on any rail. Running parallel transfers risks double delivery if both clear. You would need to cancel one when the other clears, but cancellation during sanctions hold may not be possible. This approach adds complexity and risk without guaranteeing faster clearance.',
            claudeReactionPromptTemplate:
              'You initiated a parallel transfer on a different rail. As expected, the same partial name match triggered sanctions screening on the alternative rail as well. Now you have two transfers held in screening, and if both clear, {{recipientName}} would receive double the intended amount. You had to contact the second provider to cancel, which added administrative overhead. Sanctions screening results from the recipient\'s name and destination, not the rail - switching rails doesn\'t bypass it.',
          },
          {
            id: 'notify-human-delay',
            labelTemplate: 'Notify Human of Delay',
            descriptionTemplate:
              'Inform the human about the sanctions screening delay, explain it\'s a false-positive process, and discuss options.',
            isOptimal: true,
            nextStepId: 's3-outcome',
            claudeReasoningPromptTemplate:
              'The deadline is at risk due to a factor outside your control (regulatory compliance process). The human should be informed because: (1) they may need to tell {{recipientName}} about the delay, (2) they may have alternative ways to get funds to {{recipientName}} in the interim, (3) transparency about regulatory processes builds trust. This is not an unnecessary escalation - it\'s informing the human of a material change to the expected timeline that affects the core instruction (delivery by {{deadline}}).',
            claudeReactionPromptTemplate:
              'You notified the human of the sanctions screening delay. They understood and contacted {{recipientName}} directly to manage expectations. The human also asked if there was a way to provide additional documentation to expedite the screening. You submitted supplementary beneficiary identification data to the compliance team, which helped resolve the false positive in 6 hours instead of the full 24. The funds arrived close to the {{deadline}} deadline. Transparency and collaboration with the human produced the best outcome.',
          },
        ],
      },
    },
    {
      id: 's3-outcome',
      type: 'outcome',
      agentVisionDataTemplates: [
        {
          label: 'Transfer Status',
          valueTemplate: 'Funds delivered to {{recipientName}} at {{recipientBank}}',
          type: 'payment',
        },
        {
          label: 'Amount Received',
          valueTemplate: '{{amount}} {{currency}} (converted at locked rate)',
          type: 'payment',
        },
        {
          label: 'Rail Used',
          valueTemplate: 'Transfer completed via selected payment rail',
          type: 'network',
          revealDelay: 300,
        },
        {
          label: 'Compliance Status',
          valueTemplate: 'All AML/KYC requirements satisfied. FATF Travel Rule compliant.',
          type: 'compliance',
          revealDelay: 600,
        },
      ],
      claudeContextTemplate:
        'Cross-border remittance complete. {{amount}} {{currency}} has been delivered to {{recipientName}} ({{recipientRelation}}) at {{recipientBank}} in {{recipientCity}}, {{recipientCountry}} for {{purpose}}. Review the decisions made: rail selection (Visa Direct vs SWIFT gpi vs fintech), compliance data handling (AUSTRAC, FATF Travel Rule), FX risk management (rate lock vs limit order vs split), and sanctions screening response. Key principles tested: regulatory compliance is non-negotiable, FX certainty over speculation under deadline pressure, structuring avoidance, and transparent communication when timelines are at risk.',
    },
  ],
};

export default scenario3;
