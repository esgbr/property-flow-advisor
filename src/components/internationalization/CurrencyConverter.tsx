
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRightLeft, RefreshCw, Check, Calculator } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

/**
 * Currency converter component for real estate investment calculations
 */
const CurrencyConverter: React.FC = () => {
  const { language } = useLanguage();
  const [amount, setAmount] = useState<string>('100000');
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Common currencies in real estate investment
  const currencies: CurrencyOption[] = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' }
  ];

  // Mock exchange rates - in real app, these would come from an API
  useEffect(() => {
    const fetchRates = () => {
      setIsLoading(true);
      
      // Simulate API call - in a real app this would fetch from a currency API
      setTimeout(() => {
        const mockRates = {
          'EUR': 1,
          'USD': 1.09,
          'GBP': 0.86,
          'CHF': 0.96,
          'JPY': 162.5,
          'CAD': 1.47,
          'AUD': 1.64,
          'CNY': 7.87,
          'SGD': 1.46,
          'AED': 4.0
        };
        
        setRates(mockRates);
        setLastUpdated(new Date());
        setIsLoading(false);
        
        // Recalculate if we have an amount
        if (amount) {
          calculateConversion(amount, fromCurrency, toCurrency, mockRates);
        }
      }, 1000);
    };
    
    fetchRates();
  }, []);

  // Calculate conversion based on rates
  const calculateConversion = (
    amount: string, 
    from: string, 
    to: string, 
    currentRates: Record<string, number> = rates
  ) => {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount)) {
      setResult(null);
      return;
    }
    
    // Both currencies need to use EUR as base
    const fromRate = currentRates[from] || 1;
    const toRate = currentRates[to] || 1;
    
    // Convert from source currency to EUR, then to target currency
    const amountInEur = numericAmount / fromRate;
    const convertedAmount = amountInEur * toRate;
    
    setResult(convertedAmount);
  };
  
  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    calculateConversion(newAmount, fromCurrency, toCurrency);
  };
  
  // Handle currency change
  const handleCurrencyChange = (currency: string, isSource: boolean) => {
    if (isSource) {
      setFromCurrency(currency);
      calculateConversion(amount, currency, toCurrency);
    } else {
      setToCurrency(currency);
      calculateConversion(amount, fromCurrency, currency);
    }
  };
  
  // Switch currencies
  const handleSwitchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    calculateConversion(amount, toCurrency, fromCurrency);
    
    toast.success(
      language === 'de' 
        ? 'Währungen getauscht' 
        : 'Currencies swapped',
      {
        description: language === 'de'
          ? `${toCurrency} zu ${fromCurrency}`
          : `${toCurrency} to ${fromCurrency}`
      }
    );
  };
  
  // Force refresh rates
  const handleRefreshRates = () => {
    toast.info(
      language === 'de' 
        ? 'Aktualisiere Wechselkurse...' 
        : 'Refreshing exchange rates...'
    );
    
    setIsLoading(true);
    
    // Simulate API call - in a real app this would fetch from a currency API
    setTimeout(() => {
      // Small random variation for demo purposes
      const updatedRates = { ...rates };
      Object.keys(updatedRates).forEach(key => {
        if (key !== 'EUR') {
          updatedRates[key] = updatedRates[key] * (1 + (Math.random() * 0.02 - 0.01));
        }
      });
      
      setRates(updatedRates);
      setLastUpdated(new Date());
      calculateConversion(amount, fromCurrency, toCurrency, updatedRates);
      setIsLoading(false);
      
      toast.success(
        language === 'de' 
          ? 'Wechselkurse aktualisiert' 
          : 'Exchange rates updated',
        {
          description: language === 'de'
            ? `Letzte Aktualisierung: ${new Date().toLocaleTimeString()}`
            : `Last update: ${new Date().toLocaleTimeString()}`
        }
      );
    }, 2000);
  };

  // Format based on locale
  const formatCurrency = (value: number, currencyCode: string) => {
    const currencyOption = currencies.find(c => c.code === currencyCode);
    const symbol = currencyOption?.symbol || currencyCode;
    
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Get localized currency name
  const getLocalizedCurrencyName = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    
    if (!currency) return code;
    
    const localizedNames: Record<string, Record<string, string>> = {
      'de': {
        'EUR': 'Euro',
        'USD': 'US-Dollar',
        'GBP': 'Britisches Pfund',
        'CHF': 'Schweizer Franken',
        'JPY': 'Japanischer Yen',
        'CAD': 'Kanadischer Dollar',
        'AUD': 'Australischer Dollar',
        'CNY': 'Chinesischer Yuan',
        'SGD': 'Singapur-Dollar',
        'AED': 'VAE-Dirham'
      }
    };
    
    if (language === 'de' && localizedNames['de'][code]) {
      return localizedNames['de'][code];
    }
    
    return currency.name;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {language === 'de' ? 'Währungsumrechner' : 'Currency Converter'}
        </CardTitle>
        <CardDescription>
          {language === 'de'
            ? 'Berechnen Sie Immobilienwerte in verschiedenen Währungen'
            : 'Calculate property values in different currencies'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === 'de' ? 'Betrag' : 'Amount'}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currencies.find(c => c.code === fromCurrency)?.symbol}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">
                  {language === 'de' ? 'Von' : 'From'}
                </label>
                <Select
                  value={fromCurrency}
                  onValueChange={(value) => handleCurrencyChange(value, true)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={fromCurrency} />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center">
                          <span className="mr-1">{currency.symbol}</span>
                          <span>{getLocalizedCurrencyName(currency.code)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwitchCurrencies}
                  className="rounded-full"
                  disabled={isLoading}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  <span className="sr-only">
                    {language === 'de' ? 'Währungen tauschen' : 'Switch currencies'}
                  </span>
                </Button>
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">
                  {language === 'de' ? 'Nach' : 'To'}
                </label>
                <Select
                  value={toCurrency}
                  onValueChange={(value) => handleCurrencyChange(value, false)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={toCurrency} />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center">
                          <span className="mr-1">{currency.symbol}</span>
                          <span>{getLocalizedCurrencyName(currency.code)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Result card */}
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  {language === 'de' ? 'Umgerechneter Betrag' : 'Converted Amount'}
                </div>
                <div className="text-2xl font-bold">
                  {result !== null 
                    ? formatCurrency(result, toCurrency)
                    : '-'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      {language === 'de' ? 'Wird aktualisiert...' : 'Updating...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Check className="h-3 w-3 mr-1 text-green-600" />
                      {lastUpdated && (
                        language === 'de'
                          ? `Letzte Aktualisierung: ${lastUpdated.toLocaleTimeString()}`
                          : `Last updated: ${lastUpdated.toLocaleTimeString()}`
                      )}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-2">
                  1 {fromCurrency} = {rates[toCurrency] / rates[fromCurrency]} {toCurrency}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshRates}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {language === 'de' ? 'Aktualisieren' : 'Refresh Rates'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
