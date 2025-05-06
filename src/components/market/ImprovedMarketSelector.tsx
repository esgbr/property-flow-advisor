
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Globe, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEnhancedMarket } from '@/hooks/use-enhanced-market';
import { InvestmentMarket, InvestmentMarketOption } from '@/contexts/UserPreferencesContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface ImprovedMarketSelectorProps {
  onMarketChange: (market: InvestmentMarket) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showRecentlyVisited?: boolean;
}

const ImprovedMarketSelector: React.FC<ImprovedMarketSelectorProps> = ({
  onMarketChange,
  className,
  variant = 'default',
  showRecentlyVisited = true
}) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { 
    currentMarket, 
    getAllMarkets, 
    getMarketsByRegion,
    getCurrentMarketDisplayName,
    getCurrentMarketLocalizedName,
    trackMarketVisit
  } = useEnhancedMarket();
  
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [recentMarkets, setRecentMarkets] = useState<InvestmentMarketOption[]>([]);
  
  // All available markets
  const allMarkets = getAllMarkets();
  
  // Group markets by region
  const europeanMarkets = getMarketsByRegion('europe');
  const northAmericanMarkets = getMarketsByRegion('northAmerica');
  
  // Get all recently visited markets
  useEffect(() => {
    const { preferences } = require('@/contexts/UserPreferencesContext').useUserPreferences();
    const recentMarketIds = preferences.recentMarkets || [];
    
    if (recentMarketIds && recentMarketIds.length > 0) {
      const recentOptions = allMarkets.filter(market => 
        recentMarketIds.includes(market.id as InvestmentMarket)
      );
      setRecentMarkets(recentOptions);
    }
  }, [allMarkets]);
  
  // Handle market selection
  const handleSelectMarket = (marketId: string) => {
    const market = marketId as InvestmentMarket;
    
    // Track this market visit
    trackMarketVisit(market);
    
    // Notify about market change
    onMarketChange(market);
    
    // Close the popover
    setOpen(false);
    
    // Show notification
    toast({
      title: t('marketChanged'),
      description: `${t('nowViewing')} ${getLocalizedName(market)}`
    });
  };
  
  // Get localized market name
  const getLocalizedName = (marketId: InvestmentMarket): string => {
    const market = allMarkets.find(m => m.id === marketId);
    if (!market) return marketId;
    
    return language === 'de' ? 
      getLocalizedNameInGerman(market.name) : 
      market.name;
  };
  
  // Translate common market names to German
  const getLocalizedNameInGerman = (name: string): string => {
    const translations: Record<string, string> = {
      'Global': 'Global',
      'Germany': 'Deutschland',
      'Austria': 'Österreich',
      'Switzerland': 'Schweiz',
      'France': 'Frankreich',
      'USA': 'USA',
      'Canada': 'Kanada',
      'Other': 'Andere'
    };
    
    return translations[name] || name;
  };
  
  // Render different variants
  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className={cn("flex items-center gap-1 text-xs", className)}
      >
        <Globe className="h-3 w-3" />
        <span>{getLocalizedName(currentMarket)}</span>
      </Button>
    );
  }
  
  if (variant === 'compact') {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open}
            size="sm"
            className={cn("flex items-center gap-1", className)}
          >
            <MapPin className="h-4 w-4" />
            {getLocalizedName(currentMarket)}
            <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandList>
              <CommandGroup heading={t('markets')}>
                {allMarkets.map((market) => (
                  <CommandItem
                    key={market.id}
                    value={market.id}
                    onSelect={() => handleSelectMarket(market.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentMarket === market.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {getLocalizedName(market.id as InvestmentMarket)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
  
  // Default full-featured variant
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {getCurrentMarketLocalizedName()}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center border-b px-3">
            <TabsList className="h-10">
              <TabsTrigger value="all" className="text-xs px-3">
                {t('allMarkets')}
              </TabsTrigger>
              <TabsTrigger value="europe" className="text-xs px-3">
                {language === 'de' ? 'Europa' : 'Europe'}
              </TabsTrigger>
              <TabsTrigger value="northAmerica" className="text-xs px-3">
                {language === 'de' ? 'Nordamerika' : 'North America'}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <Command>
            <CommandInput placeholder={t('searchMarkets')} className="h-9" />
            <CommandList>
              <CommandEmpty>{t('noMarketFound')}</CommandEmpty>
              
              <TabsContent value="all" className="mt-0 p-0 border-0">
                {showRecentlyVisited && recentMarkets.length > 0 && (
                  <CommandGroup heading={t('recentlyVisited')}>
                    {recentMarkets.map((market) => (
                      <CommandItem
                        key={market.id}
                        value={market.name}
                        onSelect={() => handleSelectMarket(market.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentMarket === market.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {getLocalizedName(market.id as InvestmentMarket)}
                        {market.id === currentMarket && (
                          <Badge variant="outline" className="ml-2 text-[10px]">
                            {t('current')}
                          </Badge>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                <CommandGroup heading={t('allMarkets')}>
                  {allMarkets.map((market) => (
                    <CommandItem
                      key={market.id}
                      value={market.name}
                      onSelect={() => handleSelectMarket(market.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentMarket === market.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {getLocalizedName(market.id as InvestmentMarket)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </TabsContent>
              
              <TabsContent value="europe" className="mt-0 p-0 border-0">
                <CommandGroup heading={language === 'de' ? 'Europäische Märkte' : 'European Markets'}>
                  {europeanMarkets.map((market) => (
                    <CommandItem
                      key={market.id}
                      value={market.name}
                      onSelect={() => handleSelectMarket(market.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentMarket === market.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {getLocalizedName(market.id as InvestmentMarket)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </TabsContent>
              
              <TabsContent value="northAmerica" className="mt-0 p-0 border-0">
                <CommandGroup heading={language === 'de' ? 'Nordamerikanische Märkte' : 'North American Markets'}>
                  {northAmericanMarkets.map((market) => (
                    <CommandItem
                      key={market.id}
                      value={market.name}
                      onSelect={() => handleSelectMarket(market.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentMarket === market.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {getLocalizedName(market.id as InvestmentMarket)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </TabsContent>
            </CommandList>
          </Command>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default ImprovedMarketSelector;
