
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';

const PropertyFinancialTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Analysis</CardTitle>
        <CardDescription>Key financial indicators for this investment</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Financial analysis details will be displayed here.</p>
      </CardContent>
    </Card>
  );
};

export default PropertyFinancialTab;
