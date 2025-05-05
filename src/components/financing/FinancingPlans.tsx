
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PieChart, Calendar, TrendingUp } from 'lucide-react';
import { FinancingPlan } from '@/interfaces/financing';
import FinancingPlanList from './FinancingPlanList';
import FinancingPlanForm from './FinancingPlanForm';
import FinancingOverview from './FinancingOverview';
import PaymentScheduleView from './PaymentScheduleView';

// Sample data for development
const sampleFinancingPlans: FinancingPlan[] = [
  {
    id: '1',
    name: 'Hauptfinanzierung Wohnung Berlin',
    loanAmount: 250000,
    initialDate: '2023-01-15',
    endDate: '2053-01-15',
    interestRate: 2.75,
    fixedInterestPeriod: 10,
    monthlyPayment: 1024.56,
    loanTerm: 30,
    lender: 'Commerzbank',
    loanType: 'annuity',
    propertyId: '101',
    paymentSchedule: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2023, i, 15).toISOString(),
      paymentNumber: i + 1,
      totalPayment: 1024.56,
      principalPayment: 500 + Math.random() * 50,
      interestPayment: 500 - Math.random() * 50,
      remainingBalance: 250000 - (i * 500)
    })),
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Grundschuld Hamburg Immobilie',
    loanAmount: 320000,
    initialDate: '2022-06-01',
    endDate: '2047-06-01',
    interestRate: 3.1,
    fixedInterestPeriod: 15,
    monthlyPayment: 1369.23,
    loanTerm: 25,
    lender: 'Deutsche Bank',
    loanType: 'fixed-rate',
    propertyId: '102',
    paymentSchedule: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2023, i, 1).toISOString(),
      paymentNumber: i + 13, // 2nd year
      totalPayment: 1369.23,
      principalPayment: 600 + Math.random() * 50,
      interestPayment: 769.23 - Math.random() * 50,
      remainingBalance: 320000 - (13 * 600) - (i * 600)
    })),
    createdAt: '2022-05-20T14:30:00Z',
    updatedAt: '2022-05-20T14:30:00Z'
  }
];

const FinancingPlans: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [plans, setPlans] = useState<FinancingPlan[]>(sampleFinancingPlans);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FinancingPlan | null>(null);
  
  const handleAddPlan = (plan: FinancingPlan) => {
    setPlans([...plans, { ...plan, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    setShowAddForm(false);
    toast({
      title: t('financingPlanAdded'),
      description: t('financingPlanAddedDescription'),
    });
  };
  
  const handlePlanSelect = (plan: FinancingPlan) => {
    setSelectedPlan(plan);
  };
  
  const handlePlanUpdate = (updatedPlan: FinancingPlan) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    setSelectedPlan(null);
    toast({
      title: t('financingPlanUpdated'),
      description: t('financingPlanUpdatedDescription'),
    });
  };
  
  const handlePlanDelete = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
    setSelectedPlan(null);
    toast({
      title: t('financingPlanDeleted'),
      description: t('financingPlanDeletedDescription'),
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('financingPlans')}</h1>
          <p className="text-muted-foreground">{t('manageYourFinancingPlans')}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? t('cancel') : t('addFinancingPlan')}
        </Button>
      </div>
      
      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('addNewFinancingPlan')}</CardTitle>
            <CardDescription>{t('enterFinancingDetails')}</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancingPlanForm onSubmit={handleAddPlan} />
          </CardContent>
        </Card>
      ) : selectedPlan ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('editFinancingPlan')}: {selectedPlan.name}</CardTitle>
            <CardDescription>{t('updateFinancingDetails')}</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancingPlanForm plan={selectedPlan} onSubmit={handlePlanUpdate} onCancel={() => setSelectedPlan(null)} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <PieChart className="mr-2 h-4 w-4" />
              {t('overview')}
            </TabsTrigger>
            <TabsTrigger value="plans">
              <Calendar className="mr-2 h-4 w-4" />
              {t('financingPlans')}
            </TabsTrigger>
            <TabsTrigger value="forecast">
              <TrendingUp className="mr-2 h-4 w-4" />
              {t('liquidityForecast')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <FinancingOverview plans={plans} />
          </TabsContent>
          
          <TabsContent value="plans">
            <FinancingPlanList 
              plans={plans} 
              onPlanSelect={handlePlanSelect}
              onPlanDelete={handlePlanDelete}
            />
          </TabsContent>
          
          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle>{t('liquidityForecast')}</CardTitle>
                <CardDescription>{t('forecastDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <PaymentScheduleView plans={plans} />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {t('generateDetailedForecast')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FinancingPlans;
