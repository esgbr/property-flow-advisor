
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, X, PlusCircle, ArrowLeftRight, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  rentalIncome: number;
  expenses: {
    maintenance: number;
    tax: number;
    insurance: number;
    vacancy: number;
  };
  metrics: {
    capRate: number;
    cashOnCash: number;
    roi: number;
    breakEven: number;
  };
  size: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  type: string;
}

// Sample property data
const sampleProperties: Property[] = [
  {
    id: 'p1',
    title: 'City Center Apartment',
    address: 'Hauptstraße 42, Berlin',
    price: 450000,
    rentalIncome: 1800,
    expenses: {
      maintenance: 200,
      tax: 150,
      insurance: 80,
      vacancy: 90,
    },
    metrics: {
      capRate: 5.8,
      cashOnCash: 6.2,
      roi: 7.1,
      breakEven: 78.5,
    },
    size: 85,
    bedrooms: 2,
    bathrooms: 1,
    yearBuilt: 2008,
    type: 'Apartment',
  },
  {
    id: 'p2',
    title: 'Suburban House',
    address: 'Waldweg 15, Munich',
    price: 680000,
    rentalIncome: 2500,
    expenses: {
      maintenance: 300,
      tax: 240,
      insurance: 120,
      vacancy: 125,
    },
    metrics: {
      capRate: 5.2,
      cashOnCash: 4.8,
      roi: 6.5,
      breakEven: 84.2,
    },
    size: 140,
    bedrooms: 4,
    bathrooms: 2,
    yearBuilt: 2005,
    type: 'House',
  },
  {
    id: 'p3',
    title: 'Modern Office Space',
    address: 'Innovationspark 7, Frankfurt',
    price: 920000,
    rentalIncome: 4200,
    expenses: {
      maintenance: 450,
      tax: 380,
      insurance: 220,
      vacancy: 210,
    },
    metrics: {
      capRate: 6.5,
      cashOnCash: 7.2,
      roi: 8.1,
      breakEven: 72.8,
    },
    size: 210,
    bedrooms: 0,
    bathrooms: 2,
    yearBuilt: 2019,
    type: 'Commercial',
  },
  {
    id: 'p4',
    title: 'Vacation Home',
    address: 'Seeblick 3, Hamburg',
    price: 550000,
    rentalIncome: 3200,
    expenses: {
      maintenance: 280,
      tax: 180,
      insurance: 90,
      vacancy: 320,
    },
    metrics: {
      capRate: 5.9,
      cashOnCash: 6.8,
      roi: 7.6,
      breakEven: 82.1,
    },
    size: 110,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2012,
    type: 'Vacation',
  },
];

const PropertyComparison: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [availableProperties, setAvailableProperties] = useState<Property[]>(sampleProperties);
  const [activeTab, setActiveTab] = useState('financial');

  const addPropertyToComparison = (property: Property) => {
    if (selectedProperties.length >= 3) {
      toast({
        title: t('maxPropertiesReached'),
        description: t('removePropertyFirst'),
        variant: "destructive",
      });
      return;
    }
    
    setSelectedProperties([...selectedProperties, property]);
    setAvailableProperties(availableProperties.filter(p => p.id !== property.id));
  };

  const removePropertyFromComparison = (propertyId: string) => {
    const propertyToRemove = selectedProperties.find(p => p.id === propertyId);
    
    if (propertyToRemove) {
      setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
      setAvailableProperties([...availableProperties, propertyToRemove]);
    }
  };

  const exportComparison = () => {
    toast({
      title: t('comparisonExported'),
      description: t('comparisonExportedDescription'),
    });
    // In a real app, implement actual export functionality
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <ArrowLeftRight className="mr-2 h-5 w-5" />
          {t('propertyComparison')}
        </h2>
        
        {selectedProperties.length > 0 && (
          <Button onClick={exportComparison} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t('exportComparison')}
          </Button>
        )}
      </div>
      
      {selectedProperties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">{t('noPropertiesSelected')}</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              {t('selectPropertiesToCompare')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('propertyComparison')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="financial">{t('financialMetrics')}</TabsTrigger>
                <TabsTrigger value="physical">{t('propertyDetails')}</TabsTrigger>
                <TabsTrigger value="expenses">{t('expenses')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="financial">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('metric')}</TableHead>
                      {selectedProperties.map(property => (
                        <TableHead key={property.id} className="text-center">
                          <div className="flex flex-col">
                            <div className="flex justify-between items-center">
                              <span className="font-bold">{property.title}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removePropertyFromComparison(property.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">{property.address}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{t('price')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {formatCurrency(property.price)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('monthlyRent')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {formatCurrency(property.rentalIncome)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('capRate')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {property.metrics.capRate}%
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('cashOnCash')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {property.metrics.cashOnCash}%
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('roi')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {property.metrics.roi}%
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('breakEvenOccupancy')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {property.metrics.breakEven}%
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="physical">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('feature')}</TableHead>
                      {selectedProperties.map(property => (
                        <TableHead key={property.id} className="text-center">
                          <div className="flex flex-col">
                            <div className="flex justify-between items-center">
                              <span className="font-bold">{property.title}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removePropertyFromComparison(property.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">{property.address}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{t('propertyType')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {property.type}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('size')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {property.size} m²
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('bedrooms')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {property.bedrooms}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('bathrooms')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {property.bathrooms}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('yearBuilt')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {property.yearBuilt}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('pricePerSqm')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {formatCurrency(Math.round(property.price / property.size))}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="expenses">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('expenseCategory')}</TableHead>
                      {selectedProperties.map(property => (
                        <TableHead key={property.id} className="text-center">
                          <div className="flex flex-col">
                            <div className="flex justify-between items-center">
                              <span className="font-bold">{property.title}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removePropertyFromComparison(property.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">{property.address}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{t('maintenance')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {formatCurrency(property.expenses.maintenance)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('propertyTax')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {formatCurrency(property.expenses.tax)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('insurance')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {formatCurrency(property.expenses.insurance)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('vacancyReserve')}</TableCell>
                      {selectedProperties.map(property => (
                        <TableCell key={property.id} className="text-center">
                          {formatCurrency(property.expenses.vacancy)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>{t('totalExpenses')}</TableCell>
                      {selectedProperties.map(property => {
                        const total = Object.values(property.expenses).reduce((sum, expense) => sum + expense, 0);
                        return (
                          <TableCell key={property.id} className="text-center">
                            {formatCurrency(total)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t('availableProperties')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableProperties.map(property => (
              <Card key={property.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">{property.address}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('price')}</p>
                      <p className="font-medium">{formatCurrency(property.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('capRate')}</p>
                      <p className="font-medium">{property.metrics.capRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('size')}</p>
                      <p className="font-medium">{property.size} m²</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('type')}</p>
                      <p className="font-medium">{property.type}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => addPropertyToComparison(property)}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('addToComparison')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyComparison;
