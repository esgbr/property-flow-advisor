
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
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <Badge variant={
          property.status === 'analyzing' ? 'default' :
          property.status === 'negotiating' ? 'secondary' :
          property.status === 'owned' ? 'outline' : 'outline'
        }>
          {property.status.replace('_', ' ')}
        </Badge>
      </div>
      <Button variant="default">Edit Property</Button>
    </div>
  );
};

export default PropertyHeader;
