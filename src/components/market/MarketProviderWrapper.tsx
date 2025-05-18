
import React from 'react';
import { MarketDataProvider } from '@/contexts/MarketDataContext';

interface MarketProviderWrapperProps {
  children: React.ReactNode;
}

const MarketProviderWrapper: React.FC<MarketProviderWrapperProps> = ({ children }) => {
  return (
    <MarketDataProvider>
      {children}
    </MarketDataProvider>
  );
};

export default MarketProviderWrapper;
