import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Calculator } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { GrunderwerbsteuerCalculator } from '@/components/calculators/GrunderwerbsteuerCalculator';
import { WorkflowNavigation } from '@/components/workflow/WorkflowNavigation';
import { WorkflowSuggestions } from '@/components/workflow/WorkflowSuggestions';

const GrunderwerbsteuerPage: React.FC = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('grunderwerbsteuerCalculator')}
        </h1>
        <p className="text-muted-foreground">
          {t('calculateGrunderwerbsteuer')}
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('calculator')}</CardTitle>
          <CardDescription>{t('enterPropertyDetails')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <GrunderwerbsteuerCalculator />
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <WorkflowNavigation 
          workflowType="steuer" 
          currentStep="grunderwerbsteuer"
          variant="compact"
          className="mb-4"
        />

        <WorkflowSuggestions
          currentTool="grunderwerbsteuer"
          workflowType="steuer"
          maxSuggestions={2}
        />
      </div>
    </div>
  );
};

export default GrunderwerbsteuerPage;
