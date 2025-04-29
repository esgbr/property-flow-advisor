
import { Property, Contact } from '@/interfaces/property';

export const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment in City Center',
    address: '123 Main Street',
    city: 'Berlin',
    zipCode: '10115',
    country: 'Germany',
    propertyType: 'Apartment',
    squareMeters: 65,
    rooms: 2,
    purchasePrice: 320000,
    status: 'analyzing',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    financials: {
      purchasePricePerSqm: 4923,
      expectedRent: 1200,
      grossRentalYield: 4.5,
      monthlyIncome: 1200,
      monthlyExpenses: 240,
      monthlyCashFlow: 960,
      annualCashFlow: 11520,
      capRate: 3.6
    },
    financing: {
      loanAmount: 256000,
      downPayment: 64000,
      interestRate: 3.2,
      loanTerm: 30,
      fixedRatePeriod: 10,
      amortizationRate: 2,
      monthlyPayment: 1107,
      loanType: 'annuity'
    }
  },
  {
    id: '2',
    title: 'Suburban Family House',
    address: '456 Oak Drive',
    city: 'Munich',
    zipCode: '80331',
    country: 'Germany',
    propertyType: 'House',
    squareMeters: 150,
    rooms: 5,
    purchasePrice: 650000,
    status: 'prospect',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Investment Studio Apartment',
    address: '789 Pine Road',
    city: 'Hamburg',
    zipCode: '20095',
    country: 'Germany',
    propertyType: 'Studio',
    squareMeters: 35,
    rooms: 1,
    purchasePrice: 190000,
    status: 'negotiating',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    title: 'Renovation Project - Old Building',
    address: '101 River Street',
    city: 'Frankfurt',
    zipCode: '60311',
    country: 'Germany',
    propertyType: 'Apartment',
    squareMeters: 85,
    rooms: 3,
    purchasePrice: 280000,
    status: 'analyzing',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    refurbishment: {
      totalBudget: 45000,
      completionTimeframe: 4,
      tasks: [
        { id: 't1', name: 'Kitchen renovation', cost: 15000, status: 'planned' },
        { id: 't2', name: 'Bathroom update', cost: 12000, status: 'planned' },
        { id: 't3', name: 'Flooring replacement', cost: 8500, status: 'planned' },
        { id: 't4', name: 'Painting', cost: 5000, status: 'planned' },
        { id: 't5', name: 'Electrical update', cost: 4500, status: 'planned' }
      ],
      expectedValueIncrease: 70000,
      expectedRentIncrease: 300
    }
  }
];

export const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@realestate.com',
    phone: '+49 123 456789',
    type: 'broker',
    company: 'City Real Estate GmbH',
    notes: 'Specializes in city center properties'
  },
  {
    id: '2',
    name: 'Michael Brown',
    email: 'michael@propertysellers.de',
    phone: '+49 987 654321',
    type: 'broker',
    company: 'Property Sellers',
    notes: 'Has access to off-market deals'
  },
  {
    id: '3',
    name: 'Stefan Müller',
    email: 'stefan@deutschebank.de',
    phone: '+49 555 123456',
    type: 'bank',
    company: 'Deutsche Bank',
    notes: 'Fixed rate specialist'
  },
  {
    id: '4',
    name: 'Dr. Lisa Wagner',
    email: 'wagner@notary-berlin.de',
    phone: '+49 555 987654',
    type: 'notary',
    company: 'Wagner & Partners',
    notes: 'English-speaking notary'
  }
];
