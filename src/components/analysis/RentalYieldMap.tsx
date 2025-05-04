
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const RentalYieldMap: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100 rounded-lg">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="h-5 w-5 bg-red-500 rounded mr-2"></div>
          <div className="h-5 w-5 bg-amber-500 rounded mr-2"></div>
          <div className="h-5 w-5 bg-green-500 rounded"></div>
          <span className="ml-2 text-sm text-muted-foreground">
            {t('lowToHighYield')}
          </span>
        </div>
        <p className="text-gray-500">{t('mapDataLoading')}</p>
        <p className="text-sm text-muted-foreground mt-2">{t('clickNeighborhood')}</p>
      </div>
    </div>
  );
};

export default RentalYieldMap;
