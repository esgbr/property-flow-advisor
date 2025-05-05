
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

  // Synchronisiere lokalen State mit User-Preferences
  useEffect(() => {
    if (preferences.investmentMarket) {
      setUserMarketState(preferences.investmentMarket);
    }
  }, [preferences.investmentMarket]);

  // Setze Markt und aktualisiere Preferences
  const setUserMarket = useCallback((market: InvestmentMarket) => {
    setUserMarketState(market);
    updatePreferences({ investmentMarket: market });
  }, [updatePreferences]);

  // Hole formatierten Marktnamen 
  const getMarketDisplayNameFormatted = useCallback(() => {
    return getMarketDisplayName(userMarket);
  }, [userMarket]);

  // Hole lokalisierten Marktnamen
  const getLocalizedMarketNameFormatted = useCallback(() => {
    return getLocalizedMarketName(userMarket, language);
  }, [userMarket, language]);

  return {
    userMarket,
    setUserMarket,
    getMarketDisplayName: getMarketDisplayNameFormatted,
    getLocalizedMarketName: getLocalizedMarketNameFormatted
  };
};
