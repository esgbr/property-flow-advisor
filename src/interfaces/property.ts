
// Property interfaces
export interface PropertyBasics {
  id?: string;
  title: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  propertyType: string;
  squareMeters: number;
  rooms: number;
  purchasePrice: number;
  status: 'prospect' | 'analyzing' | 'negotiating' | 'under_contract' | 'owned' | 'rejected';
  imageUrl?: string;
}

export interface FinancialDetails {
  purchasePricePerSqm: number;
  expectedRent: number;
  grossRentalYield: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  capRate: number;
}

export interface FinancingDetails {
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number; // in years
  fixedRatePeriod: number; // in years
  amortizationRate: number;
  monthlyPayment: number;
  loanType: 'annuity' | 'fixed_principal';
}

export interface RefurbishmentDetails {
  totalBudget: number;
  completionTimeframe: number; // in months
  tasks: RefurbishmentTask[];
  expectedValueIncrease: number;
  expectedRentIncrease: number;
}

export interface RefurbishmentTask {
  id: string;
  name: string;
  cost: number;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface AppointmentSchedule {
  appointments: Appointment[];
}

export interface Appointment {
  id: string;
  title: string;
  date: Date;
  type: 'viewing' | 'notary' | 'bank' | 'handover' | 'contractor' | 'other';
  notes?: string;
  location?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface PurchaseDecisionCriteria {
  cashFlowPositive: boolean;
  goodLocation: boolean;
  structurallySound: boolean;
  growthPotential: boolean;
  affordableRenovation: boolean;
  favorableFinancing: boolean;
  quickClosing: boolean;
  notes: string;
  decision: 'buy' | 'pass' | 'undecided';
}

export interface Property extends PropertyBasics {
  financials?: FinancialDetails;
  financing?: FinancingDetails;
  refurbishment?: RefurbishmentDetails;
  schedule?: AppointmentSchedule;
  decisionCriteria?: PurchaseDecisionCriteria;
}

// Broker/Contact interfaces
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: 'broker' | 'seller' | 'bank' | 'notary' | 'contractor' | 'other';
  company?: string;
  notes?: string;
}
