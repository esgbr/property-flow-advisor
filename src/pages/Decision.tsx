
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sampleProperties } from '@/data/sampleData';
import { Check, X, Home } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const DecisionCriteria = [
  { id: 'cashFlowPositive', label: 'Cash Flow Positive' },
  { id: 'goodLocation', label: 'Good Location' },
  { id: 'structurallySound', label: 'Structurally Sound' },
  { id: 'growthPotential', label: 'Growth Potential' },
  { id: 'affordableRenovation', label: 'Affordable Renovation' },
  { id: 'favorableFinancing', label: 'Favorable Financing' },
  { id: 'quickClosing', label: 'Quick Closing Possible' },
];

const Decision = () => {
  const { toast } = useToast();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [criteria, setCriteria] = useState<{ [key: string]: boolean }>({
    cashFlowPositive: false,
    goodLocation: false,
    structurallySound: false,
    growthPotential: false,
    affordableRenovation: false,
    favorableFinancing: false,
    quickClosing: false,
  });
  const [notes, setNotes] = useState<string>('');
  const [decision, setDecision] = useState<'buy' | 'pass' | 'undecided'>('undecided');
  
  const selectedProperty = sampleProperties.find(p => p.id === selectedPropertyId);
  
  const criteriaChecked = Object.values(criteria).filter(Boolean).length;
  const totalCriteria = DecisionCriteria.length;
  const criteriaPercentage = (criteriaChecked / totalCriteria) * 100;
  
  const handleCriteriaChange = (criteriaId: string, checked: boolean) => {
    setCriteria(prev => ({
      ...prev,
      [criteriaId]: checked
    }));
  };
  
  const handleDecision = (decision: 'buy' | 'pass') => {
    setDecision(decision);
    
    const message = decision === 'buy' 
      ? 'Decision recorded: Purchase this property' 
      : 'Decision recorded: Pass on this property';
      
    toast({
      title: message,
      description: `${criteriaChecked} out of ${totalCriteria} criteria met.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Purchase Decision</h1>
        <p className="text-muted-foreground">Evaluate properties against key criteria</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Decision Checklist</CardTitle>
          <CardDescription>Systematically evaluate whether to buy a property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="property-select">Select Property</Label>
            <Select onValueChange={setSelectedPropertyId} value={selectedPropertyId}>
              <SelectTrigger className="w-full" id="property-select">
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Properties</SelectLabel>
                  {sampleProperties.map(property => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {selectedProperty ? (
            <>
              <div className="p-4 border rounded-lg bg-muted/50 flex">
                {selectedProperty.imageUrl ? (
                  <img 
                    src={selectedProperty.imageUrl} 
                    alt={selectedProperty.title}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                ) : (
                  <div className="w-20 h-20 bg-muted flex items-center justify-center rounded mr-4">
                    <Home className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{selectedProperty.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProperty.address}, {selectedProperty.city}</p>
                  <div className="mt-1 flex space-x-4 text-sm">
                    <span>€{selectedProperty.purchasePrice.toLocaleString()}</span>
                    <span>{selectedProperty.squareMeters} m²</span>
                    <span>{selectedProperty.rooms} rooms</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Decision Criteria</h3>
                  <span className="text-sm text-muted-foreground">
                    {criteriaChecked} of {totalCriteria} criteria met
                  </span>
                </div>
                
                <div className="h-2 w-full bg-muted rounded overflow-hidden">
                  <div 
                    className={`h-2 ${
                      criteriaPercentage >= 70 ? 'bg-green-500' : 
                      criteriaPercentage >= 50 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${criteriaPercentage}%` }}
                  ></div>
                </div>
                
                <div className="space-y-3 mt-4">
                  {DecisionCriteria.map(item => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={item.id} 
                        checked={criteria[item.id]} 
                        onCheckedChange={(checked) => 
                          handleCriteriaChange(item.id, checked === true)
                        }
                      />
                      <Label htmlFor={item.id}>{item.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add your observations and thoughts about this property..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Final Decision</h3>
                <div className="flex space-x-4">
                  <Button 
                    className="flex-1"
                    onClick={() => handleDecision('buy')}
                    variant="default"
                  >
                    <Check className="mr-2 h-4 w-4" /> Buy
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleDecision('pass')}
                    variant="outline"
                  >
                    <X className="mr-2 h-4 w-4" /> Pass
                  </Button>
                </div>
                
                {decision !== 'undecided' && (
                  <div className={`mt-4 p-4 rounded-md ${
                    decision === 'buy' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <h4 className={`font-medium ${
                      decision === 'buy' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      Decision: {decision === 'buy' ? 'Purchase' : 'Pass'}
                    </h4>
                    <p className="text-sm mt-1">
                      {decision === 'buy'
                        ? `You've decided to purchase this property with ${criteriaChecked} of ${totalCriteria} criteria met.`
                        : `You've decided to pass on this property with only ${criteriaChecked} of ${totalCriteria} criteria met.`
                      }
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Home className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Property Selected</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Please select a property from the dropdown menu to begin the evaluation process.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Decision;
