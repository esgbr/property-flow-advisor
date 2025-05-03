
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Calendar, CalendarIcon, Clock, FileText, Info, RefreshCw } from 'lucide-react';
import { format, addDays, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { de } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

type ExchangeSteps = 'not-started' | 'sale-pending' | 'sale-closed' | 'identification' | 'acquisition' | 'completed';

interface Exchange {
  id: string;
  name: string;
  relinquishedProperty: {
    address: string;
    salePrice: number;
    closingDate: string;
    originalPurchasePrice: number;
    improvements: number;
  };
  exchangeStatus: ExchangeSteps;
  identificationDeadline: string; // 45 days from closing
  acquisitionDeadline: string; // 180 days from closing
  identifiedProperties: Array<{
    id: string;
    address: string;
    price: number;
    selected: boolean;
    status: 'considering' | 'under-contract' | 'closed' | 'rejected';
  }>;
}

interface TaxCalculation {
  salesPrice: number;
  originalBasis: number;
  improvements: number;
  sellingCosts: number;
  adjustedBasis: number;
  gainAmount: number;
  deferredGain: number;
  federalTaxRate: number;
  stateTaxRate: number;
  federalTaxSavings: number;
  stateTaxSavings: number;
  totalTaxSavings: number;
  isLongTerm: boolean;
}

const ExchangeTracker: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [exchanges, setExchanges] = useState<Exchange[]>([
    {
      id: '1',
      name: 'Downtown Apartment Exchange',
      relinquishedProperty: {
        address: '123 Main St, Munich, Germany',
        salePrice: 850000,
        closingDate: new Date().toISOString(),
        originalPurchasePrice: 550000,
        improvements: 100000,
      },
      exchangeStatus: 'sale-closed',
      identificationDeadline: addDays(new Date(), 42).toISOString(),
      acquisitionDeadline: addDays(new Date(), 175).toISOString(),
      identifiedProperties: [
        {
          id: 'p1',
          address: '456 Oak Ave, Berlin, Germany',
          price: 920000,
          selected: true,
          status: 'under-contract',
        },
        {
          id: 'p2',
          address: '789 Pine St, Frankfurt, Germany',
          price: 875000,
          selected: false,
          status: 'considering',
        },
        {
          id: 'p3',
          address: '321 Elm Rd, Hamburg, Germany',
          price: 930000,
          selected: false,
          status: 'considering',
        }
      ],
    }
  ]);

  const [newExchange, setNewExchange] = useState({
    name: '',
    propertyAddress: '',
    salePrice: '',
    originalPurchasePrice: '',
    improvements: '',
    closingDate: new Date(),
  });

  const [newProperty, setNewProperty] = useState({
    address: '',
    price: '',
    exchangeId: '',
  });

  const [editExchangeId, setEditExchangeId] = useState<string | null>(null);
  const [calculatorValues, setCalculatorValues] = useState<TaxCalculation>({
    salesPrice: 500000,
    originalBasis: 300000,
    improvements: 50000,
    sellingCosts: 30000,
    adjustedBasis: 0,
    gainAmount: 0,
    deferredGain: 0,
    federalTaxRate: 20,
    stateTaxRate: 5,
    federalTaxSavings: 0,
    stateTaxSavings: 0,
    totalTaxSavings: 0,
    isLongTerm: true
  });

  // Calculate additional values whenever inputs change
  React.useEffect(() => {
    const adjustedBasis = calculatorValues.originalBasis + calculatorValues.improvements;
    const gainAmount = calculatorValues.salesPrice - adjustedBasis - calculatorValues.sellingCosts;
    
    // Apply appropriate tax rates based on long vs. short term
    const effectiveFederalRate = calculatorValues.isLongTerm ? calculatorValues.federalTaxRate : 37;
    
    const federalTaxSavings = (gainAmount > 0 ? gainAmount : 0) * (effectiveFederalRate / 100);
    const stateTaxSavings = (gainAmount > 0 ? gainAmount : 0) * (calculatorValues.stateTaxRate / 100);
    
    setCalculatorValues({
      ...calculatorValues,
      adjustedBasis,
      gainAmount,
      deferredGain: gainAmount > 0 ? gainAmount : 0,
      federalTaxSavings,
      stateTaxSavings,
      totalTaxSavings: federalTaxSavings + stateTaxSavings
    });
  }, [
    calculatorValues.salesPrice,
    calculatorValues.originalBasis,
    calculatorValues.improvements,
    calculatorValues.sellingCosts,
    calculatorValues.federalTaxRate,
    calculatorValues.stateTaxRate,
    calculatorValues.isLongTerm
  ]);

  const addExchange = () => {
    if (!newExchange.name || !newExchange.propertyAddress || !newExchange.salePrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    const id = `ex-${Date.now()}`;
    const closingDate = newExchange.closingDate.toISOString();
    const identificationDeadline = addDays(newExchange.closingDate, 45).toISOString();
    const acquisitionDeadline = addDays(newExchange.closingDate, 180).toISOString();

    const exchange: Exchange = {
      id,
      name: newExchange.name,
      relinquishedProperty: {
        address: newExchange.propertyAddress,
        salePrice: parseFloat(newExchange.salePrice),
        closingDate,
        originalPurchasePrice: parseFloat(newExchange.originalPurchasePrice || '0'),
        improvements: parseFloat(newExchange.improvements || '0'),
      },
      exchangeStatus: 'sale-pending',
      identificationDeadline,
      acquisitionDeadline,
      identifiedProperties: [],
    };

    setExchanges([...exchanges, exchange]);
    setNewExchange({
      name: '',
      propertyAddress: '',
      salePrice: '',
      originalPurchasePrice: '',
      improvements: '',
      closingDate: new Date(),
    });

    toast.success('New 1031 exchange created successfully');
  };

  const updateExchangeStatus = (exchangeId: string, status: ExchangeSteps) => {
    setExchanges(exchanges.map(ex => {
      if (ex.id === exchangeId) {
        // If moving to 'sale-closed', update the deadlines based on current date
        if (status === 'sale-closed') {
          const today = new Date();
          return {
            ...ex,
            exchangeStatus: status,
            relinquishedProperty: {
              ...ex.relinquishedProperty,
              closingDate: today.toISOString(),
            },
            identificationDeadline: addDays(today, 45).toISOString(),
            acquisitionDeadline: addDays(today, 180).toISOString(),
          };
        }
        return {
          ...ex,
          exchangeStatus: status,
        };
      }
      return ex;
    }));
    toast.success(`Exchange status updated to ${status.replace('-', ' ')}`);
  };

  const addIdentifiedProperty = () => {
    if (!newProperty.address || !newProperty.price || !newProperty.exchangeId) {
      toast.error('Please fill in all property details');
      return;
    }

    setExchanges(exchanges.map(ex => {
      if (ex.id === newProperty.exchangeId) {
        return {
          ...ex,
          identifiedProperties: [
            ...ex.identifiedProperties,
            {
              id: `property-${Date.now()}`,
              address: newProperty.address,
              price: parseFloat(newProperty.price),
              selected: false,
              status: 'considering' as const,
            }
          ]
        };
      }
      return ex;
    }));

    setNewProperty({
      address: '',
      price: '',
      exchangeId: newProperty.exchangeId,
    });

    toast.success('Property added to identification list');
  };

  const updatePropertyStatus = (exchangeId: string, propertyId: string, status: 'considering' | 'under-contract' | 'closed' | 'rejected') => {
    setExchanges(exchanges.map(ex => {
      if (ex.id === exchangeId) {
        return {
          ...ex,
          identifiedProperties: ex.identifiedProperties.map(prop => {
            if (prop.id === propertyId) {
              return {
                ...prop,
                status,
                // If this property is closed, mark it as selected
                selected: status === 'closed' ? true : prop.selected
              };
            }
            // If this property is being set to closed, unselect all others
            if (status === 'closed') {
              return {
                ...prop,
                selected: prop.id === propertyId
              };
            }
            return prop;
          }),
          // If a property is marked as closed, update the exchange status to completed
          exchangeStatus: status === 'closed' ? 'completed' : ex.exchangeStatus
        };
      }
      return ex;
    }));

    toast.success(`Property status updated to ${status}`);
  };

  const selectProperty = (exchangeId: string, propertyId: string) => {
    setExchanges(exchanges.map(ex => {
      if (ex.id === exchangeId) {
        return {
          ...ex,
          identifiedProperties: ex.identifiedProperties.map(prop => ({
            ...prop,
            selected: prop.id === propertyId
          }))
        };
      }
      return ex;
    }));
    toast.success('Property selected as primary target');
  };

  const getDaysRemaining = (deadline: string) => {
    const days = differenceInDays(new Date(deadline), new Date());
    return days >= 0 ? days : 0;
  };

  const getProgressColor = (days: number, totalDays: number) => {
    const percentage = (days / totalDays) * 100;
    if (percentage > 66) return "bg-green-500";
    if (percentage > 33) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getDeadlineStatus = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    
    if (isAfter(now, deadlineDate)) {
      return <span className="text-red-500 font-semibold">Abgelaufen</span>;
    }
    
    const daysLeft = getDaysRemaining(deadline);
    
    if (daysLeft <= 7) {
      return <span className="text-red-500 font-semibold">{daysLeft} Tage übrig</span>;
    }
    
    if (daysLeft <= 14) {
      return <span className="text-orange-500 font-semibold">{daysLeft} Tage übrig</span>;
    }
    
    return <span className="text-green-500 font-semibold">{daysLeft} Tage übrig</span>;
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">1031 Tauschüberwachung</h1>
          <p className="text-muted-foreground">Verfolgen und verwalten Sie Ihre 1031-Tauschvorgänge und maximieren Sie die Steuervorteile.</p>
        </div>
        <Button onClick={() => setActiveTab('new')} className="md:self-end">
          <RefreshCw className="mr-2 h-4 w-4" />
          Neuen 1031-Tausch erstellen
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="properties">Identifizierte Immobilien</TabsTrigger>
          <TabsTrigger value="calculator">Steuerberechnungen</TabsTrigger>
          <TabsTrigger value="new">Neuer Tausch</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {exchanges.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Keine aktiven Tausche</CardTitle>
                <CardDescription>Sie haben derzeit keine aktiven 1031-Tausche. Erstellen Sie einen neuen, um zu beginnen.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setActiveTab('new')}>Neuen 1031-Tausch erstellen</Button>
              </CardFooter>
            </Card>
          ) : (
            exchanges.map(exchange => (
              <Card key={exchange.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <CardTitle>{exchange.name}</CardTitle>
                      <CardDescription>{exchange.relinquishedProperty.address}</CardDescription>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm capitalize">
                      {exchange.exchangeStatus.replace('-', ' ')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          Verkaufte Immobilie
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Adresse:</div>
                          <div>{exchange.relinquishedProperty.address}</div>
                          
                          <div className="text-muted-foreground">Verkaufspreis:</div>
                          <div>{formatCurrency(exchange.relinquishedProperty.salePrice)}</div>
                          
                          <div className="text-muted-foreground">Abschlussdatum:</div>
                          <div>{format(new Date(exchange.relinquishedProperty.closingDate), 'dd.MM.yyyy')}</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          Wichtige Fristen
                        </h3>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span className="text-muted-foreground">Identifikationsfrist (45 Tage)</span>
                              <span>{getDeadlineStatus(exchange.identificationDeadline)}</span>
                            </div>
                            <Progress 
                              value={((45 - getDaysRemaining(exchange.identificationDeadline)) / 45) * 100} 
                              className={cn("h-2", getProgressColor(getDaysRemaining(exchange.identificationDeadline), 45))}
                            />
                            <div className="mt-1 text-xs text-muted-foreground">
                              Fälligkeit am {format(new Date(exchange.identificationDeadline), 'dd.MM.yyyy')}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span className="text-muted-foreground">Akquisitionsfrist (180 Tage)</span>
                              <span>{getDeadlineStatus(exchange.acquisitionDeadline)}</span>
                            </div>
                            <Progress 
                              value={((180 - getDaysRemaining(exchange.acquisitionDeadline)) / 180) * 100}
                              className={cn("h-2", getProgressColor(getDaysRemaining(exchange.acquisitionDeadline), 180))}
                            />
                            <div className="mt-1 text-xs text-muted-foreground">
                              Fälligkeit am {format(new Date(exchange.acquisitionDeadline), 'dd.MM.yyyy')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                        Tauschstatus aktualisieren
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <Button 
                          variant={exchange.exchangeStatus === 'sale-pending' ? 'default' : 'outline'} 
                          onClick={() => updateExchangeStatus(exchange.id, 'sale-pending')}
                          disabled={exchange.exchangeStatus !== 'sale-pending' && exchange.exchangeStatus !== 'not-started'}
                          className="justify-start"
                        >
                          1. Verkauf im Gange
                        </Button>
                        
                        <Button 
                          variant={exchange.exchangeStatus === 'sale-closed' ? 'default' : 'outline'} 
                          onClick={() => updateExchangeStatus(exchange.id, 'sale-closed')}
                          disabled={exchange.exchangeStatus !== 'sale-closed' && exchange.exchangeStatus !== 'sale-pending'}
                          className="justify-start"
                        >
                          2. Verkauf abgeschlossen
                        </Button>
                        
                        <Button 
                          variant={exchange.exchangeStatus === 'identification' ? 'default' : 'outline'} 
                          onClick={() => updateExchangeStatus(exchange.id, 'identification')}
                          disabled={exchange.exchangeStatus !== 'identification' && exchange.exchangeStatus !== 'sale-closed'}
                          className="justify-start"
                        >
                          3. Eigenschaften identifiziert
                        </Button>
                        
                        <Button 
                          variant={exchange.exchangeStatus === 'acquisition' ? 'default' : 'outline'} 
                          onClick={() => updateExchangeStatus(exchange.id, 'acquisition')}
                          disabled={exchange.exchangeStatus !== 'acquisition' && exchange.exchangeStatus !== 'identification'}
                          className="justify-start"
                        >
                          4. Erwerb im Gange
                        </Button>
                        
                        <Button 
                          variant={exchange.exchangeStatus === 'completed' ? 'default' : 'outline'} 
                          onClick={() => updateExchangeStatus(exchange.id, 'completed')}
                          disabled={exchange.exchangeStatus !== 'completed' && exchange.exchangeStatus !== 'acquisition'}
                          className="justify-start"
                        >
                          5. Tausch abgeschlossen
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Identifizierte Ersatzimmobilien</h4>
                        {exchange.identifiedProperties.length > 0 ? (
                          <div className="space-y-2">
                            {exchange.identifiedProperties.map(property => (
                              <div 
                                key={property.id}
                                className={cn(
                                  "p-2 border rounded-md text-sm",
                                  property.selected && "border-primary bg-primary/5"
                                )}
                              >
                                <div className="font-medium">{property.address}</div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-muted-foreground">{formatCurrency(property.price)}</span>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs capitalize",
                                    property.status === 'under-contract' && "bg-orange-100 text-orange-600",
                                    property.status === 'closed' && "bg-green-100 text-green-600",
                                    property.status === 'rejected' && "bg-red-100 text-red-600",
                                    property.status === 'considering' && "bg-blue-100 text-blue-600"
                                  )}>
                                    {property.status.replace('-', ' ')}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">Keine Immobilien identifiziert.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          {exchanges.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Keine aktiven Tausche</CardTitle>
                <CardDescription>Sie haben derzeit keine aktiven 1031-Tausche. Erstellen Sie einen neuen, um zu beginnen.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setActiveTab('new')}>Neuen 1031-Tausch erstellen</Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              {exchanges.map(exchange => (
                <Card key={exchange.id}>
                  <CardHeader>
                    <CardTitle>{exchange.name}</CardTitle>
                    <CardDescription>Identifizierte Ersatzimmobilien für diesen 1031-Tausch</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <h3 className="text-sm font-medium">Identifikationsfrist</h3>
                          <p className="text-sm text-muted-foreground">
                            {getDeadlineStatus(exchange.identificationDeadline)} - bis {format(new Date(exchange.identificationDeadline), 'dd.MM.yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setNewProperty({...newProperty, exchangeId: exchange.id});
                              setEditExchangeId(exchange.id);
                            }}
                          >
                            Immobilie hinzufügen
                          </Button>
                        </div>
                      </div>
                      
                      {editExchangeId === exchange.id && (
                        <div className="bg-muted/50 p-4 rounded-md">
                          <h4 className="font-medium mb-3">Neue Ersatzimmobilie</h4>
                          <div className="grid gap-3">
                            <div>
                              <Label htmlFor="property-address">Adresse</Label>
                              <Input
                                id="property-address"
                                value={newProperty.address}
                                onChange={e => setNewProperty({...newProperty, address: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="property-price">Preis</Label>
                              <Input
                                id="property-price"
                                type="number"
                                value={newProperty.price}
                                onChange={e => setNewProperty({...newProperty, price: e.target.value})}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setEditExchangeId(null)}>Abbrechen</Button>
                              <Button onClick={addIdentifiedProperty}>Hinzufügen</Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {exchange.identifiedProperties.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="text-left text-sm text-muted-foreground border-b">
                                <th className="pb-2 pl-2">Adresse</th>
                                <th className="pb-2">Preis</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2 pr-2">Aktionen</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exchange.identifiedProperties.map(property => (
                                <tr 
                                  key={property.id} 
                                  className={cn(
                                    "border-b last:border-0 hover:bg-muted/50",
                                    property.selected && "bg-primary/5"
                                  )}
                                >
                                  <td className="py-3 pl-2">{property.address}</td>
                                  <td className="py-3">{formatCurrency(property.price)}</td>
                                  <td className="py-3">
                                    <div className={cn(
                                      "inline-block px-2 py-1 rounded-full text-xs capitalize",
                                      property.status === 'under-contract' && "bg-orange-100 text-orange-600",
                                      property.status === 'closed' && "bg-green-100 text-green-600",
                                      property.status === 'rejected' && "bg-red-100 text-red-600",
                                      property.status === 'considering' && "bg-blue-100 text-blue-600"
                                    )}>
                                      {property.status.replace('-', ' ')}
                                    </div>
                                  </td>
                                  <td className="py-3 pr-2">
                                    <div className="flex items-center gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => selectProperty(exchange.id, property.id)}
                                        disabled={property.selected}
                                      >
                                        {property.selected ? 'Ausgewählt' : 'Auswählen'}
                                      </Button>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="ghost" size="sm">Status</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-56 p-2">
                                          <div className="grid gap-1">
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="justify-start h-8"
                                              onClick={() => updatePropertyStatus(exchange.id, property.id, 'considering')}
                                            >
                                              Betrachtend
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="justify-start h-8"
                                              onClick={() => updatePropertyStatus(exchange.id, property.id, 'under-contract')}
                                            >
                                              Unter Vertrag
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="justify-start h-8"
                                              onClick={() => updatePropertyStatus(exchange.id, property.id, 'closed')}
                                            >
                                              Abgeschlossen
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="justify-start h-8 text-red-500"
                                              onClick={() => updatePropertyStatus(exchange.id, property.id, 'rejected')}
                                            >
                                              Abgelehnt
                                            </Button>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-muted/30 p-6 text-center rounded-md">
                          <p className="text-muted-foreground">Keine Immobilien identifiziert. Fügen Sie Ersatzimmobilien hinzu.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Steueraufschubsrechner für 1031-Tausch</CardTitle>
              <CardDescription>Berechnen Sie Ihre potenziellen Steuerersparnisse durch einen 1031-Tausch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-3">Immobiliendaten</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="salesPrice">Verkaufspreis</Label>
                      <Input
                        id="salesPrice"
                        type="number"
                        value={calculatorValues.salesPrice}
                        onChange={(e) => setCalculatorValues({...calculatorValues, salesPrice: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="originalBasis">Ursprünglicher Kaufpreis</Label>
                      <Input
                        id="originalBasis"
                        type="number"
                        value={calculatorValues.originalBasis}
                        onChange={(e) => setCalculatorValues({...calculatorValues, originalBasis: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="improvements">Verbesserungskosten</Label>
                      <Input
                        id="improvements"
                        type="number"
                        value={calculatorValues.improvements}
                        onChange={(e) => setCalculatorValues({...calculatorValues, improvements: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sellingCosts">Verkaufskosten</Label>
                      <Input
                        id="sellingCosts"
                        type="number"
                        value={calculatorValues.sellingCosts}
                        onChange={(e) => setCalculatorValues({...calculatorValues, sellingCosts: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isLongTerm" 
                        checked={calculatorValues.isLongTerm}
                        onCheckedChange={(checked) => setCalculatorValues({...calculatorValues, isLongTerm: checked === true})}
                      />
                      <Label htmlFor="isLongTerm">Langfristiger Kapitalgewinn (Besitz {">"} 1 Jahr)</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Steuerinformationen</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="federalTaxRate">Bundessteuersatz (%)</Label>
                      <Input
                        id="federalTaxRate"
                        type="number"
                        value={calculatorValues.federalTaxRate}
                        onChange={(e) => setCalculatorValues({...calculatorValues, federalTaxRate: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stateTaxRate">Landessteuersatz (%)</Label>
                      <Input
                        id="stateTaxRate"
                        type="number"
                        value={calculatorValues.stateTaxRate}
                        onChange={(e) => setCalculatorValues({...calculatorValues, stateTaxRate: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md space-y-3 mt-6">
                      <h4 className="font-medium">Berechnungsergebnisse</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Angepasste Basis:</div>
                        <div>{formatCurrency(calculatorValues.adjustedBasis)}</div>
                        
                        <div className="text-muted-foreground">Kapitalgewinn:</div>
                        <div>{formatCurrency(calculatorValues.gainAmount)}</div>
                        
                        <div className="text-muted-foreground">Aufgeschobener Gewinn:</div>
                        <div>{formatCurrency(calculatorValues.deferredGain)}</div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Bundes-Steuerersparnis:</div>
                        <div>{formatCurrency(calculatorValues.federalTaxSavings)}</div>
                        
                        <div className="text-muted-foreground">Landes-Steuerersparnis:</div>
                        <div>{formatCurrency(calculatorValues.stateTaxSavings)}</div>
                        
                        <div className="font-medium">Gesamte Steuerersparnis:</div>
                        <div className="font-medium text-green-600">{formatCurrency(calculatorValues.totalTaxSavings)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm mt-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Dies ist eine Schätzung. Bitte konsultieren Sie einen Steuerberater für genaue Berechnungen.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Neuen 1031-Tausch erstellen</CardTitle>
              <CardDescription>Beginnen Sie die Verfolgung eines neuen 1031-Tauschvorgangs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="exchange-name">Tauschname</Label>
                  <Input 
                    id="exchange-name" 
                    placeholder="z.B. Frankfurt Apartment Tausch" 
                    value={newExchange.name} 
                    onChange={(e) => setNewExchange({...newExchange, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="property-address">Adresse der verkauften Immobilie</Label>
                  <Input 
                    id="property-address" 
                    placeholder="Vollständige Adresse" 
                    value={newExchange.propertyAddress} 
                    onChange={(e) => setNewExchange({...newExchange, propertyAddress: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sale-price">Verkaufspreis</Label>
                    <Input 
                      id="sale-price" 
                      type="number" 
                      placeholder="z.B. 500000" 
                      value={newExchange.salePrice} 
                      onChange={(e) => setNewExchange({...newExchange, salePrice: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="closing-date">Geplantes Abschlussdatum</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(newExchange.closingDate, 'PPP', { locale: de })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={newExchange.closingDate}
                          onSelect={(date) => date && setNewExchange({...newExchange, closingDate: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original-price">Ursprünglicher Kaufpreis</Label>
                    <Input 
                      id="original-price" 
                      type="number" 
                      placeholder="z.B. 300000" 
                      value={newExchange.originalPurchasePrice} 
                      onChange={(e) => setNewExchange({...newExchange, originalPurchasePrice: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="improvements">Verbesserungskosten</Label>
                    <Input 
                      id="improvements" 
                      type="number" 
                      placeholder="z.B. 50000" 
                      value={newExchange.improvements} 
                      onChange={(e) => setNewExchange({...newExchange, improvements: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <div className="text-sm text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5" />
                <span>Nach der Erstellung können Sie identifizierte Ersatzimmobilien hinzufügen.</span>
              </div>
              <Button onClick={addExchange}>1031-Tausch erstellen</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExchangeTracker;
