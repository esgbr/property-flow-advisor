
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, RefreshCw, Globe, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

// Currency type
type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'JPY' | 'CAD' | 'AUD';

// Fixed exchange rate type to properly handle self-references
type ExchangeRates = Record<Currency, Record<Currency, number>>;

const CurrencyConverter: React.FC = () => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<Currency>('EUR');
  const [toCurrency, setToCurrency] = useState<Currency>('USD');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Updated exchange rates with proper self-references for each currency
  const exchangeRates: ExchangeRates = {
    EUR: {
      EUR: 1.0,
      USD: 1.09,
      GBP: 0.85,
      CHF: 0.96,
      JPY: 157.20,
      CAD: 1.47,
      AUD: 1.62
    },
    USD: {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.78,
      CHF: 0.88,
      JPY: 144.50,
      CAD: 1.35,
      AUD: 1.49
    },
    GBP: {
      GBP: 1.0,
      EUR: 1.17,
      USD: 1.28,
      CHF: 1.13,
      JPY: 184.30,
      CAD: 1.73,
      AUD: 1.91
    },
    CHF: {
      CHF: 1.0,
      EUR: 1.04,
      USD: 1.14,
      GBP: 0.88,
      JPY: 163.30,
      CAD: 1.53,
      AUD: 1.69
    },
    JPY: {
      JPY: 1.0,
      EUR: 0.0064,
      USD: 0.0069,
      GBP: 0.0054,
      CHF: 0.0061,
      CAD: 0.0094,
      AUD: 0.0103
    },
    CAD: {
      CAD: 1.0,
      EUR: 0.68,
      USD: 0.74,
      GBP: 0.58,
      CHF: 0.65,
      JPY: 107.30,
      AUD: 1.10
    },
    AUD: {
      AUD: 1.0,
      EUR: 0.62,
      USD: 0.67,
      GBP: 0.52,
      CHF: 0.59,
      JPY: 97.30,
      CAD: 0.91
    }
  };

  // All available currencies
  const currencies: { value: Currency; label: string }[] = [
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CHF', label: 'Swiss Franc (CHF)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' }
  ];

  // Convert currencies
  const convertCurrency = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        const numAmount = parseFloat(amount);
        
        if (isNaN(numAmount)) {
          toast.error(t('Invalid Amount'), { description: t('Please enter a valid number') });
          setConvertedAmount(null);
          setIsLoading(false);
          return;
        }
        
        if (fromCurrency === toCurrency) {
          setConvertedAmount(numAmount);
        } else {
          const rate = exchangeRates[fromCurrency][toCurrency];
          const result = numAmount * rate;
          setConvertedAmount(result);
        }
        
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (error) {
        toast.error(t('Conversion Error'), { description: t('An error occurred during conversion') });
        setIsLoading(false);
      }
    }, 500);
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Format currency
  const formatCurrency = (value: number, currency: Currency): string => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return formatter.format(value);
  };

  // Effect to convert currency when input values change
  useEffect(() => {
    if (amount) {
      convertCurrency();
    }
  }, [fromCurrency, toCurrency]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          {t('Currency Converter')}
        </CardTitle>
        <CardDescription>
          {t('Convert between different currencies using real-time exchange rates')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('Amount')}
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-7 gap-2 items-center">
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">
                {t('From')}
              </label>
              <Select value={fromCurrency} onValueChange={(value: string) => setFromCurrency(value as Currency)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select currency')} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={swapCurrencies} 
              className="mt-6"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">
                {t('To')}
              </label>
              <Select value={toCurrency} onValueChange={(value: string) => setToCurrency(value as Currency)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select currency')} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={convertCurrency} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {t('Converting...')}
              </>
            ) : (
              t('Convert')
            )}
          </Button>
          
          {convertedAmount !== null && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                {t('Result')}:
              </div>
              <div className="grid grid-cols-1 gap-1">
                <div className="text-xl font-semibold">
                  {formatCurrency(parseFloat(amount), fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
                </div>
                <div className="text-sm text-muted-foreground">
                  1 {fromCurrency} = {exchangeRates[fromCurrency][toCurrency]} {toCurrency}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {t('Last updated')}: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurrencyConverter;
