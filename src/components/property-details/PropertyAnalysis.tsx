
import React from 'react';
import { Check, Calculator, Calendar, Wrench } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface PropertyAnalysisProps {
  analysisScore: number;
}

const PropertyAnalysis = ({ analysisScore }: PropertyAnalysisProps) => {
  return (
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
  );
};

export default PropertyAnalysis;
