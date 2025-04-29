
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';

const PropertyScheduleTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
        <CardDescription>Important dates and appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Schedule and appointments will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default PropertyScheduleTab;
