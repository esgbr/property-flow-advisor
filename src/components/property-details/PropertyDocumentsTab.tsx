
import React from 'react';
import { FileText } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PropertyDocumentsTab = () => {
  return (
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
  );
};

export default PropertyDocumentsTab;
