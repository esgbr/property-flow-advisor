
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

export interface OnboardingData {
  name?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  interests: string[];
  investmentMarket: InvestmentMarket;
}

export interface OnboardingStepProps {
  data: OnboardingData;
  updateData: (data: OnboardingData) => void;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}
