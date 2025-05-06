
import { InvestmentMarket } from "@/contexts/UserPreferencesContext";

export interface OnboardingData {
  name: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  interests: string[];
  investmentMarket: InvestmentMarket;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}
