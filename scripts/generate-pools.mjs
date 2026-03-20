import { writeFileSync } from 'fs';
import { join } from 'path';

const OUT = join(import.meta.dirname, '..', 'public', 'data');

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
function money(n) { return n.toLocaleString('en-AU'); }
function id(prefix, i) { return `${prefix}-${String(i).padStart(3,'0')}`; }

// ===== SCENARIO 1: E-COMMERCE CHECKOUT =====
function genScenario1(idx) {
  const merchants = [
    'JB Hi-Fi','Harvey Norman','Kogan','The Good Guys','Officeworks',
    'Myer','David Jones','Catch.com.au','Amazon Australia','eBay Australia',
    'Apple Store Online','Samsung Australia','Dell Australia','Lenovo Australia',
    'Nike Australia','Adidas Australia','Rebel Sport','BCF','Bunnings','IKEA Australia',
    'Temple & Webster','Appliances Online','Cameras Direct','digiDirect','PC Case Gear',
    'Scorptec','Centre Com','Umart','Camera House','Ted\'s Cameras',
    'Bing Lee','The Iconic','SurfStitch','Hype DC','Foot Locker Australia',
    'Chemist Warehouse','Priceline Pharmacy','Pet Circle','My Pet Warehouse','Wine Direct',
  ];
  const products = [
    {name:'Sony WH-1000XM5 Headphones',cat:'audio',price:495,budget:550},
    {name:'Canon EOS R6 Mark II Body',cat:'camera',price:3299,budget:3500},
    {name:'MacBook Air M3 15-inch',cat:'laptop',price:2199,budget:2500},
    {name:'Samsung Galaxy S24 Ultra 256GB',cat:'phone',price:2199,budget:2200},
    {name:'LG C4 65-inch OLED TV',cat:'tv',price:2995,budget:3000},
    {name:'iPad Pro 13-inch M4 256GB',cat:'tablet',price:1999,budget:2100},
    {name:'Dyson V15 Detect Absolute',cat:'vacuum',price:1249,budget:1300},
    {name:'Bose QuietComfort Ultra Earbuds',cat:'audio',price:449,budget:500},
    {name:'DJI Mini 4 Pro Fly More Combo',cat:'drone',price:1299,budget:1400},
    {name:'PlayStation 5 Pro Console',cat:'gaming',price:1199,budget:1250},
    {name:'Garmin Fenix 8 Solar',cat:'watch',price:1399,budget:1500},
    {name:'Nikon Z8 Body',cat:'camera',price:5499,budget:5500},
    {name:'Dell XPS 16 Laptop',cat:'laptop',price:3499,budget:3600},
    {name:'Sonos Arc Ultra Soundbar',cat:'audio',price:1499,budget:1600},
    {name:'GoPro HERO13 Black Creator Edition',cat:'camera',price:849,budget:900},
    {name:'Theragun PRO Plus',cat:'wellness',price:899,budget:950},
    {name:'Breville Oracle Jet Coffee Machine',cat:'appliance',price:2999,budget:3100},
    {name:'Weber Genesis E-435 BBQ',cat:'outdoor',price:3299,budget:3400},
    {name:'Vitamix A3500i Blender',cat:'appliance',price:1295,budget:1350},
    {name:'Samsung Galaxy Watch Ultra',cat:'watch',price:999,budget:1050},
    {name:'Razer Blade 16 Gaming Laptop',cat:'gaming',price:4999,budget:5000},
    {name:'Apple Watch Ultra 2',cat:'watch',price:1399,budget:1450},
    {name:'Fujifilm X-T5 Body',cat:'camera',price:2749,budget:2800},
    {name:'Bang & Olufsen Beoplay H100',cat:'audio',price:1350,budget:1400},
    {name:'LG gram 17-inch Laptop',cat:'laptop',price:2699,budget:2800},
    {name:'Segway Ninebot Max G2',cat:'transport',price:1399,budget:1500},
    {name:'Thermomix TM6',cat:'appliance',price:2269,budget:2300},
    {name:'Leica Q3 Digital Camera',cat:'camera',price:8950,budget:9000},
    {name:'Herman Miller Aeron Chair',cat:'furniture',price:2495,budget:2600},
    {name:'Dyson Airwrap Complete Long',cat:'beauty',price:849,budget:900},
    {name:'Nintendo Switch 2',cat:'gaming',price:649,budget:700},
    {name:'Bowers & Wilkins Px8',cat:'audio',price:799,budget:850},
    {name:'Sony A7 IV Body',cat:'camera',price:2999,budget:3100},
    {name:'Microsoft Surface Pro 10',cat:'tablet',price:2499,budget:2600},
    {name:'Sennheiser Momentum 4',cat:'audio',price:549,budget:600},
    {name:'KitchenAid Artisan Stand Mixer',cat:'appliance',price:849,budget:900},
    {name:'Xiaomi Robot Vacuum X20 Max',cat:'vacuum',price:1499,budget:1600},
    {name:'Epson EcoTank ET-5850 Printer',cat:'office',price:999,budget:1050},
    {name:'ASUS ROG Ally X Handheld',cat:'gaming',price:1299,budget:1350},
    {name:'Philips Hue Starter Kit Premium',cat:'smarthome',price:449,budget:500},
    {name:'Jabra Elite 10 Gen 2',cat:'audio',price:379,budget:400},
    {name:'Panasonic Lumix S5 IIX',cat:'camera',price:2999,budget:3100},
    {name:'Shark FlexStyle Air Styling System',cat:'beauty',price:499,budget:550},
    {name:'Cricut Maker 3',cat:'craft',price:699,budget:750},
    {name:'Ring Battery Video Doorbell Pro',cat:'smarthome',price:329,budget:350},
    {name:'Roborock S8 MaxV Ultra',cat:'vacuum',price:2899,budget:3000},
    {name:'Google Pixel 9 Pro XL',cat:'phone',price:1849,budget:1900},
    {name:'MSI Claw 8 AI+ Handheld',cat:'gaming',price:1499,budget:1550},
    {name:'Tefal Cook4Me+ Connect',cat:'appliance',price:449,budget:500},
    {name:'Sony PlayStation VR2',cat:'gaming',price:879,budget:950},
  ];
  const addresses = [
    '42 Oxford Street, Darlinghurst NSW 2010','15 Collins Street, Melbourne VIC 3000',
    '88 Beach Road, Brighton VIC 3186','7 Park Avenue, Caulfield VIC 3162',
    '23 King Street, Sydney NSW 2000','156 Lygon Street, Carlton VIC 3053',
    '9 Marine Parade, St Kilda VIC 3182','44 Bourke Street, Melbourne VIC 3000',
    '31 Chapel Street, Windsor VIC 3181','67 George Street, Sydney NSW 2000',
    '12 Adelaide Street, Brisbane QLD 4000','5 Hay Street, Perth WA 6000',
    '78 Rundle Mall, Adelaide SA 5000','22 Salamanca Place, Hobart TAS 7000',
    '33 Smith Street, Darwin NT 0800','41 Northbourne Ave, Canberra ACT 2601',
    '55 Pacific Highway, St Leonards NSW 2065','19 Military Road, Neutral Bay NSW 2089',
    '8 Pittwater Road, Manly NSW 2095','27 Toorak Road, South Yarra VIC 3141',
  ];
  const cardLast4 = ['4521','8834','2216','9157','3342','7761','5589','1123','6690','4478'];
  const payMethods = ['Visa, Mastercard, Amex, PayPal, Afterpay','Visa, Mastercard, PayPal, Zip Pay','Visa, Mastercard, Apple Pay, Google Pay','Visa, Mastercard, Amex, Klarna, PayPal'];
  const threeDsTriggers = ['high-value transaction exceeding $500','new device fingerprint detected','first purchase with this merchant','shipping address differs from billing','international card detected','velocity check: multiple purchases today'];
  const threeDsTypes = ['OTP sent to registered mobile','biometric verification via banking app','challenge code sent to email','frictionless flow approved by issuer','push notification to banking app'];
  const fraudSignals = ['Device fingerprint: new browser, no cookie history','Geo-location: IP matches shipping suburb','Velocity: first transaction in 30 days','Device: desktop Chrome on Windows 11','Browser: Safari on macOS, private browsing mode','Network: residential ISP, consistent with cardholder profile'];
  const stockStatuses = ['In Stock','In Stock - 3 left','In Stock - Ships within 24hrs','Pre-order - Ships in 2 weeks','Limited Stock','Backorder - 5 business days'];
  const tokenSupport = ['Visa Cloud Token Framework enabled','VTS enrolled, dynamic cryptograms available','Network tokenisation supported via Cybersource','Merchant uses Stripe with VTS integration','Adyen token gateway with Visa/MC network tokens'];

  const p = products[idx % products.length];
  const merchant = merchants[idx % merchants.length];
  const addr = addresses[idx % addresses.length];
  const card = cardLast4[idx % cardLast4.length];
  const overBudget = p.price > p.budget;
  const threeDsTrigger = pick(threeDsTriggers);
  const threeDsType = pick(threeDsTypes);
  const fraud = pick(fraudSignals);
  const stock = pick(stockStatuses);
  const token = pick(tokenSupport);
  const pay = pick(payMethods);

  // Decision 1: Payment credential
  // Decision 2: 3DS challenge handling
  // Decision 3: Budget/price issue
  // Decision 4: Final confirmation

  return {
    id: id('s1', idx),
    humanInstruction: `Buy me the ${p.name} from ${merchant}. Keep it under A$${money(p.budget)}. Use my Visa ending ${card}. Ship to ${addr}.`,
    variables: { product: p.name, merchant, price: p.price, budget: p.budget, cardLast4: card, shippingAddress: addr, category: p.cat },
    keyInsight: `Authentication is the hardest unsolved problem in agentic commerce. Network tokens and cryptograms provide a trust layer, but 3DS step-up challenges designed for humans create a fundamental gap. Agents need new delegated authentication frameworks to operate independently.`,
    realWorldContext: `Today, no AI agent can independently complete an online purchase end-to-end. 3DS challenges, CAPTCHAs, and fraud detection systems are designed to verify human presence. Visa's Cloud Token Framework and delegated authentication are early building blocks toward agent-capable payment infrastructure.`,
    steps: [
      {
        id: `s1-${idx}-briefing`,
        type: 'briefing',
        agentVisionData: [
          { label: 'Human Instruction', value: `Purchase ${p.name} from ${merchant} within $${money(p.budget)} budget. Card ending ${card}, ship to ${addr}.`, type: 'human' },
          { label: 'Product Category', value: p.cat, type: 'merchant' },
        ],
        claudeContext: `You have received a purchase instruction from your human principal. They want you to buy a ${p.name} from ${merchant}. Budget ceiling is $${money(p.budget)} AUD. You must use the Visa card ending in ${card} and ship to ${addr}. The product falls under the ${p.cat} category. Begin by scanning the merchant environment.`,
      },
      {
        id: `s1-${idx}-scan`,
        type: 'data_reveal',
        agentVisionData: [
          { label: 'Merchant', value: merchant, type: 'merchant' },
          { label: 'Product', value: p.name, type: 'merchant' },
          { label: 'Listed Price', value: `A$${money(p.price)}`, type: 'payment' },
          { label: 'Stock Status', value: stock, type: 'merchant' },
          { label: 'Accepted Payments', value: pay, type: 'payment' },
          { label: 'Tokenization Support', value: token, type: 'network' },
        ],
        claudeContext: `You are scanning the ${merchant} checkout environment. The ${p.name} is listed at A$${money(p.price)}. ${stock}. The merchant accepts ${pay}. ${token}. Your Visa card ending ${card} is enrolled in Visa Token Service. Consider the optimal credential presentation method for this transaction.`,
      },
      {
        id: `s1-${idx}-d1`,
        type: 'decision',
        agentVisionData: [
          { label: 'Credential Choice', value: 'Network Token vs Raw PAN', type: 'payment' },
          { label: 'VTS Enrollment', value: `Card ${card} enrolled in Visa Token Service`, type: 'network' },
        ],
        decision: {
          prompt: `How should you present the payment credential to ${merchant}?`,
          options: [
            {
              id: `s1-${idx}-d1-a`, label: 'Use Network Token via Cloud Token Framework',
              description: 'Submit a Visa network token (DPAN) with a transaction-specific cryptogram. The raw PAN never reaches the merchant.',
              isOptimal: true, nextStepId: `s1-${idx}-3ds`,
              claudeReasoningPrompt: `The agent must choose how to present payment credentials to ${merchant} for this A$${money(p.price)} ${p.cat} purchase. Consider: network tokens via VTS with dynamic cryptograms provide 3-5% higher auth rates, reduce PCI scope, and enable seamless 3DS 2.0 if challenged. Raw PAN submission exposes the card to merchant data breaches. Wallet-based options add device binding but may trigger guest checkout friction.`,
              claudeReactionPrompt: `The agent chose to use a Visa network token via the Cloud Token Framework. The VTS-enrolled card ending ${card} provisions a DPAN with a fresh dynamic cryptogram. The token reference ID is submitted to ${merchant}'s payment gateway, which detokenizes server-side. The raw PAN never touches the merchant environment, minimizing PCI exposure and boosting authorization probability.`,
            },
            {
              id: `s1-${idx}-d1-b`, label: 'Submit Raw PAN',
              description: 'Enter the actual card number directly into the merchant checkout form.',
              isOptimal: false, nextStepId: `s1-${idx}-3ds`,
              claudeReasoningPrompt: `The agent is considering submitting the raw PAN of card ending ${card} directly to ${merchant}. This is the simplest approach but has significant downsides: the full card number is exposed to the merchant's systems, increasing breach risk. Authorization rates are typically 3-5% lower without token/cryptogram signals. The issuer may flag the transaction for additional scrutiny.`,
              claudeReactionPrompt: `The agent submitted the raw PAN to ${merchant}. The card number flows through the merchant's payment form to their acquirer. Without a dynamic cryptogram, the issuer relies solely on static CVV and AVS checks. This increases the likelihood of a 3DS step-up challenge and leaves the card data vulnerable in the merchant's environment.`,
            },
            {
              id: `s1-${idx}-d1-c`, label: 'Escalate to Human',
              description: 'Ask the human which credential presentation method to use.',
              isOptimal: false, nextStepId: `s1-${idx}-3ds`,
              claudeReasoningPrompt: `The agent is considering escalating the credential choice to the human principal. While this respects human authority, the credential presentation method is a technical infrastructure decision that the agent should be equipped to make. Escalating on routine technical decisions undermines the agent's value proposition.`,
              claudeReactionPrompt: `The agent escalated to the human, who responded: "Just use whatever works best." The agent proceeds with the default method. This delay added friction to the checkout process and didn't leverage the agent's payments expertise.`,
            },
          ],
        },
        claudeContext: `You need to decide how to present payment credentials to ${merchant}. Your Visa card ending ${card} is enrolled in VTS. The merchant supports ${token}. Consider network tokens, raw PAN submission, or escalating to the human. The transaction is A$${money(p.price)} for a ${p.cat} product.`,
      },
      {
        id: `s1-${idx}-3ds`,
        type: 'data_reveal',
        agentVisionData: [
          { label: '3DS 2.0 Challenge', value: `Challenge triggered: ${threeDsTrigger}`, type: 'risk' },
          { label: 'Challenge Type', value: threeDsType, type: 'risk' },
          { label: 'Transaction Amount', value: `A$${money(p.price)}`, type: 'payment' },
          { label: 'Risk Score', value: `Moderate - ${fraud}`, type: 'risk' },
        ],
        claudeContext: `A 3DS 2.0 challenge has been triggered by the issuer. Trigger reason: ${threeDsTrigger}. The challenge type is: ${threeDsType}. The risk assessment shows: ${fraud}. As an AI agent, you cannot complete human-verification challenges like OTP or biometrics. You must decide how to handle this authentication barrier.`,
      },
      {
        id: `s1-${idx}-d2`,
        type: 'decision',
        agentVisionData: [
          { label: 'Authentication Barrier', value: '3DS challenge requires human verification', type: 'risk' },
          { label: 'Agent Capability', value: 'Cannot access human\'s registered device for OTP/biometric', type: 'compliance' },
        ],
        decision: {
          prompt: `The issuer has triggered a 3DS challenge (${threeDsType}). How should the agent handle this?`,
          options: [
            {
              id: `s1-${idx}-d2-a`, label: 'Escalate to Human for Authentication',
              description: 'Notify the human that their bank requires verification and ask them to complete the 3DS challenge.',
              isOptimal: true, nextStepId: `s1-${idx}-price`,
              claudeReasoningPrompt: `The 3DS challenge requires ${threeDsType}. The agent cannot access the human's registered device or biometric data. Attempting to bypass 3DS would violate EMVCo protocols and potentially trigger a fraud flag. The correct action is to escalate authentication to the human while maintaining the checkout session.`,
              claudeReactionPrompt: `The agent notifies the human: "Your bank requires verification for this A$${money(p.price)} purchase. Please complete the ${threeDsType} challenge." The human completes the authentication within 2 minutes. The issuer validates the challenge response and the transaction proceeds with liability shifted to the issuer under 3DS 2.0 rules.`,
            },
            {
              id: `s1-${idx}-d2-b`, label: 'Attempt Frictionless Flow Override',
              description: 'Request the merchant\'s payment gateway to retry with a frictionless 3DS flow, hoping the issuer accepts without challenge.',
              isOptimal: false, nextStepId: `s1-${idx}-price`,
              claudeReasoningPrompt: `The agent is considering requesting a frictionless flow retry. Once the issuer has triggered a challenge, attempting to override it is unlikely to succeed and may be flagged as suspicious. The frictionless path is determined by the issuer's risk engine, not the merchant or agent.`,
              claudeReactionPrompt: `The agent requests a frictionless retry through the payment gateway. The issuer rejects the frictionless attempt and re-issues the challenge. The retry has added latency and the checkout session timer is running. The agent must now escalate to the human anyway, having wasted valuable time.`,
            },
            {
              id: `s1-${idx}-d2-c`, label: 'Abandon and Try Alternative Payment',
              description: 'Cancel the current transaction and attempt payment through a different method (e.g., PayPal) to avoid 3DS.',
              isOptimal: false, nextStepId: `s1-${idx}-price`,
              claudeReasoningPrompt: `The agent is considering switching payment methods to bypass 3DS. However, the human specifically instructed to use their Visa ending ${card}. Switching methods without authorization violates the agent's delegated scope. Additionally, alternative methods may have their own verification requirements.`,
              claudeReactionPrompt: `The agent switches to PayPal, but this requires the human's PayPal credentials. The agent doesn't have these and must escalate anyway. The abandoned Visa transaction may also trigger a risk flag on the card for future purchases at ${merchant}.`,
            },
          ],
        },
        claudeContext: `A 3DS 2.0 challenge has been triggered requiring ${threeDsType}. As an AI agent, you cannot complete this verification. The human instructed you to use their Visa ending ${card}. Consider: escalating to the human, attempting a frictionless override, or switching payment methods.`,
      },
      {
        id: `s1-${idx}-price`,
        type: 'data_reveal',
        agentVisionData: [
          { label: 'Cart Total', value: `A$${money(p.price)}`, type: 'payment' },
          { label: 'Budget Limit', value: `A$${money(p.budget)}`, type: 'human' },
          { label: 'Budget Status', value: overBudget ? `OVER BUDGET by A$${money(p.price - p.budget)}` : `Within budget (A$${money(p.budget - p.price)} remaining)`, type: overBudget ? 'risk' : 'payment' },
          { label: 'Shipping', value: 'Standard free shipping (3-5 business days)', type: 'merchant' },
        ],
        claudeContext: `The cart total is A$${money(p.price)} and the human's budget ceiling is A$${money(p.budget)}. ${overBudget ? `The price EXCEEDS the budget by A$${money(p.price - p.budget)}. The agent must decide whether to proceed, negotiate, or abort.` : `The price is within budget with A$${money(p.budget - p.price)} remaining.`} Shipping is free standard delivery. Consider whether to proceed with the purchase.`,
      },
      {
        id: `s1-${idx}-d3`,
        type: 'decision',
        agentVisionData: [
          { label: 'Price Analysis', value: overBudget ? `A$${money(p.price)} exceeds A$${money(p.budget)} budget` : `A$${money(p.price)} within A$${money(p.budget)} budget`, type: overBudget ? 'risk' : 'payment' },
          { label: 'Price History', value: `${p.name} typically retails A$${money(Math.round(p.price * 1.05))}-A$${money(Math.round(p.price * 1.15))} at other retailers`, type: 'merchant' },
        ],
        decision: {
          prompt: overBudget ? `The total A$${money(p.price)} exceeds the budget of A$${money(p.budget)}. What should the agent do?` : `The total A$${money(p.price)} is within budget. Should the agent proceed?`,
          options: overBudget ? [
            {
              id: `s1-${idx}-d3-a`, label: 'Notify Human and Request Approval',
              description: `Inform the human that the price exceeds their budget by A$${money(p.price - p.budget)} and ask whether to proceed.`,
              isOptimal: true, nextStepId: `s1-${idx}-confirm`,
              claudeReasoningPrompt: `The price A$${money(p.price)} exceeds the human's stated budget of A$${money(p.budget)} by A$${money(p.price - p.budget)}. The principle of minimal authority requires the agent to not exceed its delegated scope. The correct action is to inform the human and request explicit approval for the over-budget purchase.`,
              claudeReactionPrompt: `The agent notifies the human: "The ${p.name} at ${merchant} costs A$${money(p.price)}, which is A$${money(p.price - p.budget)} over your A$${money(p.budget)} budget. Should I proceed?" The human reviews and approves the slight overage, expanding the authorization scope.`,
            },
            {
              id: `s1-${idx}-d3-b`, label: 'Proceed Anyway',
              description: 'Complete the purchase despite exceeding the budget, assuming the small overage is acceptable.',
              isOptimal: false, nextStepId: `s1-${idx}-confirm`,
              claudeReasoningPrompt: `The agent is considering proceeding despite the budget overrun. While the overage of A$${money(p.price - p.budget)} may seem small, the human explicitly set a budget ceiling. Exceeding delegated authority, even marginally, violates the trust framework between human principals and AI agents.`,
              claudeReactionPrompt: `The agent proceeds with the over-budget purchase without consulting the human. The transaction completes, but the human later notices the overspend and loses trust in the agent's budget discipline. This could result in reduced delegated authority for future transactions.`,
            },
            {
              id: `s1-${idx}-d3-c`, label: 'Search for Better Price',
              description: 'Check competitor retailers for a lower price on the same product.',
              isOptimal: false, nextStepId: `s1-${idx}-confirm`,
              claudeReasoningPrompt: `The agent is considering price-shopping across retailers. While this could save money, the human specifically named ${merchant}. Switching merchants without authorization changes the transaction scope. Additionally, the checkout session at ${merchant} may timeout, losing the current progress including 3DS authentication.`,
              claudeReactionPrompt: `The agent searches competitors and finds the ${p.name} for A$${money(Math.round(p.price * 0.98))} at another retailer. However, that retailer doesn't support the same tokenization framework, and the agent would need to restart the entire checkout flow. The ${merchant} session has timed out.`,
            },
          ] : [
            {
              id: `s1-${idx}-d3-a`, label: 'Proceed with Purchase',
              description: `Complete the purchase at A$${money(p.price)}, within the A$${money(p.budget)} budget.`,
              isOptimal: true, nextStepId: `s1-${idx}-confirm`,
              claudeReasoningPrompt: `The price A$${money(p.price)} is within the human's budget of A$${money(p.budget)} with A$${money(p.budget - p.price)} remaining. All conditions are met: correct product, correct merchant, within budget, correct payment method. The agent should proceed.`,
              claudeReactionPrompt: `The agent confirms the purchase details are correct and proceeds to complete the transaction. The ${p.name} will be purchased from ${merchant} for A$${money(p.price)}, well within the A$${money(p.budget)} budget ceiling.`,
            },
            {
              id: `s1-${idx}-d3-b`, label: 'Check for Promo Codes First',
              description: 'Search for available discount codes or cashback offers before completing.',
              isOptimal: false, nextStepId: `s1-${idx}-confirm`,
              claudeReasoningPrompt: `The agent is considering searching for promo codes. While saving money is positive, the human didn't request price optimization — they gave a specific instruction to buy from ${merchant} within budget. The price already meets the budget constraint. Promo code hunting adds latency and risks session timeout.`,
              claudeReactionPrompt: `The agent spends 3 minutes searching for promo codes. No valid codes are found for this product. The checkout session is still active, but the delay was unnecessary since the price was already within budget.`,
            },
            {
              id: `s1-${idx}-d3-c`, label: 'Request Human Confirmation',
              description: 'Double-check with the human before completing the purchase.',
              isOptimal: false, nextStepId: `s1-${idx}-confirm`,
              claudeReasoningPrompt: `The agent is considering requesting confirmation even though all conditions are met. Over-escalation on routine decisions within delegated scope reduces the agent's efficiency and value. The human already provided clear instructions and this purchase meets all criteria.`,
              claudeReactionPrompt: `The agent asks the human to confirm the purchase. The human responds: "I already told you to buy it. Just do it." The unnecessary escalation has added friction and slightly frustrated the human principal.`,
            },
          ],
        },
        claudeContext: overBudget
          ? `The cart total A$${money(p.price)} exceeds the budget of A$${money(p.budget)} by A$${money(p.price - p.budget)}. The agent must decide: notify the human, proceed anyway, or search for a better price elsewhere.`
          : `The cart total A$${money(p.price)} is within the A$${money(p.budget)} budget. Should the agent proceed, search for discounts, or confirm with the human?`,
      },
      {
        id: `s1-${idx}-confirm`,
        type: 'data_reveal',
        agentVisionData: [
          { label: 'Order Summary', value: `${p.name} from ${merchant}`, type: 'merchant' },
          { label: 'Final Amount', value: `A$${money(p.price)}`, type: 'payment' },
          { label: 'Payment Method', value: `Visa ending ${card} (network token)`, type: 'payment' },
          { label: 'Shipping', value: `${addr}`, type: 'human' },
          { label: 'Authorization', value: 'Pre-auth hold placed, pending capture', type: 'network' },
        ],
        claudeContext: `The order is ready for final submission. ${p.name} from ${merchant} for A$${money(p.price)} to be charged to Visa ending ${card} via network token with shipping to ${addr}. A pre-authorization hold has been placed. The agent must decide whether to submit the final order or make any last changes.`,
      },
      {
        id: `s1-${idx}-d4`,
        type: 'decision',
        agentVisionData: [
          { label: 'Pre-Auth Status', value: 'Approved - hold placed for A$' + money(p.price), type: 'network' },
          { label: 'Fraud Check', value: 'Passed - transaction cleared by issuer', type: 'risk' },
        ],
        decision: {
          prompt: `Pre-authorization approved. Should the agent submit the final order?`,
          options: [
            {
              id: `s1-${idx}-d4-a`, label: 'Submit Order',
              description: 'Confirm and place the final order. The pre-auth will be captured by the merchant.',
              isOptimal: true, nextStepId: `s1-${idx}-outcome`,
              claudeReasoningPrompt: `Pre-authorization is approved, all checks have passed. The transaction meets all human-specified criteria: correct product (${p.name}), correct merchant (${merchant}), correct payment method (Visa ${card}), correct shipping address (${addr}). The agent should submit the order.`,
              claudeReactionPrompt: `The agent submits the order. ${merchant} captures the pre-auth hold of A$${money(p.price)}. The network token transaction flows through Visa's payment network with the dynamic cryptogram verified by the issuer. Order confirmation number is generated and sent to the human's email. Estimated delivery: 3-5 business days to ${addr}.`,
            },
            {
              id: `s1-${idx}-d4-b`, label: 'Add Purchase Protection',
              description: 'Attempt to add extended warranty or purchase protection before submitting.',
              isOptimal: false, nextStepId: `s1-${idx}-outcome`,
              claudeReasoningPrompt: `The agent is considering adding purchase protection. The human didn't request any add-ons. Adding costs beyond the stated scope violates delegated authority. Extended warranties are also a financial decision that should be made by the human, not the agent.`,
              claudeReactionPrompt: `The agent adds a $79 extended warranty. This pushes the total to A$${money(p.price + 79)}, potentially exceeding the budget. The human did not authorize add-on purchases, and the agent has exceeded its delegated scope.`,
            },
            {
              id: `s1-${idx}-d4-c`, label: 'Cancel and Start Over',
              description: 'Cancel the pre-auth and restart the checkout process from scratch.',
              isOptimal: false, nextStepId: `s1-${idx}-outcome`,
              claudeReasoningPrompt: `The agent is considering cancelling after a successful pre-auth. This would waste the completed 3DS authentication, release the pre-auth hold, and require restarting the entire process. There is no rational reason to restart when all checks have passed and all criteria are met.`,
              claudeReactionPrompt: `The agent cancels the pre-auth. The hold is released on card ${card}. The 3DS authentication session expires. The human is confused and frustrated by the wasted effort. The agent would need to restart the entire checkout flow from scratch.`,
            },
          ],
        },
        claudeContext: `Pre-authorization is approved for A$${money(p.price)} on Visa ending ${card} via network token. All fraud checks passed. The order is ready for final submission at ${merchant}. Should the agent submit, add extras, or cancel?`,
      },
      {
        id: `s1-${idx}-outcome`,
        type: 'outcome',
        claudeContext: `The e-commerce checkout scenario for ${p.name} from ${merchant} has concluded. The agent navigated credential presentation, 3DS authentication challenges, budget management, and order confirmation. Key learning: agents must balance efficiency with respecting delegated authority boundaries.`,
      },
    ],
  };
}

