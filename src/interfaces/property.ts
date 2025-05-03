
export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  sizeUnit: 'sqft' | 'sqm';
  purchasePrice: number;
  currentValue: number;
  currency: string;
  images: string[];
  features?: string[];
  yearBuilt?: number;
  lastRenovated?: number;
  parkingSpaces?: number;
  isRental?: boolean;
  rentalIncome?: number;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'pending' | 'sold' | 'off-market' | 'analyzing' | 'negotiating' | 'prospect' | 'owned' | 'under_contract' | 'rejected';
  createdAt: string;
  updatedAt: string;
  
  // Additional properties found in current codebase
  imageUrl?: string;
  squareMeters?: number;
  rooms?: number;
  financials?: {
    purchasePricePerSqm?: number;
    expectedRent?: number;
    grossRentalYield?: number;
    monthlyIncome?: number;
    monthlyExpenses?: number;
    monthlyCashFlow?: number;
    annualCashFlow?: number;
    capRate?: number;
  };
  financing?: {
    loanAmount?: number;
    downPayment?: number;
    interestRate?: number;
    loanTerm?: number;
    fixedRatePeriod?: number;
    amortizationRate?: number;
    monthlyPayment?: number;
    loanType?: string;
  };
  refurbishment?: {
    totalBudget: number;
    completionTimeframe: number;
    tasks: Array<{
      id: string;
      name: string;
      cost: number;
      status: string;
    }>;
    expectedValueIncrease: number;
    expectedRentIncrease: number;
  };
  dismissedSecurityAlert?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'broker' | 'bank' | 'notary' | 'contractor' | 'tenant' | 'other';
  company?: string;
  notes?: string;
}
