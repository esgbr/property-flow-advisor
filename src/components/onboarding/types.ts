
export type Language = 'en' | 'de';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type InvestmentMarket = 'global' | 'germany' | 'usa' | 'austria' | 'switzerland' | 'canada';
export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land' | 'multi-family';
export type InvestmentGoal = 'passive-income' | 'wealth-building' | 'tax-benefits' | 'diversification';

export interface OnboardingData {
  name: string;
  email?: string;
  language: Language;
  experienceLevel: ExperienceLevel;
  investmentMarket: InvestmentMarket;
  preferredPropertyTypes: PropertyType[];
  investmentGoals: InvestmentGoal[];
  completedAt?: string;
}
