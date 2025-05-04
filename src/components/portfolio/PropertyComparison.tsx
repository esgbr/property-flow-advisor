
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Calculator, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Property } from '@/interfaces/property';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Sample properties for comparison
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment',
    description: 'Newly renovated apartment in downtown',
    address: '123 Main St',
    city: 'Berlin',
    zipCode: '10115',
    country: 'Germany',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    size: 75,
    sizeUnit: 'sqm',
    purchasePrice: 380000,
    currentValue: 410000,
    currency: 'EUR',
    images: [],
    squareMeters: 75,
    status: 'owned',
    createdAt: '2023-05-15',
    updatedAt: '2023-05-15',
    financials: {
      expectedRent: 1800,
      grossRentalYield: 5.7,
      monthlyIncome: 1800,
      monthlyExpenses: 700,
      monthlyCashFlow: 1100,
      annualCashFlow: 13200,
      capRate: 4.9
    }
  },
  {
    id: '2',
    title: 'Suburban House',
    description: 'Single family home with garden',
    address: '456 Oak Ave',
    city: 'Munich',
    zipCode: '80331',
    country: 'Germany',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 2,
    size: 150,
    sizeUnit: 'sqm',
    purchasePrice: 650000,
    currentValue: 720000,
    currency: 'EUR',
    images: [],
    squareMeters: 150,
    status: 'owned',
    createdAt: '2022-11-23',
    updatedAt: '2022-11-23',
    financials: {
      expectedRent: 2800,
      grossRentalYield: 5.2,
      monthlyIncome: 2800,
      monthlyExpenses: 1300,
      monthlyCashFlow: 1500,
      annualCashFlow: 18000,
      capRate: 4.4
    }
  },
  {
    id: '3',
    title: 'Commercial Space',
    description: 'Retail space in shopping center',
    address: '789 Market St',
    city: 'Frankfurt',
    zipCode: '60311',
    country: 'Germany',
    propertyType: 'commercial',
    bedrooms: 0,
    bathrooms: 1,
    size: 120,
    sizeUnit: 'sqm',
    purchasePrice: 480000,
    currentValue: 510000,
    currency: 'EUR',
    images: [],
    squareMeters: 120,
    status: 'owned',
    createdAt: '2023-02-08',
    updatedAt: '2023-02-08',
    financials: {
      expectedRent: 2600,
      grossRentalYield: 6.5,
      monthlyIncome: 2600,
      monthlyExpenses: 850,
      monthlyCashFlow: 1750,
      annualCashFlow: 21000,
      capRate: 5.8
    }
  },
  {
    id: '4',
    title: 'Small Studio',
    description: 'Compact studio in university area',
    address: '101 College Rd',
    city: 'Hamburg',
    zipCode: '20095',
    country: 'Germany',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    size: 35,
    sizeUnit: 'sqm',
    purchasePrice: 220000,
    currentValue: 235000,
    currency: 'EUR',
    images: [],
    squareMeters: 35,
    status: 'owned',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    financials: {
      expectedRent: 950,
      grossRentalYield: 5.2,
      monthlyIncome: 950,
      monthlyExpenses: 380,
      monthlyCashFlow: 570,
      annualCashFlow: 6840,
      capRate: 4.4
    }
  }
];

interface PropertyComparisonProps {
  properties?: Property[];
}

