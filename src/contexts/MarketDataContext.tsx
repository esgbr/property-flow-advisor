
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { useComponentPerformance } from '@/utils/performanceUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface PriceData {
  month: string;
  current: number;
  previous: number;
  comparison?: number;
}

interface MarketData {
  trends?: any[];
}

interface MarketDataContextProps {
  priceData: PriceData[];
  rentData: PriceData[];
  yieldData: PriceData[];
  marketOptions: {
    id: string;
    name: string;
  }[];
  selectedTimeRange: '1y' | '3y' | '5y' | 'max';
  selectedMetric: 'price' | 'rent' | 'yield';
  comparisonMarket: string | null;
  marketData: MarketData;
  setSelectedTimeRange: (range: '1y' | '3y' | '5y' | 'max') => void;
  setSelectedMetric: (metric: 'price' | 'rent' | 'yield') => void;
  setComparisonMarket: (market: string | null) => void;
  getActiveData: () => PriceData[];
  getMetricTitle: () => string;
  getMetricDescription: () => string;
  getYAxisLabel: () => string;
  formatYAxisTick: (value: number) => string;
}

const MarketDataContext = createContext<MarketDataContextProps | undefined>(undefined);

interface MarketDataProviderProps {
  children: ReactNode;
  initialData?: MarketData;
}

export const MarketDataProvider: React.FC<MarketDataProviderProps> = ({ children, initialData }) => {
  useComponentPerformance('MarketDataProvider');
  const { t } = useLanguage();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1y' | '3y' | '5y' | 'max'>('1y');
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'rent' | 'yield'>('price');
  const [comparisonMarket, setComparisonMarket] = useState<string | null>(null);
  
  // Sample data - could be fetched from an API in a real application
  const priceData = useMemo(() => [
    { month: 'Jan', current: 380000, previous: 355000, comparison: 420000 },
    { month: 'Feb', current: 382000, previous: 360000, comparison: 425000 },
    { month: 'Mar', current: 385000, previous: 365000, comparison: 430000 },
    { month: 'Apr', current: 390000, previous: 368000, comparison: 435000 },
    { month: 'May', current: 395000, previous: 370000, comparison: 437000 },
    { month: 'Jun', current: 400000, previous: 373000, comparison: 440000 },
    { month: 'Jul', current: 405000, previous: 377000, comparison: 442000 },
    { month: 'Aug', current: 408000, previous: 380000, comparison: 445000 },
    { month: 'Sep', current: 407000, previous: 382000, comparison: 446000 },
    { month: 'Oct', current: 410000, previous: 384000, comparison: 448000 },
    { month: 'Nov', current: 415000, previous: 386000, comparison: 450000 },
    { month: 'Dec', current: 420000, previous: 390000, comparison: 455000 },
  ], []);

  const rentData = useMemo(() => [
    { month: 'Jan', current: 1800, previous: 1650, comparison: 2100 },
    { month: 'Feb', current: 1820, previous: 1670, comparison: 2120 },
    { month: 'Mar', current: 1850, previous: 1690, comparison: 2150 },
    { month: 'Apr', current: 1870, previous: 1710, comparison: 2170 },
    { month: 'May', current: 1900, previous: 1730, comparison: 2200 },
    { month: 'Jun', current: 1920, previous: 1750, comparison: 2220 },
    { month: 'Jul', current: 1950, previous: 1770, comparison: 2240 },
    { month: 'Aug', current: 1970, previous: 1790, comparison: 2260 },
    { month: 'Sep', current: 1980, previous: 1800, comparison: 2270 },
    { month: 'Oct', current: 2000, previous: 1820, comparison: 2290 },
    { month: 'Nov', current: 2020, previous: 1840, comparison: 2300 },
    { month: 'Dec', current: 2040, previous: 1860, comparison: 2320 },
  ], []);

  const yieldData = useMemo(() => [
    { month: 'Jan', current: 5.7, previous: 5.6, comparison: 6.0 },
    { month: 'Feb', current: 5.7, previous: 5.6, comparison: 6.0 },
    { month: 'Mar', current: 5.8, previous: 5.6, comparison: 6.0 },
    { month: 'Apr', current: 5.8, previous: 5.6, comparison: 6.0 },
    { month: 'May', current: 5.8, previous: 5.6, comparison: 6.1 },
    { month: 'Jun', current: 5.8, previous: 5.6, comparison: 6.1 },
    { month: 'Jul', current: 5.8, previous: 5.6, comparison: 6.1 },
    { month: 'Aug', current: 5.9, previous: 5.7, comparison: 6.1 },
    { month: 'Sep', current: 5.9, previous: 5.7, comparison: 6.1 },
    { month: 'Oct', current: 5.9, previous: 5.7, comparison: 6.1 },
    { month: 'Nov', current: 5.9, previous: 5.7, comparison: 6.2 },
    { month: 'Dec', current: 6.0, previous: 5.7, comparison: 6.2 },
  ], []);

  const marketOptions = useMemo(() => [
    { id: 'germany', name: 'Germany' },
    { id: 'usa', name: 'USA' },
    { id: 'france', name: 'France' },
    { id: 'spain', name: 'Spain' },
  ], []);

  // Add market data with defaults and any initial data provided
  const marketData = useMemo(() => {
    const defaultMarketData: MarketData = {
      trends: [
        { name: '2018', german: 100, european: 100, global: 100 },
        { name: '2019', german: 106, european: 104, global: 105 },
        { name: '2020', german: 110, european: 105, global: 104 },
        { name: '2021', german: 118, european: 112, global: 110 },
        { name: '2022', german: 124, european: 115, global: 112 },
        { name: '2023', german: 128, european: 119, global: 116 },
        { name: '2024', german: 132, european: 122, global: 119 }
      ]
    };

    return {
      ...defaultMarketData,
      ...initialData
    };
  }, [initialData]);

  const getActiveData = () => {
    switch(selectedMetric) {
      case 'rent':
        return rentData;
      case 'yield':
        return yieldData;
      case 'price':
      default:
        return priceData;
    }
  };

  const getMetricTitle = () => {
    switch(selectedMetric) {
      case 'rent':
        return t('Rental Price Trends');
      case 'yield':
        return t('Rental Yield Trends');
      case 'price':
      default:
        return t('Property Price Trends');
    }
  };

  const getMetricDescription = () => {
    switch(selectedMetric) {
      case 'rent':
        return t('Average monthly rental prices');
      case 'yield':
        return t('Average rental yield percentages');
      case 'price':
      default:
        return t('Average property purchase prices');
    }
  };

  const getYAxisLabel = () => {
    switch(selectedMetric) {
      case 'rent':
        return t('Rent (€)');
      case 'yield':
        return t('Yield (%)');
      case 'price':
      default:
        return t('Price (€)');
    }
  };

  const formatYAxisTick = (value: number) => {
    switch(selectedMetric) {
      case 'rent':
        return `€${value}`;
      case 'yield':
        return `${value}%`;
      case 'price':
      default:
        return value >= 1000000 
          ? `€${(value / 1000000).toFixed(1)}M` 
          : `€${(value / 1000).toFixed(0)}K`;
    }
  };

  const value = {
    priceData,
    rentData,
    yieldData,
    marketOptions,
    selectedTimeRange,
    selectedMetric,
    comparisonMarket,
    marketData,
    setSelectedTimeRange,
    setSelectedMetric,
    setComparisonMarket,
    getActiveData,
    getMetricTitle,
    getMetricDescription,
    getYAxisLabel,
    formatYAxisTick
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = (): MarketDataContextProps => {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};
