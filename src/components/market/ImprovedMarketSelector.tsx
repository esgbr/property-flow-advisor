
import React, { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedMarketName } from '@/utils/marketHelpers';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Building, TrendingUp, MapPin } from 'lucide-react';

interface ImprovedMarketSelectorProps {
  onMarketChange: (market: InvestmentMarket) => void;
  defaultValue?: InvestmentMarket;
  className?: string;
  showLabel?: boolean;
  showBadge?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'compact';
}

const ImprovedMarketSelector: React.FC<ImprovedMarketSelectorProps> = ({
  onMarketChange,
  defaultValue = 'germany',
  className = '',
  showLabel = false,
  showBadge = false,
  size = 'default',
  variant = 'default'
}) => {
  const { language } = useLanguage();
  const [selectedMarket, setSelectedMarket] = useState<InvestmentMarket>(defaultValue);
  
  const handleMarketChange = (value: string) => {
    const market = value as InvestmentMarket;
    setSelectedMarket(market);
    onMarketChange(market);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // The Select component from shadcn/ui handles the opening when triggered
    }
  };
  
  // Define market regions for grouping
  const europeanMarkets = ['germany', 'austria', 'switzerland', 'uk', 'europe'];
  const northAmericanMarkets = ['usa', 'canada'];
  const globalMarkets = ['global'];

  // Helper function to get market growth indicator
  const getMarketGrowthIndicator = (market: InvestmentMarket) => {
    // This would ideally come from a real data source
    const growthIndicators: Record<InvestmentMarket, { trend: 'up' | 'down' | 'stable', value: number }> = {
      'germany': { trend: 'up', value: 3.2 },
      'austria': { trend: 'up', value: 2.8 },
      'switzerland': { trend: 'stable', value: 1.5 },
      'usa': { trend: 'up', value: 4.3 },
      'canada': { trend: 'up', value: 3.5 },
      'global': { trend: 'stable', value: 2.7 },
      'uk': { trend: 'down', value: 1.2 },
      'europe': { trend: 'stable', value: 2.1 }
    };
    
    return growthIndicators[market] || { trend: 'stable', value: 0 };
  };
  
  const availableMarkets: InvestmentMarketOption[] = [
    { id: 'germany', name: 'Germany' },
    { id: 'austria', name: 'Austria' },
    { id: 'switzerland', name: 'Switzerland' },
    { id: 'usa', name: 'USA' },
    { id: 'canada', name: 'Canada' },
    { id: 'global', name: 'Global' },
    { id: 'uk', name: 'United Kingdom' },
    { id: 'europe', name: 'Europe' }
  ];
  
  const renderMarketItem = (market: InvestmentMarketOption) => {
    const growth = getMarketGrowthIndicator(market.id);
    
    return (
      <SelectItem key={market.id} value={market.id} className="flex items-center py-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{getLocalizedMarketName(market.id, language)}</span>
          </div>
          
          {variant !== 'compact' && (
            <div className="flex items-center">
              <TrendingUp 
                className={`h-3.5 w-3.5 ml-2 ${
                  growth.trend === 'up' ? 'text-green-500' : 
                  growth.trend === 'down' ? 'text-red-500 transform rotate-180' : 
                  'text-amber-500'
                }`} 
              />
              <span className={`text-xs ml-1 ${
                growth.trend === 'up' ? 'text-green-500' : 
                growth.trend === 'down' ? 'text-red-500' : 
                'text-amber-500'
              }`}>
                {growth.value}%
              </span>
            </div>
          )}
        </div>
      </SelectItem>
    );
  };

  // Classes based on size
  const sizeClasses = {
    sm: "h-8 text-sm",
    default: "h-10",
    lg: "h-12 text-lg"
  };
  
  const labelId = `market-selector-${Math.random().toString(36).substring(7)}`;
  
  return (
    <div className={className}>
      {showLabel && (
        <label htmlFor={labelId} className="block text-sm font-medium mb-2">
          {language === 'de' ? 'Markt auswählen' : 'Select Market'}
        </label>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Select 
                value={selectedMarket} 
                onValueChange={handleMarketChange}
                onKeyDown={handleKeyDown}
              >
                <SelectTrigger 
                  id={labelId}
                  className={`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${sizeClasses[size]}`}
                  aria-label={language === 'de' ? 'Wo möchten Sie investieren' : 'Where do you want to invest'}
                >
                  <SelectValue placeholder={language === 'de' ? 'Markt auswählen' : 'Select market'}>
                    <div className="flex items-center gap-2">
                      {showBadge && (
                        <Badge variant="outline" className="font-normal">
                          <Building className="h-3 w-3 mr-1" />
                          {language === 'de' ? 'Markt' : 'Market'}
                        </Badge>
                      )}
                      {getLocalizedMarketName(selectedMarket, language)}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel>{language === 'de' ? 'Europa' : 'Europe'}</SelectLabel>
                    {availableMarkets
                      .filter(market => europeanMarkets.includes(market.id))
                      .map(market => renderMarketItem(market))}
                  </SelectGroup>
                  
                  <SelectGroup>
                    <SelectLabel>{language === 'de' ? 'Nordamerika' : 'North America'}</SelectLabel>
                    {availableMarkets
                      .filter(market => northAmericanMarkets.includes(market.id))
                      .map(market => renderMarketItem(market))}
                  </SelectGroup>
                  
                  <SelectGroup>
                    <SelectLabel>{language === 'de' ? 'Global' : 'Global'}</SelectLabel>
                    {availableMarkets
                      .filter(market => globalMarkets.includes(market.id))
                      .map(market => renderMarketItem(market))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {language === 'de' 
                ? `Wachstumsprognose für ${getLocalizedMarketName(selectedMarket, language)}: ${getMarketGrowthIndicator(selectedMarket).value}%` 
                : `Growth forecast for ${getLocalizedMarketName(selectedMarket, language)}: ${getMarketGrowthIndicator(selectedMarket).value}%`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ImprovedMarketSelector;
