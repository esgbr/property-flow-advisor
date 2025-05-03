
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Check, ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface RenovationItem {
  id: string;
  name: string;
  cost: number;
  valueAdd: number;
  timeframe: number; // in weeks
}

const defaultRenovationItems: RenovationItem[] = [
  { id: '1', name: 'Kitchen Remodel', cost: 15000, valueAdd: 25000, timeframe: 3 },
  { id: '2', name: 'Bathroom Update', cost: 8500, valueAdd: 12000, timeframe: 2 },
  { id: '3', name: 'Fresh Paint (Interior)', cost: 3200, valueAdd: 5000, timeframe: 1 },
];

interface RenovationCalculatorProps {
  className?: string;
}

const RenovationCalculator: React.FC<RenovationCalculatorProps> = ({ className }) => {
  const [renovationItems, setRenovationItems] = useState<RenovationItem[]>(defaultRenovationItems);
  const [propertyValue, setPropertyValue] = useState(350000);
  const [newItem, setNewItem] = useState<{ name: string; cost: string; valueAdd: string; timeframe: string }>({
    name: '',
    cost: '',
    valueAdd: '',
    timeframe: ''
  });
  const [openSection, setOpenSection] = useState<string | null>(null);
  
  const { toast } = useToast();

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const totalCost = renovationItems.reduce((acc, item) => acc + item.cost, 0);
  const totalValueAdd = renovationItems.reduce((acc, item) => acc + item.valueAdd, 0);
  const roi = totalCost > 0 ? ((totalValueAdd / totalCost) * 100).toFixed(1) : '0';
  const newPropertyValue = propertyValue + totalValueAdd;
  
  // Get the longest timeframe in weeks
  const totalTimeframe = renovationItems.length > 0 ? 
    Math.max(...renovationItems.map(item => item.timeframe)) : 0;

  const handleAddItem = () => {
    if (!newItem.name || !newItem.cost || !newItem.valueAdd || !newItem.timeframe) {
      toast({
        title: "Incomplete information",
        description: "Please fill all fields for the new renovation item",
        variant: "destructive"
      });
      return;
    }

    const newRenovationItem: RenovationItem = {
      id: Date.now().toString(),
      name: newItem.name,
      cost: Number(newItem.cost),
      valueAdd: Number(newItem.valueAdd),
      timeframe: Number(newItem.timeframe)
    };

    setRenovationItems([...renovationItems, newRenovationItem]);
    setNewItem({ name: '', cost: '', valueAdd: '', timeframe: '' });
    
    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your renovation plan.`,
    });
  };

  const handleRemoveItem = (id: string) => {
    setRenovationItems(renovationItems.filter(item => item.id !== id));
  };

  const handleSavePlan = () => {
    toast({
      title: "Renovation plan saved",
      description: "Your renovation plan has been saved successfully.",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Calculator className="mr-2 h-6 w-6" />
            Renovation ROI Calculator
          </h2>
          <p className="text-muted-foreground">Plan renovations and calculate potential returns</p>
        </div>
        <Button onClick={handleSavePlan}>Save Plan</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>Enter your property information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="propertyValue">Current Property Value</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-3 text-muted-foreground">€</span>
                <Input 
                  id="propertyValue"
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="pl-7"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-2">Renovation Items</h3>
              
              <div className="space-y-3">
                {renovationItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex-grow">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-3 mt-1">
                        <span>€{item.cost.toLocaleString()}</span>
                        <span>+€{item.valueAdd.toLocaleString()} value</span>
                        <span>{item.timeframe} week{item.timeframe !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                      <Trash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Collapsible className="mt-4">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between" type="button">
                    <span>Add New Renovation Item</span>
                    {openSection === 'newItem' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4 border rounded-md p-4">
                  <div>
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input 
                      id="itemName"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="e.g., Bathroom Remodel"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemCost">Cost (€)</Label>
                      <Input 
                        id="itemCost"
                        type="number"
                        value={newItem.cost}
                        onChange={(e) => setNewItem({...newItem, cost: e.target.value})}
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemValueAdd">Value Added (€)</Label>
                      <Input 
                        id="itemValueAdd"
                        type="number"
                        value={newItem.valueAdd}
                        onChange={(e) => setNewItem({...newItem, valueAdd: e.target.value})}
                        placeholder="15000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="itemTimeframe">Timeframe (weeks)</Label>
                    <Input 
                      id="itemTimeframe"
                      type="number"
                      value={newItem.timeframe}
                      onChange={(e) => setNewItem({...newItem, timeframe: e.target.value})}
                      placeholder="2"
                    />
                  </div>
                  
                  <Button onClick={handleAddItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>ROI Analysis</CardTitle>
            <CardDescription>Projected return on investment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Current Value</div>
                <div className="text-2xl font-bold">€{propertyValue.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">After Renovation</div>
                <div className="text-2xl font-bold text-green-600">€{newPropertyValue.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Value Increase</div>
                <div className="text-2xl font-bold text-green-600">+€{totalValueAdd.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Total Cost</div>
                <div className="text-xl font-bold">€{totalCost.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-sm text-muted-foreground">ROI</div>
                <div className="text-xl font-bold text-green-600">{roi}%</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Timeframe</div>
                <div className="text-xl font-bold">{totalTimeframe} weeks</div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Return Analysis</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cost to Value Ratio</span>
                    <span className="font-medium">
                      1:{(totalValueAdd / totalCost).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${Math.min(100, (totalValueAdd / totalCost) * 50)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    For every €1 spent, you gain €{(totalValueAdd / totalCost).toFixed(2)} in value
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Value Boost Percentage</span>
                    <span className="font-medium">
                      +{((totalValueAdd / propertyValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${Math.min(100, (totalValueAdd / propertyValue) * 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Percentage increase in total property value
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-green-50 text-green-800 rounded-lg flex items-start">
                <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Good ROI Potential</div>
                  <p className="text-sm">
                    This renovation plan has a positive return on investment. The value added exceeds your costs by {(totalValueAdd - totalCost).toLocaleString()} EUR.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RenovationCalculator;
