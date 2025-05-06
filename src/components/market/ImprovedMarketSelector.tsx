
import React, { useState } from 'react';
import { Check, Globe, Search, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';
import { useEnhancedMarket } from '@/hooks/use-enhanced-market';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImprovedMarketSelectorProps {
  onChange?: (market: InvestmentMarket) => void;
  minimal?: boolean;
  appearance?: 'default' | 'mini' | 'inline' | 'expanded';
  className?: string;
  showPopular?: boolean;
}

export const ImprovedMarketSelector: React.FC<ImprovedMarketSelectorProps> = ({
  onChange,
  minimal = false,
  appearance = 'default',
  className = '',
  showPopular = false
}) => {
  const { language, t } = useLanguage();
  const {
    currentMarket,
    setMarket,
    getAllMarkets,
    getCurrentMarketDisplayName,
    getRecommendedMarkets
  } = useEnhancedMarket();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const allMarkets = getAllMarkets();
  const recommendedMarkets = getRecommendedMarkets();
  
  const filteredMarkets = searchTerm 
    ? allMarkets.filter(market => 
        market.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : allMarkets;
  
  const handleMarketChange = (market: InvestmentMarket) => {
    setMarket(market);
    
    if (onChange) {
      onChange(market);
    }
    
    // Close expanded view after selection
    setIsExpanded(false);
  };
  
  if (minimal) {
    return (
      <Select 
        value={currentMarket} 
        onValueChange={handleMarketChange}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {allMarkets.map(option => (
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
          {getCurrentMarketDisplayName()}
        </span>
      </div>
    );
  }
  
  if (appearance === 'inline') {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {allMarkets.map(option => (
          <button
            key={option.id}
            className={cn(
              "px-2 py-1 text-xs rounded-full border transition-colors",
              currentMarket === option.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted/50 border-muted"
            )}
            onClick={() => handleMarketChange(option.id as InvestmentMarket)}
            aria-pressed={currentMarket === option.id}
          >
            {currentMarket === option.id && (
              <Check className="h-3 w-3 inline mr-1" />
            )}
            {option.name}
          </button>
        ))}
      </div>
    );
  }
  
  if (appearance === 'expanded' || isExpanded) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {t('selectMarket')}
            </h3>
            {appearance !== 'expanded' && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setIsExpanded(false)}
              >
                {t('close')}
              </Button>
            )}
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('searchMarkets')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {showPopular && searchTerm === '' && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {t('recommendedMarkets')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendedMarkets.map(market => (
                  <Badge 
                    key={market.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => handleMarketChange(market.id as InvestmentMarket)}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {market.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {filteredMarkets.map(option => (
              <button
                key={option.id}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-left transition-colors",
                  currentMarket === option.id
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
                onClick={() => handleMarketChange(option.id as InvestmentMarket)}
              >
                <Globe className="h-4 w-4 mr-2" />
                <span>{option.name}</span>
                {currentMarket === option.id && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </button>
            ))}
            
            {filteredMarkets.length === 0 && (
              <div className="col-span-2 text-center py-4 text-muted-foreground">
                {t('noMarketsFound')}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium mb-1">
          {t('selectMarket')}
        </label>
        
        {/* Expand button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-6 px-2"
          onClick={() => setIsExpanded(true)}
        >
          {t('moreOptions')}
        </Button>
      </div>
      
      <Select 
        value={currentMarket} 
        onValueChange={handleMarketChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {allMarkets.map(option => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ImprovedMarketSelector;
