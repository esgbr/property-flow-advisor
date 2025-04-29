
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { sampleProperties } from '@/data/sampleData';
import { Check, Plus, Trash, Wrench } from 'lucide-react';
import { Property } from '@/interfaces/property';

const RefurbishmentCalculator = () => {
  const [budget, setBudget] = useState(50000);
  const [tasks, setTasks] = useState([
    { id: '1', name: 'Kitchen Renovation', cost: 15000 },
    { id: '2', name: 'Bathroom Update', cost: 8000 },
    { id: '3', name: 'Flooring', cost: 7500 },
    { id: '4', name: 'Painting', cost: 4000 },
    { id: '5', name: 'Electrical Updates', cost: 3500 },
  ]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCost, setNewTaskCost] = useState('');
  const [expectedValueIncrease, setExpectedValueIncrease] = useState(70000);
  const [expectedRentIncrease, setExpectedRentIncrease] = useState(300);
  
  const totalCost = tasks.reduce((sum, task) => sum + task.cost, 0);
  const remainingBudget = budget - totalCost;
  
  const handleAddTask = () => {
    if (newTaskName && newTaskCost) {
      setTasks([
        ...tasks, 
        { 
          id: Date.now().toString(),
          name: newTaskName,
          cost: Number(newTaskCost) 
        }
      ]);
      setNewTaskName('');
      setNewTaskCost('');
    }
  };
  
  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const propertiesWithRefurbishment = sampleProperties.filter(
    property => property.refurbishment || property.status === 'analyzing'
  );
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Refurbishment Calculator</CardTitle>
          <CardDescription>Plan and calculate renovation costs and returns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Total Budget</Label>
              <span className="text-sm font-medium">€{budget.toLocaleString()}</span>
            </div>
            <Slider
              value={[budget]}
              min={10000}
              max={200000}
              step={5000}
              onValueChange={(values) => setBudget(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Renovation Tasks</h3>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{task.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">€{task.cost.toLocaleString()}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveTask(task.id)}
                    >
                      <Trash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-[1fr,auto,auto] gap-2 items-end mt-4">
              <div>
                <Label htmlFor="taskName" className="text-sm">Task Name</Label>
                <Input 
                  id="taskName"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g., New Windows"
                />
              </div>
              <div>
                <Label htmlFor="taskCost" className="text-sm">Cost (€)</Label>
                <Input 
                  id="taskCost"
                  value={newTaskCost}
                  onChange={(e) => setNewTaskCost(e.target.value)}
                  placeholder="5000"
                  type="number"
                  className="w-28"
                />
              </div>
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className={`flex justify-between p-3 mt-2 rounded-lg font-medium ${
              remainingBudget >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              <span>Remaining Budget:</span>
              <span>€{remainingBudget.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Expected Property Value Increase</Label>
                <span className="text-sm font-medium">€{expectedValueIncrease.toLocaleString()}</span>
              </div>
              <Slider
                value={[expectedValueIncrease]}
                min={0}
                max={200000}
                step={5000}
                onValueChange={(values) => setExpectedValueIncrease(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Expected Monthly Rent Increase</Label>
                <span className="text-sm font-medium">€{expectedRentIncrease}</span>
              </div>
              <Slider
                value={[expectedRentIncrease]}
                min={0}
                max={1000}
                step={50}
                onValueChange={(values) => setExpectedRentIncrease(values[0])}
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-sm text-muted-foreground">ROI (Value)</div>
              <div className="text-2xl font-bold mt-1">
                {((expectedValueIncrease / totalCost) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Value Increase ÷ Cost
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Annual Rent Yield</div>
              <div className="text-2xl font-bold mt-1">
                {((expectedRentIncrease * 12 / totalCost) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Annual Rent Increase ÷ Cost
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Payback Period</div>
              <div className="text-2xl font-bold mt-1">
                {(totalCost / (expectedRentIncrease * 12)).toFixed(1)} years
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Cost ÷ Annual Rent Increase
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Properties for Refurbishment</CardTitle>
          <CardDescription>Properties with renovation potential</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {propertiesWithRefurbishment.length > 0 ? (
              propertiesWithRefurbishment.map((property: Property) => (
                <div key={property.id} className="border rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {property.imageUrl && (
                      <div className="w-full md:w-48 h-48">
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {property.city}, {property.country}
                        </span>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Price:</span> €{property.purchasePrice.toLocaleString()}</div>
                        <div><span className="text-muted-foreground">Area:</span> {property.squareMeters} m²</div>
                        <div><span className="text-muted-foreground">Type:</span> {property.propertyType}</div>
                        <div><span className="text-muted-foreground">Rooms:</span> {property.rooms}</div>
                      </div>
                      
                      {property.refurbishment && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium flex items-center">
                            <Wrench className="h-4 w-4 mr-1" />
                            Refurbishment Plan
                          </h4>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-muted-foreground">Budget:</span> €{property.refurbishment.totalBudget.toLocaleString()}</div>
                            <div><span className="text-muted-foreground">Timeline:</span> {property.refurbishment.completionTimeframe} months</div>
                            <div><span className="text-muted-foreground">Value Increase:</span> €{property.refurbishment.expectedValueIncrease.toLocaleString()}</div>
                            <div><span className="text-muted-foreground">Rent Increase:</span> €{property.refurbishment.expectedRentIncrease}/month</div>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap gap-2">
                            {property.refurbishment.tasks.slice(0, 3).map(task => (
                              <span key={task.id} className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-muted">
                                {task.name}: €{task.cost.toLocaleString()}
                              </span>
                            ))}
                            {property.refurbishment.tasks.length > 3 && (
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-muted">
                                +{property.refurbishment.tasks.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!property.refurbishment && (
                    <div className="px-4 py-3 bg-muted border-t flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">No refurbishment plan yet</span>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Create Plan
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <h3 className="font-medium text-lg mb-1">No properties for refurbishment</h3>
                <p className="text-muted-foreground">Add properties that need renovation</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Refurbishment = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Refurbishment</h1>
        <p className="text-muted-foreground">Plan and manage property renovations</p>
      </div>
      
      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator" className="pt-4">
          <RefurbishmentCalculator />
        </TabsContent>
        <TabsContent value="projects" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Refurbishment Projects</CardTitle>
              <CardDescription>Track your ongoing renovation projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Wrench className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Detailed project tracking with timelines, contractor management, 
                  and before/after comparisons will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Refurbishment;
