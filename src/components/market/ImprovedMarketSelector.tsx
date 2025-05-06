
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedMarketName } from '@/utils/marketHelpers';

interface ImprovedMarketSelectorProps {
  onMarketChange: (market: InvestmentMarket) => void;
  defaultValue?: InvestmentMarket;
  className?: string;
  showLabel?: boolean;
}

const ImprovedMarketSelector: React.FC<ImprovedMarketSelectorProps> = ({
  onMarketChange,
  defaultValue = 'germany',
  className = '',
  showLabel = false
}) => {
  const { language } = useLanguage();
  
  const markets: InvestmentMarket[] = ['germany', 'austria', 'switzerland', 'netherlands'];
  
  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium mb-2">
          {language === 'de' ? 'Markt auswählen' : 'Select Market'}
        </label>
      )}
      <Select 
        defaultValue={defaultValue} 
        onValueChange={(value) => onMarketChange(value as InvestmentMarket)}
      >
        <SelectTrigger>
          <SelectValue placeholder={language === 'de' ? 'Markt auswählen' : 'Select market'} />
        </SelectTrigger>
        <SelectContent>
          {markets.map((market) => (
            <SelectItem key={market} value={market}>
              {getLocalizedMarketName(market, language)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ImprovedMarketSelector;
