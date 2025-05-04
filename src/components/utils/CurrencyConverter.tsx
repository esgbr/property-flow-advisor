
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, RefreshCw, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CurrencyConverter: React.FC = () => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [convertedAmount, setConvertedAmount] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Sample exchange rates (in a real app, these would come from an API)
  const exchangeRates = {
    EUR: {
      USD: 1.07,
      GBP: 0.85,
      CHF: 0.96,
      JPY: 163.45,
      CAD: 1.47,
      AUD: 1.64
    },
    USD: {
      EUR: 0.93,
      GBP: 0.79,
      CHF: 0.89,
      JPY: 152.38,
      CAD: 1.37,
      AUD: 1.53
    },
    GBP: {
      EUR: 1.18,
      USD: 1.27,
      CHF: 1.13,
      JPY: 192.82,
      CAD: 1.73,
      AUD: 1.93
    },
    CHF: {
      EUR: 1.04,
      USD: 1.12,
      GBP: 0.88,
      JPY: 170.26,
      CAD: 1.53,
      AUD: 1.71
    },
    JPY: {
      EUR: 0.0061,
      USD: 0.0066,
      GBP: 0.0052,
      CHF: 0.0059,
      CAD: 0.0090,
      AUD: 0.010
    },
    CAD: {
      EUR: 0.68,
      USD: 0.73,
      GBP: 0.58,
      CHF: 0.65,
      JPY: 111.19,
      AUD: 1.12
    },
    AUD: {
      EUR: 0.61,
      USD: 0.65,
      GBP: 0.52,
      CHF: 0.58,
      JPY: 99.66,
      CAD: 0.89
    }
  };

  // Currencies
  const currencies = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  // Get currency name by code
  const getCurrencyName = (code: string): string => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.name : code;
  };

  // Get currency symbol by code
  const getCurrencySymbol = (code: string): string => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : code;
  };

  // Swap currencies
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Convert currency
  const convertCurrency = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setConvertedAmount('');
      setExchangeRate(null);
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      setExchangeRate(1);
      return;
    }

    const rate = exchangeRates[fromCurrency as keyof typeof exchangeRates][toCurrency as keyof typeof exchangeRates[typeof fromCurrency]];
    const converted = numAmount * rate;
    setConvertedAmount(converted.toFixed(2));
    setExchangeRate(rate);
    setLastUpdated(new Date().toLocaleDateString());
  };

  // Effect to convert currency when inputs change
  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {t('Currency Converter')}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-1">
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('Convert property values between different currencies')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>{t('Convert between real estate markets')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('Amount')}</label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {getCurrencySymbol(fromCurrency)}
              </div>
            </div>
          </div>
          
          {/* Currency selection */}
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">{t('From')}</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select currency')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('Currencies')}</SelectLabel>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="mt-6"
              onClick={swapCurrencies}
              title={t('Swap currencies')}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('To')}</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select currency')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('Currencies')}</SelectLabel>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Result */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{t('Converted Amount')}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={convertCurrency}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {t('Refresh')}
              </Button>
            </div>
            <div className="text-2xl font-bold">
              {convertedAmount ? (
                <>
                  {getCurrencySymbol(toCurrency)} {parseFloat(convertedAmount).toLocaleString()}
                </>
              ) : (
                '—'
              )}
            </div>
            {exchangeRate !== null && (
              <div className="text-xs text-muted-foreground mt-1">
                {t('Exchange Rate')}: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </div>
            )}
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-muted-foreground text-right">
              {t('Last updated')}: {lastUpdated}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
