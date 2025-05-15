
import { useMemo } from 'react';

const PROPERTIES = [
  { id: 1, name: 'Apartment 12B', value: 350000, location: 'Berlin', rental_yield: 4.2, ownership: 100 },
  { id: 2, name: 'Commercial Space', value: 520000, location: 'Frankfurt', rental_yield: 5.8, ownership: 100 },
  { id: 3, name: 'Residential Building', value: 1250000, location: 'Munich', rental_yield: 3.9, ownership: 75 }
];

export function usePortfolioData() {
  // Example of computing portfolio summary from properties
  return useMemo(() => {
    const properties = PROPERTIES;
    const totalValue = properties.reduce((sum, prop) => sum + prop.value, 0);
    const monthlyIncome = 8450; // Placeholder, could be computed
    const averageYield = (
      properties.reduce((sum, prop) => sum + prop.rental_yield, 0) /
      properties.length
    ).toFixed(1);
    const contactsCount = 12; // Placeholder
    return {
      properties,
      stats: {
        totalValue,
        monthlyIncome,
        averageYield,
        contactsCount,
      },
    };
  }, []);
}
