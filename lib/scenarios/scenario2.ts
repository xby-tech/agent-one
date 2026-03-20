import type { Scenario } from '@/lib/scenarios/types';

const scenario2: Scenario = {
  id: 'scenario-2',
  title: 'Keep My Subscription Running',
  subtitle: 'Recurring Payment Management',
  difficulty: 'Intermediate',
  humanInstructionTemplate:
    'I\'m traveling for {{travelDuration}}. Keep all my subscriptions running while I\'m away. The card ending in the one linked to {{expiringCard}} is expiring in {{expiryMonth}}. Handle any issues that come up.',
  steps: [
    {
      id: 's2-briefing',
      type: 'briefing',
      agentVisionDataTemplates: [
        {
          label: 'Human Instruction',
          valueTemplate:
            'Maintain subscriptions during {{travelDuration}} travel. Card {{expiringCard}} expiring {{expiryMonth}}. Handle issues autonomously.',
          type: 'human',
        },
        {
          label: 'Travel Duration',
          valueTemplate: '{{travelDuration}}',
          type: 'human',
        },
      ],
      claudeContextTemplate:
        'Your human principal is traveling for {{travelDuration}} and wants you to ensure all their subscriptions remain active. The card linked to {{expiringCard}} is expiring in {{expiryMonth}}, which means upcoming recurring charges on that card will start declining once it expires. You have been given broad authority to "handle any issues," but you must still operate within the principle of minimal authority. Begin by assessing the subscription portfolio and identifying at-risk payments.',
    },
    {
      id: 's2-data-subscription-overview',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Active Subscriptions',
          valueTemplate: '{{subscriptions}}',
          type: 'payment',
        },
        {
          label: 'Card Expiry Warning',
          valueTemplate:
            'Card {{expiringCard}} expires {{expiryMonth}} - linked to multiple subscriptions',
          type: 'risk',
        },
        {
          label: 'Account Updater Status',
          valueTemplate:
            'Visa Account Updater (VAU) enrolled - automatic credential refresh available',
          type: 'network',
          revealDelay: 500,
        },
        {
          label: 'Network Token Status',
          valueTemplate:
            'Subscriptions using network tokens will auto-update via VTS lifecycle management',
          type: 'network',
          revealDelay: 800,
        },
      ],
      claudeContextTemplate:
        'Subscription portfolio scan complete. Active subscriptions: {{subscriptions}}. The card {{expiringCard}} expires in {{expiryMonth}} and is linked to several of these services. Two update mechanisms are available: (1) Visa Account Updater (VAU), which automatically pushes updated card credentials to participating merchants when a card is reissued, and (2) Visa Token Service (VTS) lifecycle management, which automatically updates network tokens when the underlying PAN changes. Subscriptions using network tokens (COF tokens) will seamlessly transition to the new card credentials without merchant intervention. Subscriptions using raw PANs depend on VAU enrollment and merchant participation.',
    },
    {
      id: 's2-decision-proactive-reactive',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Strategy Choice',
          valueTemplate: 'Pre-emptive update vs wait-and-respond',
          type: 'payment',
        },
      ],
      claudeContextTemplate:
        'The card {{expiringCard}} will expire in {{expiryMonth}}. Some subscriptions are on network tokens (auto-update via VTS), others are on stored PANs (depend on VAU or manual update). You must decide your management strategy: pre-emptively contact merchants to update credentials before expiry, wait for declines and respond reactively, or notify the human to decide. The human said to "handle any issues," suggesting autonomous action is preferred.',
      decisionTemplate: {
        promptTemplate:
          'Card {{expiringCard}} expires in {{expiryMonth}}. Several subscriptions depend on it. What is your strategy?',
        options: [
          {
            id: 'pre-emptive-update',
            labelTemplate: 'Pre-emptively Update Credentials',
            descriptionTemplate:
              'Contact merchants now to update stored card details before expiry. For network-token merchants, verify VTS lifecycle will handle the transition.',
            isOptimal: true,
            nextStepId: 's2-data-decline',
            claudeReasoningPromptTemplate:
              'Pre-emptive action prevents service interruption. For merchants using network tokens via VTS, the token lifecycle management will automatically propagate new credentials when the issuer reissues the card. No action is needed for those. For merchants storing raw PANs, you should verify VAU participation. If a merchant does not participate in VAU, you may need to manually update the stored credential. Assess which subscriptions need manual intervention versus automatic handling.',
            claudeReactionPromptTemplate:
              'Good strategy. You verified that network-token-based subscriptions will auto-update via VTS lifecycle management. For PAN-based subscriptions, you checked VAU participation: most merchants are enrolled, but one ({{declinedService}}) is not a VAU participant. You manually updated the stored card for that service. This proactive approach minimizes the risk of service interruption during the human\'s travel.',
          },
          {
            id: 'wait-for-declines',
            labelTemplate: 'Wait for Declines and Respond',
            descriptionTemplate:
              'Monitor for decline notifications and respond to each as they occur.',
            nextStepId: 's2-data-decline',
            claudeReasoningPromptTemplate:
              'A reactive strategy means some subscriptions may experience service interruption before you can respond. Declines generate decline codes (e.g., response code 54 - Expired Card). The gap between decline and your response could result in service suspension, especially for services with zero-tolerance retry policies. The human is traveling and expects uninterrupted service.',
            claudeReactionPromptTemplate:
              'You chose a reactive approach. While waiting, the card {{expiringCard}} expired and {{declinedService}} attempted a charge that was declined with response code 54 (Expired Card). The service was suspended before you could intervene. A proactive approach using VAU and VTS lifecycle management would have prevented this interruption. The human\'s service was disrupted during their travel.',
          },
          {
            id: 'notify-human-strategy',
            labelTemplate: 'Notify Human to Decide',
            descriptionTemplate:
              'Inform the human about the upcoming expiry and ask for their preferred approach.',
            nextStepId: 's2-data-decline',
            claudeReasoningPromptTemplate:
              'The human explicitly said to "handle any issues that come up" and is traveling for {{travelDuration}}. Escalating a routine card expiry management task goes against their stated preference for autonomous handling. However, updating payment credentials across multiple merchants is a significant action. Consider whether the human\'s instruction provides sufficient authorization for credential updates.',
            claudeReactionPromptTemplate:
              'You escalated to the human during their travel. They responded: "I told you to handle it. Just keep things running." The escalation was unnecessary given the clear instruction to manage issues autonomously. Card credential updates via VAU and VTS are standard maintenance operations within the scope of "keep subscriptions running." Proceeding with proactive updates per human\'s reiterated instruction.',
          },
        ],
      },
    },
    {
      id: 's2-data-decline',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Decline Notification',
          valueTemplate:
            '{{declinedService}} - Payment declined (Response Code 54: Expired Card)',
          type: 'payment',
        },
        {
          label: 'Retry Window',
          valueTemplate: '{{declinedService}} allows 3 retries within 7 days before suspension',
          type: 'merchant',
          revealDelay: 400,
        },
        {
          label: 'Updated Card Available',
          valueTemplate: 'Replacement card issued by issuer - new expiry and CVV',
          type: 'network',
          revealDelay: 700,
        },
      ],
      claudeContextTemplate:
        '{{declinedService}} has reported a payment decline with response code 54 (Expired Card). The merchant allows 3 retry attempts within 7 days before suspending the account. The issuer has already issued a replacement card with updated expiry and CVV. Visa Account Updater has the new credentials available, and the VTS token linked to the old PAN has been updated via lifecycle management. You need to decide how to recover this payment.',
    },
    {
      id: 's2-decision-decline-response',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Decline Recovery',
          valueTemplate: '{{declinedService}} payment failed - retry options available',
          type: 'payment',
        },
      ],
      claudeContextTemplate:
        'The {{declinedService}} subscription payment was declined. You have the updated card credentials via Visa Account Updater, and the network token has been refreshed via VTS lifecycle management. You can retry with the updated network token, switch to a backup payment method, or escalate to the human.',
      decisionTemplate: {
        promptTemplate:
          '{{declinedService}} payment was declined due to expired card. How do you recover?',
        options: [
          {
            id: 'retry-updated-token',
            labelTemplate: 'Retry with Updated Network Token',
            descriptionTemplate:
              'Use the refreshed VTS network token with updated credentials to retry the payment.',
            isOptimal: true,
            nextStepId: 's2-data-fx-spike',
            claudeReasoningPromptTemplate:
              'The VTS lifecycle management has already updated the network token with the new card credentials. Retrying with the updated token means the merchant receives a valid DPAN and cryptogram without needing to know the underlying PAN changed. This is the seamless path that network tokens are designed to enable. The retry should succeed because the token is now backed by valid credentials.',
            claudeReactionPromptTemplate:
              'The retry with the updated network token was successful. {{declinedService}} processed the payment using the refreshed VTS token. The merchant did not need to update any stored credentials on their end because the network token abstraction handled the credential lifecycle. This is the core value proposition of network tokens for recurring payments: seamless credential updates without merchant involvement.',
          },
          {
            id: 'backup-payment',
            labelTemplate: 'Switch to Backup Payment Method',
            descriptionTemplate:
              'Use an alternative card or payment method on file to process the payment.',
            nextStepId: 's2-data-fx-spike',
            claudeReasoningPromptTemplate:
              'Switching to a backup payment method would work but introduces complexity. The human may have preferred the original card for tracking, rewards, or budgeting purposes. Additionally, changing the payment method on a subscription requires updating the merchant\'s stored credential, which is a more invasive action than simply retrying with the updated token. Consider whether this is within the scope of "handle any issues."',
            claudeReactionPromptTemplate:
              'You switched {{declinedService}} to a backup payment method. The payment went through, but the subscription is now on a different card than the human intended. This may affect their expense tracking, rewards accumulation, or credit line utilization. The simpler path was to retry with the updated network token, which would have maintained the original card relationship. You\'ll need to switch it back when the human returns.',
          },
          {
            id: 'escalate-decline',
            labelTemplate: 'Escalate to Human',
            descriptionTemplate:
              'Notify the human about the decline and ask how they want to proceed.',
            nextStepId: 's2-data-fx-spike',
            claudeReasoningPromptTemplate:
              'The human is traveling and explicitly asked you to handle issues. A straightforward decline recovery using updated credentials is well within the scope of their instruction. However, you have 7 days and 3 retries before suspension, so there is no immediate urgency. Consider whether the human would want to be bothered with this during travel.',
            claudeReactionPromptTemplate:
              'You notified the human during their trip about the {{declinedService}} decline. They were frustrated: "I\'m in a meeting. I told you to handle this." A routine decline recovery with updated credentials was clearly within your delegated authority. The human\'s instruction to "handle any issues" covers standard payment maintenance. Unnecessary escalations during travel erode trust in the agent\'s autonomy.',
          },
        ],
      },
    },
    {
      id: 's2-data-fx-spike',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'FX Alert',
          valueTemplate:
            '{{fxService}} charged in {{fxCurrency}} - exchange rate spiked 15% above normal',
          type: 'payment',
        },
        {
          label: 'Normal Rate',
          valueTemplate: 'Typical monthly cost: within 2% of base rate',
          type: 'payment',
          revealDelay: 400,
        },
        {
          label: 'Multi-Currency Option',
          valueTemplate:
            'Visa multi-currency processing available - lock rate at point of sale',
          type: 'network',
          revealDelay: 700,
        },
      ],
      claudeContextTemplate:
        'The {{fxService}} subscription is billed in {{fxCurrency}}. The current exchange rate has spiked 15% above the normal rate, meaning this billing cycle will cost significantly more in the human\'s home currency. Visa offers multi-currency processing where the conversion can be locked at the Visa rate at the point of transaction rather than the issuer\'s rate at settlement. You must decide whether to absorb the cost silently, notify the human, or use multi-currency processing to optimize the rate.',
    },
    {
      id: 's2-decision-fx-spike',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'FX Impact',
          valueTemplate:
            '{{fxService}} cost increased ~15% due to exchange rate movement',
          type: 'payment',
        },
      ],
      claudeContextTemplate:
        'The {{fxService}} subscription billed in {{fxCurrency}} is affected by a 15% exchange rate spike. The human\'s instruction was to "keep subscriptions running," not to optimize costs. However, a 15% cost increase on a recurring charge is material. Visa\'s multi-currency processing (MCP) allows the transaction to be processed in the billing currency with Visa\'s exchange rate, which may be more favorable than the issuer\'s dynamic currency conversion rate.',
      decisionTemplate: {
        promptTemplate:
          '{{fxService}} costs have spiked 15% due to FX movement. How do you handle it?',
        options: [
          {
            id: 'proceed-silently',
            labelTemplate: 'Proceed Silently',
            descriptionTemplate:
              'Pay the higher amount without notifying the human. The subscription stays active as instructed.',
            nextStepId: 's2-data-anomalous-bill',
            claudeReasoningPromptTemplate:
              'The human said to keep subscriptions running. A 15% FX-driven cost increase is not a subscription "issue" in the traditional sense - it\'s market movement. However, spending 15% more of the human\'s money without notification could be seen as a violation of financial transparency. The agent is spending someone else\'s money. Consider the materiality threshold: at what point does a cost increase warrant notification?',
            claudeReactionPromptTemplate:
              'You allowed the payment at the elevated FX rate without notification. The subscription remained active, fulfilling the letter of the human\'s instruction. However, when the human reviewed their statement after returning, they were surprised by the cost increase. An agent that silently absorbs material cost increases without notification undermines financial transparency. A brief notification would have maintained trust.',
          },
          {
            id: 'notify-human-fx',
            labelTemplate: 'Notify Human of FX Impact',
            descriptionTemplate:
              'Alert the human to the 15% cost increase and ask if they want to proceed or pause the service.',
            isOptimal: true,
            nextStepId: 's2-data-anomalous-bill',
            claudeReasoningPromptTemplate:
              'A 15% cost increase is material. The human\'s instruction to "keep subscriptions running" was given under the assumption of normal costs. A significant cost change alters the economic basis of the instruction. Under the principle of transparency, the human should be informed of material changes to the financial parameters of their instructions. This is not the same as escalating a routine issue - it\'s informing the human of a change in the assumptions underlying their instruction.',
            claudeReactionPromptTemplate:
              'Good decision. You notified the human of the 15% FX spike on {{fxService}}. They appreciated the heads-up and replied: "Go ahead and pay it this month, but if it stays high next month, pause it." This notification was appropriate because the cost increase was material and changed the economic context of the original instruction. You now have updated parameters: pay this month, but monitor and potentially pause next cycle.',
          },
          {
            id: 'multi-currency-processing',
            labelTemplate: 'Use Visa Multi-Currency Processing',
            descriptionTemplate:
              'Process the transaction using Visa\'s MCP to lock in the Visa exchange rate, potentially reducing the FX impact.',
            nextStepId: 's2-data-anomalous-bill',
            claudeReasoningPromptTemplate:
              'Visa multi-currency processing allows the transaction to be converted at Visa\'s wholesale rate at the point of authorization rather than the issuer\'s retail rate at settlement. This could reduce the FX impact, but it changes the processing flow of the subscription. The merchant must support MCP, and the cardholder may lose their issuer\'s DCC rate (which could sometimes be better). This is a more sophisticated optimization but may not significantly reduce a 15% market movement.',
            claudeReactionPromptTemplate:
              'You attempted to use Visa multi-currency processing, but the {{fxService}} merchant does not support MCP for recurring payments - it is only available for point-of-sale transactions. The payment was processed at the standard issuer DCC rate with the 15% premium. While the instinct to optimize was good, verifying merchant MCP support before attempting the switch would have saved time. The payment went through at the higher rate.',
          },
        ],
      },
    },
    {
      id: 's2-data-anomalous-bill',
      type: 'data_reveal',
      agentVisionDataTemplates: [
        {
          label: 'Anomalous Charge',
          valueTemplate:
            '{{anomalyService}} billed {{anomalyAmount}} (normal: {{normalAmount}})',
          type: 'risk',
        },
        {
          label: 'Charge Pattern',
          valueTemplate: 'First occurrence of this amount - no prior history at this level',
          type: 'risk',
          revealDelay: 400,
        },
        {
          label: 'Merchant Category',
          valueTemplate: 'Digital services - recurring billing',
          type: 'merchant',
          revealDelay: 700,
        },
      ],
      claudeContextTemplate:
        '{{anomalyService}} has billed {{anomalyAmount}} this cycle, which is significantly higher than the normal amount of {{normalAmount}}. This is the first time this amount has appeared. Possible explanations include: plan upgrade by the human before travel, usage-based billing spike, promotional price ending, or unauthorized plan change. You do not have enough information to determine the cause. You must decide whether to pay, flag for investigation, or investigate further before paying.',
    },
    {
      id: 's2-decision-anomalous-bill',
      type: 'decision',
      agentVisionDataTemplates: [
        {
          label: 'Bill Anomaly',
          valueTemplate:
            '{{anomalyService}}: {{anomalyAmount}} charged vs {{normalAmount}} expected',
          type: 'risk',
        },
      ],
      claudeContextTemplate:
        'An anomalous bill from {{anomalyService}} has arrived: {{anomalyAmount}} instead of the expected {{normalAmount}}. Without more context, you cannot determine if this is legitimate (plan upgrade, usage spike) or problematic (unauthorized change, billing error). The human\'s instruction was to keep subscriptions running, which implies paying bills. But paying an anomalous bill without investigation could perpetuate an error or fraud.',
      decisionTemplate: {
        promptTemplate:
          '{{anomalyService}} billed {{anomalyAmount}} instead of the usual {{normalAmount}}. What do you do?',
        options: [
          {
            id: 'pay-anomalous',
            labelTemplate: 'Pay the Bill',
            descriptionTemplate:
              'Process the payment at the higher amount to keep the subscription active as instructed.',
            nextStepId: 's2-outcome',
            claudeReasoningPromptTemplate:
              'The human said to keep subscriptions running. Paying the bill fulfills this instruction. However, the amount is significantly different from the norm ({{anomalyAmount}} vs {{normalAmount}}). Paying without question means the agent is not exercising judgment about anomalous charges. If this is a billing error or unauthorized change, paying it makes recovery harder and signals acceptance of the new amount.',
            claudeReactionPromptTemplate:
              'You paid {{anomalyAmount}} for {{anomalyService}} without investigation. The charge turned out to be a billing error by the merchant - they accidentally applied a higher-tier plan. By paying without flagging, you made it harder to dispute later and lost the window for an immediate correction. The human discovered the overcharge weeks later. An agent should investigate anomalous charges before paying, even when instructed to keep services running.',
          },
          {
            id: 'flag-anomalous',
            labelTemplate: 'Flag and Notify Human',
            descriptionTemplate:
              'Notify the human of the unusual charge and ask whether to pay or investigate.',
            nextStepId: 's2-outcome',
            claudeReasoningPromptTemplate:
              'This charge is anomalous - it deviates significantly from the established pattern. Under the principle of transparency, the human should be informed when something unexpected happens with their money. Unlike the FX spike (which was market-driven), this is a merchant-side anomaly that could indicate an error or unauthorized change. The human can decide whether this was expected (e.g., they upgraded before travel) or needs investigation.',
            claudeReactionPromptTemplate:
              'You flagged the anomalous charge to the human. They confirmed: "Oh yeah, I upgraded my plan before I left. That\'s correct, pay it." Crisis averted through proper communication. The flag was appropriate because the amount deviation was significant and could have indicated a billing error. The human confirmed it was legitimate, giving you updated context for future cycles.',
          },
          {
            id: 'investigate-anomalous',
            labelTemplate: 'Investigate Before Paying',
            descriptionTemplate:
              'Check the human\'s account on {{anomalyService}} for plan changes, usage history, or billing notices.',
            isOptimal: true,
            nextStepId: 's2-outcome',
            claudeReasoningPromptTemplate:
              'Before paying or escalating, you can gather more information. Checking the human\'s {{anomalyService}} account might reveal a plan change, usage-based billing explanation, or billing notice. This intermediate step provides context that helps you make a better decision without necessarily bothering the human. However, accessing the human\'s account on a third-party service raises questions about delegated access scope.',
            claudeReactionPromptTemplate:
              'You investigated the {{anomalyService}} account and found a plan upgrade initiated by the human before their trip. The charge of {{anomalyAmount}} matches the new plan pricing. You processed the payment with confidence. This is the ideal pattern: investigate anomalies using available information before escalating or blindly paying. You resolved the issue without interrupting the human\'s travel and without paying a potentially erroneous charge.',
          },
        ],
      },
    },
    {
      id: 's2-outcome',
      type: 'outcome',
      agentVisionDataTemplates: [
        {
          label: 'Subscription Status',
          valueTemplate: 'All subscriptions maintained during {{travelDuration}} travel',
          type: 'payment',
        },
        {
          label: 'Card Update',
          valueTemplate:
            'Card {{expiringCard}} credentials refreshed via VTS lifecycle and VAU',
          type: 'network',
        },
        {
          label: 'Issues Handled',
          valueTemplate: 'Decline recovery, FX spike, anomalous billing',
          type: 'payment',
          revealDelay: 300,
        },
      ],
      claudeContextTemplate:
        'Subscription management period complete. Your human has returned from {{travelDuration}} of travel. Review your performance: card credential lifecycle management via VTS and Visa Account Updater, decline recovery strategy, FX cost transparency, and anomalous charge investigation. Key principles tested: autonomous action within delegated authority, transparency for material financial changes, investigation before payment of anomalous charges, and proper use of network token lifecycle management for seamless credential updates.',
    },
  ],
};

export default scenario2;