const PropertyComparison: React.FC<PropertyComparisonProps> = ({ properties = sampleProperties }) => {
  const { t } = useLanguage();
  const [selectedProperties, setSelectedProperties] = useState<string[]>(['1', '2', '3']); // Default to first 3 properties
  const [sortBy, setSortBy] = useState<string>('roi');
  
  // Filter properties based on selection
  const propertiesToCompare = properties.filter(p => selectedProperties.includes(p.id));
  
  // Sort properties based on selected metric
  const sortedProperties = [...propertiesToCompare].sort((a, b) => {
    switch (sortBy) {
      case 'roi':
        return (b.financials?.grossRentalYield || 0) - (a.financials?.grossRentalYield || 0);
      case 'cashflow':
        return (b.financials?.monthlyCashFlow || 0) - (a.financials?.monthlyCashFlow || 0);
      case 'price':
        return (a.purchasePrice || 0) - (b.purchasePrice || 0);
      case 'value':
        return (b.currentValue || 0) - (a.currentValue || 0);
      default:
        return 0;
    }
  });
  
  // Calculate best performance across metrics
  const bestROI = Math.max(...propertiesToCompare.map(p => p.financials?.grossRentalYield || 0));
  const bestCashFlow = Math.max(...propertiesToCompare.map(p => p.financials?.monthlyCashFlow || 0));
  const lowestPrice = Math.min(...propertiesToCompare.map(p => p.purchasePrice));
  const bestValueGrowth = Math.max(...propertiesToCompare.map(p => 
    ((p.currentValue - p.purchasePrice) / p.purchasePrice) * 100
  ));
  
  const togglePropertySelection = (id: string) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter(p => p !== id));
    } else {
      setSelectedProperties([...selectedProperties, id]);
    }
  };
  
  // Calculate metrics per square meter for better comparison
  const getMetricPerSqm = (value: number, sqm: number) => {
    return sqm > 0 ? value / sqm : 0;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          {t('propertyComparison')}
        </CardTitle>
        <CardDescription>{t('compareYourInvestmentProperties')}</CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roi">{t('returnOnInvestment')}</SelectItem>
              <SelectItem value="cashflow">{t('cashFlow')}</SelectItem>
              <SelectItem value="price">{t('purchasePrice')}</SelectItem>
              <SelectItem value="value">{t('currentValue')}</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="ml-auto flex flex-wrap gap-1">
            {properties.map(property => (
              <Button 
                key={property.id} 
                variant={selectedProperties.includes(property.id) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePropertySelection(property.id)}
                className="text-xs"
              >
                {property.title.length > 15 ? `${property.title.substring(0, 15)}...` : property.title}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] sticky left-0 bg-background">{t('metric')}</TableHead>
              {sortedProperties.map(property => (
                <TableHead key={property.id} className="text-center">
                  <div>
                    <div className="font-medium">{property.title}</div>
                    <div className="text-xs text-muted-foreground">{property.propertyType} | {property.city}</div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('purchasePrice')}</TableCell>
              {sortedProperties.map(property => (
                <TableCell key={property.id} className="text-center">
                  <div>€{property.purchasePrice.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    €{getMetricPerSqm(property.purchasePrice, property.squareMeters || 1).toFixed(0)}/m²
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('currentValue')}</TableCell>
              {sortedProperties.map(property => (
                <TableCell key={property.id} className="text-center">
                  <div>€{property.currentValue.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    €{getMetricPerSqm(property.currentValue, property.squareMeters || 1).toFixed(0)}/m²
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('valueGrowth')}</TableCell>
              {sortedProperties.map(property => {
                const growth = ((property.currentValue - property.purchasePrice) / property.purchasePrice) * 100;
                const isHighest = growth === bestValueGrowth;
                return (
                  <TableCell key={property.id} className="text-center">
                    <div className={isHighest ? 'font-bold text-green-600' : ''}>
                      {growth.toFixed(1)}%
                    </div>
                    {isHighest && (
                      <div className="text-xs text-green-600">{t('bestPerformer')}</div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('monthlyIncome')}</TableCell>
              {sortedProperties.map(property => (
                <TableCell key={property.id} className="text-center">
                  <div>€{(property.financials?.monthlyIncome || 0).toLocaleString()}</div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('monthlyExpenses')}</TableCell>
              {sortedProperties.map(property => (
                <TableCell key={property.id} className="text-center">
                  <div>€{(property.financials?.monthlyExpenses || 0).toLocaleString()}</div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('monthlyCashFlow')}</TableCell>
              {sortedProperties.map(property => {
                const cashFlow = property.financials?.monthlyCashFlow || 0;
                const isHighest = cashFlow === bestCashFlow;
                return (
                  <TableCell key={property.id} className="text-center">
                    <div className={isHighest ? 'font-bold text-green-600' : 
                      cashFlow > 0 ? 'text-green-600' : 'text-red-600'}>
                      €{cashFlow.toLocaleString()}
                    </div>
                    {isHighest && (
                      <div className="text-xs text-green-600">{t('bestPerformer')}</div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('grossRentalYield')}</TableCell>
              {sortedProperties.map(property => {
                const roi = property.financials?.grossRentalYield || 0;
                const isHighest = roi === bestROI;
                return (
                  <TableCell key={property.id} className="text-center">
                    <div className={isHighest ? 'font-bold text-green-600' : ''}>
                      {roi.toFixed(1)}%
                    </div>
                    {isHighest && (
                      <div className="text-xs text-green-600">{t('bestPerformer')}</div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('capRate')}</TableCell>
              {sortedProperties.map(property => (
                <TableCell key={property.id} className="text-center">
                  <div>{(property.financials?.capRate || 0).toFixed(1)}%</div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('pricePerSqm')}</TableCell>
              {sortedProperties.map(property => {
                const priceSqm = property.squareMeters ? property.purchasePrice / property.squareMeters : 0;
                const isLowestPrice = property.purchasePrice === lowestPrice;
                return (
                  <TableCell key={property.id} className="text-center">
                    <div className={isLowestPrice ? 'font-bold text-green-600' : ''}>
                      €{priceSqm.toFixed(0)}
                    </div>
                    {isLowestPrice && (
                      <div className="text-xs text-green-600">{t('bestValue')}</div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('size')}</TableCell>
              {sortedProperties.map(property => (
                <TableCell key={property.id} className="text-center">
                  <div>{property.squareMeters || property.size} m²</div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('propertyType')}</TableCell>
              {sortedProperties.map(property => (
                <TableCell key={property.id} className="text-center">
                  <Badge variant="outline">
                    {property.propertyType}
                  </Badge>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium sticky left-0 bg-background">{t('location')}</TableCell>
              {sortedProperties.map(property => (
                <TableCell key={property.id} className="text-center">
                  <div>{property.city}, {property.country}</div>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PropertyComparison;
