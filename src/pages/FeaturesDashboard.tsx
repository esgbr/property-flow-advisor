
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, ChartBar, FileText, Search, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import InvestmentDashboard from '@/components/performance/InvestmentDashboard';
import PropertyRecommendations from '@/components/recommendations/PropertyRecommendations';
import RenovationCalculator from '@/components/renovation/RenovationCalculator';
import DocumentManager from '@/components/documents/DocumentManager';

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
      'documents': 'Document Management System loaded'
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
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-1 mb-2' : 'md:inline-grid grid-cols-4'}`}>
          <TabsTrigger value="performance" className={isMobile ? "text-xs px-1 py-2" : ""}>
            <TrendingUp className="h-4 w-4 mr-2" />
            {!isMobile ? "Investment Performance" : "Performance"}
          </TabsTrigger>
          <TabsTrigger value="recommendations" className={isMobile ? "text-xs px-1 py-2" : ""}>
            <Search className="h-4 w-4 mr-2" />
            {!isMobile ? "Property Recommendations" : "Recommendations"}
          </TabsTrigger>
          <TabsTrigger value="renovations" className={isMobile ? "text-xs px-1 py-2" : ""}>
            <Calculator className="h-4 w-4 mr-2" />
            {!isMobile ? "Renovation Calculator" : "Renovations"}
          </TabsTrigger>
          <TabsTrigger value="documents" className={isMobile ? "text-xs px-1 py-2" : ""}>
            <FileText className="h-4 w-4 mr-2" />
            {!isMobile ? "Document Management" : "Documents"}
          </TabsTrigger>
        </TabsList>

        {isMobile && (
          <div className="flex overflow-x-auto pb-2 mb-4">
            <div className="text-sm font-medium">
              {activeTab === 'performance' && "Investment Performance Dashboard"}
              {activeTab === 'recommendations' && "AI Property Recommendations"}
              {activeTab === 'renovations' && "Renovation ROI Calculator"}
              {activeTab === 'documents' && "Document Management System"}
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
      </Tabs>
    </div>
  );
};

export default FeaturesDashboard;
