
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useMarketFilter } from '@/hooks/use-market-filter';

const MarketStep: React.FC<OnboardingStepProps> = ({ data, updateData, onNext }) => {
  const { language } = useLanguage();
  const marketFilter = useMarketFilter();
  
  const handleSelection = (value: string) => {
    updateData('investmentMarket', value as InvestmentMarket);
    
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup 
        value={data.investmentMarket} 
        onValueChange={handleSelection}
        className="grid gap-4"
      >
        {marketFilter.getMarketOptions().map((market) => (
          <div 
            key={market.id} 
            className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent"
          >
            <RadioGroupItem value={market.id} id={market.id} />
            <Label htmlFor={market.id} className="cursor-pointer flex-grow">
              <div className="font-medium">{market.name}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default MarketStep;
