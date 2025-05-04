
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, Filter, MapPin, Search, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

export const PropertyScanner = () => {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5 text-primary" />
          {t('propertyScanner')}
        </CardTitle>
        <CardDescription>{t('findUndervaluedProperties')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder={t('locationOrZipCode')} 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('minCashFlow')}</span>
              <span className="text-sm">€1,000 / {t('month')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('minCapRate')}</span>
              <span className="text-sm">5.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('priceRange')}</span>
              <span className="text-sm">€100k - €500k</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t('propertyTypes')}</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {t('residential')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {t('commercial')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleScan} disabled={isScanning}>
          {isScanning ? (
            <>
              <TrendingUp className="mr-2 h-4 w-4 animate-spin" />
              {t('scanning')}...
            </>
          ) : (
            <>
              <Building className="mr-2 h-4 w-4" />
              {t('scanForProperties')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
