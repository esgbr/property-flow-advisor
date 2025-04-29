
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';

const PropertyRefurbishmentTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Refurbishment Planning</CardTitle>
        <CardDescription>Renovation cost and potential value increase</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Refurbishment details will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default PropertyRefurbishmentTab;
