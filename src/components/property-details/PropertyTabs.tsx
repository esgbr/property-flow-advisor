
import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Property } from '@/interfaces/property';
import PropertyDetailsTab from './PropertyDetailsTab';
import PropertyFinancialTab from './PropertyFinancialTab';
import PropertyScheduleTab from './PropertyScheduleTab';
import PropertyRefurbishmentTab from './PropertyRefurbishmentTab';
import PropertyDocumentsTab from './PropertyDocumentsTab';
import PropertyLocationAnalysisTab from './PropertyLocationAnalysisTab';
import { Building, Calculator, Calendar, FileText, Map, TrendingUp, BarChart, Users } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface PropertyTabsProps {
  property: Property;
}

const PropertyTabs = ({ property }: PropertyTabsProps) => {
  // Force tab refresh when property changes
  const [key, setKey] = React.useState(0);
  const { preferences } = useUserPreferences();
  
  useEffect(() => {
    // When property changes (especially address), refresh the components
    setKey(prev => prev + 1);
  }, [property.address, property.city, property.country, property.zipCode]);

  return (
    <Tabs defaultValue="details" key={key} className="w-full animate-fade-in">
      <TabsList className="grid grid-cols-4 md:grid-cols-8 w-full">
        <TabsTrigger value="details" className="flex items-center gap-1">
          <Building className="h-4 w-4" />
          <span className="hidden md:inline">Details</span>
        </TabsTrigger>
        <TabsTrigger value="financial" className="flex items-center gap-1">
          <Calculator className="h-4 w-4" />
          <span className="hidden md:inline">Financial</span>
        </TabsTrigger>
        <TabsTrigger value="location" className="flex items-center gap-1">
          <Map className="h-4 w-4" />
          <span className="hidden md:inline">Location</span>
        </TabsTrigger>
        <TabsTrigger value="schedule" className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span className="hidden md:inline">Schedule</span>
        </TabsTrigger>
        <TabsTrigger value="refurbishment" className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden md:inline">Refurbishment</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span className="hidden md:inline">Documents</span>
        </TabsTrigger>
        <TabsTrigger value="market" className="flex items-center gap-1">
          <BarChart className="h-4 w-4" />
          <span className="hidden md:inline">Market</span>
        </TabsTrigger>
        <TabsTrigger value="tenants" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span className="hidden md:inline">Tenants</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="space-y-4 mt-4">
        <PropertyDetailsTab property={property} />
      </TabsContent>
      
      <TabsContent value="financial" className="mt-4">
        <PropertyFinancialTab />
      </TabsContent>
      
      <TabsContent value="location" className="mt-4">
        <PropertyLocationAnalysisTab property={property} />
      </TabsContent>
      
      <TabsContent value="schedule" className="mt-4">
        <PropertyScheduleTab />
      </TabsContent>
      
      <TabsContent value="refurbishment" className="mt-4">
        <PropertyRefurbishmentTab />
      </TabsContent>
      
      <TabsContent value="documents" className="mt-4">
        <PropertyDocumentsTab />
      </TabsContent>
      
      <TabsContent value="market" className="mt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Market Analysis</h3>
          <p className="text-muted-foreground">
            Detailed market analysis for {property.address}, {property.city}
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Market Trends</h4>
              <p className="text-sm text-muted-foreground">
                Current market trends for {property.city} and surrounding areas.
              </p>
              <div className="h-32 bg-muted rounded flex items-center justify-center">
                Market trend chart (loading...)
              </div>
            </div>
            
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Comparable Properties</h4>
              <p className="text-sm text-muted-foreground">
                Similar properties in the area and their valuations.
              </p>
              <div className="space-y-2 mt-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between p-2 border-b">
                    <div className="text-sm">Similar property #{item}</div>
                    <div className="font-medium">€{(property.purchasePrice * (0.9 + (item * 0.1))).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="tenants" className="mt-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tenant Management</h3>
          <p className="text-muted-foreground">
            Manage tenants and rental income for this property
          </p>
          
          {preferences.experienceLevel === 'expert' ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Current Tenants</h4>
                <div className="space-y-2 mt-2">
                  {property.isRental ? (
                    [1, 2].map((item) => (
                      <div key={item} className="flex items-center justify-between p-2 border-b">
                        <div>
                          <div className="text-sm font-medium">Tenant #{item}</div>
                          <div className="text-xs text-muted-foreground">Since: Jan {2022 + item}</div>
                        </div>
                        <div className="text-sm font-medium">€{(700 + (item * 150)).toLocaleString()}/mo</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No active tenants for this property</div>
                  )}
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Rental History</h4>
                <div className="space-y-2 mt-2">
                  <div className="h-32 bg-muted rounded flex items-center justify-center">
                    Rental income chart (loading...)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average occupancy rate: 94%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-4 flex items-center justify-center h-40">
              <div className="text-center">
                <p className="text-muted-foreground">Advanced tenant management available for expert users</p>
                <button 
                  className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                  onClick={() => alert('Feature not available in your current plan')}
                >
                  Upgrade Experience Level
                </button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PropertyTabs;
