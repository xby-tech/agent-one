import { ScenarioVariant } from '@/lib/scenarios/types';

export const scenario2Variants: ScenarioVariant[] = [
  {
    subscriptions: ["Netflix", "Spotify", "Adobe Creative Cloud", "AWS", "The Athletic"],
    expiringCard: "4521",
    expiryMonth: "next month",
    declinedService: "Netflix",
    fxService: "Adobe",
    fxCurrency: "USD",
    anomalyService: "AWS",
    anomalyAmount: 847,
    normalAmount: 200,
    travelDuration: "3 months"
  },
  {
    subscriptions: ["Disney+", "YouTube Premium", "Figma", "Google Cloud", "NYT"],
    expiringCard: "8834",
    expiryMonth: "next month",
    declinedService: "Figma",
    fxService: "NYT",
    fxCurrency: "USD",
    anomalyService: "Google Cloud",
    anomalyAmount: 1230,
    normalAmount: 340,
    travelDuration: "6 weeks"
  },
  {
    subscriptions: ["Stan", "Apple Music", "Notion", "Azure", "Bloomberg"],
    expiringCard: "2216",
    expiryMonth: "next month",
    declinedService: "Apple Music",
    fxService: "Bloomberg",
    fxCurrency: "USD",
    anomalyService: "Azure",
    anomalyAmount: 562,
    normalAmount: 150,
    travelDuration: "2 months"
  }
];
