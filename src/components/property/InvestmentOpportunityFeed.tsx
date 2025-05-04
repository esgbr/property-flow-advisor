
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, ArrowUpRight, Building, DollarSign, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const InvestmentOpportunityFeed = () => {
  const { t } = useLanguage();

  // Sample investment opportunities
  const opportunities = [
    {
      id: 1,
      title: '2 Bedroom Apartment',
      location: 'Berlin, Germany',
      price: 250000,
      capRate: 5.8,
      type: 'residential',
      isHotDeal: true
    },
    {
      id: 2,
      title: 'Commercial Storefront',
      location: 'Frankfurt, Germany',
      price: 420000,
      capRate: 6.2,
      type: 'commercial',
      isHotDeal: false
    },
    {
      id: 3,
      title: 'Duplex Property',
      location: 'Munich, Germany',
      price: 380000,
      capRate: 5.5,
      type: 'residential',
      isHotDeal: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5 text-primary" />
          {t('investmentOpportunities')}
        </CardTitle>
        <CardDescription>{t('latestDealsAndListings')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="border rounded-lg p-3 hover:bg-accent/5 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{opportunity.title}</h3>
                    {opportunity.isHotDeal && (
                      <Badge variant="destructive" className="ml-2">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {t('hotDeal')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {opportunity.location}
                  </p>
                </div>
                <Badge variant={opportunity.type === 'residential' ? 'secondary' : 'outline'}>
                  {opportunity.type === 'residential' ? t('residential') : t('commercial')}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <p className="text-xs text-muted-foreground">{t('price')}</p>
                  <p className="text-sm font-medium flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {opportunity.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('capRate')}</p>
                  <p className="text-sm font-medium">{opportunity.capRate}%</p>
                </div>
              </div>
              <Button size="sm" variant="link" className="p-0 h-auto mt-2">
                {t('viewDeal')}
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" className="w-full">
            {t('viewMoreListings')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentOpportunityFeed;
