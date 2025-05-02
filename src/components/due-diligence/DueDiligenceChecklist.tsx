
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, Calendar, CheckCircle, CheckSquare, ChevronDown, ChevronRight,
  ClipboardCheck, FileText, Search, TrendingUp, Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Simplified implementation of DueDiligenceChecklist component
const DueDiligenceChecklist: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("property");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample data for the checklist
  const checklistItems = {
    property: [
      { id: "p1", title: "Property inspection report", completed: true },
      { id: "p2", title: "Building condition assessment", completed: false },
      { id: "p3", title: "Past inspection records review", completed: false },
      { id: "p4", title: "Pest inspection report", completed: true },
      { id: "p5", title: "Floor plan verification", completed: false },
      { id: "p6", title: "Utility systems check", completed: false },
    ],
    financial: [
      { id: "f1", title: "Income & expense verification", completed: false },
      { id: "f2", title: "Cash flow analysis", completed: false },
      { id: "f3", title: "Tax records review", completed: false },
      { id: "f4", title: "Insurance quote", completed: false },
      { id: "f5", title: "Property tax assessment", completed: false },
    ],
    legal: [
      { id: "l1", title: "Title search completion", completed: true },
      { id: "l2", title: "Property liens check", completed: false },
      { id: "l3", title: "Zoning compliance verification", completed: false },
      { id: "l4", title: "Easements & encroachments", completed: false },
      { id: "l5", title: "HOA document review", completed: false },
    ],
    environmental: [
      { id: "e1", title: "Environmental site assessment", completed: false },
      { id: "e2", title: "Flood zone determination", completed: true },
      { id: "e3", title: "Soil contamination check", completed: false },
      { id: "e4", title: "Lead & asbestos testing", completed: false },
    ]
  };
  
  // Calculate completion percentages
  const calculateCompletion = (items) => {
    const total = items.length;
    const completed = items.filter(item => item.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  const propertyCompletion = calculateCompletion(checklistItems.property);
  const financialCompletion = calculateCompletion(checklistItems.financial);
  const legalCompletion = calculateCompletion(checklistItems.legal);
  const environmentalCompletion = calculateCompletion(checklistItems.environmental);
  
  const totalCompletion = Math.round(
    (propertyCompletion + financialCompletion + legalCompletion + environmentalCompletion) / 4
  );
  
  // Toggle item completion status
  const toggleItem = (category, id) => {
    // In a real application, this would update state and possibly save to backend
    console.log(`Toggling ${category} item ${id}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <ClipboardCheck className="inline-block mr-2 h-8 w-8" />
          {t('dueDiligence')}
        </h1>
        <p className="text-muted-foreground">{t('completeInvestmentChecklist')}</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Due Diligence Progress</CardTitle>
              <CardDescription>Track your investment verification process</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalCompletion}%</div>
              <div className="text-xs text-muted-foreground">Overall completion</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  <span>Property</span>
                </div>
                <span>{propertyCompletion}%</span>
              </div>
              <Progress value={propertyCompletion} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Financial</span>
                </div>
                <span>{financialCompletion}%</span>
              </div>
              <Progress value={financialCompletion} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Legal</span>
                </div>
                <span>{legalCompletion}%</span>
              </div>
              <Progress value={legalCompletion} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center">
                  <Map className="h-4 w-4 mr-1" />
                  <span>Environmental</span>
                </div>
                <span>{environmentalCompletion}%</span>
              </div>
              <Progress value={environmentalCompletion} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search checklist items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
        </TabsList>
        
        <TabsContent value="property" className="mt-4 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="inspection">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span className="mr-2">Property Inspection</span>
                      <Badge variant={propertyCompletion > 0 ? "default" : "outline"}>
                        {calculateCompletion(checklistItems.property.slice(0, 3))}%
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-4">
                      {checklistItems.property.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.id}
                            checked={item.completed}
                            onCheckedChange={() => toggleItem("property", item.id)}
                          />
                          <label
                            htmlFor={item.id}
                            className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {item.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="structure">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span className="mr-2">Structure & Systems</span>
                      <Badge variant={propertyCompletion > 0 ? "default" : "outline"}>
                        {calculateCompletion(checklistItems.property.slice(3))}%
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-4">
                      {checklistItems.property.slice(3).map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.id}
                            checked={item.completed}
                            onCheckedChange={() => toggleItem("property", item.id)}
                          />
                          <label
                            htmlFor={item.id}
                            className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {item.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Button className="w-full" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Property Report
          </Button>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {checklistItems.financial.map(item => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={() => toggleItem("financial", item.id)}
                    />
                    <label
                      htmlFor={item.id}
                      className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.title}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="legal" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {checklistItems.legal.map(item => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={() => toggleItem("legal", item.id)}
                    />
                    <label
                      htmlFor={item.id}
                      className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.title}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="environmental" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {checklistItems.environmental.map(item => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={() => toggleItem("environmental", item.id)}
                    />
                    <label
                      htmlFor={item.id}
                      className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.title}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DueDiligenceChecklist;
