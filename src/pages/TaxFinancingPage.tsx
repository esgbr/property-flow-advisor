
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Calendar, PiggyBank, Coins, FileText } from 'lucide-react';
import TaxOptimizationSimulator from '@/components/tax/TaxOptimizationSimulator';
import AfaPlanner from '@/components/tax/AfaPlanner';
import FinancingRateComparison from '@/components/financing/FinancingRateComparison';
import RepaymentPlanOptimizer from '@/components/financing/RepaymentPlanOptimizer';
import TaxCalendarReminders from '@/components/tax/TaxCalendarReminders';

const TaxFinancingPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Calculator className="mr-3 h-8 w-8" />
            {language === 'de' ? 'Steuer & Finanzierung' : 'Tax & Financing'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de'
              ? 'Steueroptimierung und Finanzierungsplanung für Ihre Immobilieninvestitionen'
              : 'Tax optimization and financing planning for your real estate investments'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'de' ? 'Zurück' : 'Back'}
        </Button>
      </div>

      <Tabs defaultValue="tax-optimization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tax-optimization">
            <Calculator className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Steueroptimierung' : 'Tax Optimization'}
          </TabsTrigger>
          <TabsTrigger value="afa-planning">
            <FileText className="mr-2 h-4 w-4" />
            {language === 'de' ? 'AfA-Planung' : 'Depreciation Planning'}
          </TabsTrigger>
          <TabsTrigger value="financing-comparison">
            <Coins className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Finanzierungsvergleich' : 'Financing Comparison'}
          </TabsTrigger>
          <TabsTrigger value="repayment-optimizer">
            <PiggyBank className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Tilgungsoptimierung' : 'Repayment Optimization'}
          </TabsTrigger>
          <TabsTrigger value="tax-calendar">
            <Calendar className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Steuerkalender' : 'Tax Calendar'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tax-optimization">
          <TaxOptimizationSimulator />
        </TabsContent>

        <TabsContent value="afa-planning">
          <AfaPlanner />
        </TabsContent>

        <TabsContent value="financing-comparison">
          <FinancingRateComparison />
        </TabsContent>

        <TabsContent value="repayment-optimizer">
          <RepaymentPlanOptimizer />
        </TabsContent>

        <TabsContent value="tax-calendar">
          <TaxCalendarReminders />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxFinancingPage;
