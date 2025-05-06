
import React from 'react';
import { Check, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { cn } from '@/lib/utils';

interface MarketSelectorProps {
  onChange?: (market: InvestmentMarket) => void;
  minimal?: boolean;
  appearance?: 'default' | 'mini' | 'inline';
  className?: string;
}

const MarketSelector = ({
  onChange,
  minimal = false,
  appearance = 'default',
  className = ''
}: MarketSelectorProps) => {
  const { language, t } = useLanguage();
  const { preferences, updatePreferences } = useUserPreferences();
  const { getMarketOptions, getMarketDisplayName } = useMarketFilter();
  
  const handleMarketChange = (market: InvestmentMarket) => {
    updatePreferences({
      marketFilter: market
    });
    
    if (onChange) {
      onChange(market);
    }
  };
  
  if (minimal) {
    return (
      <Select 
        value={preferences.marketFilter} 
        onValueChange={handleMarketChange}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {getMarketOptions().map(option => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  
  if (appearance === 'mini') {
    return (
      <div className={cn("flex items-center gap-1 text-xs", className)}>
        <Globe className="h-3 w-3 opacity-70" />
        <span className="opacity-70">{t('market')}:</span>
        <span className="font-medium">
          {getMarketDisplayName()}
        </span>
      </div>
    );
  }
  
  if (appearance === 'inline') {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {getMarketOptions().map(option => (
          <button
            key={option.id}
            className={cn(
              "px-2 py-1 text-xs rounded-full border transition-colors",
              preferences.marketFilter === option.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted/50 border-muted"
            )}
            onClick={() => handleMarketChange(option.id as InvestmentMarket)}
          >
            {preferences.marketFilter === option.id && (
              <Check className="h-3 w-3 inline mr-1" />
            )}
            {option.name}
          </button>
        ))}
      </div>
    );
  }
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">
        {t('selectMarket')}
      </label>
      <Select 
        value={preferences.marketFilter} 
        onValueChange={handleMarketChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {getMarketOptions().map(option => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MarketSelector;
