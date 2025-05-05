
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { sampleProperties } from '@/data/sampleData';
import { Home, Plus, FileText, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAccessibility } from '@/components/accessibility/A11yProvider';

const Properties = () => {
  const { t } = useLanguage();
  const { highContrast } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter properties based on search term
  const filteredProperties = searchTerm
    ? sampleProperties.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sampleProperties;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Simulate loading state briefly for UX feedback
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Handle keyboard navigation for cards
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, propertyId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = `/property/${propertyId}`;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage your property portfolio</p>
        </div>
        <Button as={Link} to="/property/new" className="flex items-center">
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> 
          Add Property
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          type="text"
          placeholder="Search properties by title, city, country, or type..."
          className="pl-10 w-full max-w-md"
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Search properties"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} className="opacity-60">
              <div className="h-48 w-full bg-muted animate-pulse" />
              <CardHeader className="pb-2">
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded mt-2" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((_, i) => (
                    <div key={i}>
                      <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="h-9 w-20 bg-muted animate-pulse rounded" />
                <div className="h-9 w-20 bg-muted animate-pulse rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card 
              key={property.id} 
              className={`card-hover overflow-hidden transition-transform hover:shadow-lg focus-within:ring-2 ${highContrast ? 'border-2' : ''}`}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, property.id)}
              aria-label={`${property.title}, ${property.propertyType} in ${property.city}, ${property.country}`}
            >
              <div className="h-48 w-full relative">
                {property.imageUrl ? (
                  <img
                    src={property.imageUrl}
                    alt={`Photo of ${property.title}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <Home className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={property.status === 'sold' ? "destructive" : property.status === 'active' ? "default" : "secondary"} className="capitalize">
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
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/property/${property.id}`}>
                    <FileText className="mr-2 h-4 w-4" aria-hidden="true" /> Details
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to={`/property/${property.id}/financials`}>
                    Analyze
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <Home className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
          <h3 className="text-lg font-medium mb-1">No properties found</h3>
          <p className="text-muted-foreground text-center mb-4">
            No properties match your search criteria. Try adjusting your filters.
          </p>
          <Button variant="outline" onClick={() => setSearchTerm('')}>
            Clear search
          </Button>
        </div>
      )}

      {filteredProperties.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProperties.length} of {sampleProperties.length} properties
          </p>
          <Button variant="outline" size="sm" onClick={() => setSearchTerm('')} disabled={!searchTerm}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Properties;
