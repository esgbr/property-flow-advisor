
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, Calculator, DollarSign, LineChart, TrendingUp, 
  Users, Map, BarChart3, Activity, Banknote
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const RealEstateInvestorTools: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('valuation');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast.success(`${value.charAt(0).toUpperCase() + value.slice(1)} tool loaded`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          {t('investorTools')}
        </h1>
        <p className="text-muted-foreground">{t('advancedRealEstateInvestmentTools')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="mb-6 overflow-x-auto">
          <TabsList className={`${isMobile ? 'flex w-max min-w-full space-x-1' : 'grid grid-cols-4 md:grid-cols-6 gap-1'}`}>
            <TabsTrigger value="valuation" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Building className="h-4 w-4 mr-2" />
              {!isMobile ? "Property Valuation" : "Valuation"}
            </TabsTrigger>
            <TabsTrigger value="taxplanning" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <DollarSign className="h-4 w-4 mr-2" />
              {!isMobile ? "Tax Planning" : "Tax"}
            </TabsTrigger>
            <TabsTrigger value="partners" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Users className="h-4 w-4 mr-2" />
              {!isMobile ? "Investment Partners" : "Partners"}
            </TabsTrigger>
            <TabsTrigger value="yield" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Calculator className="h-4 w-4 mr-2" />
              {!isMobile ? "Rental Yield Optimizer" : "Yield"}
            </TabsTrigger>
            <TabsTrigger value="acquisition" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <LineChart className="h-4 w-4 mr-2" />
              {!isMobile ? "Acquisition Pipeline" : "Acquisition"}
            </TabsTrigger>
            <TabsTrigger value="economic" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Activity className="h-4 w-4 mr-2" />
              {!isMobile ? "Economic Impact" : "Economic"}
            </TabsTrigger>
            <TabsTrigger value="exchange" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Banknote className="h-4 w-4 mr-2" />
              {!isMobile ? "1031 Exchange" : "1031"}
            </TabsTrigger>
            <TabsTrigger value="neighborhood" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Map className="h-4 w-4 mr-2" />
              {!isMobile ? "Neighborhood Analysis" : "Neighborhood"}
            </TabsTrigger>
          </TabsList>
        </div>

        {isMobile && (
          <div className="flex overflow-x-auto pb-2 mb-4">
            <div className="text-sm font-medium">
              {activeTab === 'valuation' && "Real-Time Property Valuation"}
              {activeTab === 'taxplanning' && "Tax Planning & Optimization"}
              {activeTab === 'partners' && "Investment Partner Matching"}
              {activeTab === 'yield' && "Rental Yield Optimizer"}
              {activeTab === 'acquisition' && "Property Acquisition Pipeline"}
              {activeTab === 'economic' && "Economic Impact Analysis"}
              {activeTab === 'exchange' && "1031 Exchange Tracker"}
              {activeTab === 'neighborhood' && "Neighborhood Trend Analysis"}
            </div>
          </div>
        )}

        <TabsContent value="valuation" className="mt-6">
          <PropertyValuation />
        </TabsContent>

        <TabsContent value="taxplanning" className="mt-6">
          <TaxPlanningOptimization />
        </TabsContent>

        <TabsContent value="partners" className="mt-6">
          <InvestmentPartnerMatching />
        </TabsContent>

        <TabsContent value="yield" className="mt-6">
          <RentalYieldOptimizer />
        </TabsContent>
        
        <TabsContent value="acquisition" className="mt-6">
          <AcquisitionPipeline />
        </TabsContent>
        
        <TabsContent value="economic" className="mt-6">
          <EconomicImpactAnalysis />
        </TabsContent>
        
        <TabsContent value="exchange" className="mt-6">
          <ExchangeTracker />
        </TabsContent>
        
        <TabsContent value="neighborhood" className="mt-6">
          <NeighborhoodAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Property Valuation Tool Component
const PropertyValuation: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Valuation</CardTitle>
            <CardDescription>AI-powered valuation estimates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Current Portfolio Valuation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded p-4">
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-2xl font-bold">$3,250,000</p>
                    <p className="text-xs text-green-500">+5.2% this quarter</p>
                  </div>
                  <div className="border rounded p-4">
                    <p className="text-sm text-muted-foreground">Projected (12mo)</p>
                    <p className="text-2xl font-bold">$3,422,500</p>
                    <p className="text-xs text-green-500">+5.3% growth</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Recent Value Changes</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>123 Main St</span>
                    <span className="text-green-500">+2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>456 Oak Ave</span>
                    <span className="text-green-500">+3.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>789 Pine Rd</span>
                    <span className="text-red-500">-0.8%</span>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">Run Full Valuation Analysis</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Market Comparison</CardTitle>
            <CardDescription>How your properties compare to the market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Your Portfolio</span>
                  <span className="text-sm font-medium">+5.2%</span>
                </div>
                <Progress value={52} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Local Market</span>
                  <span className="text-sm font-medium">+3.8%</span>
                </div>
                <Progress value={38} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">National Average</span>
                  <span className="text-sm font-medium">+2.5%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              
              <Alert className="bg-primary/10 border-primary/20 mt-4">
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Outperforming the Market</AlertTitle>
                <AlertDescription>
                  Your portfolio is outperforming the local market by 1.4% and the national average by 2.7%.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Tax Planning & Optimization Tool Component
const TaxPlanningOptimization: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tax Planning</CardTitle>
            <CardDescription>Optimize your tax strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Potential Deductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Mortgage Interest</span>
                    <span className="font-medium">$18,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Property Taxes</span>
                    <span className="font-medium">$12,300</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Depreciation</span>
                    <span className="font-medium">$24,750</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Repairs & Maintenance</span>
                    <span className="font-medium">$7,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Insurance Premiums</span>
                    <span className="font-medium">$5,400</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Total Potential Deductions</span>
                  <span>$68,150</span>
                </div>
              </div>
              
              <Alert className="bg-primary/10 border-primary/20">
                <Calculator className="h-4 w-4" />
                <AlertTitle>Tax Optimization Opportunity</AlertTitle>
                <AlertDescription>
                  You may be missing $12,500 in potential deductions based on your current records.
                </AlertDescription>
              </Alert>
              
              <Button className="w-full">Run Tax Optimization Analysis</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Investment Scenarios</CardTitle>
            <CardDescription>Tax implications of potential investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">Scenario: New Property Purchase</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Purchase Price</span>
                    <span>$450,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First Year Deductions</span>
                    <span>$23,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Savings (30% bracket)</span>
                    <span className="text-green-500">$7,050</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">Scenario: Property Improvement</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Improvement Cost</span>
                    <span>$75,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Depreciable Amount</span>
                    <span>$75,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Savings Over 5 Years</span>
                    <span className="text-green-500">$11,250</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">Create Custom Scenario</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Investment Partner Matching Tool Component
const InvestmentPartnerMatching: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Partner Matching</CardTitle>
            <CardDescription>Find compatible investment partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">Your Investment Criteria</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Property Types</p>
                    <p className="text-sm">Residential, Multi-family</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Investment Range</p>
                    <p className="text-sm">$100K - $500K</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Preferred Locations</p>
                    <p className="text-sm">Southeast, Midwest</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Investment Timeline</p>
                    <p className="text-sm">5-10 years</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">Update Investment Criteria</Button>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Potential Matches (12)</h3>
                <div className="space-y-3">
                  <div className="border rounded p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Alex Morgan</p>
                        <p className="text-sm text-muted-foreground">Multi-family, Southeast</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                  <div className="border rounded p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Jordan Lee</p>
                        <p className="text-sm text-muted-foreground">Residential, Midwest</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                  <div className="border rounded p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Taylor Chen</p>
                        <p className="text-sm text-muted-foreground">Multi-family, Nationwide</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Partnerships</CardTitle>
            <CardDescription>Manage your investment partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-medium">Main Street Apartments</h3>
                <p className="text-sm text-muted-foreground mb-3">With: Morgan Investments Group</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Investment</span>
                    <span>$620,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Your Share</span>
                    <span>35% ($217,000)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Annual Return</span>
                    <span className="text-green-500">8.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Partnership Status</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
              
              <div className="border rounded p-4">
                <h3 className="font-medium">Oakwood Development</h3>
                <p className="text-sm text-muted-foreground mb-3">With: RiverCity Investments</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Investment</span>
                    <span>$980,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Your Share</span>
                    <span>25% ($245,000)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Annual Return</span>
                    <span className="text-green-500">7.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Partnership Status</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">In Development</span>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
              
              <Button className="w-full">Explore New Partnership Opportunities</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Rental Yield Optimizer Tool Component
const RentalYieldOptimizer: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rental Yield Analysis</CardTitle>
            <CardDescription>Optimize your rental income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Current Rental Performance</h3>
                <div className="space-y-3">
                  <div className="border rounded p-3">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">123 Main Street</p>
                      <span className="text-amber-500">$1,450/mo</span>
                    </div>
                    <div className="flex items-center">
                      <Progress value={73} className="h-2 flex-1" />
                      <span className="text-xs ml-2">73% of market</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Market rate potential: $1,950/mo</p>
                  </div>
                  
                  <div className="border rounded p-3">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">456 Oak Avenue</p>
                      <span className="text-green-500">$2,200/mo</span>
                    </div>
                    <div className="flex items-center">
                      <Progress value={95} className="h-2 flex-1" />
                      <span className="text-xs ml-2">95% of market</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Market rate potential: $2,300/mo</p>
                  </div>
                  
                  <div className="border rounded p-3">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">789 Pine Road</p>
                      <span className="text-red-500">$1,100/mo</span>
                    </div>
                    <div className="flex items-center">
                      <Progress value={62} className="h-2 flex-1" />
                      <span className="text-xs ml-2">62% of market</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Market rate potential: $1,750/mo</p>
                  </div>
                </div>
              </div>
              
              <Alert className="bg-primary/10 border-primary/20">
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Income Optimization Opportunity</AlertTitle>
                <AlertDescription>
                  Potential annual income increase of $17,400 by adjusting to market rates.
                </AlertDescription>
              </Alert>
              
              <Button className="w-full">Generate Rental Optimization Plan</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Improvement ROI Analysis</CardTitle>
            <CardDescription>Strategic improvements for maximum returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">123 Main Street</h3>
                <div className="space-y-3">
                  <div className="border rounded p-3">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">Kitchen Renovation</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost: $15,000</span>
                      <span>Rent Increase: $300/mo</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>ROI Period:</span>
                      <span className="text-green-500">50 months</span>
                    </div>
                  </div>
                  
                  <div className="border rounded p-3">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">Bathroom Update</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost: $8,000</span>
                      <span>Rent Increase: $200/mo</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>ROI Period:</span>
                      <span className="text-green-500">40 months</span>
                    </div>
                  </div>
                  
                  <div className="border rounded p-3">
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">Outdoor Landscaping</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost: $5,000</span>
                      <span>Rent Increase: $75/mo</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>ROI Period:</span>
                      <span className="text-amber-500">67 months</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline">Add Property</Button>
                <Button variant="outline">Add Improvement</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Property Acquisition Pipeline Tool Component
const AcquisitionPipeline: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acquisition Pipeline</CardTitle>
            <CardDescription>Track potential property acquisitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4 bg-green-50">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Highland Apartments</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Due Diligence</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Asking Price</span>
                    <span>$1,250,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Units</span>
                    <span>12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Cap Rate</span>
                    <span>6.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Cap Rate</span>
                    <span className="text-green-600">7.8%</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between">
                  <span className="text-sm">Due Diligence Deadline:</span>
                  <span className="text-sm font-medium">May 15, 2023</span>
                </div>
                <div className="flex justify-end mt-3">
                  <Button size="sm">View Details</Button>
                </div>
              </div>
              
              <div className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Riverside Duplexes</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Initial Review</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Asking Price</span>
                    <span>$875,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Units</span>
                    <span>6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Cap Rate</span>
                    <span>5.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Cap Rate</span>
                    <span className="text-green-600">7.2%</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between">
                  <span className="text-sm">Initial Offer Deadline:</span>
                  <span className="text-sm font-medium">May 22, 2023</span>
                </div>
                <div className="flex justify-end mt-3">
                  <Button size="sm">View Details</Button>
                </div>
              </div>
              
              <div className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Oak Street Commercial</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Negotiation</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Asking Price</span>
                    <span>$2,100,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Square Footage</span>
                    <span>12,500 sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Cap Rate</span>
                    <span>6.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Cap Rate</span>
                    <span className="text-green-600">8.0%</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between">
                  <span className="text-sm">Counter Offer Due:</span>
                  <span className="text-sm font-medium">May 10, 2023</span>
                </div>
                <div className="flex justify-end mt-3">
                  <Button size="sm">View Details</Button>
                </div>
              </div>
              
              <Button className="w-full">Add New Property</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Acquisition Checklist</CardTitle>
            <CardDescription>Track due diligence and closing tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Highland Apartments</h3>
                  <div className="flex items-center">
                    <Progress value={65} className="h-2 w-24" />
                    <span className="text-xs ml-2">65% Complete</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" checked className="mr-2" />
                    <span className="text-sm line-through">Initial property inspection</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked className="mr-2" />
                    <span className="text-sm line-through">Financial records review</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked className="mr-2" />
                    <span className="text-sm line-through">Market analysis completed</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Environmental assessment</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Property title search</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Financing approval</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Final inspection</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Closing document preparation</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium mb-2">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Offer Accepted</span>
                    <span>Apr 12, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Due Diligence Deadline</span>
                    <span>May 15, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Financing Contingency</span>
                    <span>May 30, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projected Closing</span>
                    <span>Jun 15, 2023</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline">Add Task</Button>
                <Button variant="outline">Edit Timeline</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Economic Impact Analysis Tool Component
const EconomicImpactAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Economic Indicators</CardTitle>
            <CardDescription>Monitor key economic factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded p-4">
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">5.25%</p>
                    <p className="text-xs text-amber-500 pb-1">+0.25% (30 days)</p>
                  </div>
                  <p className="text-xs mt-1">Forecast: Rising trend</p>
                </div>
                
                <div className="border rounded p-4">
                  <p className="text-sm text-muted-foreground">Unemployment</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">3.8%</p>
                    <p className="text-xs text-green-500 pb-1">-0.2% (30 days)</p>
                  </div>
                  <p className="text-xs mt-1">Forecast: Stable</p>
                </div>
                
                <div className="border rounded p-4">
                  <p className="text-sm text-muted-foreground">Inflation</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">3.2%</p>
                    <p className="text-xs text-green-500 pb-1">-0.3% (30 days)</p>
                  </div>
                  <p className="text-xs mt-1">Forecast: Decreasing</p>
                </div>
                
                <div className="border rounded p-4">
                  <p className="text-sm text-muted-foreground">GDP Growth</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">2.1%</p>
                    <p className="text-xs text-green-500 pb-1">+0.3% (quarter)</p>
                  </div>
                  <p className="text-xs mt-1">Forecast: Moderate growth</p>
                </div>
              </div>
              
              <Alert className="bg-primary/10 border-primary/20">
                <Activity className="h-4 w-4" />
                <AlertTitle>Economic Impact Alert</AlertTitle>
                <AlertDescription>
                  Rising interest rates may impact financing costs for new acquisitions.
                </AlertDescription>
              </Alert>
              
              <Button className="w-full">Run Portfolio Stress Test</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Market Correlation Analysis</CardTitle>
            <CardDescription>How economic factors affect your investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">Market Sensitivity</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Interest Rate Impact</span>
                      <span className="text-amber-500">Medium</span>
                    </div>
                    <Progress value={65} className="h-2 mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Inflation Impact</span>
                      <span className="text-green-500">Low</span>
                    </div>
                    <Progress value={30} className="h-2 mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Unemployment Impact</span>
                      <span className="text-amber-500">Medium</span>
                    </div>
                    <Progress value={60} className="h-2 mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>GDP Growth Impact</span>
                      <span className="text-green-500">Low</span>
                    </div>
                    <Progress value={35} className="h-2 mt-1" />
                  </div>
                </div>
              </div>
              
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">Property Type Correlation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Residential Multi-family</span>
                    <span className="text-green-500">+0.2 correlation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Commercial Retail</span>
                    <span className="text-red-500">-0.4 correlation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Commercial Office</span>
                    <span className="text-red-500">-0.5 correlation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Industrial</span>
                    <span className="text-green-500">+0.3 correlation</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Investment Recommendation</h3>
                <p className="text-sm">Based on current economic trends, consider increasing allocation to residential multi-family and industrial properties while reducing exposure to commercial office properties.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 1031 Exchange Tracker Tool Component
const ExchangeTracker: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1031 Exchange Tracker</CardTitle>
            <CardDescription>Track and manage your 1031 exchange process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-medium">Active Exchange: Oak Street Property</h3>
                
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Relinquished Property</span>
                    <span>123 Oak Street</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sale Price</span>
                    <span>$850,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sale Date</span>
                    <span>March 15, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Identification Deadline</span>
                    <span className="font-medium">April 29, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Exchange Completion Deadline</span>
                    <span className="font-medium">August 12, 2023</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Timeline</h4>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary">
                          60% Complete
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary">
                          91 days remaining
                        </span>
                      </div>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </div>
              
              <Alert className="bg-primary/10 border-primary/20">
                <AlertTitle>Important Deadline</AlertTitle>
                <AlertDescription>
                  Property identification period ends in 14 days. Ensure you have identified potential replacement properties.
                </AlertDescription>
              </Alert>
              
              <Button className="w-full">View Exchange Details</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Replacement Properties</CardTitle>
            <CardDescription>Identified potential replacement properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Maple Avenue Apartments</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Primary Target</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Asking Price</span>
                    <span>$925,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Units</span>
                    <span>8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cap Rate</span>
                    <span>6.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="text-amber-500">Under Contract</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Willow Street Complex</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Backup</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Asking Price</span>
                    <span>$975,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Units</span>
                    <span>10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cap Rate</span>
                    <span>6.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>Available</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Cedar Court Townhomes</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Backup</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Asking Price</span>
                    <span>$890,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Units</span>
                    <span>6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cap Rate</span>
                    <span>6.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>Available</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline">Add Property</Button>
                <Button>Calculate Tax Savings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Neighborhood Trend Analysis Tool Component
const NeighborhoodAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Neighborhood Trends</CardTitle>
            <CardDescription>Analyze emerging areas for investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Riverside District</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">High Potential</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Price Appreciation (YoY)</span>
                      <span className="text-green-500">+8.2%</span>
                    </div>
                    <Progress value={82} className="h-2 mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Rental Growth (YoY)</span>
                      <span className="text-green-500">+6.5%</span>
                    </div>
                    <Progress value={65} className="h-2 mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Development Activity</span>
                      <span className="text-green-500">High</span>
                    </div>
                    <Progress value={85} className="h-2 mt-1" />
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <h4 className="font-medium">Key Developments:</h4>
                  <ul className="list-disc pl-4 mt-1">
                    <li>New tech campus opening Q3 2023</li>
                    <li>Transit expansion planned for 2024</li>
                    <li>Mixed-use development under construction</li>
                  </ul>
                </div>
                
                <Button className="w-full mt-3">View Properties</Button>
              </div>
              
              <div className="border rounded p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Eastside Heights</h3>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Medium Potential</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Price Appreciation (YoY)</span>
                      <span className="text-amber-500">+4.8%</span>
                    </div>
                    <Progress value={48} className="h-2 mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Rental Growth (YoY)</span>
                      <span className="text-green-500">+5.2%</span>
                    </div>
                    <Progress value={52} className="h-2 mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Development Activity</span>
                      <span className="text-amber-500">Medium</span>
                    </div>
                    <Progress value={50} className="h-2 mt-1" />
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <h4 className="font-medium">Key Developments:</h4>
                  <ul className="list-disc pl-4 mt-1">
                    <li>Retail corridor revitalization</li>
                    <li>New community center opened 2022</li>
                    <li>School district improvements planned</li>
                  </ul>
                </div>
                
                <Button className="w-full mt-3">View Properties</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Demographic Shifts</CardTitle>
            <CardDescription>Population and income trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">Riverside District</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Population Growth (5yr)</span>
                      <span>+12.4%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Median Income</span>
                      <span>$82,500 (+8.3%)</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Millennial Population</span>
                      <span>38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>College Educated</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">Infrastructure & Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded p-2 text-center">
                    <p className="text-sm font-medium">Walk Score</p>
                    <p className="text-xl font-bold">82</p>
                    <p className="text-xs text-green-500">Very Walkable</p>
                  </div>
                  
                  <div className="border rounded p-2 text-center">
                    <p className="text-sm font-medium">Transit Score</p>
                    <p className="text-xl font-bold">75</p>
                    <p className="text-xs text-green-500">Excellent Transit</p>
                  </div>
                  
                  <div className="border rounded p-2 text-center">
                    <p className="text-sm font-medium">Bike Score</p>
                    <p className="text-xl font-bold">68</p>
                    <p className="text-xs text-amber-500">Bikeable</p>
                  </div>
                  
                  <div className="border rounded p-2 text-center">
                    <p className="text-sm font-medium">Amenity Score</p>
                    <p className="text-xl font-bold">85</p>
                    <p className="text-xs text-green-500">Abundant</p>
                  </div>
                </div>
              </div>
              
              <Alert className="bg-primary/10 border-primary/20">
                <Map className="h-4 w-4" />
                <AlertTitle>Investment Insight</AlertTitle>
                <AlertDescription>
                  Riverside District shows strong indicators for long-term rental demand growth and property appreciation.
                </AlertDescription>
              </Alert>
              
              <Button className="w-full">Generate Neighborhood Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealEstateInvestorTools;
