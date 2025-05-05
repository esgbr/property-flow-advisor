
import React from 'react';
import { useLanguage } from '@/contexts/FixedLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FinancingPlan } from '@/interfaces/financing';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface FinancingPlanListProps {
  plans: FinancingPlan[];
  onPlanSelect: (plan: FinancingPlan) => void;
  onPlanDelete: (id: string) => void;
}

const FinancingPlanList: React.FC<FinancingPlanListProps> = ({ plans, onPlanSelect, onPlanDelete }) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('activeFinancingPlans')}</CardTitle>
        <CardDescription>{t('viewAndManageAllFinancingPlans')}</CardDescription>
      </CardHeader>
      <CardContent>
        {plans.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t('noFinancingPlans')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('lender')}</TableHead>
                <TableHead className="text-right">{t('loanAmount')}</TableHead>
                <TableHead className="text-right">{t('interestRate')}</TableHead>
                <TableHead className="text-right">{t('monthlyPayment')}</TableHead>
                <TableHead className="text-right">{t('remainingTerm')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                // Calculate remaining term in years and months
                const endDate = new Date(plan.endDate);
                const now = new Date();
                const remainingMonths = (endDate.getFullYear() - now.getFullYear()) * 12 + (endDate.getMonth() - now.getMonth());
                const remainingYears = Math.floor(remainingMonths / 12);
                const months = remainingMonths % 12;
                
                return (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.lender}</TableCell>
                    <TableCell className="text-right">€{plan.loanAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{plan.interestRate}%</TableCell>
                    <TableCell className="text-right">€{plan.monthlyPayment.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{remainingYears} {t('years')} {months} {t('months')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => onPlanSelect(plan)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t('edit')}</span>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => onPlanDelete(plan.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t('delete')}</span>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => alert(t('viewPaymentSchedule'))}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">{t('view')}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancingPlanList;
