
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronsRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertySummary from '@/components/property/PropertySummary';
import { usePortfolioData } from '@/hooks/usePortfolioData';

/**
 * Centralizes property data usage and adds an "Add Property" workflow button.
 */
const DashboardPropertiesGrid: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { properties } = usePortfolioData();

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{t('yourProperties')}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/properties/new')}>
            <Plus className="h-4 w-4 mr-1" /> {t('addProperty') || "Add Property"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/properties')}>
            {t('viewAll')} <ChevronsRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {properties.map(property => (
          <PropertySummary key={property.id} property={property} />
        ))}
      </div>
    </>
  );
};

export default DashboardPropertiesGrid;
