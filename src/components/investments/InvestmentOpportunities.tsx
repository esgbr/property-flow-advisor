
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, TrendingUp, Map, ChevronRight } from 'lucide-react';

const InvestmentOpportunities: React.FC = () => {
  const { language } = useLanguage();
  
  // Sample investment opportunities data
  const opportunities = [
    {
      id: 1,
      title: language === 'de' ? 'Wohnkomplex in Berlin' : 'Residential Complex in Berlin',
      description: language === 'de' 
        ? 'Mehrfamilienhaus mit 12 Einheiten in aufstrebendem Stadtteil'
        : 'Multi-family property with 12 units in up-and-coming neighborhood',
      price: 1250000,
      roi: 5.8,
      location: 'Berlin',
      type: language === 'de' ? 'Wohnimmobilie' : 'Residential',
      matchScore: 92
    },
    {
      id: 2,
      title: language === 'de' ? 'Büroflächen in München' : 'Office Space in Munich',
      description: language === 'de'
        ? 'Moderne Büroflächen mit langfristigem Mietvertrag'
        : 'Modern office spaces with long-term lease agreement',
      price: 1850000,
      roi: 6.2,
      location: 'Munich',
      type: language === 'de' ? 'Gewerbeimmobilie' : 'Commercial',
      matchScore: 87
    },
    {
      id: 3,
      title: language === 'de' ? 'Einzelhandelsimmobilie in Hamburg' : 'Retail Property in Hamburg',
      description: language === 'de'
        ? 'Gut positionierte Einzelhandelsimmobilie in Haupteinkaufsstraße'
        : 'Well-positioned retail property on main shopping street',
      price: 975000,
      roi: 5.4,
      location: 'Hamburg',
      type: language === 'de' ? 'Einzelhandel' : 'Retail',
      matchScore: 79
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'de' ? 'Anlagemöglichkeiten' : 'Investment Opportunities'}</CardTitle>
          <CardDescription>
            {language === 'de' 
              ? 'Auf Ihre Präferenzen zugeschnittene Investitionsmöglichkeiten'
              : 'Investment opportunities tailored to your preferences'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{opportunity.title}</CardTitle>
                      <CardDescription className="mt-1">{opportunity.description}</CardDescription>
                    </div>
                    <Badge className="bg-primary">
                      {opportunity.matchScore}% {language === 'de' ? 'Match' : 'Match'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">{opportunity.type}</span>
                    </div>
                    <div className="flex items-center">
                      <Map className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">{opportunity.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        €{opportunity.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">{opportunity.roi}% ROI</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="ghost" className="ml-auto" size="sm">
                    {language === 'de' ? 'Details anzeigen' : 'View details'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            {language === 'de' ? 'Alle Anlagemöglichkeiten anzeigen' : 'View all investment opportunities'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvestmentOpportunities;
