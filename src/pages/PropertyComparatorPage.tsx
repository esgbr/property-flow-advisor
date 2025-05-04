
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Building, ChevronDown, ChevronUp, DollarSign, Home, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

type Property = {
  id: string;
  name: string;
  price: number;
  rentalIncome: number;
  expenses: number;
  roi: number;
  type: 'residential' | 'commercial' | 'industrial';
  area: number;
  yearBuilt: number;
  location: string;
  market: string;
};

const PropertyComparatorPage: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket } = useMarketFilter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>('basics');
  
  // Sample property data
  const sampleProperties: Property[] = [
    {
      id: '1',
      name: 'Apartment Building',
      price: 450000,
      rentalIncome: 36000,
      expenses: 12000,
      roi: 5.3,
      type: 'residential',
      area: 800,
      yearBuilt: 1995,
      location: 'Munich',
      market: 'germany'
    },
    {
      id: '2',
      name: 'Office Space',
      price: 620000,
      rentalIncome: 54000,
      expenses: 18000,
      roi: 5.8,
      type: 'commercial',
      area: 650,
      yearBuilt: 2005,
      location: 'Hamburg',
      market: 'germany'
    },
    {
      id: '3',
      name: 'Single Family Home',
      price: 380000,
      rentalIncome: 28800,
      expenses: 9600,
      roi: 5.1,
      type: 'residential',
      area: 200,
      yearBuilt: 2010,
      location: 'Berlin',
      market: 'germany'
    },
    {
      id: '4',
      name: 'Retail Storefront',
      price: 520000,
      rentalIncome: 48000,
      expenses: 15600,
      roi: 6.2,
      type: 'commercial',
      area: 300,
      yearBuilt: 2000,
      location: 'Frankfurt',
      market: 'germany'
    },
    {
      id: '5',
      name: 'Apartment Complex',
      price: 920000,
      rentalIncome: 78000,
      expenses: 26000,
      roi: 5.7,
      type: 'residential',
      area: 1500,
      yearBuilt: 1990,
      location: 'Dresden',
      market: 'germany'
    }
  ];
  
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [displayOnlyDifferences, setDisplayOnlyDifferences] = useState(false);
  
  const addProperty = (propertyId: string) => {
    if (selectedProperties.length >= 3) {
      toast.error(t('maxPropertiesSelected'));
      return;
    }
    
    if (selectedProperties.includes(propertyId)) {
      toast.info(t('propertyAlreadySelected'));
      return;
    }
    
    setSelectedProperties([...selectedProperties, propertyId]);
    
    const propertyToAdd = sampleProperties.find(p => p.id === propertyId);
    if (propertyToAdd) {
      setProperties([...properties, propertyToAdd]);
      toast.success(t('propertyAddedToComparison'));
    }
  };
  
  const removeProperty = (propertyId: string) => {
    setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    setProperties(properties.filter(p => p.id !== propertyId));
    toast.info(t('propertyRemovedFromComparison'));
  };
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  const getCurrency = (market: string) => {
    switch(market) {
      case 'germany':
      case 'austria':
      case 'france':
        return '€';
      case 'usa':
      case 'canada':
        return '$';
      case 'switzerland':
        return 'CHF';
      default:
        return '€';
    }
  };
  
  const formatCurrency = (amount: number, market: string) => {
    const currency = getCurrency(market);
    return `${currency}${amount.toLocaleString()}`;
  };
  
  const areAllValuesSame = (propertyKey: keyof Property) => {
    if (properties.length <= 1) return false;
    const firstValue = properties[0][propertyKey];
    return properties.every(p => p[propertyKey] === firstValue);
  };
  
  const propertyTypes = {
    'residential': t('residential'),
    'commercial': t('commercial'),
    'industrial': t('industrial')
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Building className="mr-2 h-6 w-6" />
          {t('propertyComparator')}
        </h1>
        <p className="text-muted-foreground">{t('comparePropertiesSideByByside')}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('selectProperties')}</CardTitle>
          <CardDescription>{t('compareUpToThreeProperties')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Select onValueChange={addProperty}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder={t('addProperty')} />
              </SelectTrigger>
              <SelectContent>
                {sampleProperties
                  .filter(p => !selectedProperties.includes(p.id))
                  .map(property => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} - {property.location}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="differences" 
                checked={displayOnlyDifferences}
                onCheckedChange={setDisplayOnlyDifferences}
              />
              <label htmlFor="differences" className="text-sm">
                {t('showOnlyDifferences')}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {properties.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <div className="h-16 flex items-end pb-2">
                <h2 className="text-lg font-medium">{t('properties')}</h2>
              </div>
            </div>
            
            {properties.map(property => (
              <div key={property.id} className="col-span-1">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{property.name}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeProperty(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge>{propertyTypes[property.type]}</Badge>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Basic Info Section */}
          <Card className="overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-accent/10"
              onClick={() => toggleSection('basics')}
            >
              <h3 className="font-medium">{t('basicInfo')}</h3>
              <Button variant="ghost" size="sm">
                {expandedSection === 'basics' ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {expandedSection === 'basics' && (
              <CardContent className="pt-0">
                <div className="border-t pt-4">
                  {/* Location */}
                  {(!displayOnlyDifferences || !areAllValuesSame('location')) && (
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-1 text-muted-foreground">
                        {t('location')}
                      </div>
                      {properties.map(property => (
                        <div key={property.id} className="col-span-1 font-medium">
                          {property.location}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Area */}
                  {(!displayOnlyDifferences || !areAllValuesSame('area')) && (
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-1 text-muted-foreground">
                        {t('area')}
                      </div>
                      {properties.map(property => (
                        <div key={property.id} className="col-span-1 font-medium">
                          {property.area} m²
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Year Built */}
                  {(!displayOnlyDifferences || !areAllValuesSame('yearBuilt')) && (
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-1 text-muted-foreground">
                        {t('yearBuilt')}
                      </div>
                      {properties.map(property => (
                        <div key={property.id} className="col-span-1 font-medium">
                          {property.yearBuilt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
          
          {/* Financial Info Section */}
          <Card className="overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-accent/10"
              onClick={() => toggleSection('financials')}
            >
              <h3 className="font-medium">{t('financialInfo')}</h3>
              <Button variant="ghost" size="sm">
                {expandedSection === 'financials' ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {expandedSection === 'financials' && (
              <CardContent className="pt-0">
                <div className="border-t pt-4">
                  {/* Price */}
                  {(!displayOnlyDifferences || !areAllValuesSame('price')) && (
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-1 text-muted-foreground">
                        {t('purchasePrice')}
                      </div>
                      {properties.map(property => (
                        <div key={property.id} className="col-span-1 font-medium">
                          {formatCurrency(property.price, property.market)}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Rental Income */}
                  {(!displayOnlyDifferences || !areAllValuesSame('rentalIncome')) && (
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-1 text-muted-foreground">
                        {t('annualRentalIncome')}
                      </div>
                      {properties.map(property => (
                        <div key={property.id} className="col-span-1 font-medium">
                          {formatCurrency(property.rentalIncome, property.market)}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Annual Expenses */}
                  {(!displayOnlyDifferences || !areAllValuesSame('expenses')) && (
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-1 text-muted-foreground">
                        {t('annualExpenses')}
                      </div>
                      {properties.map(property => (
                        <div key={property.id} className="col-span-1 font-medium">
                          {formatCurrency(property.expenses, property.market)}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Net Income */}
                  <div className="grid grid-cols-4 py-2 border-t mt-2 pt-3">
                    <div className="col-span-1 text-muted-foreground">
                      {t('annualNetIncome')}
                    </div>
                    {properties.map(property => (
                      <div key={property.id} className="col-span-1 font-medium">
                        {formatCurrency(property.rentalIncome - property.expenses, property.market)}
                      </div>
                    ))}
                  </div>
                  
                  {/* ROI */}
                  {(!displayOnlyDifferences || !areAllValuesSame('roi')) && (
                    <div className="grid grid-cols-4 py-2">
                      <div className="col-span-1 text-muted-foreground">
                        {t('roi')}
                      </div>
                      {properties.map(property => (
                        <div key={property.id} className={`col-span-1 font-medium ${
                          property.roi > 5.5 ? 'text-green-600' : 
                          property.roi < 4.5 ? 'text-amber-600' : ''
                        }`}>
                          {property.roi}%
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Price per sqm */}
                  <div className="grid grid-cols-4 py-2">
                    <div className="col-span-1 text-muted-foreground">
                      {t('pricePerSqm')}
                    </div>
                    {properties.map(property => {
                      const pricePerSqm = property.price / property.area;
                      return (
                        <div key={property.id} className="col-span-1 font-medium">
                          {formatCurrency(pricePerSqm, property.market)}/m²
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
          
          {/* Final Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>{t('analysisAndRecommendation')}</CardTitle>
            </CardHeader>
            <CardContent>
              {properties.map(property => {
                // Simple recommendation logic
                const isPriceEfficient = property.price / property.area < 3000;
                const isHighYield = property.roi > 5.5;
                const isGoodBuy = isPriceEfficient && isHighYield;
                
                return (
                  <div key={property.id} className="border-b last:border-b-0 pb-4 mb-4 last:pb-0 last:mb-0">
                    <h4 className="font-medium mb-2">{property.name}</h4>
                    <div className="flex gap-2 mb-2">
                      <Badge variant={isHighYield ? "default" : "outline"}>
                        {t('yield')}: {isHighYield ? t('high') : t('moderate')}
                      </Badge>
                      <Badge variant={isPriceEfficient ? "default" : "outline"}>
                        {isPriceEfficient ? t('goodValue') : t('fairPrice')}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      {isGoodBuy ? 
                        t('recommendedInvestment') : 
                        isPriceEfficient ? 
                          t('considerForCashflow') : 
                          isHighYield ? 
                            t('goodYieldButExpensive') : 
                            t('averageInvestment')}
                    </p>
                  </div>
                );
              })}
              
              {properties.length >= 2 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">{t('comparisonSummary')}</h4>
                  <p className="text-sm">
                    {properties.sort((a, b) => b.roi - a.roi)[0].name} {t('hasHighestROI')} ({properties.sort((a, b) => b.roi - a.roi)[0].roi}%).
                    {properties.sort((a, b) => a.price / a.area - b.price / b.area)[0].name} {t('hasLowestPricePerSqm')} 
                    ({formatCurrency(properties.sort((a, b) => a.price / a.area - b.price / b.area)[0].price / 
                      properties.sort((a, b) => a.price / a.area - b.price / b.area)[0].area, 
                      properties.sort((a, b) => a.price / a.area - b.price / b.area)[0].market)}/m²).
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('noPropertiesSelected')}</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              {t('pleaseSelectProperties')}
            </p>
            <Select onValueChange={addProperty}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder={t('selectFirstProperty')} />
              </SelectTrigger>
              <SelectContent>
                {sampleProperties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name} - {property.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyComparatorPage;
