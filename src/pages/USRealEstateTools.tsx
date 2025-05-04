
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import USRealEstateNavigation from '@/components/navigation/USRealEstateNavigation';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import {
  Building,
  Calculator,
  Search,
  Star,
  Clock,
  Filter,
  Info
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const USRealEstateTools: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences } = useUserPreferences();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check current tab from URL
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || '1031-exchange';
  
  // Check if user has selected USA as their investment market
  const showUSTools = preferences.investmentMarket === 'usa' || preferences.investmentMarket === 'canada';
  
  if (!showUSTools) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Market-specific tools</AlertTitle>
          <AlertDescription>
            These tools are specific to the US real estate market. You can update your investment market preferences in Settings.
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-12">
          <Building className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="mt-4 text-2xl font-bold">{t('marketSpecificTools')}</h1>
          <p className="mt-2 text-muted-foreground">
            {t('toAccessTheseTools')}
          </p>
          <Button 
            className="mt-6" 
            onClick={() => navigate('/settings')}
          >
            {t('updatePreferences')}
          </Button>
        </div>
      </div>
    );
  }

  // You would replace this with the actual content of your tabs
  const renderTabContent = () => {
    return (
      <div className="py-6">
        <div className="bg-muted/50 p-6 rounded-lg text-center">
          <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">
            {currentTab === '1031-exchange' ? '1031 Exchange Calculator' :
             currentTab === 'property-tax' ? 'Property Tax Calculator' :
             currentTab === 'depreciation' ? 'Depreciation Schedule Calculator' :
             currentTab === 'mortgage' ? 'Mortgage Calculator' : 'US Real Estate Tool'
            }
          </h3>
          <p className="text-muted-foreground mt-2">
            This feature is coming soon. We're currently building this tool for you.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">US Real Estate Tools</h1>
        <p className="text-muted-foreground">
          Specialized tools and calculators for US real estate investors
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search US real estate tools..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>US Real Estate Tools</CardTitle>
              <CardDescription>
                Select a tool to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <USRealEstateNavigation />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentTab === '1031-exchange' ? '1031 Exchange Calculator' :
                 currentTab === 'property-tax' ? 'Property Tax Calculator' :
                 currentTab === 'depreciation' ? 'Depreciation Schedule Calculator' :
                 currentTab === 'mortgage' ? 'Mortgage Calculator' : 'US Real Estate Tool'
                }
              </CardTitle>
              <CardDescription>
                {currentTab === '1031-exchange' ? 'Calculate tax implications of property exchanges' :
                 currentTab === 'property-tax' ? 'Estimate property taxes by state and county' :
                 currentTab === 'depreciation' ? 'Generate property depreciation schedule' :
                 currentTab === 'mortgage' ? 'Compare mortgage rates and payments' : 'Real estate investment tools'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default USRealEstateTools;
