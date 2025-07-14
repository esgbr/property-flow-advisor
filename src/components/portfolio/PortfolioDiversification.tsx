
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, BarChart3, MapPin, LineChart } from 'lucide-react';
import { 
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  Legend 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Sample portfolio data
const portfolioByPropertyType = [
  { name: 'Residential', value: 45, color: '#0088FE' },
  { name: 'Commercial', value: 25, color: '#00C49F' },
  { name: 'Industrial', value: 15, color: '#FFBB28' },
  { name: 'Land', value: 10, color: '#FF8042' },
  { name: 'Other', value: 5, color: '#8884d8' },
];

const portfolioByLocation = [
  { name: 'Downtown', value: 30, color: '#0088FE' },
  { name: 'Suburbs', value: 25, color: '#00C49F' },
  { name: 'Industrial Zone', value: 20, color: '#FFBB28' },
  { name: 'Waterfront', value: 15, color: '#FF8042' },
  { name: 'Rural', value: 10, color: '#8884d8' },
];

const riskAssessmentData = [
  { property: 'Downtown Apartment', risk: 3.2, return: 5.8, size: 150000 },
  { property: 'Suburban House', risk: 2.5, return: 4.5, size: 280000 },
  { property: 'Commercial Office', risk: 4.8, return: 7.2, size: 450000 },
  { property: 'Industrial Warehouse', risk: 4.2, return: 6.5, size: 320000 },
  { property: 'Vacation Rental', risk: 5.5, return: 8.2, size: 180000 },
];

const radarData = [
  { category: 'Diversification', score: 75, fullMark: 100 },
  { category: 'Risk Level', score: 65, fullMark: 100 },
  { category: 'Return Potential', score: 80, fullMark: 100 },
  { category: 'Liquidity', score: 60, fullMark: 100 },
  { category: 'Market Exposure', score: 70, fullMark: 100 },
  { category: 'Growth Potential', score: 85, fullMark: 100 },
];

const PortfolioDiversification: React.FC = () => {
  const { toast } = useToast();

  const handleRebalanceClick = () => {
    toast({
      title: "Portfolio optimization in progress",
      description: "Analyzing your portfolio to suggest optimal diversification adjustments.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Diversification Analysis</h2>
          <p className="text-muted-foreground">Optimize your investment allocation across property types and regions</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Asset Allocation by Property Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={portfolioByPropertyType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolioByPropertyType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {portfolioByPropertyType.map((item) => (
                <Badge key={item.name} variant="default" style={{backgroundColor: item.color, color: 'white'}}>
                  {item.name}: {item.value}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Geographic Diversification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={portfolioByLocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolioByLocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {portfolioByLocation.map((item) => (
                <Badge key={item.name} variant="default" style={{backgroundColor: item.color, color: 'white'}}>
                  {item.name}: {item.value}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Risk vs. Return Analysis
          </CardTitle>
          <CardDescription>Property investment risk-return profile (bubble size represents investment value)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={400}
                data={riskAssessmentData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="property" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Risk (%)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Return (%)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="risk" name="Risk %" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="return" name="Return %" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChart className="mr-2 h-5 w-5" />
            Portfolio Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Portfolio Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Benchmark" dataKey="fullMark" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Diversification Score</div>
              <div className="text-2xl font-bold">72/100</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Risk Assessment</div>
              <div className="text-2xl font-bold text-amber-500">Medium</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Optimization Potential</div>
              <div className="text-2xl font-bold text-green-500">High</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 border rounded-md flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-medium">Portfolio Rebalancing Recommendation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Consider reducing exposure to Downtown properties (-5%) and increasing allocation to Industrial Zone (+3%) and Rural areas (+2%) for better diversification.
              </p>
            </div>
            <button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              onClick={handleRebalanceClick}
            >
              Optimize Portfolio
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioDiversification;
