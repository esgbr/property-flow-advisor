
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

// Market-specific feature type
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
      case 'switzerland': return 'Swiss';
      case 'france': return 'French';
      case 'usa': return 'US';
      case 'canada': return 'Canadian';
      case 'global': return 'Global';
      case 'other': return 'International';
      default: return '';
    }
  };
  
  // Get available markets for filtering
  const getAvailableMarkets = (): {id: InvestmentMarket, name: string}[] => {
    return [
      { id: 'germany', name: 'Germany' },
      { id: 'austria', name: 'Austria' },
      { id: 'switzerland', name: 'Switzerland' },
      { id: 'france', name: 'France' },
      { id: 'usa', name: 'USA' },
      { id: 'canada', name: 'Canada' },
      { id: 'global', name: 'Global' },
      { id: 'other', name: 'Other' }
    ];
  };
  
  return {
    shouldShowFeature,
    filterFeaturesByMarket,
    userMarket,
    getMarketDisplayName,
    getAvailableMarkets
  };
}

export default useMarketFilter;
