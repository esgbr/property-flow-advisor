
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Exchange {
  id: string;
  name: string;
  relinquishedProperty: string;
  relinquishedValue: number;
  saleDate: string;
  identificationDeadline: string;
  purchaseDeadline: string;
  identifiedProperties: IdentifiedProperty[];
  status: 'active' | 'completed' | 'expired';
  replacementProperty?: string;
  replacementValue?: number;
  closingDate?: string;
  taxSavings?: number;
}

interface IdentifiedProperty {
  id: string;
  address: string;
  price: number;
  selected: boolean;
}

const ExchangeTracker = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [exchanges, setExchanges] = useState<Exchange[]>([
    {
      id: '1',
      name: 'Downtown Office Exchange',
      relinquishedProperty: '123 Main St, City Center',
      relinquishedValue: 1250000,
      saleDate: '2025-04-01',
      identificationDeadline: '2025-04-16',
      purchaseDeadline: '2025-06-15',
      identifiedProperties: [
        { id: '1a', address: '456 Market St, Downtown', price: 1100000, selected: true },
        { id: '1b', address: '789 Business Ave, Westside', price: 1400000, selected: false },
        { id: '1c', address: '321 Commerce Blvd, Eastside', price: 1300000, selected: false },
      ],
      status: 'active',
      taxSavings: 187500
    },
    {
      id: '2',
      name: 'Rental Portfolio Upgrade',
      relinquishedProperty: '555 Rental Row, Apartment Complex',
      relinquishedValue: 2750000,
      saleDate: '2025-03-15',
      identificationDeadline: '2025-03-30',
      purchaseDeadline: '2025-05-29',
      identifiedProperties: [
        { id: '2a', address: '777 Luxury Lane, Highrise', price: 1500000, selected: true },
        { id: '2b', address: '888 Income Ave, Multi-family', price: 1400000, selected: true },
      ],
      status: 'active',
      taxSavings: 412500
    },
    {
      id: '3',
      name: 'Retail Location Exchange',
      relinquishedProperty: '999 Shopping Mall, Retail Space',
      relinquishedValue: 850000,
      saleDate: '2025-02-10',
      identificationDeadline: '2025-02-25',
      purchaseDeadline: '2025-04-26',
      identifiedProperties: [],
      status: 'completed',
      replacementProperty: '111 Storefront St, Downtown',
      replacementValue: 920000,
      closingDate: '2025-04-20',
      taxSavings: 127500
    }
  ]);

  const [newExchange, setNewExchange] = useState<Partial<Exchange>>({
    name: '',
    relinquishedProperty: '',
    relinquishedValue: 0,
    saleDate: '',
    status: 'active'
  });

  const calculateDaysLeft = (targetDate: string) => {
    const today = new Date();
    const deadline = new Date(targetDate);
    const difference = deadline.getTime() - today.getTime();
    const daysLeft = Math.ceil(difference / (1000 * 3600 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const handleAddExchange = () => {
    if (!newExchange.name || !newExchange.relinquishedProperty || !newExchange.relinquishedValue || !newExchange.saleDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const saleDate = new Date(newExchange.saleDate);
    
    // Calculate 45-day identification deadline
    const identificationDeadline = new Date(saleDate);
    identificationDeadline.setDate(identificationDeadline.getDate() + 45);
    
    // Calculate 180-day purchase deadline
    const purchaseDeadline = new Date(saleDate);
    purchaseDeadline.setDate(purchaseDeadline.getDate() + 180);

    const newExchangeEntry: Exchange = {
      id: Date.now().toString(),
      name: newExchange.name,
      relinquishedProperty: newExchange.relinquishedProperty,
      relinquishedValue: newExchange.relinquishedValue,
      saleDate: newExchange.saleDate,
      identificationDeadline: identificationDeadline.toISOString().split('T')[0],
      purchaseDeadline: purchaseDeadline.toISOString().split('T')[0],
      identifiedProperties: [],
      status: 'active',
      taxSavings: Math.round(newExchange.relinquishedValue * 0.15) // Estimated tax savings at 15%
    };

    setExchanges([...exchanges, newExchangeEntry]);
    setNewExchange({
      name: '',
      relinquishedProperty: '',
      relinquishedValue: 0,
      saleDate: '',
      status: 'active'
    });

    toast({
      title: "Exchange Added",
      description: "Your 1031 exchange has been successfully added.",
    });
  };

  const addIdentifiedProperty = (exchangeId: string) => {
    setExchanges(exchanges.map(exchange => {
      if (exchange.id === exchangeId) {
        return {
          ...exchange,
          identifiedProperties: [
            ...exchange.identifiedProperties,
            {
              id: Date.now().toString(),
              address: '123 New Property',
              price: 0,
              selected: false
            }
          ]
        };
      }
      return exchange;
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">1031 Exchange Tracker</h1>
      <p className="text-muted-foreground">
        Track your 1031 exchanges, deadlines, and potential tax savings.
      </p>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Exchanges</TabsTrigger>
          <TabsTrigger value="completed">Completed Exchanges</TabsTrigger>
          <TabsTrigger value="new">Start New Exchange</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          {exchanges.filter(ex => ex.status === 'active').map(exchange => (
            <Card key={exchange.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{exchange.name}</CardTitle>
                  <Badge variant="outline" className="bg-blue-100">Active</Badge>
                </div>
                <CardDescription>
                  Sold: {exchange.relinquishedProperty} for {formatCurrency(exchange.relinquishedValue)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Identification Deadline ({exchange.identificationDeadline})</span>
                      <span className="font-semibold">{calculateDaysLeft(exchange.identificationDeadline)} days left</span>
                    </div>
                    <Progress value={(45 - calculateDaysLeft(exchange.identificationDeadline)) / 45 * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Purchase Deadline ({exchange.purchaseDeadline})</span>
                      <span className="font-semibold">{calculateDaysLeft(exchange.purchaseDeadline)} days left</span>
                    </div>
                    <Progress value={(180 - calculateDaysLeft(exchange.purchaseDeadline)) / 180 * 100} className="h-2" />
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Identified Properties ({exchange.identifiedProperties.length}/3)</h4>
                    {exchange.identifiedProperties.length > 0 ? (
                      <div className="space-y-2">
                        {exchange.identifiedProperties.map(property => (
                          <div key={property.id} className="flex justify-between items-center p-2 border rounded-md">
                            <div>
                              <p className="font-medium">{property.address}</p>
                              <p className="text-sm text-muted-foreground">{formatCurrency(property.price)}</p>
                            </div>
                            <Badge variant={property.selected ? "default" : "outline"}>
                              {property.selected ? "Selected" : "Candidate"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No properties identified yet.</p>
                    )}
                    
                    {exchange.identifiedProperties.length < 3 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => addIdentifiedProperty(exchange.id)}
                      >
                        Add Property
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Estimated Tax Savings</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(exchange.taxSavings || 0)}</p>
                  </div>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
          
          {exchanges.filter(ex => ex.status === 'active').length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground">No active exchanges found.</p>
                <Button variant="outline" className="mt-2" onClick={() => document.querySelector('[data-value="new"]')?.click()}>
                  Start New Exchange
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {exchanges.filter(ex => ex.status === 'completed').map(exchange => (
            <Card key={exchange.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{exchange.name}</CardTitle>
                  <Badge variant="outline" className="bg-green-100">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Relinquished Property</h4>
                    <p>{exchange.relinquishedProperty}</p>
                    <p className="font-medium">{formatCurrency(exchange.relinquishedValue)}</p>
                    <p className="text-sm text-muted-foreground">Sold on {exchange.saleDate}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Replacement Property</h4>
                    <p>{exchange.replacementProperty}</p>
                    <p className="font-medium">{formatCurrency(exchange.replacementValue || 0)}</p>
                    <p className="text-sm text-muted-foreground">Closed on {exchange.closingDate}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full">
                  <p className="text-sm font-medium">Tax Savings</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(exchange.taxSavings || 0)}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
          
          {exchanges.filter(ex => ex.status === 'completed').length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground">No completed exchanges found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="new" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Start New 1031 Exchange</CardTitle>
              <CardDescription>
                Enter the details of your relinquished property to begin tracking your exchange.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Exchange Name</label>
                  <Input 
                    placeholder="e.g., Downtown Office Exchange"
                    value={newExchange.name}
                    onChange={e => setNewExchange({...newExchange, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Sale Date</label>
                  <Input 
                    type="date"
                    value={newExchange.saleDate}
                    onChange={e => setNewExchange({...newExchange, saleDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Relinquished Property Address</label>
                <Input 
                  placeholder="123 Main St, City, State"
                  value={newExchange.relinquishedProperty}
                  onChange={e => setNewExchange({...newExchange, relinquishedProperty: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Sale Price</label>
                <Input 
                  type="number"
                  placeholder="0"
                  value={newExchange.relinquishedValue || ''}
                  onChange={e => setNewExchange({...newExchange, relinquishedValue: parseFloat(e.target.value)})}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">1031 Exchange Timeline</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Identification Deadline: 45 days from the sale date</li>
                  <li>• Purchase Deadline: 180 days from the sale date</li>
                  <li>• You must identify up to 3 potential replacement properties</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={handleAddExchange}>
                Start Exchange Tracking
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExchangeTracker;
