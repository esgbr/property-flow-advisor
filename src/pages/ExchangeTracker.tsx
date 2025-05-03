
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ClipboardCheck,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
  DollarSign,
  Building,
  FileText,
  Briefcase,
  RefreshCw,
  Info,
  CheckCircle
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { format, addDays, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';

type ExchangeProperty = {
  id: string;
  address: string;
  purchasePrice: number;
  estimatedValue: number;
  dateAcquired: string;
  status: 'identified' | 'under-contract' | 'closed';
  notes: string;
}

type Exchange = {
  id: string;
  relinquishedProperty: {
    address: string;
    sellingPrice: number;
    closingDate: string;
    originalPurchasePrice: number;
    improvements: number;
  };
  identificationDeadline: string; // 45 days from closing
  acquisitionDeadline: string; // 180 days from closing
  potentialProperties: ExchangeProperty[];
  status: 'active' | 'completed' | 'failed';
  notes: string;
}

const SAMPLE_EXCHANGES: Exchange[] = [
  {
    id: 'ex-1',
    relinquishedProperty: {
      address: '123 Main St, Austin, TX',
      sellingPrice: 750000,
      closingDate: '2025-04-05',
      originalPurchasePrice: 450000,
      improvements: 75000,
    },
    identificationDeadline: '2025-05-20',
    acquisitionDeadline: '2025-10-02',
    potentialProperties: [
      {
        id: 'prop-1',
        address: '789 Highland Ave, Dallas, TX',
        purchasePrice: 800000,
        estimatedValue: 850000,
        dateAcquired: '',
        status: 'identified',
        notes: 'Good location near new development',
      },
      {
        id: 'prop-2',
        address: '456 Oak St, Houston, TX',
        purchasePrice: 780000,
        estimatedValue: 800000,
        dateAcquired: '',
        status: 'under-contract',
        notes: 'Inspection completed, closing scheduled',
      }
    ],
    status: 'active',
    notes: 'Working with ABC Exchange Accommodator',
  },
  {
    id: 'ex-2',
    relinquishedProperty: {
      address: '555 Pine St, San Antonio, TX',
      sellingPrice: 1250000,
      closingDate: '2025-02-15',
      originalPurchasePrice: 900000,
      improvements: 150000,
    },
    identificationDeadline: '2025-04-01',
    acquisitionDeadline: '2025-08-14',
    potentialProperties: [
      {
        id: 'prop-3',
        address: '345 Cedar Ave, Austin, TX',
        purchasePrice: 1300000,
        estimatedValue: 1350000,
        dateAcquired: '2025-03-25',
        status: 'closed',
        notes: 'Successfully acquired property',
      }
    ],
    status: 'completed',
    notes: 'Exchange completed successfully',
  }
];

const ExchangeTracker: React.FC = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>(SAMPLE_EXCHANGES);
  const [activeExchange, setActiveExchange] = useState<Exchange | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [calculatorValues, setCalculatorValues] = useState({
    sellingPrice: 500000,
    originalPurchase: 300000,
    improvements: 50000,
    isLongTerm: true
  });
  const [newExchange, setNewExchange] = useState<Partial<Exchange>>({
    relinquishedProperty: {
      address: '',
      sellingPrice: 0,
      closingDate: '',
      originalPurchasePrice: 0,
      improvements: 0
    },
    potentialProperties: [],
    status: 'active',
    notes: ''
  });
  const [newProperty, setNewProperty] = useState<Partial<ExchangeProperty>>({
    address: '',
    purchasePrice: 0,
    estimatedValue: 0,
    status: 'identified',
    notes: ''
  });
  const [identifyDate, setIdentifyDate] = useState<Date>();
  const [closingDate, setClosingDate] = useState<Date>();
  const [showAddPropertyDialog, setShowAddPropertyDialog] = useState(false);
  
  const { toast } = useToast();

  const calculateDeadlines = (closingDate: string) => {
    const closing = new Date(closingDate);
    return {
      identificationDeadline: format(addDays(closing, 45), 'yyyy-MM-dd'),
      acquisitionDeadline: format(addDays(closing, 180), 'yyyy-MM-dd')
    };
  };

  const calculateTaxSavings = () => {
    const { sellingPrice, originalPurchase, improvements, isLongTerm } = calculatorValues;
    const capitalGain = sellingPrice - originalPurchase - improvements;
    
    // Simplified tax calculation
    const federalRate = isLongTerm ? 0.20 : 0.37;
    const medicareRate = 0.038;
    const stateRate = 0.05;
    
    const federalTax = capitalGain * federalRate;
    const medicareTax = capitalGain * medicareRate;
    const stateTax = capitalGain * stateRate;
    
    const totalTax = federalTax + medicareTax + stateTax;
    return {
      capitalGain,
      federalTax,
      medicareTax,
      stateTax,
      totalTax
    };
  };
  
  const handleAddExchange = () => {
    if (!newExchange.relinquishedProperty?.address || !newExchange.relinquishedProperty?.closingDate) {
      toast({
        title: "Missing Information",
        description: "Please provide all required information",
        variant: "destructive"
      });
      return;
    }
    
    const deadlines = calculateDeadlines(newExchange.relinquishedProperty.closingDate);
    
    const exchange: Exchange = {
      id: `ex-${exchanges.length + 1}`,
      relinquishedProperty: {
        address: newExchange.relinquishedProperty.address,
        sellingPrice: newExchange.relinquishedProperty.sellingPrice || 0,
        closingDate: newExchange.relinquishedProperty.closingDate,
        originalPurchasePrice: newExchange.relinquishedProperty.originalPurchasePrice || 0,
        improvements: newExchange.relinquishedProperty.improvements || 0
      },
      identificationDeadline: deadlines.identificationDeadline,
      acquisitionDeadline: deadlines.acquisitionDeadline,
      potentialProperties: [],
      status: 'active',
      notes: newExchange.notes || ''
    };
    
    setExchanges([...exchanges, exchange]);
    setActiveExchange(exchange);
    setActiveTab("details");
    
    toast({
      title: "Exchange Added",
      description: "New 1031 exchange has been created"
    });
    
    // Reset form
    setNewExchange({
      relinquishedProperty: {
        address: '',
        sellingPrice: 0,
        closingDate: '',
        originalPurchasePrice: 0,
        improvements: 0
      },
      potentialProperties: [],
      status: 'active',
      notes: ''
    });
    setClosingDate(undefined);
  };
  
  const handleAddProperty = () => {
    if (!activeExchange || !newProperty.address) return;
    
    const property: ExchangeProperty = {
      id: `prop-${new Date().getTime()}`,
      address: newProperty.address,
      purchasePrice: newProperty.purchasePrice || 0,
      estimatedValue: newProperty.estimatedValue || 0,
      dateAcquired: '',
      status: newProperty.status as 'identified' | 'under-contract' | 'closed',
      notes: newProperty.notes || ''
    };
    
    const updatedExchange = {
      ...activeExchange,
      potentialProperties: [...activeExchange.potentialProperties, property]
    };
    
    setExchanges(exchanges.map(ex => ex.id === activeExchange.id ? updatedExchange : ex));
    setActiveExchange(updatedExchange);
    setShowAddPropertyDialog(false);
    
    toast({
      title: "Property Added",
      description: "Potential replacement property has been added"
    });
    
    // Reset form
    setNewProperty({
      address: '',
      purchasePrice: 0,
      estimatedValue: 0,
      status: 'identified',
      notes: ''
    });
  };
  
  const updatePropertyStatus = (exchangeId: string, propertyId: string, status: 'identified' | 'under-contract' | 'closed') => {
    const updatedExchanges = exchanges.map(exchange => {
      if (exchange.id === exchangeId) {
        const updatedProperties = exchange.potentialProperties.map(property => {
          if (property.id === propertyId) {
            return {
              ...property,
              status,
              dateAcquired: status === 'closed' ? format(new Date(), 'yyyy-MM-dd') : property.dateAcquired
            };
          }
          return property;
        });
        
        // If a property is closed, update exchange status to completed
        let exchangeStatus = exchange.status;
        if (status === 'closed') {
          exchangeStatus = 'completed';
        }
        
        return {
          ...exchange,
          potentialProperties: updatedProperties,
          status: exchangeStatus
        };
      }
      return exchange;
    });
    
    setExchanges(updatedExchanges);
    
    if (activeExchange && activeExchange.id === exchangeId) {
      const updatedExchange = updatedExchanges.find(ex => ex.id === exchangeId);
      if (updatedExchange) setActiveExchange(updatedExchange);
    }
    
    toast({
      title: "Status Updated",
      description: `Property status changed to ${status}`
    });
  };

  const handleViewDetailsClick = (exchange: Exchange) => {
    setActiveExchange(exchange);
    setActiveTab("details");
  };

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return differenceInDays(deadlineDate, today);
  };
  
  const getStatusColor = (daysLeft: number) => {
    if (daysLeft <= 0) return "bg-red-500";
    if (daysLeft <= 7) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Fix here - Replace the click call with a focus() call
  const handleSelectClosingDate = (date: Date | undefined) => {
    if (date) {
      setClosingDate(date);
      const formatted = format(date, 'yyyy-MM-dd');
      setNewExchange({
        ...newExchange,
        relinquishedProperty: {
          ...newExchange.relinquishedProperty!,
          closingDate: formatted
        }
      });
      
      // Calculate deadlines based on the selected closing date
      const deadlines = calculateDeadlines(formatted);
      setNewExchange(prev => ({
        ...prev,
        identificationDeadline: deadlines.identificationDeadline,
        acquisitionDeadline: deadlines.acquisitionDeadline
      }));
      
      // Instead of using click, use focus
      setTimeout(() => {
        const nextInput = document.querySelector('[name="originalPurchasePrice"]') as HTMLElement;
        if (nextInput) nextInput.focus();
      }, 100);
    }
  };
  
  const handleSelectIdentifyDate = (date: Date | undefined) => {
    if (date) {
      setIdentifyDate(date);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">1031 Exchange Tracker</h1>
        <p className="text-muted-foreground">Track your 1031 exchange deadlines and properties</p>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">
            <RefreshCw className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="calculator">
            <DollarSign className="h-4 w-4 mr-2" />
            Tax Savings Calculator
          </TabsTrigger>
          <TabsTrigger value="details" disabled={!activeExchange}>
            <FileText className="h-4 w-4 mr-2" />
            Exchange Details
          </TabsTrigger>
          <TabsTrigger value="add">
            <Building className="h-4 w-4 mr-2" />
            New Exchange
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Active 1031 Exchanges
              </CardTitle>
              <CardDescription>
                Track your current exchange deadlines and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exchanges.filter(ex => ex.status === 'active').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <RefreshCw className="h-12 w-12 mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No active exchanges</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a new 1031 exchange to start tracking your deadlines
                  </p>
                  <Button onClick={() => setActiveTab("add")}>
                    Create New Exchange
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {exchanges
                    .filter(ex => ex.status === 'active')
                    .map(exchange => {
                      const idDaysLeft = calculateDaysLeft(exchange.identificationDeadline);
                      const acqDaysLeft = calculateDaysLeft(exchange.acquisitionDeadline);
                      
                      return (
                        <div key={exchange.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div>
                              <h3 className="text-lg font-medium">{exchange.relinquishedProperty.address}</h3>
                              <p className="text-muted-foreground">${exchange.relinquishedProperty.sellingPrice.toLocaleString()}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetailsClick(exchange)}
                            >
                              View Details
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">
                                  Identification Deadline
                                </span>
                                <span className="text-sm">
                                  {idDaysLeft <= 0
                                    ? "Expired"
                                    : `${idDaysLeft} days left`
                                  }
                                </span>
                              </div>
                              <Progress 
                                value={Math.max(0, (idDaysLeft / 45) * 100)} 
                                className={getStatusColor(idDaysLeft)}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(parseISO(exchange.identificationDeadline), 'MMM d, yyyy')}
                              </p>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">
                                  Acquisition Deadline
                                </span>
                                <span className="text-sm">
                                  {acqDaysLeft <= 0
                                    ? "Expired"
                                    : `${acqDaysLeft} days left`
                                  }
                                </span>
                              </div>
                              <Progress 
                                value={Math.max(0, (acqDaysLeft / 180) * 100)} 
                                className={getStatusColor(acqDaysLeft)}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(parseISO(exchange.acquisitionDeadline), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Properties Identified: {exchange.potentialProperties.length}</p>
                            <div className="flex flex-wrap gap-2">
                              {exchange.potentialProperties.map(property => (
                                <Badge 
                                  key={property.id} 
                                  variant={
                                    property.status === 'closed' ? "default" :
                                    property.status === 'under-contract' ? "secondary" : "outline"
                                  }
                                >
                                  {property.status === 'closed' && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {property.status}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Completed Exchanges
              </CardTitle>
              <CardDescription>
                View your completed 1031 exchanges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exchanges.filter(ex => ex.status === 'completed').length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No completed exchanges yet
                </p>
              ) : (
                <div className="space-y-4">
                  {exchanges
                    .filter(ex => ex.status === 'completed')
                    .map(exchange => {
                      const replacementProperty = exchange.potentialProperties.find(p => p.status === 'closed');
                      
                      return (
                        <div key={exchange.id} className="flex flex-col md:flex-row justify-between border rounded-lg p-4">
                          <div>
                            <h3 className="text-lg font-medium">Relinquished: {exchange.relinquishedProperty.address}</h3>
                            <p className="text-muted-foreground mb-2">${exchange.relinquishedProperty.sellingPrice.toLocaleString()}</p>
                            {replacementProperty && (
                              <>
                                <h4 className="text-md font-medium">Acquired: {replacementProperty.address}</h4>
                                <p className="text-muted-foreground">${replacementProperty.purchasePrice.toLocaleString()}</p>
                              </>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-2 md:mt-0"
                            onClick={() => handleViewDetailsClick(exchange)}
                          >
                            View Details
                          </Button>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                1031 Exchange Tax Savings Calculator
              </CardTitle>
              <CardDescription>
                Calculate your potential tax savings with a 1031 exchange
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={calculatorValues.sellingPrice}
                      onChange={(e) => setCalculatorValues({...calculatorValues, sellingPrice: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="originalPurchase">Original Purchase Price ($)</Label>
                    <Input
                      id="originalPurchase"
                      type="number"
                      value={calculatorValues.originalPurchase}
                      onChange={(e) => setCalculatorValues({...calculatorValues, originalPurchase: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="improvements">Capital Improvements ($)</Label>
                    <Input
                      id="improvements"
                      type="number"
                      value={calculatorValues.improvements}
                      onChange={(e) => setCalculatorValues({...calculatorValues, improvements: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="isLongTerm"
                      type="checkbox"
                      className="mr-2"
                      checked={calculatorValues.isLongTerm}
                      onChange={(e) => setCalculatorValues({...calculatorValues, isLongTerm: e.target.checked})}
                    />
                    <Label htmlFor="isLongTerm">Long-term capital gains (owned > 1 year)</Label>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Tax Savings Summary</h3>
                  
                  {(() => {
                    const { capitalGain, federalTax, medicareTax, stateTax, totalTax } = calculateTaxSavings();
                    
                    return (
                      <>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Capital Gain:</span>
                            <span>${capitalGain.toLocaleString()}</span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between">
                            <span>Federal Capital Gains Tax 
                              ({calculatorValues.isLongTerm ? "20%" : "37%"}):
                            </span>
                            <span>${federalTax.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Medicare Surtax (3.8%):</span>
                            <span>${medicareTax.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>State Income Tax (est. 5%):</span>
                            <span>${stateTax.toLocaleString()}</span>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between font-medium">
                            <span>Total Tax Due Without 1031:</span>
                            <span>${totalTax.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between font-medium mt-2 text-green-600">
                            <span>Tax Savings With 1031 Exchange:</span>
                            <span>${totalTax.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <Alert className="mt-4">
                          <Info className="h-4 w-4" />
                          <AlertTitle>Important Note</AlertTitle>
                          <AlertDescription>
                            This is a simplified calculation. Consult a tax professional for precise tax implications for your specific situation.
                          </AlertDescription>
                        </Alert>
                      </>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {activeExchange && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Exchange Details</h2>
                <Badge 
                  variant={
                    activeExchange.status === 'completed' ? "default" : 
                    activeExchange.status === 'failed' ? "destructive" : "outline"
                  }
                >
                  {activeExchange.status}
                </Badge>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Relinquished Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium mb-1">Address</h3>
                      <p>{activeExchange.relinquishedProperty.address}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Selling Price</h3>
                      <p>${activeExchange.relinquishedProperty.sellingPrice.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Closing Date</h3>
                      <p>{format(parseISO(activeExchange.relinquishedProperty.closingDate), 'MMM d, yyyy')}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Original Purchase Price</h3>
                      <p>${activeExchange.relinquishedProperty.originalPurchasePrice.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Capital Improvements</h3>
                      <p>${activeExchange.relinquishedProperty.improvements.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Capital Gain</h3>
                      <p>${(activeExchange.relinquishedProperty.sellingPrice - activeExchange.relinquishedProperty.originalPurchasePrice - activeExchange.relinquishedProperty.improvements).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="relative">
                  <div className={`absolute top-3 right-3 h-3 w-3 rounded-full ${
                    calculateDaysLeft(activeExchange.identificationDeadline) <= 0 ? 'bg-red-500' :
                    calculateDaysLeft(activeExchange.identificationDeadline) <= 7 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Identification Deadline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium mb-1">
                      {format(parseISO(activeExchange.identificationDeadline), 'MMMM d, yyyy')}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {calculateDaysLeft(activeExchange.identificationDeadline) <= 0
                        ? "Deadline has expired"
                        : `${calculateDaysLeft(activeExchange.identificationDeadline)} days remaining`
                      }
                    </p>
                    <Progress 
                      value={Math.max(0, (calculateDaysLeft(activeExchange.identificationDeadline) / 45) * 100)} 
                      className={getStatusColor(calculateDaysLeft(activeExchange.identificationDeadline))}
                    />
                    <p className="text-sm mt-2">45-day identification period</p>
                  </CardContent>
                </Card>
                
                <Card className="relative">
                  <div className={`absolute top-3 right-3 h-3 w-3 rounded-full ${
                    calculateDaysLeft(activeExchange.acquisitionDeadline) <= 0 ? 'bg-red-500' :
                    calculateDaysLeft(activeExchange.acquisitionDeadline) <= 7 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Acquisition Deadline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium mb-1">
                      {format(parseISO(activeExchange.acquisitionDeadline), 'MMMM d, yyyy')}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {calculateDaysLeft(activeExchange.acquisitionDeadline) <= 0
                        ? "Deadline has expired"
                        : `${calculateDaysLeft(activeExchange.acquisitionDeadline)} days remaining`
                      }
                    </p>
                    <Progress 
                      value={Math.max(0, (calculateDaysLeft(activeExchange.acquisitionDeadline) / 180) * 100)} 
                      className={getStatusColor(calculateDaysLeft(activeExchange.acquisitionDeadline))}
                    />
                    <p className="text-sm mt-2">180-day exchange period</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Replacement Properties</CardTitle>
                  <Dialog open={showAddPropertyDialog} onOpenChange={setShowAddPropertyDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">Add Property</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Replacement Property</DialogTitle>
                        <DialogDescription>
                          Add a property you've identified as a potential replacement
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Property Address</Label>
                          <Input 
                            id="address" 
                            value={newProperty.address}
                            onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                            <Input 
                              id="purchasePrice" 
                              type="number"
                              value={newProperty.purchasePrice || ''}
                              onChange={(e) => setNewProperty({...newProperty, purchasePrice: Number(e.target.value)})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
                            <Input 
                              id="estimatedValue" 
                              type="number"
                              value={newProperty.estimatedValue || ''}
                              onChange={(e) => setNewProperty({...newProperty, estimatedValue: Number(e.target.value)})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <select 
                            id="status"
                            className="w-full p-2 border rounded"
                            value={newProperty.status}
                            onChange={(e) => setNewProperty({...newProperty, status: e.target.value as any})}
                          >
                            <option value="identified">Identified</option>
                            <option value="under-contract">Under Contract</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <textarea 
                            id="notes"
                            className="w-full p-2 border rounded"
                            rows={3}
                            value={newProperty.notes}
                            onChange={(e) => setNewProperty({...newProperty, notes: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddPropertyDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddProperty}>Add Property</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {activeExchange.potentialProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No properties identified yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You can identify up to three potential replacement properties
                      </p>
                      <Button onClick={() => setShowAddPropertyDialog(true)}>
                        Add Property
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeExchange.potentialProperties.map(property => (
                        <div key={property.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{property.address}</h3>
                              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                <span>${property.purchasePrice.toLocaleString()}</span>
                                {property.status === 'closed' && property.dateAcquired && (
                                  <span>Acquired: {format(parseISO(property.dateAcquired), 'MMM d, yyyy')}</span>
                                )}
                              </div>
                            </div>
                            <Badge 
                              variant={
                                property.status === 'closed' ? "default" :
                                property.status === 'under-contract' ? "secondary" : "outline"
                              }
                            >
                              {property.status}
                            </Badge>
                          </div>
                          
                          {property.notes && (
                            <p className="text-sm mt-2 bg-muted p-2 rounded">{property.notes}</p>
                          )}
                          
                          {property.status !== 'closed' && (
                            <div className="mt-4 flex gap-2 justify-end">
                              {property.status === 'identified' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updatePropertyStatus(activeExchange.id, property.id, 'under-contract')}
                                >
                                  Mark as Under Contract
                                </Button>
                              )}
                              {property.status === 'under-contract' && (
                                <Button 
                                  size="sm"
                                  onClick={() => updatePropertyStatus(activeExchange.id, property.id, 'closed')}
                                >
                                  Mark as Closed
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {activeExchange.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{activeExchange.notes}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Create New 1031 Exchange
              </CardTitle>
              <CardDescription>
                Enter the details of your relinquished property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Relinquished Property Address</Label>
                  <Input 
                    id="address" 
                    value={newExchange.relinquishedProperty?.address || ''}
                    onChange={(e) => setNewExchange({
                      ...newExchange,
                      relinquishedProperty: {
                        ...newExchange.relinquishedProperty!,
                        address: e.target.value
                      }
                    })}
                    placeholder="123 Main St, City, State"
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                    <Input 
                      id="sellingPrice" 
                      type="number"
                      value={newExchange.relinquishedProperty?.sellingPrice || ''}
                      onChange={(e) => setNewExchange({
                        ...newExchange,
                        relinquishedProperty: {
                          ...newExchange.relinquishedProperty!,
                          sellingPrice: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="closingDate">Closing Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !closingDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {closingDate ? format(closingDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={closingDate}
                          onSelect={handleSelectClosingDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="originalPurchasePrice">Original Purchase Price ($)</Label>
                    <Input 
                      id="originalPurchasePrice"
                      name="originalPurchasePrice"  
                      type="number"
                      value={newExchange.relinquishedProperty?.originalPurchasePrice || ''}
                      onChange={(e) => setNewExchange({
                        ...newExchange,
                        relinquishedProperty: {
                          ...newExchange.relinquishedProperty!,
                          originalPurchasePrice: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="improvements">Capital Improvements ($)</Label>
                    <Input 
                      id="improvements" 
                      type="number"
                      value={newExchange.relinquishedProperty?.improvements || ''}
                      onChange={(e) => setNewExchange({
                        ...newExchange,
                        relinquishedProperty: {
                          ...newExchange.relinquishedProperty!,
                          improvements: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <textarea 
                    id="notes"
                    className="w-full p-2 border rounded"
                    rows={3}
                    value={newExchange.notes || ''}
                    onChange={(e) => setNewExchange({...newExchange, notes: e.target.value})}
                    placeholder="Enter any additional notes about this exchange"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddExchange}>Create Exchange</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExchangeTracker;
