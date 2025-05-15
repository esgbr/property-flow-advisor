
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronsRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertySummary from '@/components/property/PropertySummary';

const DUMMY_PROPERTIES = [
  { id: 1, name: 'Apartment 12B', value: 350000, location: 'Berlin', rental_yield: 4.2, ownership: 100 },
  { id: 2, name: 'Commercial Space', value: 520000, location: 'Frankfurt', rental_yield: 5.8, ownership: 100 },
  { id: 3, name: 'Residential Building', value: 1250000, location: 'Munich', rental_yield: 3.9, ownership: 75 }
];

const DashboardPropertiesGrid: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{t('yourProperties')}</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/properties')}>
          {t('viewAll')} <ChevronsRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {DUMMY_PROPERTIES.map(property => (
          <PropertySummary key={property.id} property={property} />
        ))}
      </div>
    </>
  );
};

export default DashboardPropertiesGrid;
