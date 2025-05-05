
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FinancingPlan, PaymentScheduleEntry } from '@/interfaces/financing';
import { generatePaymentSchedule } from '@/utils/financingCalculator';

interface FinancingPlanFormProps {
  plan?: FinancingPlan;
  onSubmit: (plan: FinancingPlan) => void;
  onCancel?: () => void;
}

const FinancingPlanForm: React.FC<FinancingPlanFormProps> = ({ plan, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  const isEditMode = !!plan;
  
  const [formData, setFormData] = useState<Partial<FinancingPlan>>(
    plan || {
      name: '',
      loanAmount: 0,
      initialDate: new Date().toISOString().split('T')[0],
      interestRate: 3,
      loanTerm: 30,
      monthlyPayment: 0,
      loanType: 'annuity' as const,
      lender: '',
      fixedInterestPeriod: 10,
      paymentSchedule: []
    }
  );
  
  const [calculatedMonthlyPayment, setCalculatedMonthlyPayment] = useState<number | null>(
    plan ? plan.monthlyPayment : null
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'loanAmount' || name === 'interestRate' || 
              name === 'loanTerm' || name === 'fixedInterestPeriod' || 
              name === 'monthlyPayment' || name === 'initialPayment'
              ? parseFloat(value) 
              : value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const calculateMonthlyPayment = () => {
    if (formData.loanAmount && formData.interestRate && formData.loanTerm) {
      const monthlyInterestRate = (formData.interestRate / 100) / 12;
      const numberOfPayments = formData.loanTerm * 12;
      
      const monthlyPayment = 
        (formData.loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      
      setCalculatedMonthlyPayment(Number(monthlyPayment.toFixed(2)));
      
      // Update form data with calculated monthly payment
      setFormData({
        ...formData,
        monthlyPayment: Number(monthlyPayment.toFixed(2)),
        endDate: new Date(new Date(formData.initialDate || new Date()).setFullYear(
          new Date(formData.initialDate || new Date()).getFullYear() + formData.loanTerm
        )).toISOString().split('T')[0]
      });
    }
  };
  
  const generateAmortizationSchedule = () => {
    if (formData.loanAmount && formData.interestRate && formData.loanTerm && formData.monthlyPayment) {
      const schedule = generatePaymentSchedule(
        formData.loanAmount,
        formData.interestRate,
        formData.loanTerm,
        new Date(formData.initialDate || new Date())
      );
      
      setFormData({
        ...formData,
        paymentSchedule: schedule
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.monthlyPayment) {
      calculateMonthlyPayment();
    }
    
    if (!formData.paymentSchedule || formData.paymentSchedule.length === 0) {
      generateAmortizationSchedule();
    }
    
    // Generate a new end date if not present
    const endDate = formData.endDate || new Date(new Date(formData.initialDate || new Date()).setFullYear(
      new Date(formData.initialDate || new Date()).getFullYear() + (formData.loanTerm || 30)
    )).toISOString().split('T')[0];
    
    onSubmit({
      ...formData,
      endDate,
      paymentSchedule: formData.paymentSchedule || [],
      updatedAt: new Date().toISOString(),
    } as FinancingPlan);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t('financingPlanName')}</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="lender">{t('lender')}</Label>
            <Input 
              id="lender" 
              name="lender" 
              value={formData.lender} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="loanType">{t('loanType')}</Label>
            <Select 
              value={formData.loanType} 
              onValueChange={(value) => handleSelectChange('loanType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectLoanType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annuity">{t('annuityLoan')}</SelectItem>
                <SelectItem value="fixed-rate">{t('fixedRateLoan')}</SelectItem>
                <SelectItem value="variable-rate">{t('variableRateLoan')}</SelectItem>
                <SelectItem value="interest-only">{t('interestOnlyLoan')}</SelectItem>
                <SelectItem value="other">{t('otherLoanType')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="propertyId">{t('associatedProperty')}</Label>
            <Select 
              value={formData.propertyId || ''} 
              onValueChange={(value) => handleSelectChange('propertyId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectProperty')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="101">Wohnung in Berlin</SelectItem>
                <SelectItem value="102">Haus in Hamburg</SelectItem>
                <SelectItem value="103">Apartment in München</SelectItem>
                <SelectItem value="">-- {t('noAssociation')} --</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="loanAmount">{t('loanAmount')} (€)</Label>
            <Input 
              id="loanAmount" 
              name="loanAmount" 
              type="number" 
              min="1000" 
              step="1000" 
              value={formData.loanAmount} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="interestRate">{t('interestRate')} (%)</Label>
            <Input 
              id="interestRate" 
              name="interestRate" 
              type="number" 
              step="0.01" 
              min="0" 
              max="20" 
              value={formData.interestRate} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="loanTerm">{t('loanTerm')} ({t('years')})</Label>
            <Input 
              id="loanTerm" 
              name="loanTerm" 
              type="number" 
              min="1" 
              max="50" 
              value={formData.loanTerm} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="fixedInterestPeriod">{t('fixedInterestPeriod')} ({t('years')})</Label>
            <Input 
              id="fixedInterestPeriod" 
              name="fixedInterestPeriod" 
              type="number" 
              min="1" 
              max="30" 
              value={formData.fixedInterestPeriod} 
              onChange={handleChange} 
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="initialDate">{t('startDate')}</Label>
          <Input 
            id="initialDate" 
            name="initialDate" 
            type="date" 
            value={formData.initialDate ? formData.initialDate.split('T')[0] : ''} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="monthlyPayment">{t('monthlyPayment')} (€)</Label>
          <div className="relative">
            <Input 
              id="monthlyPayment" 
              name="monthlyPayment" 
              type="number" 
              step="0.01" 
              min="0" 
              value={formData.monthlyPayment || ''} 
              onChange={handleChange} 
              placeholder={calculatedMonthlyPayment ? calculatedMonthlyPayment.toFixed(2) : undefined}
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={calculateMonthlyPayment}
              className="absolute top-0 right-0 h-10 px-3"
            >
              {t('calculate')}
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">{t('notes')}</Label>
        <Input 
          id="notes" 
          name="notes" 
          value={formData.notes || ''} 
          onChange={handleChange} 
        />
      </div>
      
      {calculatedMonthlyPayment && (
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <AlertDescription>
                {t('calculatedMonthlyPayment')}: €{calculatedMonthlyPayment.toFixed(2)}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
        )}
        <Button type="submit">
          {isEditMode ? t('updatePlan') : t('createPlan')}
        </Button>
      </div>
    </form>
  );
};

export default FinancingPlanForm;
