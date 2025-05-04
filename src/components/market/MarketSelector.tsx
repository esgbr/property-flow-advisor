
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

interface MarketSelectorProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
  align?: 'center' | 'start' | 'end';
}

const MarketSelector: React.FC<MarketSelectorProps> = ({
  variant = 'outline',
  size = 'default',
  showLabel = true,
  align = 'end'
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useUserPreferences();
  const { getMarketDisplayName, getAvailableMarkets } = useMarketFilter();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentMarket = preferences.investmentMarket || 'global';
  const markets = getAvailableMarkets();
  
  const handleMarketChange = (marketId: InvestmentMarket) => {
    if (marketId === currentMarket) return;
    
    updatePreferences({ ...preferences, investmentMarket: marketId });
    
    toast.success(
      t('Market Changed'), 
      { 
        description: `${t('Your investment market has been updated to')} ${markets.find(m => m.id === marketId)?.name}.`,
        duration: 3000
      }
    );
    
    // Close dropdown
    setIsOpen(false);
    
    // Navigate to appropriate tools page for the selected market
    if (marketId === 'germany' || marketId === 'austria' || marketId === 'switzerland') {
      navigate('/deutsche-immobilien-tools');
    } else if (marketId === 'usa' || marketId === 'canada') {
      navigate('/us-real-estate-tools');
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 mr-1" />
          {showLabel ? (
            <>
              <span>{t('Market')}: </span>
              <span className="font-medium">
                {markets.find(m => m.id === currentMarket)?.name || t('Global')}
              </span>
            </>
          ) : (
            <Badge variant="outline" className="bg-primary/10">
              {getMarketDisplayName()}
            </Badge>
          )}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel>{t('Select Investment Market')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {markets.map((market) => (
          <DropdownMenuItem
            key={market.id}
            className="flex items-center justify-between"
            onClick={() => handleMarketChange(market.id)}
          >
            <span>{market.name}</span>
            {market.id === currentMarket && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          {t('Manage Market Settings')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MarketSelector;
