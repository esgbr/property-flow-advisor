
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calculator, ChevronRight, Home, Search, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t('realEstateInvestmentMadeEasy')}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {t('comprehensiveToolsForRealEstate')}
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link to="/investor-dashboard">
                    {t('investorDashboard')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/properties">
                    {t('exploreProperties')}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80" 
                alt="Real Estate Investment" 
                className="aspect-video object-cover w-full"
                width={500}
                height={280}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t('powerfulTools')}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('comprehensiveToolsDescription')}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <Building className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>{t('portfolioManagement')}</CardTitle>
                <CardDescription>{t('portfolioManagementDesc')}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="link" className="px-0">
                  <Link to="/investor-dashboard">
                    {t('explore')} <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <Calculator className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>{t('financialTools')}</CardTitle>
                <CardDescription>{t('financialToolsDesc')}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="link" className="px-0">
                  <Link to="/calculators">
                    {t('explore')} <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <TrendingUp className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>{t('marketAnalysis')}</CardTitle>
                <CardDescription>{t('marketAnalysisDesc')}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="link" className="px-0">
                  <Link to="/investor-dashboard?tab=market">
                    {t('explore')} <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t('startInvesting')}</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('startInvestingDesc')}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link to="/dashboard">
                  {t('getStarted')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
