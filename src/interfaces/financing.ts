
export interface FinancingPlan {
  id: string;
  name: string;
  loanAmount: number;
  initialDate: string;
  endDate: string;
  interestRate: number;
  fixedInterestPeriod?: number;
  initialPayment?: number;
  monthlyPayment: number;
  loanTerm: number; // in years
  paymentSchedule: PaymentScheduleEntry[];
  lender: string;
  loanType: 'annuity' | 'fixed-rate' | 'variable-rate' | 'interest-only' | 'other';
  propertyId?: string; // Reference to associated property
  notes?: string;
  documents?: string[]; // URLs to documents
  createdAt: string;
  updatedAt: string;
}

export interface PaymentScheduleEntry {
  date: string;
  paymentNumber: number;
  totalPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
  additionalPayment?: number;
}

export interface LiquidityForecast {
  id: string;
  name: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  forecastEntries: LiquidityForecastEntry[];
  propertyId?: string; // Can be linked to a specific property
}

export interface LiquidityForecastEntry {
  date: string;
  income: number;
  expenses: number;
  cashFlow: number;
  balance: number;
  category: 'rental_income' | 'mortgage_payment' | 'maintenance' | 'taxes' | 'insurance' | 'utilities' | 'other';
  description?: string;
  isRecurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'annual' | 'one-time';
}

// For organizing financing plans
export interface FinancingGroup {
  id: string;
  name: string;
  description?: string;
  plans: FinancingPlan[];
  totalLoanAmount: number;
  averageInterestRate: number;
  totalMonthlyPayment: number;
}
