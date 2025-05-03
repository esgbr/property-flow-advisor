
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Calculator, MapPin, Search, Star } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock recommended properties data
const recommendedProperties = [
  {
    id: 'rec-1',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2075&ixlib=rb-4.0.3',
    title: 'Modern Downtown Apartment',
    description: 'Luxury 2-bedroom apartment in the heart of downtown with incredible views and amenities.',
    price: 450000,
    roi: 8.2,
    cashFlow: 1450,
    matchScore: 92,
    location: 'Downtown, New York',
    features: ['High Rental Demand', 'Appreciating Area', 'Low Maintenance'],
    type: 'Apartment'
  },
  {
    id: 'rec-2',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
    title: 'Suburban Family House',
    description: 'Spacious 4-bedroom house with garden, perfect for long-term family rentals in a growing area.',
    price: 680000,
    roi: 6.7,
    cashFlow: 2100,
    matchScore: 86,
    location: 'Highland Park, Dallas',
    features: ['Good Schools', 'Family-Friendly', 'Stable Market'],
    type: 'Single Family Home'
  },
  {
    id: 'rec-3',
    imageUrl: 'https://images.unsplash.com/photo-1577414104411-4e82f8e4dd6d?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3',
    title: 'Commercial Retail Space',
    description: 'Prime location retail space with established foot traffic and excellent visibility.',
    price: 890000,
    roi: 7.5,
    cashFlow: 5500,
    matchScore: 79,
    location: 'Shopping District, Chicago',
    features: ['High Traffic', 'Corner Location', 'Multi-Tenant Potential'],
    type: 'Commercial'
  },
  {
    id: 'rec-4',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
    title: 'Vacation Rental Cottage',
    description: 'Charming 2-bedroom cottage near popular tourist attractions, perfect for short-term rentals.',
    price: 350000,
    roi: 9.3,
    cashFlow: 3200,
    matchScore: 85,
    location: 'Coastal Area, Miami',
    features: ['Seasonal Premium', 'Tourist Hotspot', 'Furnished'],
    type: 'Vacation Property'
  },
  {
    id: 'rec-5',
    imageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
    title: 'Modern Office Building',
    description: 'Renovated office building with multiple units and parking, located in a business district.',
    price: 1250000,
    roi: 6.9,
    cashFlow: 7800,
    matchScore: 72,
    location: 'Business District, Seattle',
    features: ['Long-Term Leases', 'Professional Tenants', 'Low Vacancy'],
    type: 'Office'
  }
];

interface PropertyRecommendationsProps {
  className?: string;
}

const PropertyRecommendations: React.FC<PropertyRecommendationsProps> = ({ className }) => {
  const { preferences } = useUserPreferences();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProperties = recommendedProperties.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : filteredProperties.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < filteredProperties.length - 1 ? prev + 1 : 0));
  };

  const handleSave = (propertyId: string) => {
    toast({
      title: "Property saved",
      description: "This property has been added to your watchlist.",
    });
  };

  const handleAnalyze = (propertyId: string) => {
    toast({
      title: "Analysis started",
      description: "We're analyzing this property in detail. Check back soon.",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">AI Property Recommendations</h2>
          <p className="text-muted-foreground">Personalized investment opportunities based on your preferences</p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {filteredProperties.length > 0 ? (
        <div className="rounded-xl overflow-hidden border">
          <div className="relative aspect-video md:aspect-[21/9]">
            <img
              src={filteredProperties[currentIndex].imageUrl}
              alt={filteredProperties[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-white">{filteredProperties[currentIndex].title}</h3>
                  <p className="flex items-center text-white/90">
                    <MapPin className="h-4 w-4 mr-1" />
                    {filteredProperties[currentIndex].location}
                  </p>
                </div>
                <Badge className="bg-primary text-primary-foreground">{filteredProperties[currentIndex].type}</Badge>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground mb-4">{filteredProperties[currentIndex].description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Match Score</span>
                    <span className="text-sm font-medium">{filteredProperties[currentIndex].matchScore}%</span>
                  </div>
                  <Progress value={filteredProperties[currentIndex].matchScore} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Based on your investment goals and preferences
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {filteredProperties[currentIndex].features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="bg-muted">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Price</div>
                      <div className="text-lg font-bold">€{filteredProperties[currentIndex].price.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Potential ROI</div>
                      <div className="text-lg font-bold">{filteredProperties[currentIndex].roi}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Monthly Cash Flow</div>
                      <div className="text-lg font-bold">€{filteredProperties[currentIndex].cashFlow}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Property Type</div>
                      <div className="text-lg font-bold">{filteredProperties[currentIndex].type}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => handleSave(filteredProperties[currentIndex].id)} className="flex-1">
                    <Star className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => handleAnalyze(filteredProperties[currentIndex].id)} className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted border-t flex justify-between items-center p-4">
            <div className="text-sm">
              Showing {currentIndex + 1} of {filteredProperties.length} recommendations
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button size="sm" variant="outline" onClick={handleNext}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <Search className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or preferences
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyRecommendations;