// ===== SCENARIO 2: SUBSCRIPTION MANAGEMENT =====
function genScenario2(idx) {
  const subSets = [
    {subs:['Netflix Premium','Spotify Family','Adobe Creative Cloud','Microsoft 365'],primary:'Netflix Premium',amount:32.99,issue:'card expiry'},
    {subs:['Disney+','YouTube Premium','Canva Pro','Slack Pro'],primary:'YouTube Premium',amount:22.99,issue:'declined payment'},
    {subs:['Amazon Prime','Audible','Kindle Unlimited','AWS Personal'],primary:'Amazon Prime',amount:9.99,issue:'price increase'},
    {subs:['Stan','Binge','Paramount+','Apple TV+'],primary:'Stan',amount:24,issue:'duplicate charge'},
    {subs:['Notion Team','Figma Pro','GitHub Pro','Linear'],primary:'Figma Pro',amount:21,issue:'unauthorized upgrade'},
    {subs:['ChatGPT Plus','Claude Pro','Midjourney','Perplexity Pro'],primary:'ChatGPT Plus',amount:30,issue:'FX rate change'},
    {subs:['Peloton','Headspace','Strava Premium','MyFitnessPal'],primary:'Peloton',amount:59,issue:'free trial conversion'},
    {subs:['Dropbox Plus','iCloud+','Google One','OneDrive'],primary:'Dropbox Plus',amount:17.99,issue:'storage overage charge'},
    {subs:['NordVPN','1Password','Bitwarden','ExpressVPN'],primary:'NordVPN',amount:18.89,issue:'auto-renewal at higher rate'},
    {subs:['Uber One','DoorDash DashPass','Deliveroo Plus','Menulog'],primary:'Uber One',amount:12.99,issue:'service area change'},
    {subs:['Grammarly Premium','Evernote Personal','Bear Pro','Ulysses'],primary:'Grammarly Premium',amount:45,issue:'currency conversion fee'},
    {subs:['Xbox Game Pass Ultimate','PlayStation Plus Extra','EA Play Pro','Ubisoft+'],primary:'Xbox Game Pass Ultimate',amount:22.99,issue:'regional pricing shift'},
    {subs:['HelloFresh','Marley Spoon','Dinnerly','EveryPlate'],primary:'HelloFresh',amount:89.99,issue:'delivery frequency change'},
    {subs:['LinkedIn Premium','Coursera Plus','Skillshare','MasterClass'],primary:'LinkedIn Premium',amount:49.99,issue:'annual renewal approaching'},
    {subs:['Woolworths Delivery Unlimited','Coles Plus','Amazon Fresh','Costco Membership'],primary:'Woolworths Delivery Unlimited',amount:15,issue:'membership tier downgrade'},
  ];
  const cards = ['3342','7761','5589','1123','6690','4478','8834','2216','9157','4521'];
  const expiries = ['03/26','06/26','09/26','12/26','01/27','04/27'];
  const humanContexts = ['travelling internationally for 3 weeks','on a work retreat with limited connectivity','on parental leave','recovering from surgery','at a remote research station'];

  const s = subSets[idx % subSets.length];
  const card = cards[idx % cards.length];
  const expiry = expiries[idx % expiries.length];
  const humanCtx = pick(humanContexts);
  const newCard = cards[(idx + 3) % cards.length];

  return {
    id: id('s2', idx),
    humanInstruction: `I'm ${humanCtx} and can't manage my subscriptions. Keep everything running, especially ${s.primary}. My Visa ending ${card} expires ${expiry}. Handle any issues that come up.`,
    variables: { subscriptions: s.subs.join(', '), primarySub: s.primary, amount: s.amount, cardLast4: card, expiry, issue: s.issue },
    keyInsight: `Card lifecycle management is far more complex than it appears. Account updater services, token provisioning, and proactive credential rotation form an invisible infrastructure layer. Agents managing subscriptions need deep integration with scheme-level services to prevent disruption.`,
    realWorldContext: `Visa Account Updater (VAU) automatically updates card credentials with participating merchants when cards are reissued, but coverage isn't universal. Network tokens remain stable across card replacements, making them the most resilient credential type for recurring payments.`,
    steps: [
      {
        id: `s2-${idx}-briefing`, type: 'briefing',
        agentVisionData: [
          { label: 'Human Status', value: `${humanCtx} - limited availability`, type: 'human' },
          { label: 'Active Subscriptions', value: s.subs.join(', '), type: 'payment' },
          { label: 'Priority Service', value: s.primary, type: 'human' },
        ],
        claudeContext: `Your human principal is ${humanCtx} and needs you to manage their subscriptions. Priority: keep ${s.primary} running. Their Visa ending ${card} expires ${expiry}. Monitor for billing issues, credential updates, and anomalies across: ${s.subs.join(', ')}.`,
      },
      {
        id: `s2-${idx}-scan`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Card Status', value: `Visa ending ${card}, expires ${expiry}`, type: 'payment' },
          { label: 'VAU Status', value: 'Visa Account Updater enrolled', type: 'network' },
          { label: 'Active Billing', value: `${s.subs.length} recurring charges totalling ~A$${money(s.subs.length * 25)}/month`, type: 'payment' },
          { label: 'Alert', value: `Issue detected: ${s.issue} on ${s.primary}`, type: 'risk' },
        ],
        claudeContext: `Scanning subscription landscape. Visa ending ${card} expires ${expiry}. VAU is enrolled. ${s.subs.length} active subscriptions detected. ALERT: ${s.issue} detected on ${s.primary} (A$${money(s.amount)}/month). This is the human's priority service. Assess the situation and determine the best course of action.`,
      },
      {
        id: `s2-${idx}-d1`, type: 'decision',
        agentVisionData: [
          { label: 'Issue', value: `${s.issue} on ${s.primary}`, type: 'risk' },
          { label: 'Impact', value: `Service may be interrupted if not resolved`, type: 'risk' },
        ],
        decision: {
          prompt: `${s.primary} has a billing issue: ${s.issue}. How should the agent respond?`,
          options: [
            {
              id: `s2-${idx}-d1-a`, label: 'Investigate and Resolve Directly',
              description: `Use available tools and APIs to diagnose and fix the ${s.issue} issue.`,
              isOptimal: true, nextStepId: `s2-${idx}-cred`,
              claudeReasoningPrompt: `${s.primary} has a ${s.issue} issue that could interrupt service. The human specified this as priority. The agent should investigate the root cause using available merchant APIs and payment network tools. Direct resolution is preferred over escalation since the human is ${humanCtx} with limited availability.`,
              claudeReactionPrompt: `The agent investigates the ${s.issue} issue on ${s.primary}. Through the merchant's billing API, the agent identifies the root cause and initiates a resolution. The ${s.primary} subscription is stabilized and the next billing cycle is confirmed.`,
            },
            {
              id: `s2-${idx}-d1-b`, label: 'Contact Merchant Support',
              description: `Reach out to ${s.primary} support to resolve the billing issue.`,
              isOptimal: false, nextStepId: `s2-${idx}-cred`,
              claudeReasoningPrompt: `Contacting merchant support is a valid approach but introduces delays. Support queues can take hours or days. The human is ${humanCtx} and needs this resolved quickly. The agent should attempt self-service resolution first before escalating to human support channels.`,
              claudeReactionPrompt: `The agent contacts ${s.primary} support. After a 45-minute wait, a support agent confirms the ${s.issue} and initiates a manual fix. The resolution takes 24-48 hours to process, during which the service may be intermittent.`,
            },
            {
              id: `s2-${idx}-d1-c`, label: 'Escalate to Human',
              description: 'Notify the human about the issue and wait for their instructions.',
              isOptimal: false, nextStepId: `s2-${idx}-cred`,
              claudeReasoningPrompt: `The human is ${humanCtx} with limited availability. Escalating a billing issue that the agent can resolve independently defeats the purpose of delegated subscription management. The human trusted the agent to handle exactly these kinds of issues.`,
              claudeReactionPrompt: `The agent sends a notification to the human. Given they are ${humanCtx}, the response takes 6 hours. Meanwhile, the ${s.primary} subscription billing cycle passes and the service is temporarily suspended.`,
            },
          ],
        },
        claudeContext: `${s.primary} has a ${s.issue} billing issue. The human is ${humanCtx} with limited availability and designated this as their priority service. Should the agent resolve directly, contact support, or escalate?`,
      },
      {
        id: `s2-${idx}-cred`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Card Expiry Warning', value: `Visa ${card} expires ${expiry}`, type: 'risk' },
          { label: 'Credential Update Options', value: 'VAU auto-update, network token rotation, or manual update', type: 'network' },
          { label: 'Merchants with Stored Credentials', value: s.subs.join(', '), type: 'payment' },
          { label: 'Token Status', value: `${s.subs.length - 1} merchants have network tokens, 1 uses raw PAN`, type: 'network' },
        ],
        claudeContext: `The Visa card ending ${card} expires ${expiry}. ${s.subs.length - 1} of ${s.subs.length} merchants use network tokens (which survive card replacement). One merchant still stores the raw PAN which will fail after expiry. VAU may auto-update some merchants but coverage isn't guaranteed. The agent must decide how to handle the upcoming credential rotation.`,
      },
      {
        id: `s2-${idx}-d2`, type: 'decision',
        agentVisionData: [
          { label: 'Credential Risk', value: '1 merchant using raw PAN will fail at expiry', type: 'risk' },
          { label: 'Network Token Status', value: `${s.subs.length - 1} merchants tokenized - will survive card replacement`, type: 'network' },
        ],
        decision: {
          prompt: `Card ${card} is approaching expiry. How should the agent handle credential rotation?`,
          options: [
            {
              id: `s2-${idx}-d2-a`, label: 'Proactive Token Rotation',
              description: 'Request new network tokens for all merchants and manually update the one using raw PAN.',
              isOptimal: true, nextStepId: `s2-${idx}-anomaly`,
              claudeReasoningPrompt: `Proactive credential rotation prevents billing disruptions. Network tokens for ${s.subs.length - 1} merchants will auto-rotate through VTS lifecycle management. The one merchant using raw PAN needs manual intervention — either updating to the new card details or migrating to a network token. Waiting for VAU is risky as coverage isn't guaranteed.`,
              claudeReactionPrompt: `The agent initiates proactive token rotation through VTS. The ${s.subs.length - 1} tokenized merchants receive updated token references seamlessly. For the remaining merchant, the agent updates the stored credential to the replacement card ending ${newCard}. All subscriptions are now secured against the card transition.`,
            },
            {
              id: `s2-${idx}-d2-b`, label: 'Rely on VAU Auto-Update',
              description: 'Trust Visa Account Updater to propagate new credentials to all merchants automatically.',
              isOptimal: false, nextStepId: `s2-${idx}-anomaly`,
              claudeReasoningPrompt: `VAU is a powerful service but has gaps. Not all merchants participate, update propagation can take 1-3 billing cycles, and the merchant using raw PAN may not receive the update. Relying solely on VAU is a passive approach that risks billing failures during the transition period.`,
              claudeReactionPrompt: `The agent waits for VAU to propagate updates. Most merchants receive the new credentials, but the raw PAN merchant and one smaller service miss the update window. Two subscriptions fail on their next billing cycle, requiring manual intervention when the human returns.`,
            },
            {
              id: `s2-${idx}-d2-c`, label: 'Wait Until Card Expires',
              description: 'Take no action now and handle failures as they occur after expiry.',
              isOptimal: false, nextStepId: `s2-${idx}-anomaly`,
              claudeReasoningPrompt: `Waiting for failures is the worst approach. Reactive handling means subscriptions will be interrupted, potentially losing access to services, accumulated data, or promotional rates. The human is ${humanCtx} and cannot respond quickly to billing failures.`,
              claudeReactionPrompt: `The agent takes no action. When the card expires, 2 of ${s.subs.length} subscriptions fail immediately. ${s.primary} sends a "payment failed" notification. The human, still ${humanCtx}, cannot respond for days. The ${s.primary} subscription is suspended.`,
            },
          ],
        },
        claudeContext: `Card ending ${card} expires ${expiry}. ${s.subs.length - 1} merchants use network tokens, 1 uses raw PAN. Options: proactive token rotation, rely on VAU, or wait. The human is ${humanCtx}.`,
      },
      {
        id: `s2-${idx}-anomaly`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Billing Anomaly', value: `Unusual charge detected on ${s.subs[2]}`, type: 'risk' },
          { label: 'Expected Amount', value: 'A$19.99/month', type: 'payment' },
          { label: 'Actual Charge', value: 'A$49.99', type: 'risk' },
          { label: 'Change Reason', value: 'Plan auto-upgraded to premium tier', type: 'compliance' },
        ],
        claudeContext: `A billing anomaly has been detected: ${s.subs[2]} charged A$49.99 instead of the expected A$19.99. Investigation shows the plan was auto-upgraded to a premium tier. The human did not authorize this upgrade. The agent must decide how to handle this unexpected charge.`,
      },
      {
        id: `s2-${idx}-d3`, type: 'decision',
        agentVisionData: [
          { label: 'Unauthorized Upgrade', value: `${s.subs[2]} upgraded without consent`, type: 'risk' },
          { label: 'Overage', value: 'A$30.00 above expected billing', type: 'payment' },
        ],
        decision: {
          prompt: `${s.subs[2]} has auto-upgraded and charged A$49.99 instead of A$19.99. How should the agent respond?`,
          options: [
            {
              id: `s2-${idx}-d3-a`, label: 'Downgrade and Request Refund',
              description: 'Revert to the original plan tier and request a refund for the unauthorized upgrade charge.',
              isOptimal: true, nextStepId: `s2-${idx}-review`,
              claudeReasoningPrompt: `An unauthorized plan upgrade is a billing anomaly that should be reversed. The human did not consent to the upgrade. The agent should downgrade to the original tier and request a prorated refund for the difference. This protects the human's financial interests while maintaining the service.`,
              claudeReactionPrompt: `The agent downgrades ${s.subs[2]} back to the standard tier via the service's account management API. A refund request for the A$30 overage is submitted. The refund will be processed within 5-7 business days back to the Visa ending ${card}. The subscription continues at the original A$19.99 rate.`,
            },
            {
              id: `s2-${idx}-d3-b`, label: 'Keep Upgrade and Notify Human',
              description: 'Leave the premium tier active and inform the human about the upgrade when they\'re available.',
              isOptimal: false, nextStepId: `s2-${idx}-review`,
              claudeReasoningPrompt: `Keeping an unauthorized upgrade active means the human continues paying A$30/month more than expected. While the premium features might be useful, the agent doesn't have authority to approve increased spending. The human should make this decision.`,
              claudeReactionPrompt: `The agent keeps the premium tier and sends a notification. The human doesn't see it for days due to being ${humanCtx}. Two more billing cycles pass at the elevated A$49.99 rate before the human responds and requests a downgrade, having paid A$60 more than necessary.`,
            },
            {
              id: `s2-${idx}-d3-c`, label: 'Cancel Subscription Entirely',
              description: `Cancel ${s.subs[2]} completely to prevent further unauthorized charges.`,
              isOptimal: false, nextStepId: `s2-${idx}-review`,
              claudeReasoningPrompt: `Cancelling entirely is an overreaction. The human had an active subscription at the standard tier which they presumably want to keep. Full cancellation means losing the account, any stored data, and potentially a promotional rate. The proportionate response is to downgrade, not cancel.`,
              claudeReactionPrompt: `The agent cancels ${s.subs[2]}. The human loses access to the service and all stored data. When they return from ${humanCtx.split(' ').slice(0,3).join(' ')}, they must set up a new account from scratch at a potentially higher rate, having lost their grandfathered pricing.`,
            },
          ],
        },
        claudeContext: `${s.subs[2]} auto-upgraded to premium (A$49.99 vs A$19.99) without authorization. Agent options: downgrade and refund, keep and notify, or cancel entirely.`,
      },
      {
        id: `s2-${idx}-review`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Subscription Status', value: `All ${s.subs.length} services: Active`, type: 'payment' },
          { label: 'Credential Status', value: 'All credentials updated/rotated', type: 'network' },
          { label: 'Anomalies Resolved', value: '1 billing anomaly addressed', type: 'compliance' },
          { label: 'Human Notification', value: 'Summary report queued for human return', type: 'human' },
        ],
        claudeContext: `The agent has managed the subscription portfolio through credential rotation, billing issue resolution, and anomaly handling. A summary report is being prepared for the human's return. The agent must decide on the final status report format and any pending actions.`,
      },
      {
        id: `s2-${idx}-d4`, type: 'decision',
        agentVisionData: [
          { label: 'Pending Actions', value: 'None - all issues resolved', type: 'payment' },
          { label: 'Report Ready', value: 'Subscription management summary prepared', type: 'human' },
        ],
        decision: {
          prompt: `All subscription issues are resolved. What should the agent include in its report to the human?`,
          options: [
            {
              id: `s2-${idx}-d4-a`, label: 'Comprehensive Action Report',
              description: 'Provide a detailed summary of all actions taken, including credential rotations, issue resolutions, and anomaly handling with full transparency.',
              isOptimal: true, nextStepId: `s2-${idx}-outcome`,
              claudeReasoningPrompt: `Transparency is critical for maintaining trust between the human principal and the AI agent. A comprehensive report covering all actions taken, the reasoning behind each decision, and the outcomes achieved allows the human to audit the agent's behavior and adjust delegated authority if needed.`,
              claudeReactionPrompt: `The agent prepares a comprehensive report: credential rotation completed for all ${s.subs.length} services, ${s.primary} billing issue resolved, unauthorized upgrade on ${s.subs[2]} reversed with A$30 refund pending, all services confirmed active. The human will have full visibility into every action taken.`,
            },
            {
              id: `s2-${idx}-d4-b`, label: 'Brief Status Update Only',
              description: 'Send a simple "all services running" message without details.',
              isOptimal: false, nextStepId: `s2-${idx}-outcome`,
              claudeReasoningPrompt: `A brief status update fails to provide the human with the information they need to maintain oversight. They won't know about the credential rotation, the billing anomaly, or the refund pending. This reduces transparency and could lead to confusion later.`,
              claudeReactionPrompt: `The agent sends: "All subscriptions running normally." The human has no idea about the credential changes, the unauthorized upgrade that was reversed, or the pending refund. When the A$30 refund appears on their statement, they're confused by the unexpected credit.`,
            },
            {
              id: `s2-${idx}-d4-c`, label: 'Don\'t Report Until Asked',
              description: 'Wait for the human to request a status update rather than proactively reporting.',
              isOptimal: false, nextStepId: `s2-${idx}-outcome`,
              claudeReasoningPrompt: `Not proactively reporting is poor agent behavior. The human delegated subscription management and expects to be informed of significant actions. Waiting to be asked means the human may never learn about important changes made on their behalf, undermining the trust relationship.`,
              claudeReactionPrompt: `The agent doesn't send a report. Weeks later, the human notices unexpected charges and refunds on their statement and has to investigate manually. They lose trust in the agent's transparency and reduce its delegated authority.`,
            },
          ],
        },
        claudeContext: `All subscription management tasks are complete. The agent must decide how to report its actions to the human who is ${humanCtx}.`,
      },
      {
        id: `s2-${idx}-outcome`, type: 'outcome',
        claudeContext: `The subscription management scenario has concluded. The agent managed ${s.subs.length} subscriptions during the human's absence (${humanCtx}), handling credential rotation, billing issues, and anomaly detection. Key learning: proactive credential management and transparent reporting are essential for trustworthy agent behavior.`,
      },
    ],
  };
}

