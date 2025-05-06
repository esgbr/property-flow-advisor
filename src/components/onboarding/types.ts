
import { InvestmentMarket } from "@/contexts/UserPreferencesContext";

export interface OnboardingData {
  name: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  interests: string[];
  investmentMarket: InvestmentMarket;
  investmentPreference: 'growth' | 'income' | 'balanced' | 'conservative' | 'aggressive';
  goals: string[];
  propertyTypes: string[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export interface OnboardingStepProps {
  data: Partial<OnboardingData>;
  updateData: (fieldName: keyof OnboardingData, value: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}
