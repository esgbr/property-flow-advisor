
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Coins, Plus, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type FinancingOffer = {
  id: string;
  provider: string;
  interestRate: number;
  fixedRatePeriod: number;
  processingFee: number;
  monthlyRate: number;
  specialRepayments: boolean;
  totalCost: number;
};

const FinancingRateComparison: React.FC = () => {
  const { language } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(300000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  
  // Sample offers data
  const [offers, setOffers] = useState<FinancingOffer[]>([
    {
      id: '1',
      provider: 'Deutsche Bank',
      interestRate: 2.8,
      fixedRatePeriod: 10,
      processingFee: 1500,
      monthlyRate: 1230,
      specialRepayments: true,
      totalCost: 442800
    },
    {
      id: '2',
      provider: 'Commerzbank',
      interestRate: 2.65,
      fixedRatePeriod: 15,
      processingFee: 2000,
      monthlyRate: 1205,
      specialRepayments: false,
      totalCost: 435800
    },
    {
      id: '3',
      provider: 'Sparkasse',
      interestRate: 2.95,
      fixedRatePeriod: 20,
      processingFee: 1200,
      monthlyRate: 1260,
      specialRepayments: true,
      totalCost: 454800
    }
  ]);

  const [newOffer, setNewOffer] = useState<Partial<FinancingOffer>>({
    provider: '',
    interestRate: 2.5,
    fixedRatePeriod: 10,
    processingFee: 1000,
    specialRepayments: true
  });

  const toggleOfferSelection = (id: string) => {
    setSelectedOffers(prev => {
      if (prev.includes(id)) {
        return prev.filter(offerId => offerId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const addNewOffer = () => {
    if (!newOffer.provider) return;
    
    // Calculate monthly rate and total cost
    const r = (newOffer.interestRate || 0) / 100 / 12;
    const n = loanTerm * 12;
    const monthlyRate = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalCost = (monthlyRate * n) + (newOffer.processingFee || 0);
    
    const offer: FinancingOffer = {
      id: Date.now().toString(),
      provider: newOffer.provider || '',
      interestRate: newOffer.interestRate || 0,
      fixedRatePeriod: newOffer.fixedRatePeriod || 0,
      processingFee: newOffer.processingFee || 0,
      monthlyRate: Math.round(monthlyRate),
      specialRepayments: newOffer.specialRepayments || false,
      totalCost: Math.round(totalCost)
    };
    
    setOffers(prev => [...prev, offer]);
    setNewOffer({
      provider: '',
      interestRate: 2.5,
      fixedRatePeriod: 10,
      processingFee: 1000,
      specialRepayments: true
    });
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== id));
    setSelectedOffers(prev => prev.filter(offerId => offerId !== id));
  };

  const bestOffer = offers.reduce((best, current) => {
    if (!best || current.totalCost < best.totalCost) return current;
    return best;
  }, offers[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Finanzierungsratenvergleich' : 'Financing Rate Comparison'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Vergleichen Sie verschiedene Finanzierungsangebote und berechnen Sie die Gesamtkosten' 
            : 'Compare different financing offers and calculate total costs'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="compare" className="space-y-4">
          <TabsList>
            <TabsTrigger value="compare">
              {language === 'de' ? 'Angebote vergleichen' : 'Compare Offers'}
            </TabsTrigger>
            <TabsTrigger value="add">
              {language === 'de' ? 'Angebot hinzufügen' : 'Add Offer'}
            </TabsTrigger>
            <TabsTrigger value="detailed">
              {language === 'de' ? 'Detailvergleich' : 'Detailed Comparison'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compare">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="loanAmount">
                    {language === 'de' ? 'Darlehensbetrag (€)' : 'Loan Amount (€)'}
                  </Label>
                  <Input 
                    id="loanAmount" 
                    type="number" 
                    value={loanAmount} 
                    onChange={(e) => setLoanAmount(Number(e.target.value))} 
                  />
                </div>
                <div>
                  <Label htmlFor="loanTerm">
                    {language === 'de' ? 'Darlehenslaufzeit (Jahre)' : 'Loan Term (years)'}
                  </Label>
                  <Input 
                    id="loanTerm" 
                    type="number" 
                    value={loanTerm} 
                    onChange={(e) => setLoanTerm(Number(e.target.value))} 
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>{language === 'de' ? 'Anbieter' : 'Provider'}</TableHead>
                    <TableHead>{language === 'de' ? 'Zinssatz' : 'Interest Rate'}</TableHead>
                    <TableHead className="hidden md:table-cell">{language === 'de' ? 'Zinsbindung' : 'Fixed Rate'}</TableHead>
                    <TableHead>{language === 'de' ? 'Monatliche Rate' : 'Monthly Rate'}</TableHead>
                    <TableHead className="text-right">{language === 'de' ? 'Aktionen' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id} className={offer.id === bestOffer.id ? "bg-primary/5" : ""}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={selectedOffers.includes(offer.id)} 
                          onChange={() => toggleOfferSelection(offer.id)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {offer.provider}
                        {offer.id === bestOffer.id && (
                          <Badge variant="secondary" className="ml-2">
                            {language === 'de' ? 'Bestangebot' : 'Best Offer'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{offer.interestRate}%</TableCell>
                      <TableCell className="hidden md:table-cell">{offer.fixedRatePeriod} {language === 'de' ? 'Jahre' : 'years'}</TableCell>
                      <TableCell>
                        {offer.monthlyRate.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => deleteOffer(offer.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between">
                <Button variant="outline" disabled={selectedOffers.length < 2}>
                  {language === 'de' ? 'Ausgewählte vergleichen' : 'Compare Selected'}
                </Button>
                <Button>
                  {language === 'de' ? 'Detaillierte Analyse' : 'Detailed Analysis'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="provider">
                    {language === 'de' ? 'Anbieter' : 'Provider'}
                  </Label>
                  <Input 
                    id="provider" 
                    value={newOffer.provider || ''} 
                    onChange={(e) => setNewOffer(prev => ({ ...prev, provider: e.target.value }))} 
                    placeholder={language === 'de' ? 'Name des Anbieters' : 'Provider name'}
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">
                    {language === 'de' ? 'Zinssatz (%)' : 'Interest Rate (%)'}
                  </Label>
                  <Input 
                    id="interestRate" 
                    type="number"
                    step="0.01"
                    value={newOffer.interestRate || ''} 
                    onChange={(e) => setNewOffer(prev => ({ ...prev, interestRate: Number(e.target.value) }))} 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="fixedRatePeriod">
                    {language === 'de' ? 'Zinsbindung (Jahre)' : 'Fixed Rate Period (years)'}
                  </Label>
                  <Input 
                    id="fixedRatePeriod" 
                    type="number" 
                    value={newOffer.fixedRatePeriod || ''} 
                    onChange={(e) => setNewOffer(prev => ({ ...prev, fixedRatePeriod: Number(e.target.value) }))} 
                  />
                </div>
                <div>
                  <Label htmlFor="processingFee">
                    {language === 'de' ? 'Bearbeitungsgebühr (€)' : 'Processing Fee (€)'}
                  </Label>
                  <Input 
                    id="processingFee" 
                    type="number" 
                    value={newOffer.processingFee || ''} 
                    onChange={(e) => setNewOffer(prev => ({ ...prev, processingFee: Number(e.target.value) }))} 
                  />
                </div>
                <div>
                  <Label htmlFor="specialRepayments">
                    {language === 'de' ? 'Sondertilgungen möglich' : 'Special Repayments Allowed'}
                  </Label>
                  <Select 
                    value={newOffer.specialRepayments ? "true" : "false"} 
                    onValueChange={(value) => setNewOffer(prev => ({ ...prev, specialRepayments: value === "true" }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        {language === 'de' ? 'Ja' : 'Yes'}
                      </SelectItem>
                      <SelectItem value="false">
                        {language === 'de' ? 'Nein' : 'No'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={addNewOffer} className="w-full" disabled={!newOffer.provider}>
                <Plus className="mr-2 h-4 w-4" />
                {language === 'de' ? 'Angebot hinzufügen' : 'Add Offer'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="detailed">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Coins className="h-5 w-5 mr-2" />
                  {language === 'de' ? 'Kostenvergleich' : 'Cost Comparison'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'de' ? 'Anbieter' : 'Provider'}</TableHead>
                      <TableHead>{language === 'de' ? 'Monatliche Rate' : 'Monthly Rate'}</TableHead>
                      <TableHead>{language === 'de' ? 'Bearbeitungsgebühr' : 'Processing Fee'}</TableHead>
                      <TableHead>{language === 'de' ? 'Gesamtkosten' : 'Total Cost'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow key={offer.id} className={offer.id === bestOffer.id ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">{offer.provider}</TableCell>
                        <TableCell>
                          {offer.monthlyRate.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0
                          })}
                        </TableCell>
                        <TableCell>
                          {offer.processingFee.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0
                          })}
                        </TableCell>
                        <TableCell className={offer.id === bestOffer.id ? "font-bold" : ""}>
                          {offer.totalCost.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Gesamtkosten beinhalten Zinsen über die gesamte Laufzeit und alle Gebühren.' 
                    : 'Total costs include interest over the entire term and all fees.'}
                </div>
              </CardFooter>
            </Card>

            <div className="mt-6 flex justify-between">
              <Button variant="outline">
                {language === 'de' ? 'Bericht exportieren' : 'Export Report'}
              </Button>
              <Button>
                {language === 'de' ? 'Kostenoptimierung vorschlagen' : 'Suggest Cost Optimization'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancingRateComparison;
