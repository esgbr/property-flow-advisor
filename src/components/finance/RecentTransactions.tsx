
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  property?: string;
}

const RecentTransactions: React.FC = () => {
  const { language } = useLanguage();
  
  // Sample transactions data
  const transactions: Transaction[] = [
    {
      id: 1,
      date: '2023-05-01',
      description: language === 'de' ? 'Mieteinnahme' : 'Rental income',
      amount: 1200,
      type: 'income',
      property: 'Apartment 12B'
    },
    {
      id: 2,
      date: '2023-04-28',
      description: language === 'de' ? 'Reparatur' : 'Repair work',
      amount: 350,
      type: 'expense',
      property: 'Commercial Space'
    },
    {
      id: 3,
      date: '2023-04-25',
      description: language === 'de' ? 'Mieteinnahme' : 'Rental income',
      amount: 2800,
      type: 'income',
      property: 'Residential Building'
    },
    {
      id: 4,
      date: '2023-04-20',
      description: language === 'de' ? 'Versicherungszahlung' : 'Insurance payment',
      amount: 480,
      type: 'expense',
      property: 'Apartment 12B'
    },
    {
      id: 5,
      date: '2023-04-15',
      description: language === 'de' ? 'Mieteinnahme' : 'Rental income',
      amount: 950,
      type: 'income',
      property: 'Commercial Space'
    }
  ];

  // Format date based on language
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (language === 'de') {
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex justify-between items-start pb-3 border-b last:border-0 last:pb-0">
          <div>
            <p className="font-medium">{transaction.description}</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
              {transaction.property && (
                <span className="text-xs text-muted-foreground ml-2">• {transaction.property}</span>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+' : '-'}€{transaction.amount}
            </span>
            <Badge variant={transaction.type === 'income' ? 'outline' : 'secondary'} className="ml-2">
              {transaction.type === 'income' 
                ? (language === 'de' ? 'Einnahme' : 'Income')
                : (language === 'de' ? 'Ausgabe' : 'Expense')
              }
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;
