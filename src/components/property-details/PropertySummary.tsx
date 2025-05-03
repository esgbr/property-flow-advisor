
import React from 'react';
import { MapPin, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/interfaces/property';

interface PropertySummaryProps {
  property: Property;
}

const PropertySummary = ({ property }: PropertySummaryProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-0">
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          {property.imageUrl ? (
            <img 
              src={property.imageUrl} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Home className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.address}, {property.city}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Purchase Price</p>
              <p className="text-xl font-semibold">€{property.purchasePrice.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Size</p>
              <p className="text-xl font-semibold">{property.squareMeters || property.size || 0} m²</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Price per m²</p>
              <p className="text-xl font-semibold">€{Math.round(property.purchasePrice / (property.squareMeters || property.size || 1)).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Expected Rent</p>
              <p className="text-xl font-semibold">€{property.financials?.expectedRent?.toLocaleString() || 'N/A'}/month</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Gross Yield</p>
              <p className="text-xl font-semibold">{property.financials?.grossRentalYield || 'N/A'}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Monthly Cash Flow</p>
              <p className="text-xl font-semibold">€{property.financials?.monthlyCashFlow?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertySummary;
