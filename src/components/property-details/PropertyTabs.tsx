
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Property } from '@/interfaces/property';
import PropertyDetailsTab from './PropertyDetailsTab';
import PropertyFinancialTab from './PropertyFinancialTab';
import PropertyScheduleTab from './PropertyScheduleTab';
import PropertyRefurbishmentTab from './PropertyRefurbishmentTab';
import PropertyDocumentsTab from './PropertyDocumentsTab';
import PropertyLocationAnalysisTab from './PropertyLocationAnalysisTab';

interface PropertyTabsProps {
  property: Property;
}

const PropertyTabs = ({ property }: PropertyTabsProps) => {
  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Property Details</TabsTrigger>
        <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
        <TabsTrigger value="location">Location Analysis</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="refurbishment">Refurbishment</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
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
    </Tabs>
  );
};

export default PropertyTabs;
