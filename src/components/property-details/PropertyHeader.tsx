
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/interfaces/property';
import { useLanguage } from '@/contexts/LanguageContext';

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  const { t } = useLanguage();
  
  // Function to determine badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'analyzing':
        return 'default';
      case 'pending':
      case 'negotiating':
        return 'secondary';
      case 'sold':
      case 'owned':
        return 'outline';
      case 'off-market':
      case 'rejected':
      case 'under_contract':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Function to format status text with proper capitalization
  const formatStatusText = (status: string): string => {
    // Replace underscores with spaces and capitalize each word
    return status
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild className="shrink-0">
          <Link to="/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <Badge variant={getBadgeVariant(property.status)}>
              {formatStatusText(property.status)}
            </Badge>
          </div>
          {property.address && (
            <p className="text-sm text-muted-foreground mt-1">
              <Building className="inline-block h-3.5 w-3.5 mr-1" />
              {property.address}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button variant="outline" className="flex-1 sm:flex-none" asChild>
          <Link to={`/property/${property.id}/financials`}>{t('viewFinancials')}</Link>
        </Button>
        <Button variant="default" className="flex-1 sm:flex-none" asChild>
          <Link to={`/property/${property.id}/edit`}>{t('editProperty')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default PropertyHeader;
