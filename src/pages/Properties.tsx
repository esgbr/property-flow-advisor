
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { sampleProperties } from '@/data/sampleData';
import { Home, Plus, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Properties = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage your property portfolio</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleProperties.map((property) => (
          <Card key={property.id} className="card-hover overflow-hidden">
            <div className="h-48 w-full relative">
              {property.imageUrl ? (
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <Home className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="capitalize">
                  {property.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{property.city}, {property.country}</p>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <p className="font-medium">€{property.purchasePrice.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">{property.propertyType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Area:</span>
                  <p className="font-medium">{property.squareMeters} m²</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Rooms:</span>
                  <p className="font-medium">{property.rooms}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" /> Details
              </Button>
              <Button variant="default" size="sm">
                Analyze
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Properties;