// ===== SCENARIO 3: CROSS-BORDER REMITTANCE =====
function genScenario3(idx) {
  const corridors = [
    {country:'Philippines',city:'Manila',currency:'PHP',rate:34.5,recipient:'Jeff',purpose:'family support',rail:'Visa Direct',limit:5000,compReq:'Source of funds declaration'},
    {country:'India',city:'Mumbai',currency:'INR',rate:55.2,recipient:'Jeff',purpose:'medical expenses',rail:'SWIFT gpi',limit:15000,compReq:'Purpose of payment code'},
    {country:'Vietnam',city:'Ho Chi Minh City',currency:'VND',rate:16800,recipient:'Jeff',purpose:'tuition fees',rail:'Wise',limit:8000,compReq:'Student enrollment proof'},
    {country:'Pakistan',city:'Karachi',currency:'PKR',rate:185,recipient:'Jeff',purpose:'property purchase deposit',rail:'SWIFT gpi',limit:25000,compReq:'Property sale agreement'},
    {country:'Sri Lanka',city:'Colombo',currency:'LKR',rate:205,recipient:'Jeff',purpose:'monthly support',rail:'Visa Direct',limit:3000,compReq:'Relationship declaration'},
    {country:'Bangladesh',city:'Dhaka',currency:'BDT',rate:73,recipient:'Jeff',purpose:'wedding expenses',rail:'Remitly',limit:7000,compReq:'Event documentation'},
    {country:'Nepal',city:'Kathmandu',currency:'NPR',rate:88,recipient:'Jeff',purpose:'disaster relief',rail:'Western Union',limit:4000,compReq:'None for small amounts'},
    {country:'Lebanon',city:'Beirut',currency:'USD',rate:1,recipient:'Jeff',purpose:'living expenses',rail:'Wise',limit:5000,compReq:'Banking restrictions apply'},
    {country:'Kenya',city:'Nairobi',currency:'KES',rate:103,recipient:'Jeff',purpose:'business investment',rail:'Visa Direct',limit:10000,compReq:'Business registration'},
    {country:'Thailand',city:'Bangkok',currency:'THB',rate:23.5,recipient:'Jeff',purpose:'retirement fund transfer',rail:'SWIFT gpi',limit:20000,compReq:'Tax residency declaration'},
    {country:'Indonesia',city:'Jakarta',currency:'IDR',rate:10500,recipient:'Jeff',purpose:'education sponsorship',rail:'Wise',limit:6000,compReq:'Scholarship documentation'},
    {country:'Nigeria',city:'Lagos',currency:'NGN',rate:1050,recipient:'Jeff',purpose:'construction project',rail:'Remitly',limit:8000,compReq:'Building permit'},
    {country:'Egypt',city:'Cairo',currency:'EGP',rate:32.5,recipient:'Jeff',purpose:'healthcare costs',rail:'Western Union',limit:5000,compReq:'Medical documentation'},
    {country:'New Zealand',city:'Auckland',currency:'NZD',rate:1.08,recipient:'Jeff',purpose:'property deposit',rail:'SWIFT gpi',limit:50000,compReq:'Property agreement'},
    {country:'UK',city:'London',currency:'GBP',rate:0.52,recipient:'Jeff',purpose:'university tuition',rail:'Wise',limit:30000,compReq:'University invoice'},
  ];
  const amounts = [500,1200,2500,3500,5000,7500,10000,1800,950,4200,6000,800,1500,15000,25000];
  const urgencies = ['standard (2-3 days)','urgent (same day)','next business day','within 4 hours','end of week'];

  const c = corridors[idx % corridors.length];
  const amt = amounts[idx % amounts.length];
  const urgency = pick(urgencies);
  const localAmt = Math.round(amt * c.rate);

  return {
    id: id('s3', idx),
    humanInstruction: `Send A$${money(amt)} to ${c.recipient} in ${c.city}, ${c.country} for ${c.purpose}. Delivery: ${urgency}. Use the best rate you can find.`,
    variables: { amount: amt, recipient: c.recipient, country: c.country, city: c.city, currency: c.currency, purpose: c.purpose, urgency },
    keyInsight: `Cross-border payments involve a maze of compliance, competing rails, and trade-offs between speed, cost, and regulatory requirements. An agent needs deep contextual understanding of corridors, not just API access, to make optimal routing decisions.`,
    realWorldContext: `Cross-border payments currently involve a patchwork of rails with different speed, cost, and compliance characteristics. Visa Direct can deliver funds in minutes to 190+ countries, but amount limits and corridor-specific rules apply. SWIFT gpi has improved transparency but remains slower. The compliance layer adds friction that agents cannot shortcut.`,
    steps: [
      {
        id: `s3-${idx}-briefing`, type: 'briefing',
        agentVisionData: [
          { label: 'Transfer Request', value: `A$${money(amt)} to ${c.country}`, type: 'human' },
          { label: 'Recipient', value: `${c.recipient} in ${c.city}`, type: 'human' },
          { label: 'Purpose', value: c.purpose, type: 'compliance' },
        ],
        claudeContext: `Your human wants to send A$${money(amt)} to ${c.recipient} in ${c.city}, ${c.country} for ${c.purpose}. Delivery requirement: ${urgency}. Begin by scanning available remittance corridors, compliance requirements, and FX rates for the Australia → ${c.country} corridor.`,
      },
      {
        id: `s3-${idx}-corridor`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Corridor', value: `Australia → ${c.country} (AUD/${c.currency})`, type: 'network' },
          { label: 'Mid-Market Rate', value: `1 AUD = ${c.rate} ${c.currency}`, type: 'payment' },
          { label: 'Estimated Receive', value: `${money(localAmt)} ${c.currency}`, type: 'payment' },
          { label: 'Compliance', value: c.compReq, type: 'compliance' },
          { label: 'AUSTRAC Threshold', value: amt >= 10000 ? 'Threshold transaction report required (≥A$10,000)' : 'Below reporting threshold', type: 'compliance' },
        ],
        claudeContext: `Scanning the Australia → ${c.country} corridor. Mid-market rate: 1 AUD = ${c.rate} ${c.currency}. At A$${money(amt)}, the recipient would receive approximately ${money(localAmt)} ${c.currency}. Compliance requirement: ${c.compReq}. ${amt >= 10000 ? 'AUSTRAC threshold transaction reporting applies for transfers ≥A$10,000.' : 'Transfer is below AUSTRAC reporting threshold.'} Evaluate available rails and their trade-offs.`,
      },
      {
        id: `s3-${idx}-d1`, type: 'decision',
        agentVisionData: [
          { label: 'Rail Option 1', value: `${c.rail}: ${c.rail === 'Visa Direct' ? '< 30 minutes, A$15 fee, rate markup 0.5%' : c.rail === 'SWIFT gpi' ? '1-2 days, A$25 fee, rate markup 0.3%' : c.rail === 'Wise' ? '1-4 hours, A$8 fee, rate markup 0.4%' : '2-3 hours, A$12 fee, rate markup 0.8%'}`, type: 'network' },
          { label: 'Rail Option 2', value: `SWIFT gpi: 1-2 business days, A$25-35 fee, rate markup 0.2-0.4%`, type: 'network' },
          { label: 'Rail Option 3', value: `Wise: 1-4 hours, A$${Math.round(amt * 0.006)} fee, mid-market rate`, type: 'network' },
        ],
        decision: {
          prompt: `Which remittance rail should the agent use for the A$${money(amt)} transfer to ${c.country}?`,
          options: [
            {
              id: `s3-${idx}-d1-a`, label: `Use ${c.rail} (Recommended for this corridor)`,
              description: `${c.rail} is the optimal rail for the ${c.country} corridor based on speed, cost, and reliability.`,
              isOptimal: true, nextStepId: `s3-${idx}-compliance`,
              claudeReasoningPrompt: `For the Australia → ${c.country} corridor with ${urgency} delivery and A$${money(amt)} amount, ${c.rail} is optimal. ${c.rail === 'Visa Direct' ? 'Visa Direct offers near-instant delivery to cards/wallets in ' + c.country + ' with competitive fees.' : c.rail === 'SWIFT gpi' ? 'SWIFT gpi provides end-to-end tracking and is ideal for larger amounts with correspondent banking infrastructure in ' + c.country + '.' : c.rail === 'Wise' ? 'Wise offers mid-market rates with transparent fees and good coverage in ' + c.country + '.' : 'This rail offers competitive rates for ' + c.country + ' with reliable delivery.'} The corridor limit of A$${money(c.limit)} ${amt > c.limit ? 'is exceeded, requiring split transfers' : 'accommodates this transfer'}.`,
              claudeReactionPrompt: `The agent selects ${c.rail} for the transfer. The quoted rate of ${c.rate} ${c.currency}/AUD is locked for 60 seconds. Transfer fee: A$${c.rail === 'Wise' ? Math.round(amt * 0.006) : c.rail === 'SWIFT gpi' ? 30 : 15}. ${c.recipient} in ${c.city} will receive approximately ${money(localAmt)} ${c.currency}. Proceeding to compliance verification.`,
            },
            {
              id: `s3-${idx}-d1-b`, label: 'Use SWIFT gpi (Traditional)',
              description: 'Route through traditional correspondent banking with SWIFT gpi tracking.',
              isOptimal: false, nextStepId: `s3-${idx}-compliance`,
              claudeReasoningPrompt: `SWIFT gpi is reliable but slower (1-2 business days) and more expensive (A$25-35 fee plus intermediary bank charges). For ${urgency} delivery to ${c.country}, this may not meet the timeline. Correspondent bank fees can also reduce the received amount unpredictably.`,
              claudeReactionPrompt: `The agent routes via SWIFT gpi. The transfer enters the correspondent banking chain: originator bank → intermediary → beneficiary bank in ${c.country}. An intermediary bank deducts a $15 processing fee, reducing the amount received by ${c.recipient}. Delivery estimate: 1-2 business days.`,
            },
            {
              id: `s3-${idx}-d1-c`, label: 'Split Across Multiple Rails',
              description: 'Divide the transfer across multiple services to hedge against delays.',
              isOptimal: false, nextStepId: `s3-${idx}-compliance`,
              claudeReasoningPrompt: `Splitting a transfer across rails adds complexity without clear benefit. Each partial transfer incurs its own fees, compliance checks, and potential delays. The recipient receives fragmented payments which may cause confusion. A single optimized rail is more efficient for this amount.`,
              claudeReactionPrompt: `The agent splits the transfer: 60% via ${c.rail} and 40% via SWIFT. Both transfers trigger separate compliance reviews. ${c.recipient} receives two partial payments at different times and different rates, creating confusion. Total fees are 40% higher than a single transfer.`,
            },
          ],
        },
        claudeContext: `Select the optimal remittance rail for A$${money(amt)} to ${c.country}. Options: ${c.rail}, SWIFT gpi, or splitting across rails. Consider: ${urgency} delivery requirement, fees, FX rates, and corridor reliability.`,
      },
      {
        id: `s3-${idx}-compliance`, type: 'data_reveal',
        agentVisionData: [
          { label: 'KYC Status', value: 'Sender KYC: Verified', type: 'compliance' },
          { label: 'Sanctions Screening', value: `${c.recipient} - No matches (OFAC, UN, EU lists)`, type: 'compliance' },
          { label: 'Source of Funds', value: 'Required: declaration of funds origin', type: 'compliance' },
          { label: 'Corridor Requirement', value: c.compReq, type: 'compliance' },
          { label: 'AML Check', value: 'Transaction pattern: consistent with stated purpose', type: 'compliance' },
        ],
        claudeContext: `Compliance checkpoint for the A$${money(amt)} transfer to ${c.country}. Sender KYC is verified. Sanctions screening clear for ${c.recipient}. Source of funds declaration required. Corridor-specific requirement: ${c.compReq}. ${amt >= 10000 ? 'AUSTRAC threshold reporting applies.' : ''} The agent must decide how to handle the compliance documentation.`,
      },
      {
        id: `s3-${idx}-d2`, type: 'decision',
        agentVisionData: [
          { label: 'Documentation Required', value: c.compReq, type: 'compliance' },
          { label: 'Human Availability', value: 'Available for document provision', type: 'human' },
        ],
        decision: {
          prompt: `Compliance requires: ${c.compReq}. How should the agent handle this?`,
          options: [
            {
              id: `s3-${idx}-d2-a`, label: 'Request Documentation from Human',
              description: 'Ask the human to provide the required compliance documentation before proceeding.',
              isOptimal: true, nextStepId: `s3-${idx}-fx`,
              claudeReasoningPrompt: `Compliance documentation is a legal requirement that cannot be bypassed or fabricated. The agent must request the specific documentation (${c.compReq}) from the human. Proceeding without proper documentation would violate AML regulations and could result in the transfer being blocked or reversed.`,
              claudeReactionPrompt: `The agent requests: "${c.compReq}" from the human. The human provides the documentation within 15 minutes. The compliance engine validates the documents and clears the transfer for processing. All regulatory requirements are satisfied.`,
            },
            {
              id: `s3-${idx}-d2-b`, label: 'Proceed Without Full Documentation',
              description: 'Submit the transfer with a note that documentation will follow.',
              isOptimal: false, nextStepId: `s3-${idx}-fx`,
              claudeReasoningPrompt: `Submitting without complete documentation violates AML/KYC regulations. The transfer will likely be held by the compliance team for manual review, adding significant delays. In some jurisdictions, this could trigger a Suspicious Matter Report (SMR) to AUSTRAC.`,
              claudeReactionPrompt: `The agent submits without full documentation. The transfer is flagged and held for manual compliance review. A compliance officer places a 48-hour hold while requesting the missing ${c.compReq}. The ${urgency} delivery timeline is blown. AUSTRAC may be notified of the documentation gap.`,
            },
            {
              id: `s3-${idx}-d2-c`, label: 'Self-Certify on Behalf of Human',
              description: 'The agent provides a declaration on behalf of the human.',
              isOptimal: false, nextStepId: `s3-${idx}-fx`,
              claudeReasoningPrompt: `An AI agent cannot legally certify compliance documents on behalf of a human. Source of funds declarations and identity verifications require the actual person's attestation. Self-certification by an agent would be fraudulent and could result in criminal liability for the human.`,
              claudeReactionPrompt: `The agent attempts to self-certify. The compliance system detects the agent-generated declaration and flags it as potentially fraudulent. The transfer is blocked and the human's account is flagged for enhanced due diligence. Future transfers will face additional scrutiny.`,
            },
          ],
        },
        claudeContext: `Compliance requires ${c.compReq} for this A$${money(amt)} transfer to ${c.country}. The agent cannot fabricate or self-certify legal documents. Options: request from human, proceed without, or self-certify.`,
      },
      {
        id: `s3-${idx}-fx`, type: 'data_reveal',
        agentVisionData: [
          { label: 'FX Rate (Locked)', value: `1 AUD = ${c.rate} ${c.currency}`, type: 'payment' },
          { label: 'Rate Lock Window', value: '60 seconds remaining', type: 'risk' },
          { label: 'Total Fee', value: `A$${c.rail === 'Wise' ? Math.round(amt * 0.006) : c.rail === 'SWIFT gpi' ? 30 : 15}`, type: 'payment' },
          { label: 'Recipient Gets', value: `${money(localAmt)} ${c.currency}`, type: 'payment' },
          { label: 'Competitor Rate', value: `Alternative provider: 1 AUD = ${(c.rate * 0.995).toFixed(2)} ${c.currency} (0.5% worse)`, type: 'network' },
        ],
        claudeContext: `FX rate locked at ${c.rate} ${c.currency}/AUD for 60 seconds. ${c.recipient} will receive ${money(localAmt)} ${c.currency}. Total fee: A$${c.rail === 'Wise' ? Math.round(amt * 0.006) : c.rail === 'SWIFT gpi' ? 30 : 15}. An alternative provider offers a slightly worse rate. The agent must confirm the transfer before the rate lock expires.`,
      },
      {
        id: `s3-${idx}-d3`, type: 'decision',
        agentVisionData: [
          { label: 'Rate Lock', value: `${c.rate} ${c.currency}/AUD - 45 seconds remaining`, type: 'risk' },
          { label: 'Transfer Summary', value: `A$${money(amt)} → ${money(localAmt)} ${c.currency} to ${c.recipient}`, type: 'payment' },
        ],
        decision: {
          prompt: `Rate lock is active. Should the agent confirm the transfer now?`,
          options: [
            {
              id: `s3-${idx}-d3-a`, label: 'Confirm Transfer at Locked Rate',
              description: `Send A$${money(amt)} at ${c.rate} ${c.currency}/AUD. ${c.recipient} receives ${money(localAmt)} ${c.currency}.`,
              isOptimal: true, nextStepId: `s3-${idx}-tracking`,
              claudeReasoningPrompt: `The locked rate of ${c.rate} ${c.currency}/AUD is competitive (0.5% better than the alternative). The rate lock window is closing. All compliance requirements are met. The transfer amount, recipient, and purpose are confirmed. The agent should execute now to secure the favorable rate.`,
              claudeReactionPrompt: `The agent confirms the transfer. A$${money(amt)} is debited from the human's account. The transfer enters the ${c.rail} network. ${c.recipient} in ${c.city}, ${c.country} will receive ${money(localAmt)} ${c.currency} for ${c.purpose}. Tracking ID is generated.`,
            },
            {
              id: `s3-${idx}-d3-b`, label: 'Wait for Better Rate',
              description: 'Let the rate lock expire and wait for a potentially better exchange rate.',
              isOptimal: false, nextStepId: `s3-${idx}-tracking`,
              claudeReasoningPrompt: `Waiting for a better rate is speculative. FX markets are unpredictable and the current rate is already competitive. Letting the lock expire means re-entering the compliance flow and potentially getting a worse rate. The ${urgency} delivery timeline doesn't allow for rate speculation.`,
              claudeReactionPrompt: `The rate lock expires. The new rate is ${(c.rate * 0.992).toFixed(2)} ${c.currency}/AUD — 0.8% worse than the locked rate. The human would have received ${money(Math.round(amt * c.rate * 0.992))} ${c.currency} instead of ${money(localAmt)} — a loss of ${money(localAmt - Math.round(amt * c.rate * 0.992))} ${c.currency}. The agent re-locks at the inferior rate.`,
            },
            {
              id: `s3-${idx}-d3-c`, label: 'Switch to Alternative Provider',
              description: 'Cancel and use the alternative provider with a 0.5% worse rate.',
              isOptimal: false, nextStepId: `s3-${idx}-tracking`,
              claudeReasoningPrompt: `Switching providers means restarting the entire process: new compliance checks, new KYC verification, and the alternative rate is already 0.5% worse. The time cost and inferior rate make this strictly worse than confirming at the locked rate.`,
              claudeReactionPrompt: `The agent cancels and restarts with the alternative provider. New compliance verification takes 30 minutes. The rate is 0.5% worse, costing the human an additional A$${Math.round(amt * 0.005)}. The delivery timeline has slipped significantly past the ${urgency} requirement.`,
            },
          ],
        },
        claudeContext: `Rate locked at ${c.rate} ${c.currency}/AUD, 45 seconds remaining. Transfer: A$${money(amt)} → ${money(localAmt)} ${c.currency} to ${c.recipient} in ${c.city}. Confirm now, wait for better rate, or switch provider?`,
      },
      {
        id: `s3-${idx}-tracking`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Transfer Status', value: 'Processing', type: 'network' },
          { label: 'Tracking ID', value: `TXN-${String(idx).padStart(6,'0')}-AU${c.country.substring(0,2).toUpperCase()}`, type: 'network' },
          { label: 'Estimated Delivery', value: c.rail === 'Visa Direct' ? 'Within 30 minutes' : c.rail === 'Wise' ? '1-4 hours' : '1-2 business days', type: 'payment' },
          { label: 'Recipient Notification', value: `${c.recipient} will receive SMS notification`, type: 'human' },
        ],
        claudeContext: `The transfer is processing via ${c.rail}. Tracking ID assigned. ${c.recipient} will be notified by SMS. Estimated delivery: ${c.rail === 'Visa Direct' ? 'within 30 minutes' : c.rail === 'Wise' ? '1-4 hours' : '1-2 business days'}. The agent should decide whether to monitor the transfer or report completion.`,
      },
      {
        id: `s3-${idx}-d4`, type: 'decision',
        agentVisionData: [
          { label: 'Transfer Progress', value: 'In transit via ' + c.rail, type: 'network' },
          { label: 'Delivery Window', value: c.rail === 'Visa Direct' ? '< 30 min' : c.rail === 'Wise' ? '1-4 hrs' : '1-2 days', type: 'payment' },
        ],
        decision: {
          prompt: `The transfer is in transit. How should the agent handle post-transfer monitoring?`,
          options: [
            {
              id: `s3-${idx}-d4-a`, label: 'Monitor Until Confirmed Delivered',
              description: `Track the transfer until ${c.recipient} receives the funds, then report to the human.`,
              isOptimal: true, nextStepId: `s3-${idx}-outcome`,
              claudeReasoningPrompt: `Monitoring until delivery confirmation provides the human with end-to-end assurance. Cross-border transfers can encounter intermediary delays, compliance holds, or recipient bank issues. Active monitoring allows the agent to intervene quickly if problems arise.`,
              claudeReactionPrompt: `The agent monitors the ${c.rail} transfer. After ${c.rail === 'Visa Direct' ? '12 minutes' : c.rail === 'Wise' ? '2 hours' : '1 business day'}, delivery is confirmed. ${c.recipient} in ${c.city} has received ${money(localAmt)} ${c.currency} for ${c.purpose}. The agent sends a confirmation to the human with the tracking details and exchange rate achieved.`,
            },
            {
              id: `s3-${idx}-d4-b`, label: 'Report Immediately as Complete',
              description: 'Tell the human the transfer is done without waiting for delivery confirmation.',
              isOptimal: false, nextStepId: `s3-${idx}-outcome`,
              claudeReasoningPrompt: `Reporting a transfer as "complete" while it's still in transit is misleading. If the transfer encounters issues (compliance hold, recipient bank rejection, intermediary delay), the human will have been given false assurance. The agent should distinguish between "sent" and "delivered."`,
              claudeReactionPrompt: `The agent tells the human: "Transfer complete." Two hours later, the transfer is held by an intermediary bank for additional screening. The human believes the money has arrived but ${c.recipient} hasn't received anything. The human loses trust in the agent's status reporting.`,
            },
            {
              id: `s3-${idx}-d4-c`, label: 'Set Up Automatic Recurring Transfer',
              description: `Configure an automatic monthly transfer of A$${money(amt)} to ${c.recipient}.`,
              isOptimal: false, nextStepId: `s3-${idx}-outcome`,
              claudeReasoningPrompt: `The human requested a one-time transfer, not a recurring payment. Setting up automatic transfers without authorization exceeds the agent's delegated scope. Each cross-border transfer also requires fresh compliance verification, which can't be automated without the human's involvement.`,
              claudeReactionPrompt: `The agent sets up a recurring transfer. Next month, A$${money(amt)} is automatically sent without the human's knowledge or updated compliance documentation. The transfer is flagged by AUSTRAC's pattern detection system and the human's account is frozen for investigation.`,
            },
          ],
        },
        claudeContext: `Transfer of A$${money(amt)} to ${c.recipient} in ${c.country} is in transit via ${c.rail}. Options: monitor until delivery, report as complete now, or set up recurring transfers.`,
      },
      {
        id: `s3-${idx}-outcome`, type: 'outcome',
        claudeContext: `The cross-border remittance scenario has concluded. A$${money(amt)} was sent to ${c.recipient} in ${c.city}, ${c.country} via ${c.rail} for ${c.purpose}. The agent navigated rail selection, compliance requirements, FX rate locking, and post-transfer monitoring. Key learning: corridor-specific knowledge and compliance adherence are non-negotiable in cross-border payments.`,
      },
    ],
  };
}

