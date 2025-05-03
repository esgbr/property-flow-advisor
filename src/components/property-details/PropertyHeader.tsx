
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/interfaces/property';

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
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
        return 'destructive';
      case 'under_contract':
        return 'blue';
      default:
        return 'outline';
    }
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
          {property.status.replace('_', ' ')}
        </Badge>
      </div>
      <Button variant="default" asChild>
        <Link to={`/property/${property.id}/edit`}>Edit Property</Link>
      </Button>
    </div>
  );
};

export default PropertyHeader;
