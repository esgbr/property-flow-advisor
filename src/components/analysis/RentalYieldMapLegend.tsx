
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RentalYieldMapLegendProps {
  showHeading?: boolean;
}

const RentalYieldMapLegend: React.FC<RentalYieldMapLegendProps> = ({ showHeading = false }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center">
      {showHeading && (
        <h4 className="text-sm font-medium mb-2">{t('Rental Yield Legend')}</h4>
      )}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-red-500 rounded mr-2"></div>
          <span className="text-sm text-muted-foreground">{'<'}5%</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-amber-500 rounded mr-2"></div>
          <span className="text-sm text-muted-foreground">5-6%</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-muted-foreground">{'>'}6%</span>
        </div>
      </div>
    </div>
  );
};

export default RentalYieldMapLegend;
