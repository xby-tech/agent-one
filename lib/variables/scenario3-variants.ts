import { ScenarioVariant } from '@/lib/scenarios/types';

export const scenario3Variants: ScenarioVariant[] = [
  {
    recipientName: "Yousuf",
    recipientRelation: "father",
    recipientCity: "Lahore",
    recipientCountry: "Pakistan",
    recipientBank: "MCB Bank",
    recipientAccount: "0023-XXXXXXXX-01",
    currency: "PKR",
    amount: 500000,
    purpose: "medical expenses",
    deadline: "24 hours",
    corridor: "AUD-PKR",
    complianceRisk: "enhanced screening (common for Pakistan corridor)"
  },
  {
    recipientName: "Maria",
    recipientRelation: "sister",
    recipientCity: "Manila",
    recipientCountry: "Philippines",
    recipientBank: "BDO Unibank",
    recipientAccount: "0045-XXXXXXXX-88",
    currency: "PHP",
    amount: 150000,
    purpose: "tuition fees",
    deadline: "48 hours",
    corridor: "AUD-PHP",
    complianceRisk: "standard screening"
  },
  {
    recipientName: "Ahmed",
    recipientRelation: "brother",
    recipientCity: "Dubai",
    recipientCountry: "UAE",
    recipientBank: "Emirates NBD",
    recipientAccount: "AE07-XXXX-XXXX-XXXX-001",
    currency: "AED",
    amount: 25000,
    purpose: "business investment",
    deadline: "same day",
    corridor: "AUD-AED",
    complianceRisk: "source of funds required (business purpose)"
  },
  {
    recipientName: "Priya",
    recipientRelation: "mother",
    recipientCity: "Chennai",
    recipientCountry: "India",
    recipientBank: "HDFC Bank",
    recipientAccount: "5020-XXXXXXXX-77",
    currency: "INR",
    amount: 800000,
    purpose: "property registration fees",
    deadline: "24 hours",
    corridor: "AUD-INR",
    complianceRisk: "enhanced screening (large amount, property transaction)"
  }
];
