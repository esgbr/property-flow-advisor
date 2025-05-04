import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Calculator, BarChart3, Home, BookOpen } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      title: t('portfolioManagement'),
      description: t('portfolioManagementDescription'),
      icon: <Building className="h-8 w-8 text-primary" />,
      action: () => navigate('/properties')
    },
    {
      title: t('investmentAnalysis'),
      description: t('investmentAnalysisDescription'),
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      action: () => navigate('/investor-dashboard')
    },
    {
      title: t('financialCalculators'),
      description: t('financialCalculatorsDescription'),
      icon: <Calculator className="h-8 w-8 text-primary" />,
      action: () => navigate('/calculators')
    },
    {
      title: t('realEstateEducation'),
      description: t('realEstateEducationDescription'),
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      action: () => navigate('/education')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Building className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('welcomeToPropertyFlow')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('propertyFlowDescription')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              <Home className="mr-2 h-5 w-5" />
              {t('goDashboard')}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/properties')}>
              <Building className="mr-2 h-5 w-5" />
              {t('viewProperties')}
            </Button>
          </div>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{t('keyFeatures')}</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={feature.action}>
                    {t('explore')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">{t('investWithConfidence')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('investWithConfidenceDescription')}
          </p>
          <Button 
            size="lg" 
            className="mt-6"
            onClick={() => navigate('/investor-dashboard')}
          >
            {t('startInvesting')}
          </Button>
        </section>

        <footer className="border-t pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 PropertyFlow. {t('allRightsReserved')}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
