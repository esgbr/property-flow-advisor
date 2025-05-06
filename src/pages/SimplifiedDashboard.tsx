
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Globe, 
  BarChart3, 
  Calculator 
} from 'lucide-react';
import { useLanguage } from '@/contexts/FixedLanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useNavigate } from 'react-router-dom';

const SimplifiedDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('Dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center">
              <Building className="h-6 w-6 mr-2 text-primary" />
              <CardTitle>{t('Properties')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('Manage and view your real estate portfolio.')}</p>
            <Button onClick={() => navigate('/investor-dashboard')}>{t('View Properties')}</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center">
              <Globe className="h-6 w-6 mr-2 text-primary" />
              <CardTitle>{t('Market Explorer')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('Research property markets and trends.')}</p>
            <Button onClick={() => navigate('/market-explorer')}>{t('Explore Markets')}</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center">
              <Calculator className="h-6 w-6 mr-2 text-primary" />
              <CardTitle>{t('Calculators')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('Financial tools and calculators for investments.')}</p>
            <Button onClick={() => navigate('/calculators')}>{t('Open Calculators')}</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('Market Insights')}</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              {preferences.investmentMarket === 'germany' 
                ? t('German market showing stable growth in residential sector.') 
                : t('Current market conditions show positive trends for investment.')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimplifiedDashboard;
