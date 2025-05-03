
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calculator, ChartBar, FileText, Search, TrendingUp, Users, PieChart, 
  Shield, Smartphone, Leaf, Home, Building, Map, LineChart, Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import InvestmentDashboard from '@/components/performance/InvestmentDashboard';
import PropertyRecommendations from '@/components/recommendations/PropertyRecommendations';
import RenovationCalculator from '@/components/renovation/RenovationCalculator';
import DocumentManager from '@/components/documents/DocumentManager';
import MarketAnalysis from '@/components/market/MarketAnalysis';
import PortfolioDiversification from '@/components/portfolio/PortfolioDiversification';
import TenantManagement from '@/components/tenant/TenantManagement';
import CashFlowForecasting from '@/components/cashflow/CashFlowForecasting';
import SustainabilityMetrics from '@/components/sustainability/SustainabilityMetrics';
import MobileIntegration from '@/components/mobile/MobileIntegration';
import InsuranceComparison from '@/components/insurance/InsuranceComparison';
import SmartHomeIntegration from '@/components/smarthome/SmartHomeIntegration';

const FeaturesDashboard: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('performance');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Show a toast message when switching to a new feature tab
    const toastMessages: Record<string, string> = {
      'performance': 'Investment Performance Dashboard loaded',
      'recommendations': 'AI Property Recommendations loaded',
      'renovations': 'Renovation ROI Calculator loaded',
      'documents': 'Document Management System loaded',
      'market': 'Market Analysis Tool loaded',
      'portfolio': 'Portfolio Diversification Analysis loaded',
      'tenant': 'Tenant Management System loaded',
      'cashflow': 'Cash Flow Forecasting loaded',
      'sustainability': 'Sustainability Metrics loaded',
      'mobile': 'Mobile App Integration loaded',
      'insurance': 'Property Insurance Comparison loaded',
      'smarthome': 'Smart Home Integration loaded',
      'international': 'International Markets loaded',
      'taxplanning': 'Tax Planning loaded',
      'education': 'Education Resources loaded',
      'financing': 'Financing Options loaded'
    };
    
    if (toastMessages[value]) {
      toast.success(toastMessages[value]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          {t('featuresDashboard')}
        </h1>
        <p className="text-muted-foreground">{t('exploreAdvancedFeatures')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="mb-6 overflow-x-auto">
          <TabsList className={`${isMobile ? 'flex w-max min-w-full space-x-1' : 'grid grid-cols-4 md:grid-cols-6 gap-1'}`}>
            <TabsTrigger value="performance" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <TrendingUp className="h-4 w-4 mr-2" />
              {!isMobile ? "Investment Performance" : "Performance"}
            </TabsTrigger>
            <TabsTrigger value="recommendations" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Search className="h-4 w-4 mr-2" />
              {!isMobile ? "Property Recommendations" : "Recommendations"}
            </TabsTrigger>
            <TabsTrigger value="renovations" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Calculator className="h-4 w-4 mr-2" />
              {!isMobile ? "Renovation Calculator" : "Renovations"}
            </TabsTrigger>
            <TabsTrigger value="documents" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <FileText className="h-4 w-4 mr-2" />
              {!isMobile ? "Document Management" : "Documents"}
            </TabsTrigger>
            <TabsTrigger value="market" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <ChartBar className="h-4 w-4 mr-2" />
              {!isMobile ? "Market Analysis" : "Market"}
            </TabsTrigger>
            <TabsTrigger value="portfolio" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <PieChart className="h-4 w-4 mr-2" />
              {!isMobile ? "Portfolio Diversification" : "Portfolio"}
            </TabsTrigger>
            <TabsTrigger value="tenant" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Users className="h-4 w-4 mr-2" />
              {!isMobile ? "Tenant Management" : "Tenants"}
            </TabsTrigger>
            <TabsTrigger value="cashflow" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <TrendingUp className="h-4 w-4 mr-2" />
              {!isMobile ? "Cash Flow Forecasting" : "Cash Flow"}
            </TabsTrigger>
            <TabsTrigger value="sustainability" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Leaf className="h-4 w-4 mr-2" />
              {!isMobile ? "Sustainability Metrics" : "Sustainability"}
            </TabsTrigger>
            <TabsTrigger value="mobile" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Smartphone className="h-4 w-4 mr-2" />
              {!isMobile ? "Mobile Integration" : "Mobile"}
            </TabsTrigger>
            <TabsTrigger value="insurance" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Shield className="h-4 w-4 mr-2" />
              {!isMobile ? "Insurance Comparison" : "Insurance"}
            </TabsTrigger>
            <TabsTrigger value="smarthome" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Home className="h-4 w-4 mr-2" />
              {!isMobile ? "Smart Home Integration" : "Smart Home"}
            </TabsTrigger>
            <TabsTrigger value="international" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Globe className="h-4 w-4 mr-2" />
              {!isMobile ? "International Markets" : "International"}
            </TabsTrigger>
            <TabsTrigger value="taxplanning" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Calculator className="h-4 w-4 mr-2" />
              {!isMobile ? "Tax Planning" : "Tax"}
            </TabsTrigger>
            <TabsTrigger value="education" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Book className="h-4 w-4 mr-2" />
              {!isMobile ? "Education Resources" : "Education"}
            </TabsTrigger>
            <TabsTrigger value="financing" className={isMobile ? "text-xs px-2 py-2" : ""}>
              <Building className="h-4 w-4 mr-2" />
              {!isMobile ? "Financing Options" : "Financing"}
            </TabsTrigger>
          </TabsList>
        </div>

        {isMobile && (
          <div className="flex overflow-x-auto pb-2 mb-4">
            <div className="text-sm font-medium">
              {activeTab === 'performance' && "Investment Performance Dashboard"}
              {activeTab === 'recommendations' && "AI Property Recommendations"}
              {activeTab === 'renovations' && "Renovation ROI Calculator"}
              {activeTab === 'documents' && "Document Management System"}
              {activeTab === 'market' && "Market Analysis Tool"}
              {activeTab === 'portfolio' && "Portfolio Diversification Analysis"}
              {activeTab === 'tenant' && "Tenant Management System"}
              {activeTab === 'cashflow' && "Cash Flow Forecasting"}
              {activeTab === 'sustainability' && "Sustainability Metrics"}
              {activeTab === 'mobile' && "Mobile App Integration"}
              {activeTab === 'insurance' && "Property Insurance Comparison"}
              {activeTab === 'smarthome' && "Smart Home Integration"}
              {activeTab === 'international' && "International Markets"}
              {activeTab === 'taxplanning' && "Tax Planning"}
              {activeTab === 'education' && "Education Resources"}
              {activeTab === 'financing' && "Financing Options"}
            </div>
          </div>
        )}

        <TabsContent value="performance" className="mt-6">
          <InvestmentDashboard />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <PropertyRecommendations />
        </TabsContent>

        <TabsContent value="renovations" className="mt-6">
          <RenovationCalculator />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentManager />
        </TabsContent>
        
        <TabsContent value="market" className="mt-6">
          <MarketAnalysis />
        </TabsContent>
        
        <TabsContent value="portfolio" className="mt-6">
          <PortfolioDiversification />
        </TabsContent>
        
        <TabsContent value="tenant" className="mt-6">
          <TenantManagement />
        </TabsContent>
        
        <TabsContent value="cashflow" className="mt-6">
          <CashFlowForecasting />
        </TabsContent>
        
        <TabsContent value="sustainability" className="mt-6">
          <SustainabilityMetrics />
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-6">
          <MobileIntegration />
        </TabsContent>
        
        <TabsContent value="insurance" className="mt-6">
          <InsuranceComparison />
        </TabsContent>
        
        <TabsContent value="smarthome" className="mt-6">
          <SmartHomeIntegration />
        </TabsContent>

        <TabsContent value="international" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>International Real Estate Markets</CardTitle>
                <CardDescription>Explore investment opportunities in different countries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {["USA", "UK", "Spain", "France", "Italy", "Portugal"].map((country) => (
                    <Card key={country} className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{country}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Explore real estate market trends, tax implications, and investment opportunities in {country}.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info(`${country} market information coming soon`)}
                        >
                          View market details →
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="taxplanning" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tax Planning & Optimization</CardTitle>
                <CardDescription>Maximize your investment returns through tax strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Depreciation Calculator</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Calculate potential tax savings through depreciation on your property investments.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("Depreciation calculator coming soon")}
                        >
                          Use calculator →
                        </button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">1031 Exchange Guide</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Learn how to defer capital gains taxes when selling investment properties.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("1031 Exchange guide coming soon")}
                        >
                          View guide →
                        </button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Tax Deduction Finder</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Identify all possible tax deductions for your real estate investments.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("Tax deduction finder coming soon")}
                        >
                          Find deductions →
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Educational Resources</CardTitle>
                <CardDescription>Enhance your real estate investment knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Video Courses</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Learn from expert investors through our comprehensive video courses.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("Video courses coming soon")}
                        >
                          Browse courses →
                        </button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Investment Guides</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Step-by-step guides for different real estate investment strategies.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("Investment guides coming soon")}
                        >
                          View guides →
                        </button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Expert Webinars</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Regular webinars with industry experts discussing market trends and strategies.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("Expert webinars coming soon")}
                        >
                          View schedule →
                        </button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Community Forum</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Connect with other investors to share insights and ask questions.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("Community forum coming soon")}
                        >
                          Join community →
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financing" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financing Options</CardTitle>
                <CardDescription>Explore different ways to finance your real estate investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Mortgage Comparison</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Compare mortgage offers from different lenders to find the best rates.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("Mortgage comparison tool coming soon")}
                        >
                          Compare rates →
                        </button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Creative Financing</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Explore alternative financing methods beyond traditional mortgages.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("Creative financing guides coming soon")}
                        >
                          Explore options →
                        </button>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Refinancing Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Calculate potential savings from refinancing your existing properties.
                        </p>
                        <button 
                          className="mt-2 text-sm text-primary"
                          onClick={() => toast.info("Refinancing calculator coming soon")}
                        >
                          Analyze savings →
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeaturesDashboard;
