import { ScenarioVariant } from '@/lib/scenarios/types';

export const scenario4Variants: ScenarioVariant[] = [
  {
    merchantName: "LuxTravel Bookings",
    chargeAmount: 2340,
    chargeDate: "March 5th",
    description: "hotel in Bali",
    evidence: "booking confirmation email exists in inbox (human forgot)",
    trueOrigin: "legitimate booking made 6 months ago",
    mcc: "3501 (Hotels/Motels)"
  },
  {
    merchantName: "CloudFit Premium",
    chargeAmount: 899,
    chargeDate: "February 18th",
    description: "annual gym membership renewal",
    evidence: "auto-renewal clause in original signup terms",
    trueOrigin: "auto-renewed membership, human forgot to cancel",
    mcc: "7941 (Health/Fitness Clubs)"
  },
  {
    merchantName: "DigiLearn Academy",
    chargeAmount: 1575,
    chargeDate: "January 22nd",
    description: "online course bundle",
    evidence: "course access logs show 3 modules completed",
    trueOrigin: "human purchased and partially used the course",
    mcc: "5815 (Digital Goods)"
  },
  {
    merchantName: "SkyCharter Jets",
    chargeAmount: 4800,
    chargeDate: "March 12th",
    description: "private transfer booking in Queenstown",
    evidence: "WhatsApp conversation with the charter company on human's phone",
    trueOrigin: "human booked via WhatsApp and forgot, no email confirmation",
    mcc: "4522 (Air Transportation)"
  }
];
