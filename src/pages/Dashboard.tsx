
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleProperties } from '@/data/sampleData';
import { FileText, Calculator, Calendar, Wrench, Plus, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import PortfolioAnalytics from '@/components/analytics/PortfolioAnalytics';
import AIAssistant from '@/components/ai/AIAssistant';

const Dashboard = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  
  const propertyCount = sampleProperties.length;
  const analyzeCount = sampleProperties.filter(p => p.status === 'analyzing').length;
  const negotiatingCount = sampleProperties.filter(p => p.status === 'negotiating').length;
  const ownedCount = sampleProperties.filter(p => p.status === 'owned').length;
  
  // Calculate total portfolio value
  const portfolioValue = sampleProperties.reduce((sum, property) => sum + property.purchasePrice, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t('dashboard')}
          </h1>
          <p className="text-muted-foreground">{t('welcomeToDashboard')}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <AIAssistant />
          <Button asChild>
            <Link to="/properties">
              <Plus className="mr-2 h-4 w-4" />
              {t('addProperty')}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalProperties')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyCount}</div>
            <p className="text-xs text-muted-foreground">{t('allProperties')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('portfolioValue')}</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{portfolioValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t('totalPurchasePrice')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('underAnalysis')}</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyzeCount}</div>
            <p className="text-xs text-muted-foreground">{t('propertiesAnalyzed')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('negotiations')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{negotiatingCount}</div>
            <p className="text-xs text-muted-foreground">{t('propertiesNegotiation')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Analytics Section */}
      <PortfolioAnalytics />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t('recentProperties')}</CardTitle>
                <CardDescription>{t('latestPropertyProspects')}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/properties">
                  {t('viewAll')} <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleProperties.slice(0, 3).map((property) => (
                <Link 
                  to={`/property/${property.id}`} 
                  key={property.id} 
                  className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="w-16 h-16 rounded overflow-hidden">
                    {property.imageUrl && (
                      <img 
                        src={property.imageUrl} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{property.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{property.city}</p>
                    <p className="text-sm text-muted-foreground">€{property.purchasePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      property.status === 'analyzing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                      property.status === 'negotiating' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' :
                      property.status === 'owned' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }`}>
                      {property.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t('recommendedLearning')}</CardTitle>
                <CardDescription>{t('basedOnExperienceLevel')}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/education">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {preferences.experienceLevel === 'beginner' ? (
                <>
                  <Link to="/education" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="font-medium">{t('understandingRealEstateMarkets')}</div>
                    <div className="text-sm text-muted-foreground">{t('fundamentalsOfMarkets')}</div>
                  </Link>
                  <Link to="/education" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="font-medium">{t('mortgageBasics')}</div>
                    <div className="text-sm text-muted-foreground">{t('understandingMortgages')}</div>
                  </Link>
                </>
              ) : preferences.experienceLevel === 'intermediate' ? (
                <>
                  <Link to="/education" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="font-medium">{t('analyzingMarketTrends')}</div>
                    <div className="text-sm text-muted-foreground">{t('evaluatePropertyMarket')}</div>
                  </Link>
                  <Link to="/education" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="font-medium">{t('refinancingStrategies')}</div>
                    <div className="text-sm text-muted-foreground">{t('whenAndHowToRefinance')}</div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/education" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="font-medium">{t('commercialRealEstate')}</div>
                    <div className="text-sm text-muted-foreground">{t('advancedStrategies')}</div>
                  </Link>
                  <Link to="/education" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="font-medium">{t('predictiveAnalytics')}</div>
                    <div className="text-sm text-muted-foreground">{t('dataScience')}</div>
                  </Link>
                </>
              )}
              <Link to="/education" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="font-medium">{t('browseLibrary')}</div>
                <div className="text-sm text-muted-foreground">{t('exploreAllEducationalContent')}</div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
