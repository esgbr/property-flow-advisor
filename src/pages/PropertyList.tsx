
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PropertyList = () => {
  const { t } = useLanguage();

  const properties = [
    {
      id: 1,
      name: 'City Center Apartment',
      address: '123 Main St, Downtown',
      type: 'Residential',
      price: 375000,
      roi: 6.2,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80'
    },
    {
      id: 2,
      name: 'Suburban Villa',
      address: '456 Oak Dr, Westside',
      type: 'Residential',
      price: 520000,
      roi: 5.8,
      image: 'https://images.unsplash.com/photo-1585773690161-7b1cd0accfcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80'
    },
    {
      id: 3,
      name: 'Commercial Office',
      address: '789 Business Ave, Financial District',
      type: 'Commercial',
      price: 890000,
      roi: 7.4,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <Building className="inline-block mr-2 h-8 w-8" />
            {t('propertyList')}
          </h1>
          <p className="text-muted-foreground">{t('propertyListTitle')}</p>
        </div>

        <Button>
          <Building className="mr-2 h-4 w-4" />
          {t('addProperty')}
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchProperties')}
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          {t('filter')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <img
                src={property.image}
                alt={property.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{property.name}</CardTitle>
              <CardDescription>{property.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">{property.type}</div>
                  <div className="text-xl font-bold">€{property.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">ROI</div>
                  <div className="text-xl font-bold text-green-600">{property.roi}%</div>
                </div>
              </div>
              <Button className="w-full">{t('viewDetails')}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
