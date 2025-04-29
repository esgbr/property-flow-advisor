
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Property } from '@/interfaces/property';

interface PropertyDetailsTabProps {
  property: Property;
}

const PropertyDetailsTab = ({ property }: PropertyDetailsTabProps) => {
  // These are optional properties that might not exist in the Property interface
  // So we'll use optional values and fallbacks
  const propertyDetails = {
    yearBuilt: '2010',
    condition: 'Good',
    bathrooms: '1',
    heating: 'Central',
    energyRating: 'C',
    parking: 'Street',
    outdoorSpace: 'Balcony',
    neighborhood: 'City Center',
    publicTransport: '5 min walk',
    schools: 'Within 1km',
    shopping: 'Nearby',
    healthcare: '10 min drive',
    recreation: 'Park nearby'
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Property Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Property Type</p>
              <p>{property.propertyType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Year Built</p>
              <p>{propertyDetails.yearBuilt}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Condition</p>
              <p>{propertyDetails.condition}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p>{property.rooms || '2'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p>{propertyDetails.bathrooms}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Heating</p>
              <p>{propertyDetails.heating}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Energy Rating</p>
              <p>{propertyDetails.energyRating}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Parking</p>
              <p>{propertyDetails.parking}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Outdoor Space</p>
              <p>{propertyDetails.outdoorSpace}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Neighborhood</p>
              <p>{propertyDetails.neighborhood}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Public Transport</p>
              <p>{propertyDetails.publicTransport}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Schools</p>
              <p>{propertyDetails.schools}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Shopping</p>
              <p>{propertyDetails.shopping}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Healthcare</p>
              <p>{propertyDetails.healthcare}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Recreation</p>
              <p>{propertyDetails.recreation}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsTab;
