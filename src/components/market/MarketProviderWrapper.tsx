
import React from 'react';
import { MarketDataProvider } from '@/contexts/MarketDataContext';

export interface MarketProviderWrapperProps {
  children: React.ReactNode;
  initialMarketData?: Record<string, any>;
}

/**
 * Wrapper component for MarketDataProvider
 * Makes it easy to provide market data context to components
 */
const MarketProviderWrapper: React.FC<MarketProviderWrapperProps> = ({ 
  children,
  initialMarketData
}) => {
  return (
    <MarketDataProvider initialData={initialMarketData}>
      {children}
    </MarketDataProvider>
  );
};

export default MarketProviderWrapper;
