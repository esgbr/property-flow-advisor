
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import InvestorDashboard from '@/pages/InvestorDashboard';

const InvestorToolsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-4">
      <InvestorDashboard />
    </div>
  );
};

export default InvestorToolsPage;
