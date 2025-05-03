
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, TrendingDown, BarChart3, Droplets, Sun, Zap, Thermometer, Calculator, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Sample energy consumption data
const energyData = [
  { month: 'Jan', consumption: 1840, benchmark: 2100, potential: 1500 },
  { month: 'Feb', consumption: 1760, benchmark: 2100, potential: 1500 },
  { month: 'Mar', consumption: 1680, benchmark: 2100, potential: 1500 },
  { month: 'Apr', consumption: 1620, benchmark: 2100, potential: 1500 },
  { month: 'May', consumption: 1580, benchmark: 2100, potential: 1500 },
  { month: 'Jun', consumption: 1550, benchmark: 2100, potential: 1500 },
];

// Sample water consumption data
const waterData = [
  { month: 'Jan', consumption: 42, benchmark: 50, potential: 35 },
  { month: 'Feb', consumption: 45, benchmark: 50, potential: 35 },
  { month: 'Mar', consumption: 41, benchmark: 50, potential: 35 },
  { month: 'Apr', consumption: 39, benchmark: 50, potential: 35 },
  { month: 'May', consumption: 38, benchmark: 50, potential: 35 },
  { month: 'Jun', consumption: 37, benchmark: 50, potential: 35 },
];

// Sample sustainability score data
const sustainabilityScores = [
  { category: 'Energy Efficiency', score: 68, potential: 95 },
  { category: 'Water Conservation', score: 75, potential: 92 },
  { category: 'Waste Management', score: 62, potential: 90 },
  { category: 'Material Usage', score: 58, potential: 85 },
  { category: 'Indoor Air Quality', score: 72, potential: 88 },
  { category: 'Renewable Energy', score: 45, potential: 98 },
];

// Improvement recommendations
const recommendations = [
  { 
    id: 1, 
    title: 'LED Lighting Upgrade', 
    cost: 1200, 
    savings: 450, 
    roi: 2.7, 
    difficulty: 'Easy',
    impact: 'Medium',
    category: 'Energy',
  },
  { 
    id: 2, 
    title: 'Smart Thermostat Installation', 
    cost: 350, 
    savings: 320, 
    roi: 1.1, 
    difficulty: 'Easy',
    impact: 'Medium',
    category: 'Energy',
  },
  { 
    id: 3, 
    title: 'Low-Flow Fixtures', 
    cost: 600, 
    savings: 280, 
    roi: 2.1, 
    difficulty: 'Easy',
    impact: 'Medium',
    category: 'Water',
  },
  { 
    id: 4, 
    title: 'Solar Panel Installation', 
    cost: 12000, 
    savings: 1800, 
    roi: 6.7, 
    difficulty: 'Complex',
    impact: 'High',
    category: 'Energy',
  },
  { 
    id: 5, 
    title: 'Improved Insulation', 
    cost: 3200, 
    savings: 650, 
    roi: 4.9, 
    difficulty: 'Medium',
    impact: 'High',
    category: 'Energy',
  },
];

// Radar chart data
const radarData = [
  {
    subject: 'Energy',
    current: 68,
    potential: 95,
    fullMark: 100,
  },
  {
    subject: 'Water',
    current: 75,
    potential: 92,
    fullMark: 100,
  },
  {
    subject: 'Waste',
    current: 62,
    potential: 90,
    fullMark: 100,
  },
  {
    subject: 'Materials',
    current: 58,
    potential: 85,
    fullMark: 100,
  },
  {
    subject: 'Air Quality',
    current: 72,
    potential: 88,
    fullMark: 100,
  },
  {
    subject: 'Renewables',
    current: 45,
    potential: 98,
    fullMark: 100,
  },
];

