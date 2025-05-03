
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <Badge variant={getBadgeVariant(property.status)}>
          {formatStatusText(property.status)}
        </Badge>
      </div>
      <Button variant="default" asChild>
        <Link to={`/property/${property.id}/edit`}>{t('editProperty')}</Link>
      </Button>
    </div>
  );
};

export default PropertyHeader;
