
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, MapPin, TrendingUp } from 'lucide-react';

interface PropertyProps {
  property: {
    id: number;
    name: string;
    value: number;
    location: string;
    rental_yield: number;
    ownership: number;
  };
}

const PropertySummary: React.FC<PropertyProps> = ({ property }) => {
  const { t, language } = useLanguage();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{property.name}</CardTitle>
          {property.ownership < 100 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {property.ownership}% {t('ownership')}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{property.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t('value')}</p>
              <p className="font-medium">€{property.value.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('rentalYield')}</p>
              <p className="font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {property.rental_yield}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full">
          {t('viewDetails')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertySummary;
