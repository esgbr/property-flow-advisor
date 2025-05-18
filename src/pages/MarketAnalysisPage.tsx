
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MarketAnalysisDashboard from '@/pages/MarketAnalysisDashboard';

const MarketAnalysisPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-4">
      <MarketAnalysisDashboard />
    </div>
  );
};

export default MarketAnalysisPage;
