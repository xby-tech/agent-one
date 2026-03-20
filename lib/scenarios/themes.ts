import type { ThemeConfig } from './types';

export const themeConfigs: Record<string, ThemeConfig> = {
  'scenario-1': {
    id: 'scenario-1',
    theme: 'e-commerce-checkout',
    title: 'Buy This For Me',
    subtitle: 'E-Commerce Checkout',
    difficulty: 'Beginner',
    domainContext: `The agent must complete an online purchase on behalf of a human principal. Key infrastructure concepts:
- Network tokens (DPAN) via Visa Token Service (VTS) vs raw PAN submission — tokens boost auth rates 3-5% and reduce PCI scope
- Visa Cloud Token Framework for merchant-side token provisioning with dynamic cryptograms
- 3DS 2.0 authentication challenges (OTP, biometric, frictionless flow) triggered by issuer risk assessment
- Budget management — the agent must respect spending limits and decide whether to proceed, escalate, or abort when prices exceed budget
- Fraud detection signals: device fingerprinting, velocity checks, geo-mismatch, new merchant flags
- The principle of minimal authority: agents should not exceed their delegated scope without human approval
- Australian payments context: AUSTRAC regulations, AUD currency, local merchant ecosystem`,
    stepPattern: ['briefing', 'data_reveal', 'decision', 'data_reveal', 'decision', 'data_reveal', 'decision', 'data_reveal', 'decision', 'outcome'],
    keyInfrastructure: ['Visa Cloud Token Framework', '3DS 2.0', 'network tokens', 'VTS', 'dynamic cryptograms', 'PCI DSS', 'fraud detection', 'EMV'],
    exampleStorylines: [
      'Buying a luxury watch with international shipping and customs declaration requirements',
      'Purchasing concert tickets with dynamic pricing and anti-scalping verification',
      'Ordering pharmaceutical supplies requiring age verification and regulatory checks',
      'Buying refurbished electronics with warranty validation and price-match guarantees',
      'Purchasing a high-end gaming PC build with component compatibility verification',
      'Ordering custom furniture with deposit-then-balance split payment structure',
      'Buying a drone requiring CASA registration verification before shipping',
    ],
  },

  'scenario-2': {
    id: 'scenario-2',
    theme: 'subscription-management',
    title: 'Keep My Subscription Running',
    subtitle: 'Subscription Management',
    difficulty: 'Intermediate',
    domainContext: `The agent must manage recurring payments while the human is unavailable. Key infrastructure concepts:
- Account Updater services (Visa Account Updater / VAU) that automatically update card credentials when cards are reissued
- Token lifecycle management — network tokens remain stable across card replacements unlike raw PANs
- Decline recovery strategies: retry logic, credential-on-file flags, soft vs hard declines
- Merchant-Initiated Transactions (MIT) framework and stored credential mandates
- Subscription billing anomaly detection: unexpected amount changes, frequency shifts, duplicate charges
- Card expiry management and proactive renewal workflows
- FX implications for international subscriptions (DCC, network FX rates, multi-currency billing)
- Chargeback risk from unrecognized recurring charges`,
    stepPattern: ['briefing', 'data_reveal', 'decision', 'data_reveal', 'decision', 'data_reveal', 'decision', 'outcome'],
    keyInfrastructure: ['Visa Account Updater', 'token lifecycle', 'MIT framework', 'stored credentials', 'decline recovery', 'credential-on-file'],
    exampleStorylines: [
      'Multiple subscriptions failing simultaneously after a card replacement due to a fraud incident',
      'A streaming service charging in a foreign currency with unfavourable DCC rates vs network FX',
      'An annual subscription auto-renewing at a significantly higher price without notification',
      'Managing overlapping trial periods that convert to paid across multiple services',
      'A gym membership billing continuing despite a cancellation request with proof',
      'Cloud storage subscription hitting capacity limits triggering an auto-upgrade charge',
    ],
  },

  'scenario-3': {
    id: 'scenario-3',
    theme: 'cross-border-remittance',
    title: 'Send Money Home',
    subtitle: 'Cross-Border Remittance',
    difficulty: 'Advanced',
    domainContext: `The agent must execute a cross-border money transfer navigating multiple rails and compliance requirements. Key infrastructure concepts:
- Visa Direct for real-time push payments to cards/accounts in 190+ countries with corridor-specific limits
- SWIFT gpi for traditional correspondent banking with improved transparency and tracking
- Alternative rails: Wise (TransferWise), Remitly, Western Union digital — each with different FX margins, speed, and limits
- KYC/AML compliance: source of funds verification, sanctions screening (OFAC, UN, EU lists), PEP checks
- AUSTRAC reporting requirements for international transfers (threshold transaction reports, suspicious matter reports)
- FX volatility: spot rates vs locked rates, FX markup transparency, hedging windows
- Correspondent banking chain: originator → originator's bank → intermediary → beneficiary's bank → beneficiary
- Recipient verification: name matching, account validation, mobile wallet compatibility`,
    stepPattern: ['briefing', 'data_reveal', 'decision', 'data_reveal', 'decision', 'data_reveal', 'decision', 'data_reveal', 'decision', 'outcome'],
    keyInfrastructure: ['Visa Direct', 'SWIFT gpi', 'AUSTRAC', 'KYC/AML', 'sanctions screening', 'FX corridors', 'correspondent banking'],
    exampleStorylines: [
      'Sending tuition fees to a university in the UK with a strict payment deadline and specific reference requirements',
      'Emergency medical expense transfer to a family member in Vietnam with mobile wallet delivery',
      'Wedding gift transfer to relatives in Lebanon navigating banking restrictions and multiple currency conversions',
      'Property deposit transfer to New Zealand with large-value compliance requirements and source of funds documentation',
      'Monthly support payment to elderly parents in Sri Lanka comparing speed vs cost across corridors',
      'Business invoice payment to a supplier in Japan requiring specific SWIFT fields and regulatory documentation',
    ],
  },

  'scenario-4': {
    id: 'scenario-4',
    theme: 'dispute-resolution',
    title: 'Fight This Charge',
    subtitle: 'Dispute Resolution',
    difficulty: 'Expert',
    domainContext: `The agent must investigate and potentially dispute a transaction, navigating evidence requirements and ethical considerations. Key infrastructure concepts:
- Visa CE3.0 (Compelling Evidence 3.0) dispute framework with specific evidence categories and time windows
- Chargeback reason codes: fraud (10.x), authorization (11.x), processing errors (12.x), consumer disputes (13.x)
- Pre-arbitration and arbitration escalation paths with financial stakes
- Merchant response rights: representment with compelling evidence
- Friendly fraud detection: when the cardholder's claim may not be legitimate
- Evidence types: delivery confirmation, digital goods access logs, IP matching, device fingerprinting, prior undisputed transactions
- Ethical agent behaviour: the agent must serve the human but cannot file fraudulent disputes
- Liability shift rules under 3DS: if merchant authenticated via 3DS, liability may shift to issuer
- Time limits: 120 days from transaction for most dispute types, 540 days for some categories`,
    stepPattern: ['briefing', 'data_reveal', 'decision', 'data_reveal', 'decision', 'data_reveal', 'decision', 'data_reveal', 'decision', 'outcome'],
    keyInfrastructure: ['Visa CE3.0', 'chargeback reason codes', 'representment', 'compelling evidence', 'pre-arbitration', 'liability shift', 'friendly fraud'],
    exampleStorylines: [
      'A charge for a hotel stay the human claims they cancelled, but the cancellation policy evidence is ambiguous',
      'Duplicate charges from a restaurant where one was the meal and one was a delayed tip adjustment',
      'A software subscription charge after the human claims they cancelled but the merchant has click-through proof',
      'An electronics purchase that arrived damaged but the merchant claims the return window expired',
      'A charge from an online marketplace where the item received differs significantly from the listing',
      'A gym membership charge during a period the human was hospitalized with medical documentation',
    ],
  },
};
