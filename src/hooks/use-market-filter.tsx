
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

// Update the type definition to include 'global'
export type MarketSpecificFeature = {
  id: string;
  markets: InvestmentMarket[];
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  path?: string;
};

// Hook to check if a feature should be shown based on the user's selected market
export function useMarketFilter() {
  const { preferences } = useUserPreferences();
  const userMarket = preferences.investmentMarket || '';
  
  // Function to determine if a feature should be shown
  const shouldShowFeature = (feature: MarketSpecificFeature): boolean => {
    // If no market preference is set, or feature isn't market-specific, show all features
    if (!userMarket || !feature.markets || feature.markets.length === 0) {
      return true;
    }
    
    // Show features that match the user's market or are set to be available in all markets
    return feature.markets.includes(userMarket as InvestmentMarket) || 
           feature.markets.includes('global');
  };
  
  // Function to filter an array of market-specific features
  const filterFeaturesByMarket = <T extends MarketSpecificFeature>(
    features: T[]
  ): T[] => {
    return features.filter(shouldShowFeature);
  };

  // Get display name for current market
  const getMarketDisplayName = (): string => {
    switch(userMarket) {
      case 'germany': return 'German';
      case 'austria': return 'Austrian';
      case 'usa': return 'US';
      case 'canada': return 'Canadian';
      case 'switzerland': return 'Swiss';
      case 'france': return 'French';
      case 'global': return 'Global';
      default: return '';
    }
  };
  
  return {
    shouldShowFeature,
    filterFeaturesByMarket,
    userMarket,
    getMarketDisplayName
  };
}

export default useMarketFilter;
