
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { TrendingUp, TrendingDown, CreditCard, Building } from 'lucide-react';
import { getLocalizedMarketName } from '@/utils/marketHelpers';

const MarketUpdateCard: React.FC = () => {
  const { language, t } = useLanguage();
  const { preferences } = useUserPreferences();
  const market = preferences.investmentMarket || 'germany';
  
  // Sample market data - in a real app, this would come from an API
  const marketData = {
    priceChange: 2.8,
    rentalChange: 3.2,
    transactions: 14800,
    newProperties: 5200,
    trend: 'up' as 'up' | 'down' | 'stable',
    lastUpdate: new Date().toISOString()
  };
  
  // Format date for last update
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (language === 'de') {
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Marktbericht' : 'Market Update'}: {getLocalizedMarketName(market, language)}
        </CardTitle>
        <CardDescription>
          {language === 'de' ? 'Aktuelle Trends und Entwicklungen' : 'Current trends and developments'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{language === 'de' ? 'Preisentwicklung' : 'Price Trend'}</p>
            <div className="flex items-center">
              {marketData.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`font-medium ${marketData.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {marketData.priceChange > 0 ? '+' : ''}{marketData.priceChange}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{language === 'de' ? 'Mietentwicklung' : 'Rental Trend'}</p>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="font-medium text-green-500">
                +{marketData.rentalChange}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{language === 'de' ? 'Transaktionen' : 'Transactions'}</p>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="font-medium">{marketData.transactions.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{language === 'de' ? 'Neue Objekte' : 'New Properties'}</p>
            <div className="flex items-center">
              <Building className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="font-medium">{marketData.newProperties.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {language === 'de' ? 'Letztes Update' : 'Last update'}: {formatDate(marketData.lastUpdate)}
        </span>
        <Button variant="ghost" size="sm">
          {language === 'de' ? 'Vollständigen Bericht anzeigen' : 'View full report'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MarketUpdateCard;
