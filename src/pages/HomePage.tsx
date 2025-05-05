
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, BarChart3, Calculator } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useUserPreferences();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Building className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">{t('propertyFlow')}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {t('investmentPlatform')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
          >
            {isAuthenticated ? t('dashboard') : t('login')}
          </Button>
          {!isAuthenticated && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/auth?mode=register')}
            >
              {t('createAccount')}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-card rounded-lg shadow-sm p-6 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('analytics')}</h3>
          <p className="text-muted-foreground mb-4">{t('cashFlowAnalysisDescription')}</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 text-center">
          <Building className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('properties')}</h3>
          <p className="text-muted-foreground mb-4">{t('portfolioProjections')}</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 text-center">
          <Calculator className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('calculators')}</h3>
          <p className="text-muted-foreground mb-4">{t('cashFlowAnalysisDescription')}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
