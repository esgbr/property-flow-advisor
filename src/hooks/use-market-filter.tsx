
import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMarketDisplayName, getLocalizedMarketName } from '@/utils/marketHelpers';

export const useMarketFilter = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language } = useLanguage();
  const [userMarket, setUserMarketState] = useState<InvestmentMarket>(
    preferences.investmentMarket || 'global'
  );

  // Synchronize local state with user preferences
  useEffect(() => {
    if (preferences.investmentMarket && preferences.investmentMarket !== userMarket) {
      setUserMarketState(preferences.investmentMarket);
    }
  }, [preferences.investmentMarket, userMarket]);

  // Set market and update preferences
  const setUserMarket = useCallback((market: InvestmentMarket) => {
    setUserMarketState(market);
    updatePreferences({ investmentMarket: market });
  }, [updatePreferences]);

  // Get formatted market name
  const getMarketDisplayNameFormatted = useCallback(() => {
    return getMarketDisplayName(userMarket);
  }, [userMarket]);

  // Get localized market name
  const getLocalizedMarketNameFormatted = useCallback(() => {
    return getLocalizedMarketName(userMarket, language);
  }, [userMarket, language]);

  return {
    userMarket,
    setUserMarket,
    getMarketDisplayName: getMarketDisplayNameFormatted,
    getLocalizedMarketName: getLocalizedMarketNameFormatted,
    shouldShowFeature: (feature: any) => true, // Simplified implementation
    filterFeaturesByMarket: <T extends any>(features: T[]) => features, // Simplified implementation
    getAvailableMarkets: () => [] // Simplified implementation
  };
};