const SustainabilityMetrics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const { toast } = useToast();
  
  const handleCalculateScore = () => {
    toast({
      title: "Sustainability score updated",
      description: "The property's sustainability metrics have been recalculated.",
    });
  };
  
  const handleAddUpgrade = (id: number) => {
    const upgrade = recommendations.find(r => r.id === id);
    if (upgrade) {
      toast({
        title: `${upgrade.title} added to plan`,
        description: `This upgrade has been added to your sustainability improvement plan.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Leaf className="mr-2 h-6 w-6" />
            Sustainability Metrics
          </h2>
          <p className="text-muted-foreground">Track and improve energy efficiency and environmental impact</p>
        </div>
        <Button onClick={handleCalculateScore}>
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Score
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Thermometer className="mr-2 h-5 w-5 text-primary" />
              Overall Sustainability Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="relative flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    className="text-muted"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="54"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-primary"
                    strokeWidth="12"
                    strokeDasharray={54 * 2 * Math.PI}
                    strokeDashoffset={54 * 2 * Math.PI * (1 - 68 / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="54"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <span className="absolute text-3xl font-bold">68</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-sm text-muted-foreground">Score out of 100</p>
              <p className="text-sm text-amber-500 font-medium mt-1">Good - Room for improvement</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <TrendingDown className="mr-2 h-5 w-5 text-primary" />
              Monthly Utility Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€520</div>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingDown className="h-4 w-4 mr-1" />
              -8% from last year
            </p>
            <div className="flex justify-between items-center text-sm mt-4">
              <div>
                <div className="text-muted-foreground">Current</div>
                <div className="font-medium">€520/month</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">Potential</div>
                <div className="font-medium text-green-600">€380/month</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Current</span>
                <span>Potential</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Zap className="mr-2 h-5 w-5 text-primary" />
              Carbon Footprint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.5 tons</div>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingDown className="h-4 w-4 mr-1" />
              -5% from last year
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Your property</span>
                <span className="text-muted-foreground">vs. Average</span>
              </div>
              <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '80%' }} />
                <div className="absolute top-0 h-full w-1 bg-red-500" style={{ left: '90%' }} />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-primary font-medium">12.5 tons</span>
                <span className="text-red-500">14.2 tons</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="energy">
            <Zap className="h-4 w-4 mr-2" />
            Energy
          </TabsTrigger>
          <TabsTrigger value="water">
            <Droplets className="h-4 w-4 mr-2" />
            Water
          </TabsTrigger>
          <TabsTrigger value="improvements">
            <TrendingDown className="h-4 w-4 mr-2" />
            Improvements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Assessment</CardTitle>
                <CardDescription>Current and potential sustainability metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Current Score"
                        dataKey="current"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Potential Score"
                        dataKey="potential"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.4}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Metrics</CardTitle>
                <CardDescription>Score breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sustainabilityScores.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-medium">{item.score}/100</span>
                      </div>
                      <div className="relative">
                        <Progress value={item.score} className="h-2" />
                        <div 
                          className="absolute top-0 h-2 w-1 bg-green-500" 
                          style={{ left: `${item.potential}%` }}
                        />
                      </div>
                      <div className="flex justify-end mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          Potential: {item.potential}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-3 bg-muted rounded-md text-sm">
                  <div className="flex items-start">
                    <Leaf className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Improvement Potential</span>
                      <p className="text-muted-foreground mt-1">
                        This property has significant improvement potential, particularly in Energy Efficiency and Renewable Energy categories.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="energy">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption</CardTitle>
              <CardDescription>Monthly energy usage in kWh</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={energyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      name="Current Usage"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="Industry Benchmark"
                      stroke="#ff7300"
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="potential"
                      name="Improvement Potential"
                      stroke="#82ca9d"
                      strokeDasharray="3 4 5 2"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Current Usage</div>
                  <div className="text-lg font-bold">1,550 kWh</div>
                  <div className="text-xs text-green-600 mt-1">-5% year-over-year</div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Monthly Cost</div>
                  <div className="text-lg font-bold">€365</div>
                  <div className="text-xs text-green-600 mt-1">-€18 from last month</div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Potential Savings</div>
                  <div className="text-lg font-bold text-green-600">€120/mo</div>
                  <div className="text-xs text-green-600 mt-1">€1,440 annually</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Energy Efficiency Recommendations</h3>
                <div className="space-y-3">
                  {recommendations
                    .filter(rec => rec.category === 'Energy')
                    .map((rec) => (
                      <div key={rec.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{rec.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Cost: €{rec.cost} | Annual Savings: €{rec.savings} | ROI: {rec.roi} years
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{rec.difficulty}</Badge>
                            <Badge variant="outline" className={rec.impact === 'High' ? 'border-green-500 text-green-500' : ''}>
                              {rec.impact} Impact
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleAddUpgrade(rec.id)}>
                          Add to Plan
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="water">
          <Card>
            <CardHeader>
              <CardTitle>Water Consumption</CardTitle>
              <CardDescription>Monthly water usage in cubic meters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={waterData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'm³', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      name="Current Usage"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="Industry Benchmark"
                      stroke="#ff7300"
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="potential"
                      name="Improvement Potential"
                      stroke="#82ca9d"
                      strokeDasharray="3 4 5 2"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Current Usage</div>
                  <div className="text-lg font-bold">37 m³</div>
                  <div className="text-xs text-green-600 mt-1">-8% year-over-year</div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Monthly Cost</div>
                  <div className="text-lg font-bold">€155</div>
                  <div className="text-xs text-green-600 mt-1">-€12 from last month</div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">Potential Savings</div>
                  <div className="text-lg font-bold text-green-600">€42/mo</div>
                  <div className="text-xs text-green-600 mt-1">€504 annually</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Water Conservation Recommendations</h3>
                <div className="space-y-3">
                  {recommendations
                    .filter(rec => rec.category === 'Water')
                    .map((rec) => (
                      <div key={rec.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{rec.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Cost: €{rec.cost} | Annual Savings: €{rec.savings} | ROI: {rec.roi} years
                          </div>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{rec.difficulty}</Badge>
                            <Badge variant="outline" className={rec.impact === 'High' ? 'border-green-500 text-green-500' : ''}>
                              {rec.impact} Impact
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleAddUpgrade(rec.id)}>
                          Add to Plan
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="improvements">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Improvement Plan</CardTitle>
              <CardDescription>Recommended upgrades to improve property efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex justify-between items-center p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      {rec.category === 'Energy' ? 
                        <Zap className="h-8 w-8 p-1.5 bg-amber-100 text-amber-600 rounded-md" /> :
                        <Droplets className="h-8 w-8 p-1.5 bg-blue-100 text-blue-600 rounded-md" />
                      }
                      <div>
                        <div className="font-medium">{rec.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {rec.category} | {rec.difficulty} implementation
                        </div>
                      </div>
                    </div>
                    <div className="mr-10 text-right hidden md:block">
                      <div className="text-sm font-medium">ROI Period</div>
                      <div className="text-green-600">{rec.roi} years</div>
                    </div>
                    <div className="text-right hidden lg:block">
                      <div className="text-sm font-medium">Implementation Cost</div>
                      <div>€{rec.cost}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Annual Savings</div>
                      <div className="text-green-600">€{rec.savings}</div>
                    </div>
                    <Button size="sm" onClick={() => handleAddUpgrade(rec.id)}>
                      Add to Plan
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 border border-dashed rounded-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-medium">Total Investment Plan</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Implementing all recommendations would cost <span className="font-medium">€{recommendations.reduce((sum, rec) => sum + rec.cost, 0).toLocaleString()}</span> with 
                      annual savings of <span className="font-medium text-green-600">€{recommendations.reduce((sum, rec) => sum + rec.savings, 0).toLocaleString()}</span>
                    </p>
                  </div>
                  <Button variant="outline">Generate Full Report</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full bg-muted rounded-md p-3 flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-sm">
                  <span className="font-medium">Sustainability Certification</span>
                  <p className="text-muted-foreground">
                    Implementing these improvements could qualify your property for Green Building certification, potentially increasing its market value by 3-7%.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SustainabilityMetrics;
