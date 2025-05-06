import { useState, useEffect } from 'react';
import { InvestmentMarket, useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';

export interface MarketMetric {
  averagePrice: number;
  averageRent: number;
  rentalYield: number;
  yearOverYearGrowth: number;
  vacancy: number;
  affordabilityIndex: number;
  investmentVolume: number;
  salesVolume: number;
  constructionActivity: number;
  marketSentiment: number;
}

export const useMarketComparison = () => {
  const { language } = useLanguage();
  const { preferences } = useUserPreferences();
  const [primaryMarket, setPrimaryMarket] = useState<InvestmentMarket>(preferences.investmentMarket || 'germany');
  const [comparisonMarket, setComparisonMarket] = useState<InvestmentMarket>(preferences.investmentMarket === 'germany' ? 'austria' : 'germany');
  const [marketMetrics, setMarketMetrics] = useState<Record<InvestmentMarket, MarketMetric>>({
    germany: {
      averagePrice: 350000,
      averageRent: 12.5,
      rentalYield: 3.8,
      yearOverYearGrowth: 5.2,
      vacancy: 2.1,
      affordabilityIndex: 7.2,
      investmentVolume: 78000000000,
      salesVolume: 620000,
      constructionActivity: 306000,
      marketSentiment: 7.4
    },
    austria: {
      averagePrice: 320000,
      averageRent: 10.2,
      rentalYield: 3.5,
      yearOverYearGrowth: 4.8,
      vacancy: 3.2,
      affordabilityIndex: 6.9,
      investmentVolume: 12000000000,
      salesVolume: 95000,
      constructionActivity: 65000,
      marketSentiment: 7.1
    },
    switzerland: {
      averagePrice: 685000,
      averageRent: 18.6,
      rentalYield: 3.2,
      yearOverYearGrowth: 3.5,
      vacancy: 1.8,
      affordabilityIndex: 9.8,
      investmentVolume: 24000000000,
      salesVolume: 78000,
      constructionActivity: 53000,
      marketSentiment: 8.2
    },
    usa: {
      averagePrice: 428000,
      averageRent: 16.8,
      rentalYield: 4.2,
      yearOverYearGrowth: 6.5,
      vacancy: 5.6,
      affordabilityIndex: 5.4,
      investmentVolume: 632000000000,
      salesVolume: 5750000,
      constructionActivity: 1450000,
      marketSentiment: 6.8
    },
    canada: {
      averagePrice: 520000,
      averageRent: 14.5,
      rentalYield: 3.9,
      yearOverYearGrowth: 5.8,
      vacancy: 3.0,
      affordabilityIndex: 6.1,
      investmentVolume: 95000000000,
      salesVolume: 540000,
      constructionActivity: 235000,
      marketSentiment: 7.0
    },
    global: {
      averagePrice: 380000,
      averageRent: 14.0,
      rentalYield: 4.0,
      yearOverYearGrowth: 5.5,
      vacancy: 4.0,
      affordabilityIndex: 6.5,
      investmentVolume: 970000000000,
      salesVolume: 8500000,
      constructionActivity: 2000000,
      marketSentiment: 7.2
    },
    uk: {
      averagePrice: 310000,
      averageRent: 15.3,
      rentalYield: 4.1,
      yearOverYearGrowth: 2.8,
      vacancy: 2.3,
      affordabilityIndex: 8.2,
      investmentVolume: 55000000000,
      salesVolume: 1200000,
      constructionActivity: 180000,
      marketSentiment: 6.5
    },
    europe: {
      averagePrice: 295000,
      averageRent: 13.1,
      rentalYield: 3.7,
      yearOverYearGrowth: 3.2,
      vacancy: 2.7,
      affordabilityIndex: 7.5,
      investmentVolume: 342000000000,
      salesVolume: 3800000,
      constructionActivity: 1250000,
      marketSentiment: 6.9
    }
  });

  useEffect(() => {
    if (preferences.investmentMarket) {
      setPrimaryMarket(preferences.investmentMarket);
    }
  }, [preferences.investmentMarket]);

  const setMarket = (market: InvestmentMarket, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryMarket(market);
    } else {
      setComparisonMarket(market);
    }
  };

  const getMarketMetric = (market: InvestmentMarket): MarketMetric => {
    return marketMetrics[market] || marketMetrics['global'];
  };

  return {
    primaryMarket,
    comparisonMarket,
    setMarket,
    getMarketMetric,
    marketMetrics
  };
};
