
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MapPin, Map, Building, ChartBar, ChartLine, DollarSign } from 'lucide-react';
import { Property } from '@/interfaces/property';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PropertyLocationAnalysisTabProps {
  property: Property;
}

interface LocationScoresProps {
  scores: {
    label: string;
    value: number;
    description: string;
    icon: React.ReactNode;
  }[];
}

interface LocationInfoProps {
  info: {
    category: string;
    items: {
      name: string;
      value: string;
      distance?: string;
    }[];
  }[];
}

const LocationScores = ({ scores }: LocationScoresProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {scores.map((score, index) => (
      <div key={index} className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
          {score.icon}
          <h3 className="font-semibold">{score.label}</h3>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{score.description}</span>
            <span className="font-medium">{score.value}/100</span>
          </div>
          <Progress value={score.value} className="h-2" />
        </div>
      </div>
    ))}
  </div>
);

const LocationInfo = ({ info }: LocationInfoProps) => (
  <div className="space-y-6">
    {info.map((category, idx) => (
      <div key={idx} className="space-y-3">
        <h3 className="font-semibold text-lg">{category.category}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.items.map((item, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                {item.distance && <span className="text-xs text-muted-foreground">{item.distance}</span>}
              </div>
              <p className="text-base mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const PropertyLocationAnalysisTab = ({ property }: PropertyLocationAnalysisTabProps) => {
  // Generate scores based on the property location (in a real app, this would come from an API)
  const locationScores = [
    {
      label: "Investment Potential",
      value: 86,
      description: "Long-term value growth",
      icon: <ChartLine className="h-5 w-5 text-blue-500" />
    },
    {
      label: "Rental Demand",
      value: 92,
      description: "Tenant demand in the area",
      icon: <Building className="h-5 w-5 text-indigo-500" />
    },
    {
      label: "Infrastructure",
      value: 78,
      description: "Quality of local infrastructure",
      icon: <Map className="h-5 w-5 text-emerald-500" />
    },
    {
      label: "Market Liquidity",
      value: 81,
      description: "Ease of buying/selling",
      icon: <DollarSign className="h-5 w-5 text-amber-500" />
    },
    {
      label: "Neighborhood Rating",
      value: 85,
      description: "Overall quality of location",
      icon: <MapPin className="h-5 w-5 text-rose-500" />
    },
    {
      label: "Price Development",
      value: 74,
      description: "Historical price trends",
      icon: <ChartBar className="h-5 w-5 text-purple-500" />
    }
  ];

  // Mock location data (in a real app, this would come from an API based on the address)
  const locationInfo = [
    {
      category: "Transportation",
      items: [
        { name: "Public Transit", value: "Excellent", distance: "350m" },
        { name: "Main Station", value: "Berlin Hauptbahnhof", distance: "2.5 km" },
        { name: "Airport", value: "Berlin Brandenburg (BER)", distance: "22 km" },
        { name: "Highway Access", value: "Good", distance: "3.2 km" },
        { name: "Bike Lanes", value: "Extensive network" }
      ]
    },
    {
      category: "Education",
      items: [
        { name: "Primary Schools", value: "3 within 1km" },
        { name: "Secondary Schools", value: "2 within 2km" },
        { name: "Universities", value: "Humboldt University", distance: "1.8 km" },
        { name: "Kindergartens", value: "4 within 1km" }
      ]
    },
    {
      category: "Daily Needs",
      items: [
        { name: "Supermarkets", value: "5 within 1km" },
        { name: "Pharmacies", value: "3 within 1km" },
        { name: "Healthcare", value: "2 clinics, 1 hospital", distance: "1.2 km" },
        { name: "Restaurants", value: "High density" },
        { name: "Shopping", value: "Shopping center", distance: "800m" }
      ]
    },
    {
      category: "Recreation",
      items: [
        { name: "Parks", value: "2 major parks", distance: "500m" },
        { name: "Sports Facilities", value: "Fitness center, swimming pool", distance: "1.1 km" },
        { name: "Cultural Venues", value: "Theater, cinema, museums", distance: "1.5 km" }
      ]
    },
    {
      category: "Market Analysis",
      items: [
        { name: "Average Price/m²", value: "€4,850" },
        { name: "5-Year Price Change", value: "+22.5%" },
        { name: "Average Rent/m²", value: "€15.40" },
        { name: "Vacancy Rate", value: "1.2%" },
        { name: "Investment Rating", value: "A (Excellent)" }
      ]
    }
  ];

  // Mock price developments for the area
  const priceHistory = [
    { year: "2018", price: 3650 },
    { year: "2019", price: 3850 },
    { year: "2020", price: 4100 },
    { year: "2021", price: 4350 },
    { year: "2022", price: 4600 },
    { year: "2023", price: 4780 },
    { year: "2024", price: 4850 },
  ];

  // Calculate average price per sqm in the neighborhood
  const avgPricePerSqm = 4850;
  const propertyPricePerSqm = Math.round(property.purchasePrice / property.squareMeters);
  const priceDifference = ((propertyPricePerSqm - avgPricePerSqm) / avgPricePerSqm * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Location Analysis</CardTitle>
              <CardDescription>Comprehensive analysis of {property.address}, {property.city}</CardDescription>
            </div>
            <div className="flex items-center text-xl font-semibold">
              <MapPin className="text-primary h-5 w-5 mr-1" /> Location Score: 84/100
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="micro">Micro-Location</TabsTrigger>
              <TabsTrigger value="market">Market Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 pt-4">
              <LocationScores scores={locationScores} />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Price Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">This Property</p>
                      <p className="text-xl font-semibold">€{propertyPricePerSqm}/m²</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Neighborhood Average</p>
                      <p className="text-xl font-semibold">€{avgPricePerSqm}/m²</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Difference</p>
                      <p className={`text-xl font-semibold ${parseFloat(priceDifference) < 0 ? 'text-green-600' : 'text-amber-600'}`}>
                        {priceDifference}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Location Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Excellent public transportation connectivity</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>High-quality educational institutions nearby</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Low vacancy rate (high tenant demand)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Strong historical price appreciation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Wide range of amenities within walking distance</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Location Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span>Limited parking availability</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span>High property tax assessment area</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span>Above-average noise levels during peak hours</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="micro" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Micro-Location Details</CardTitle>
                  <CardDescription>Detailed information about amenities and services near this property</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocationInfo info={locationInfo.slice(0, 4)} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="market" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Data</CardTitle>
                  <CardDescription>Real estate market conditions for this location</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocationInfo info={[locationInfo[4]]} />
                  
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-3">Historical Price Development (€/m²)</h3>
                    <div className="h-64 flex items-end gap-3">
                      {priceHistory.map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="bg-primary/80 w-full rounded-t-sm" 
                            style={{ 
                              height: `${(item.price / priceHistory[priceHistory.length - 1].price) * 200}px`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <span className="text-xs">{item.year}</span>
                          <span className="text-xs font-medium">€{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Average Time to Sell</h4>
                        <p className="text-2xl font-semibold mt-1">48 days</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Development Zones</h4>
                        <p className="text-2xl font-semibold mt-1">2 nearby</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Rent Growth (YoY)</h4>
                        <p className="text-2xl font-semibold mt-1">+3.8%</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Location Map</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-muted rounded-lg flex items-center justify-center h-[400px]">
            <div className="text-center">
              <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Interactive map would be displayed here</p>
              <p className="text-xs text-muted-foreground mt-1">{property.address}, {property.city}, {property.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyLocationAnalysisTab;
