
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
  status: 'active' | 'pending' | 'sold' | 'off-market';
  createdAt: string;
  updatedAt: string;
}