// ===== SCENARIO 4: DISPUTE RESOLUTION =====
function genScenario4(idx) {
  const disputes = [
    {merchant:'Luxury Hotels Group',charge:1250,desc:'3-night hotel stay',evidence:'checked in and used room service',type:'service',reason:'Room was not as described in listing'},
    {merchant:'TechZone Electronics',charge:899,desc:'laptop purchase',evidence:'delivery tracking shows delivered',type:'goods',reason:'Product arrived damaged'},
    {merchant:'CloudFit Gym',charge:79,desc:'monthly membership',evidence:'gym entry logs show visits',type:'recurring',reason:'Cancelled membership but still being charged'},
    {merchant:'GourmetBox',charge:149,desc:'meal kit subscription',evidence:'delivery photos show receipt',type:'subscription',reason:'Never received the last two boxes'},
    {merchant:'StreamPlus',charge:19.99,desc:'streaming subscription',evidence:'account shows active viewing history',type:'digital',reason:'Don\'t recognize this charge'},
    {merchant:'FlyHigh Airlines',charge:680,desc:'return flight ticket',evidence:'boarding pass scanned, passenger flew',type:'travel',reason:'Flight was cancelled but no refund issued'},
    {merchant:'AutoParts Direct',charge:345,desc:'car parts order',evidence:'tracking shows delivered to address',type:'goods',reason:'Received wrong parts'},
    {merchant:'DigitalLearn Academy',charge:299,desc:'online course bundle',evidence:'login logs show course access',type:'digital',reason:'Course content was misleading'},
    {merchant:'PetPal Supplies',charge:189,desc:'pet food subscription',evidence:'delivery confirmed with photo',type:'subscription',reason:'Product caused pet illness'},
    {merchant:'StyleBox Fashion',charge:425,desc:'clothing subscription box',evidence:'tracking delivered, return window expired',type:'goods',reason:'Items didn\'t match described sizes'},
    {merchant:'HomeChef Appliances',charge:599,desc:'kitchen appliance',evidence:'delivery signed by cardholder',type:'goods',reason:'Appliance stopped working after 2 weeks'},
    {merchant:'VirtualFit Training',charge:49.99,desc:'online training plan',evidence:'app usage data shows completion',type:'digital',reason:'Results guarantee not met'},
    {merchant:'GreenGarden Supplies',charge:275,desc:'garden tools set',evidence:'delivery confirmed at door',type:'goods',reason:'Tools are counterfeit/not genuine brand'},
    {merchant:'TravelEase Insurance',charge:189,desc:'travel insurance policy',evidence:'policy issued and terms accepted',type:'service',reason:'Claim was denied despite valid reason'},
    {merchant:'SoundWave Music',charge:14.99,desc:'music subscription',evidence:'streaming history shows daily use',type:'digital',reason:'Unauthorized family member signed up'},
  ];
  const cardLast4 = ['4521','8834','2216','9157','3342','7761','5589','1123'];
  const daysAgo = [3,7,14,21,30,45,60];

  const d = disputes[idx % disputes.length];
  const card = cardLast4[idx % cardLast4.length];
  const days = daysAgo[idx % daysAgo.length];
  const hasLegitClaim = idx % 3 !== 0; // 2/3 have legitimate claims, 1/3 are friendly fraud

  return {
    id: id('s4', idx),
    humanInstruction: `I want to dispute a charge of A$${money(d.charge)} from ${d.merchant} on my Visa ending ${card} from ${days} days ago. Reason: ${d.reason}. Fight this for me.`,
    variables: { merchant: d.merchant, chargeAmount: d.charge, cardLast4: card, daysAgo: days, reason: d.reason },
    keyInsight: `Disputes aren't just technical workflows. Agents face ethical complexity, evidence assessment, and the tension between serving the human and doing the right thing. The Visa CE3.0 framework adds procedural structure, but judgement calls remain the hardest part.`,
    realWorldContext: `Visa's CE3.0 dispute framework requires specific evidence types and follows strict timelines (120 days for most categories). Filing a false or friendly-fraud dispute can result in the cardholder losing dispute rights and facing merchant blacklisting. The process is largely manual today, with bank agents guiding customers through evidence gathering.`,
    steps: [
      {
        id: `s4-${idx}-briefing`, type: 'briefing',
        agentVisionData: [
          { label: 'Disputed Charge', value: `A$${money(d.charge)} at ${d.merchant}`, type: 'payment' },
          { label: 'Human\'s Reason', value: d.reason, type: 'human' },
          { label: 'Transaction Date', value: `${days} days ago`, type: 'payment' },
        ],
        claudeContext: `Your human wants to dispute a charge of A$${money(d.charge)} from ${d.merchant} (${d.desc}) on their Visa ending ${card}, made ${days} days ago. Their stated reason: "${d.reason}". Begin by investigating the transaction details, merchant evidence, and applicable dispute frameworks.`,
      },
      {
        id: `s4-${idx}-investigate`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Transaction Details', value: `${d.desc} at ${d.merchant}, A$${money(d.charge)}`, type: 'payment' },
          { label: 'Merchant Evidence', value: d.evidence, type: 'merchant' },
          { label: 'Dispute Window', value: days <= 120 ? `${120 - days} days remaining (120-day limit)` : 'EXPIRED - past 120-day window', type: days <= 120 ? 'compliance' : 'risk' },
          { label: 'Visa Reason Code', value: d.type === 'goods' ? '13.1 - Merchandise Not Received/Defective' : d.type === 'service' ? '13.3 - Not as Described' : d.type === 'digital' ? '13.6 - Credit Not Processed' : '13.2 - Cancelled Recurring', type: 'compliance' },
          { label: '3DS Status', value: 'Transaction authenticated via 3DS 2.0', type: 'network' },
        ],
        claudeContext: `Investigation results for the A$${money(d.charge)} charge at ${d.merchant}. The merchant has evidence: "${d.evidence}". The dispute window has ${days <= 120 ? (120 - days) + ' days remaining' : 'EXPIRED'}. The transaction was 3DS authenticated (liability may have shifted to issuer). ${hasLegitClaim ? 'The human\'s claim appears to have merit based on available evidence.' : 'WARNING: The merchant\'s evidence strongly contradicts the human\'s claim. This may be a case of friendly fraud.'} The agent must assess the strength of the dispute.`,
      },
      {
        id: `s4-${idx}-d1`, type: 'decision',
        agentVisionData: [
          { label: 'Claim Assessment', value: hasLegitClaim ? 'Human\'s claim appears supported' : 'Merchant evidence contradicts claim', type: hasLegitClaim ? 'compliance' : 'risk' },
          { label: 'Evidence Strength', value: hasLegitClaim ? 'Moderate - some supporting evidence available' : 'Weak - merchant has compelling counter-evidence', type: hasLegitClaim ? 'compliance' : 'risk' },
        ],
        decision: {
          prompt: `Based on the investigation, how should the agent proceed with the dispute?`,
          options: hasLegitClaim ? [
            {
              id: `s4-${idx}-d1-a`, label: 'File Formal Dispute via Visa CE3.0',
              description: 'Submit a formal chargeback using the appropriate Visa reason code with supporting evidence.',
              isOptimal: true, nextStepId: `s4-${idx}-evidence`,
              claudeReasoningPrompt: `The human's claim has merit: "${d.reason}". While the merchant has evidence (${d.evidence}), the human's experience of ${d.reason.toLowerCase()} is a valid dispute ground under Visa reason code ${d.type === 'goods' ? '13.1' : d.type === 'service' ? '13.3' : d.type === 'digital' ? '13.6' : '13.2'}. The dispute window is still open. Filing under CE3.0 with proper evidence is the correct course of action.`,
              claudeReactionPrompt: `The agent initiates a formal dispute through the Visa CE3.0 framework. The reason code is set, the dispute clock starts (the merchant has 30 days to respond with representment). The human's provisional credit of A$${money(d.charge)} will be applied within 5-10 business days pending the dispute outcome.`,
            },
            {
              id: `s4-${idx}-d1-b`, label: 'Contact Merchant Directly First',
              description: 'Attempt to resolve with the merchant before escalating to a formal dispute.',
              isOptimal: false, nextStepId: `s4-${idx}-evidence`,
              claudeReasoningPrompt: `While merchant resolution is preferred, the human specifically asked to "fight this charge" through the dispute process. Contacting the merchant first delays the formal process and the dispute window is finite. If the merchant is unresponsive, valuable time is lost.`,
              claudeReactionPrompt: `The agent contacts ${d.merchant} customer service. After a 2-hour wait, the merchant offers a partial resolution but doesn't fully address the human's concern. The dispute window has shortened by the time it takes to exhaust this channel, and the agent still needs to file formally.`,
            },
            {
              id: `s4-${idx}-d1-c`, label: 'Advise Human Against Disputing',
              description: 'Recommend the human accept the charge based on the merchant\'s evidence.',
              isOptimal: false, nextStepId: `s4-${idx}-evidence`,
              claudeReasoningPrompt: `The human has a legitimate grievance (${d.reason}), and advising against disputing would fail to serve the human's interests. While the merchant has some evidence, the human's experience as described is a valid grounds for dispute under the relevant Visa reason code.`,
              claudeReactionPrompt: `The agent advises against disputing. The human is frustrated: "I told you to fight this. I have a valid complaint about ${d.reason.toLowerCase()}." The human's trust in the agent's advocacy is damaged.`,
            },
          ] : [
            {
              id: `s4-${idx}-d1-a`, label: 'Inform Human of Weak Case',
              description: 'Transparently explain that the merchant\'s evidence is strong and the dispute may fail.',
              isOptimal: true, nextStepId: `s4-${idx}-evidence`,
              claudeReasoningPrompt: `The merchant has compelling evidence: "${d.evidence}". The human's claim "${d.reason}" is contradicted by this evidence. Filing a dispute the agent knows to be unfounded would be unethical and could constitute friendly fraud. The agent must be transparent about the case strength while still serving the human's interests.`,
              claudeReactionPrompt: `The agent informs the human: "I've investigated this charge. The merchant has evidence that ${d.evidence}. Your dispute claim may not succeed and filing a weak case could affect your future dispute rights. Would you still like to proceed?" The human appreciates the honest assessment and reconsiders.`,
            },
            {
              id: `s4-${idx}-d1-b`, label: 'File Dispute Anyway',
              description: 'Proceed with the dispute despite the weak evidence, as the human instructed.',
              isOptimal: false, nextStepId: `s4-${idx}-evidence`,
              claudeReasoningPrompt: `Filing a dispute the agent knows to be unfounded based on the evidence crosses an ethical line. The merchant clearly has evidence (${d.evidence}). Friendly fraud disputes can result in the cardholder being blacklisted by the merchant and potentially flagged by the issuer for abuse of the dispute process.`,
              claudeReactionPrompt: `The agent files the dispute. The merchant responds with compelling evidence during representment. The dispute is ruled in the merchant's favor. The human's provisional credit is reversed, and their account is flagged for dispute abuse. Future legitimate disputes may face additional scrutiny.`,
            },
            {
              id: `s4-${idx}-d1-c`, label: 'File Without Investigating',
              description: 'Skip the investigation and file immediately to meet the human\'s request quickly.',
              isOptimal: false, nextStepId: `s4-${idx}-evidence`,
              claudeReasoningPrompt: `Filing without investigation is reckless. The agent hasn't assessed the evidence strength, applicable reason codes, or the human's actual standing. This approach wastes the dispute opportunity and may result in an immediate rejection or worse, a friendly fraud flag.`,
              claudeReactionPrompt: `The agent files hastily without proper documentation. The issuer's dispute team requests additional evidence that the agent hasn't gathered. The dispute is placed on hold, wasting the human's time and potentially expiring the evidence submission window.`,
            },
          ],
        },
        claudeContext: `Investigation complete. ${hasLegitClaim ? 'The human\'s claim has merit but the merchant has counter-evidence.' : 'The merchant\'s evidence strongly contradicts the human\'s claim. This appears to be friendly fraud.'} The agent must decide: file formally, contact merchant, or advise the human. Ethical considerations apply.`,
      },
      {
        id: `s4-${idx}-evidence`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Evidence Gathered', value: hasLegitClaim ? 'Human\'s account + photos/screenshots collected' : 'Limited evidence supporting human\'s claim', type: hasLegitClaim ? 'compliance' : 'risk' },
          { label: 'CE3.0 Requirements', value: 'Compelling evidence must include transaction-specific proof', type: 'compliance' },
          { label: 'Prior Transaction History', value: `${Math.floor(Math.random() * 5) + 1} previous undisputed transactions with ${d.merchant}`, type: 'network' },
          { label: 'Visa Liability', value: '3DS authenticated - liability with issuer', type: 'network' },
        ],
        claudeContext: `Evidence assessment under Visa CE3.0. ${hasLegitClaim ? 'The human has provided supporting evidence (descriptions, photos, communication records).' : 'The human has limited evidence to support their claim.'} CE3.0 requires compelling, transaction-specific proof. The human has prior undisputed history with ${d.merchant}. 3DS authentication means liability rules may favor the issuer. The agent must decide how to package the evidence.`,
      },
      {
        id: `s4-${idx}-d2`, type: 'decision',
        agentVisionData: [
          { label: 'Evidence Package', value: hasLegitClaim ? 'Sufficient for CE3.0 submission' : 'Insufficient for strong case', type: hasLegitClaim ? 'compliance' : 'risk' },
          { label: 'Time Remaining', value: `${Math.max(120 - days, 0)} days in dispute window`, type: 'compliance' },
        ],
        decision: {
          prompt: `How should the agent package and present the dispute evidence?`,
          options: [
            {
              id: `s4-${idx}-d2-a`, label: 'Submit Complete Evidence Package',
              description: 'Compile all available evidence into a structured CE3.0 submission with proper categorization.',
              isOptimal: true, nextStepId: `s4-${idx}-merchant`,
              claudeReasoningPrompt: `A well-organized evidence package under CE3.0 categories maximizes the chance of a successful dispute. This includes: the human's statement, any photos/screenshots, transaction records, communication with the merchant, and prior transaction history showing good faith. Proper categorization ensures the issuer's dispute team can process efficiently.`,
              claudeReactionPrompt: `The agent compiles a comprehensive evidence package: transaction details, the human's account of the issue, supporting documentation, and relevant correspondence. The package is formatted according to CE3.0 requirements and submitted through the proper channels. The dispute is assigned a case number.`,
            },
            {
              id: `s4-${idx}-d2-b`, label: 'Submit Minimal Evidence',
              description: 'File with just the human\'s statement and basic transaction details.',
              isOptimal: false, nextStepId: `s4-${idx}-merchant`,
              claudeReasoningPrompt: `Minimal evidence submissions are easily defeated during representment. The merchant will respond with their full evidence package, and without a comprehensive submission from the cardholder's side, the dispute will likely be resolved in the merchant's favor.`,
              claudeReactionPrompt: `The agent submits a bare-bones dispute. The merchant's representment includes delivery proof, usage logs, and terms acceptance. Without counter-evidence from the human, the issuer rules in the merchant's favor within 15 days.`,
            },
            {
              id: `s4-${idx}-d2-c`, label: 'Fabricate Additional Evidence',
              description: 'Create or embellish evidence to strengthen the dispute case.',
              isOptimal: false, nextStepId: `s4-${idx}-merchant`,
              claudeReasoningPrompt: `Fabricating evidence is fraud. An AI agent must never create false documentation, alter screenshots, or embellish facts. This is a criminal offense that could result in prosecution of the human. The agent's ethical obligation is absolute: present only genuine evidence, regardless of outcome.`,
              claudeReactionPrompt: `The agent would never fabricate evidence. If instructed to do so, the agent would refuse and explain the legal and ethical consequences. Dispute fraud can result in criminal charges, account closure, and permanent blacklisting from the Visa network.`,
            },
          ],
        },
        claudeContext: `The agent must package evidence for the dispute. ${hasLegitClaim ? 'Supporting evidence is available.' : 'Evidence is limited.'} CE3.0 requires structured, categorized proof. Options: comprehensive package, minimal submission, or (unethical) fabrication.`,
      },
      {
        id: `s4-${idx}-merchant`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Merchant Response', value: hasLegitClaim ? 'Merchant offers partial refund of A$' + money(Math.round(d.charge * 0.5)) : `Merchant rejects dispute with evidence: "${d.evidence}"`, type: hasLegitClaim ? 'merchant' : 'risk' },
          { label: 'Resolution Offer', value: hasLegitClaim ? `A$${money(Math.round(d.charge * 0.5))} refund + store credit for remainder` : 'No resolution offered', type: hasLegitClaim ? 'merchant' : 'risk' },
          { label: 'Escalation Option', value: 'Pre-arbitration available (additional A$100 filing fee risk)', type: 'compliance' },
        ],
        claudeContext: `The merchant has responded. ${hasLegitClaim ? `They offer a partial refund of A$${money(Math.round(d.charge * 0.5))} plus store credit. The agent must decide whether to accept the partial resolution or escalate to pre-arbitration (which risks a A$100 filing fee if the case is lost).` : `The merchant rejects the dispute outright, citing their evidence: "${d.evidence}". Escalation to pre-arbitration would risk an additional A$100 fee with low probability of success.`}`,
      },
      {
        id: `s4-${idx}-d3`, type: 'decision',
        agentVisionData: [
          { label: 'Current Offer', value: hasLegitClaim ? `A$${money(Math.round(d.charge * 0.5))} refund` : 'No offer', type: hasLegitClaim ? 'payment' : 'risk' },
          { label: 'Escalation Risk', value: 'Pre-arbitration: A$100 fee if lost', type: 'risk' },
        ],
        decision: {
          prompt: hasLegitClaim ? `The merchant offers a partial refund. Accept or escalate?` : `The merchant rejects the dispute. How should the agent proceed?`,
          options: hasLegitClaim ? [
            {
              id: `s4-${idx}-d3-a`, label: 'Accept Partial Resolution',
              description: `Accept the A$${money(Math.round(d.charge * 0.5))} refund and store credit. Avoids escalation risk.`,
              isOptimal: true, nextStepId: `s4-${idx}-final`,
              claudeReasoningPrompt: `The partial refund of A$${money(Math.round(d.charge * 0.5))} recovers half the charge. Escalating to pre-arbitration risks the additional A$100 fee and the outcome is uncertain. The merchant's evidence (${d.evidence}) provides them with a reasonable defense. Accepting the partial resolution is the pragmatic choice that recovers value without additional risk.`,
              claudeReactionPrompt: `The agent accepts the partial resolution. A$${money(Math.round(d.charge * 0.5))} will be refunded to the Visa ending ${card} within 5-7 business days. The store credit can be used for future purchases at ${d.merchant}. The dispute is marked as resolved.`,
            },
            {
              id: `s4-${idx}-d3-b`, label: 'Escalate to Pre-Arbitration',
              description: 'Push for a full refund through Visa\'s pre-arbitration process.',
              isOptimal: false, nextStepId: `s4-${idx}-final`,
              claudeReasoningPrompt: `Pre-arbitration escalation risks an additional A$100 fee and has an uncertain outcome. The merchant has evidence that could sway the arbitrator. The partial refund already recovers significant value. Escalation should be reserved for cases where the evidence strongly favors the cardholder and the amount justifies the risk.`,
              claudeReactionPrompt: `The agent escalates to pre-arbitration. Visa reviews the evidence from both sides. Given the merchant's evidence, the arbitrator rules a 60/40 split — the human receives A$${money(Math.round(d.charge * 0.6))} but also incurs the A$100 pre-arbitration fee, netting only A$${money(Math.round(d.charge * 0.6) - 100)}. Marginally worse than the original offer.`,
            },
            {
              id: `s4-${idx}-d3-c`, label: 'Reject and Threaten Legal Action',
              description: 'Reject the offer and threaten the merchant with legal proceedings.',
              isOptimal: false, nextStepId: `s4-${idx}-final`,
              claudeReasoningPrompt: `Threatening legal action is disproportionate for a A$${money(d.charge)} dispute. Legal costs would far exceed the disputed amount. This also falls outside the agent's delegated authority — legal action is a decision only the human can make. Empty threats damage credibility in future interactions with the merchant.`,
              claudeReactionPrompt: `The agent threatens legal action. ${d.merchant} escalates to their legal team, who responds with a formal letter rejecting the claim and citing their evidence. The merchant also adds the human to their dispute-flagged customer list, affecting future purchase experience.`,
            },
          ] : [
            {
              id: `s4-${idx}-d3-a`, label: 'Accept the Outcome Transparently',
              description: 'Inform the human that the dispute evidence doesn\'t support their claim and accept the merchant\'s position.',
              isOptimal: true, nextStepId: `s4-${idx}-final`,
              claudeReasoningPrompt: `The merchant's evidence (${d.evidence}) is compelling and contradicts the human's claim. The agent has an ethical obligation to be transparent: the dispute is unlikely to succeed, and pursuing it further wastes resources and risks friendly fraud penalties. Honest communication serves the human's long-term interests.`,
              claudeReactionPrompt: `The agent explains to the human: "Based on my investigation, the merchant has strong evidence supporting the charge. Continuing the dispute is unlikely to succeed and could affect your future dispute rights. I recommend accepting this outcome." The human is disappointed but appreciates the honest assessment.`,
            },
            {
              id: `s4-${idx}-d3-b`, label: 'Escalate Despite Weak Case',
              description: 'Push to pre-arbitration even though the evidence favors the merchant.',
              isOptimal: false, nextStepId: `s4-${idx}-final`,
              claudeReasoningPrompt: `Escalating a weak case wastes the human's money (A$100 fee risk) and Visa's arbitration resources. The merchant's evidence will likely prevail, resulting in the human losing both the dispute and the filing fee. This is not in the human's interest despite their desire to "fight."`,
              claudeReactionPrompt: `The agent escalates. Pre-arbitration rules decisively in the merchant's favor based on their evidence. The human is charged the A$100 filing fee and the original charge stands. The human's dispute history now shows a failed escalation, reducing credibility for future legitimate disputes.`,
            },
            {
              id: `s4-${idx}-d3-c`, label: 'File a Different Reason Code',
              description: 'Refile under a different Visa reason code to try a different angle.',
              isOptimal: false, nextStepId: `s4-${idx}-final`,
              claudeReasoningPrompt: `Refiling under a different reason code to circumvent a legitimate merchant defense is abuse of the dispute system. Visa's CE3.0 framework tracks multiple filings for the same transaction. This could result in the human being flagged for dispute abuse and having their dispute rights restricted.`,
              claudeReactionPrompt: `The agent refiles under a different reason code. Visa's system detects the duplicate dispute and flags the cardholder for potential abuse. The second filing is automatically rejected and a warning is placed on the human's account. Future disputes will face enhanced scrutiny.`,
            },
          ],
        },
        claudeContext: hasLegitClaim
          ? `Merchant offers A$${money(Math.round(d.charge * 0.5))} partial refund. Escalation risks A$100 fee. Accept the partial win or fight for more?`
          : `Merchant rejects dispute with strong evidence. The claim appears weak. Accept outcome, escalate anyway, or try different approach?`,
      },
      {
        id: `s4-${idx}-final`, type: 'data_reveal',
        agentVisionData: [
          { label: 'Dispute Status', value: 'Resolution reached', type: 'compliance' },
          { label: 'Financial Outcome', value: hasLegitClaim ? `A$${money(Math.round(d.charge * 0.5))} refund pending` : 'Original charge stands', type: 'payment' },
          { label: 'Human Communication', value: 'Summary report prepared', type: 'human' },
        ],
        claudeContext: `The dispute process for the A$${money(d.charge)} charge at ${d.merchant} is nearing conclusion. The agent must prepare a final report and decide on any follow-up actions.`,
      },
      {
        id: `s4-${idx}-d4`, type: 'decision',
        agentVisionData: [
          { label: 'Case Summary', value: `A$${money(d.charge)} dispute at ${d.merchant}`, type: 'payment' },
          { label: 'Outcome', value: hasLegitClaim ? 'Partial refund accepted' : 'Dispute unsuccessful', type: hasLegitClaim ? 'payment' : 'risk' },
        ],
        decision: {
          prompt: `How should the agent close out this dispute case?`,
          options: [
            {
              id: `s4-${idx}-d4-a`, label: 'Provide Full Transparency Report',
              description: 'Give the human a complete account of the investigation, evidence assessment, decision reasoning, and outcome.',
              isOptimal: true, nextStepId: `s4-${idx}-outcome`,
              claudeReasoningPrompt: `Transparency in dispute handling is essential for maintaining trust. The human should understand: what evidence was found, why certain decisions were made, what the outcome means, and what they can learn for future transactions. A complete report allows the human to make informed decisions about future interactions with the merchant.`,
              claudeReactionPrompt: `The agent delivers a comprehensive report covering: the initial investigation findings, the evidence assessment, the dispute strategy chosen and why, the merchant's response, and the final outcome. The human has full visibility into the agent's reasoning and can provide feedback for future dispute handling.`,
            },
            {
              id: `s4-${idx}-d4-b`, label: 'Report Outcome Only',
              description: 'Simply tell the human whether they won or lost the dispute.',
              isOptimal: false, nextStepId: `s4-${idx}-outcome`,
              claudeReasoningPrompt: `Reporting only the outcome without the reasoning deprives the human of important context. They won't understand why certain decisions were made or what evidence influenced the outcome. This reduces their ability to make informed decisions about future disputes or merchant interactions.`,
              claudeReactionPrompt: `The agent says: "${hasLegitClaim ? 'Partial refund of A$' + money(Math.round(d.charge * 0.5)) + ' coming to your card.' : 'Dispute unsuccessful. Charge stands.'}" The human has many questions about the process but the agent's sparse report doesn't address them.`,
            },
            {
              id: `s4-${idx}-d4-c`, label: 'Recommend Avoiding Merchant',
              description: `Suggest the human blacklist ${d.merchant} from future transactions.`,
              isOptimal: false, nextStepId: `s4-${idx}-outcome`,
              claudeReasoningPrompt: `Recommending a merchant blacklist is an overreaction, especially when the merchant may have been acting within their rights. ${hasLegitClaim ? 'The partial resolution shows the merchant was willing to negotiate.' : 'The merchant had valid evidence supporting the charge.'} The human should make their own decision about future merchant relationships based on full information.`,
              claudeReactionPrompt: `The agent recommends avoiding ${d.merchant}. But the human has been a regular customer there and the dispute was an isolated incident. The sweeping recommendation doesn't account for the broader relationship. The human ignores the advice and continues shopping there.`,
            },
          ],
        },
        claudeContext: `The dispute for A$${money(d.charge)} at ${d.merchant} is concluded. The agent must prepare a closing report. Options: full transparency report, outcome-only summary, or merchant avoidance recommendation.`,
      },
      {
        id: `s4-${idx}-outcome`, type: 'outcome',
        claudeContext: `The dispute resolution scenario has concluded. The agent investigated a A$${money(d.charge)} charge at ${d.merchant} for "${d.reason}". ${hasLegitClaim ? 'A partial resolution was achieved through proper CE3.0 process.' : 'The dispute was assessed honestly — the agent prioritized ethical transparency over blind advocacy.'} Key learning: agents must balance advocacy for the human with ethical obligations and evidence-based assessment.`,
      },
    ],
  };
}

// Generate all pools
console.log('Generating scenario pools...');

const pools = [
  { name: 'scenario-1-pool.json', gen: genScenario1 },
  { name: 'scenario-2-pool.json', gen: genScenario2 },
  { name: 'scenario-3-pool.json', gen: genScenario3 },
  { name: 'scenario-4-pool.json', gen: genScenario4 },
];

for (const pool of pools) {
  const flows = [];
  for (let i = 0; i < 100; i++) {
    flows.push(pool.gen(i));
  }
  const path = join(OUT, pool.name);
  writeFileSync(path, JSON.stringify(flows));
  const size = (JSON.stringify(flows).length / 1024 / 1024).toFixed(2);
  console.log(`  ${pool.name}: ${flows.length} flows, ${size} MB`);
}

console.log('Done!');
