
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';

interface FeatureMarketConfig {
  id: string;
  markets?: InvestmentMarket[];
}

export const useMarketFilter = () => {
  const { preferences } = useUserPreferences();
  const userMarket = preferences.investmentMarket || 'global';
  
  const shouldShowFeature = (feature: FeatureMarketConfig): boolean => {
    // If feature has no market restrictions or user has global preference, always show
    if (!feature.markets || feature.markets.includes('global') || userMarket === 'global') {
      return true;
    }
    
    // Check if the feature's markets include the user's selected market
    return feature.markets.includes(userMarket);
  };
  
  const getMarketDisplayName = (): string => {
    switch (userMarket) {
      case 'germany':
        return 'German';
      case 'austria':
        return 'Austrian';
      case 'switzerland':
        return 'Swiss';
      case 'usa':
        return 'US';
      case 'canada':
        return 'Canadian';
      case 'global':
        return 'Global';
      default:
        return 'International';
    }
  };
  
  return {
    userMarket,
    shouldShowFeature,
    getMarketDisplayName
  };
};
