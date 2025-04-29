
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building, 
  Calculator, 
  Calendar, 
  Check, 
  FileText, 
  Wrench,
  ArrowLeft,
  MapPin,
  Home,
  DollarSign,
  Tag
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleProperties } from '@/data/sampleData';

const PropertyDetail = () => {
  const { id } = useParams();
  const property = sampleProperties.find(p => p.id === id) || sampleProperties[0];
  
  // Property analysis score (example)
  const analysisScore = 72;

  return (
    <div className="space-y-6 animate-fade-in">
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
            property.status === 'owned' ? 'success' : 'outline'
          }>
            {property.status.replace('_', ' ')}
          </Badge>
        </div>
        <Button variant="default">Edit Property</Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Property image and details */}
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
                  <p className="text-xl font-semibold">{property.squareMeters} m²</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Price per m²</p>
                  <p className="text-xl font-semibold">€{Math.round(property.purchasePrice / property.squareMeters).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Expected Rent</p>
                  <p className="text-xl font-semibold">€{property.expectedRent?.toLocaleString() || 'N/A'}/month</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Gross Yield</p>
                  <p className="text-xl font-semibold">{property.grossYield || 'N/A'}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Monthly Cashflow</p>
                  <p className="text-xl font-semibold">€{property.cashflow?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column - Investment analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Analysis</CardTitle>
            <CardDescription>Overall property analysis score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analysis Score</span>
                <span className="font-medium">{analysisScore}%</span>
              </div>
              <Progress value={analysisScore} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Decision Checklist</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Purchase price</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Location quality</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Rental potential</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Financing terms</span>
                </li>
                <li className="flex items-center gap-2 text-sm opacity-50">
                  <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Refurbishment assessment</span>
                </li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Next Steps</h4>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <Calculator className="h-4 w-4" />
                  <span>Run Financial Analysis</span>
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Viewing</span>
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <Wrench className="h-4 w-4" />
                  <span>Plan Refurbishment</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="refurbishment">Refurbishment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Property Type</p>
                  <p>{property.propertyType || 'Apartment'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Year Built</p>
                  <p>{property.yearBuilt || '2010'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p>{property.condition || 'Good'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p>{property.bedrooms || '2'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p>{property.bathrooms || '1'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Heating</p>
                  <p>{property.heating || 'Central'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Energy Rating</p>
                  <p>{property.energyRating || 'C'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Parking</p>
                  <p>{property.parking || 'Street'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Outdoor Space</p>
                  <p>{property.outdoorSpace || 'Balcony'}</p>
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
                  <p>{property.neighborhood || 'City Center'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Public Transport</p>
                  <p>{property.publicTransport || '5 min walk'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Schools</p>
                  <p>{property.schools || 'Within 1km'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Shopping</p>
                  <p>{property.shopping || 'Nearby'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Healthcare</p>
                  <p>{property.healthcare || '10 min drive'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Recreation</p>
                  <p>{property.recreation || 'Park nearby'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Analysis</CardTitle>
              <CardDescription>Key financial indicators for this investment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Financial analysis details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Important dates and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Schedule and appointments will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="refurbishment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Refurbishment Planning</CardTitle>
              <CardDescription>Renovation cost and potential value increase</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Refurbishment details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Important property documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Property floor plan.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Energy certificate.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Purchase agreement.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyDetail;
