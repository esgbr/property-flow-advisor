
import { useLanguage } from '@/contexts/LanguageContext';

export interface PortfolioSummary {
  totalValue: number;
  equity: number;
  totalProperties: number;
  cashFlow: number;
  roi: number;
  appreciation: number;
  debt: number;
  capRate: number;
  cashOnCash: number;
  netOperatingIncome: number;
  debtServiceCoverageRatio: number;
  vacancyRate: number;
}

export interface InvestorMetrics {
  leverageRatio: string;
  annualCashFlow: number;
  annualROI: string;
  breakEvenOccupancy: string;
}

/**
 * Calculate key investor metrics from portfolio summary data
 */
export const calculateInvestorMetrics = (summary: PortfolioSummary): InvestorMetrics => {
  const leverageRatio = summary.debt / summary.totalValue;
  const annualCashFlow = summary.cashFlow * 12;
  const annualROI = (annualCashFlow / summary.equity) * 100;
  
  return {
    leverageRatio: leverageRatio.toFixed(2),
    annualCashFlow,
    annualROI: annualROI.toFixed(1),
    breakEvenOccupancy: ((summary.debt * 0.06) / (summary.totalValue * 0.08) * 100).toFixed(1)
  };
};

/**
 * Format currency values according to selected language
 */
export const formatCurrency = (value: number, currencyCode = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format percentage values for display
 */
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Calculate mortgage payment based on loan amount, interest rate, and term
 */
export const calculateMortgagePayment = (
  loanAmount: number, 
  interestRatePercent: number, 
  termYears: number
): number => {
  const interestRate = interestRatePercent / 100 / 12;
  const totalPayments = termYears * 12;
  
  if (interestRate === 0) {
    return loanAmount / totalPayments;
  }
  
  const payment = (loanAmount * interestRate * Math.pow(1 + interestRate, totalPayments)) / 
                  (Math.pow(1 + interestRate, totalPayments) - 1);
  
  return payment;
};

/**
 * Get portfolio health status based on key metrics
 */
export const getPortfolioHealthStatus = (summary: PortfolioSummary): {
  status: 'excellent' | 'good' | 'average' | 'concern' | 'critical',
  message: string
} => {
  const metrics = calculateInvestorMetrics(summary);
  const leverageRatio = parseFloat(metrics.leverageRatio);
  
  if (summary.cashOnCash >= 8 && leverageRatio < 0.5 && summary.capRate > 6) {
    return { status: 'excellent', message: 'portfolioHealthExcellent' };
  } else if (summary.cashOnCash >= 6 && leverageRatio < 0.65 && summary.capRate > 5) {
    return { status: 'good', message: 'portfolioHealthGood' };
  } else if (summary.cashOnCash >= 4 && leverageRatio < 0.75) {
    return { status: 'average', message: 'portfolioHealthAverage' };
  } else if (summary.cashOnCash >= 2 && leverageRatio < 0.85) {
    return { status: 'concern', message: 'portfolioHealthConcern' };
  } else {
    return { status: 'critical', message: 'portfolioHealthCritical' };
  }
};
