import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, BarChart3, Calculator, Globe, FileText, ArrowLeftRight, Map } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const SimplifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { preferences } = useUserPreferences();
  const [loading, setLoading] = useState(false);

  // Feature cards for the dashboard
  const features = [
    {
      id: 'investor-dashboard',
      title: language === 'de' ? 'Investoren-Dashboard' : 'Investor Dashboard',
      description: language === 'de' 
        ? 'Verwalten Sie Ihr Immobilienportfolio und analysieren Sie Leistungskennzahlen'
        : 'Manage your property portfolio and analyze performance metrics',
      icon: <Building className="h-10 w-10 text-primary" />,
      action: () => navigate('/investor-dashboard')
    },
    {
      id: 'market-explorer',
      title: language === 'de' ? 'Marktexplorer' : 'Market Explorer',
      description: language === 'de'
        ? 'Erkunden und analysieren Sie Immobilienmärkte'
        : 'Explore and analyze real estate markets',
      icon: <Globe className="h-10 w-10 text-primary" />,
      action: () => navigate('/market-explorer')
    },
    {
      id: 'market-comparison',
      title: language === 'de' ? 'Marktvergleich' : 'Market Comparison',
      description: language === 'de'
        ? 'Vergleichen Sie verschiedene Immobilienmärkte nebeneinander'
        : 'Compare different real estate markets side-by-side',
      icon: <ArrowLeftRight className="h-10 w-10 text-primary" />,
      action: () => navigate('/market-comparison'),
      new: true
    },
    {
      id: 'regional-analysis',
      title: language === 'de' ? 'Regionale Analyse' : 'Regional Analysis',
      description: language === 'de'
        ? 'Detaillierte Analyse regionaler Immobilienmärkte und Trends'
        : 'Detailed analysis of regional real estate markets and trends',
      icon: <Map className="h-10 w-10 text-primary" />,
      action: () => navigate('/regional-analysis'),
      new: true
    },
    {
      id: 'investment-calculators',
      title: language === 'de' ? 'Anlagerechner' : 'Investment Calculators',
      description: language === 'de'
        ? 'Berechnen Sie ROI, Cashflow und andere wichtige Finanzkennzahlen'
        : 'Calculate ROI, cash flow, and other key financial metrics',
      icon: <Calculator className="h-10 w-10 text-primary" />,
      action: () => navigate('/calculators')
    },
    {
      id: 'tax-planning',
      title: language === 'de' ? 'Steuerplanung' : 'Tax Planning',
      description: language === 'de'
        ? 'Optimieren Sie Ihre Immobilieninvestitionen für steuerliche Vorteile'
        : 'Optimize your real estate investments for tax benefits',
      icon: <FileText className="h-10 w-10 text-primary" />,
      action: () => navigate('/tax-planning')
    },
    {
      id: 'advanced-analytics',
      title: language === 'de' ? 'Erweiterte Analysen' : 'Advanced Analytics',
      description: language === 'de'
        ? 'Erhalten Sie tiefere Einblicke mit erweiterten Analysetools'
        : 'Get deeper insights with advanced analytics tools',
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      action: () => navigate('/advanced-analytics')
    },
    {
      id: 'german-market-tools',
      title: language === 'de' ? 'Deutsche Markttools' : 'German Market Tools',
      description: language === 'de'
        ? 'Spezialisierte Tools für den deutschen Immobilienmarkt'
        : 'Specialized tools for the German real estate market',
      icon: <Globe className="h-10 w-10 text-primary" />,
      action: () => navigate('/deutsche-immobilien-tools')
    }
  ];

  // Only show certain features based on user preferences or market
  const displayedFeatures = features.filter(feature => {
    // If user's market is Germany/Austria, prioritize German tools
    if (preferences.investmentMarket === 'germany' || preferences.investmentMarket === 'austria') {
      if (feature.id === 'german-market-tools') {
        return true;
      }
    }
    
    // Hide certain features for beginner users
    if (preferences.experienceLevel === 'beginner') {
      if (['advanced-analytics', 'tax-planning', 'regional-analysis'].includes(feature.id)) {
        return false;
      }
    }
    
    // Show all features by default
    return true;
  });

  // User has seen the simplified dashboard, mark it
  React.useEffect(() => {
    // You could save this information in user preferences if needed
  }, []);

  // Recent activity items (mock data)
  const recentActivity = [
    {
      id: 1,
      type: language === 'de' ? 'Marktanalyse' : 'Market Analysis',
      description: language === 'de' ? 'Berliner Marktübersicht angesehen' : 'Viewed Berlin market overview',
      timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: 2,
      type: language === 'de' ? 'Berechnung' : 'Calculation',
      description: language === 'de' ? 'ROI-Berechnung für Münchner Immobilie' : 'ROI calculation for Munich property',
      timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 3,
      type: language === 'de' ? 'Marktvergleich' : 'Market Comparison',
      description: language === 'de' ? 'Berlin vs. Frankfurt verglichen' : 'Compared Berlin vs. Frankfurt',
      timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];

  // Format relative time for recent activity
  const formatRelativeTime = (timestamp: string) => {
    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) {
      return language === 'de' ? 'gerade eben' : 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return language === 'de' ? `vor ${minutes} Minuten` : `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return language === 'de' ? `vor ${hours} Stunden` : `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return language === 'de' ? `vor ${days} Tagen` : `${days} days ago`;
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {language === 'de' 
                ? `Willkommen${preferences.name ? ', ' + preferences.name : ''}!` 
                : `Welcome${preferences.name ? ', ' + preferences.name : ''}!`}
            </h1>
            <p className="text-muted-foreground">
              {language === 'de' 
                ? 'Hier ist ein Überblick über Ihre Immobilieninvestitionstools und -aktivitäten.'
                : 'Here\'s an overview of your real estate investment tools and activities.'}
            </p>
          </div>
          
          {/* Tools Grid */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {language === 'de' ? 'Tools & Funktionen' : 'Tools & Features'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedFeatures.map((feature) => (
                <Card 
                  key={feature.id}
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={feature.action}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {feature.icon}
                      {feature.new && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          {language === 'de' ? 'Neu' : 'New'}
                        </span>
                      )}
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-start">
                      {language === 'de' ? 'Öffnen' : 'Open'} →
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Recent Activity */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {language === 'de' ? 'Letzte Aktivitäten' : 'Recent Activity'}
            </h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="flex items-start pb-4 last:pb-0 last:border-b-0 border-b">
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.type}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(activity.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  {language === 'de' ? 'Alle Aktivitäten anzeigen' : 'View All Activity'}
                </Button>
              </CardFooter>
            </Card>
          </section>
          
          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              {language === 'de' ? 'Schnellzugriff' : 'Quick Actions'}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/market-comparison')}
                className="flex items-center gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                {language === 'de' ? 'Märkte vergleichen' : 'Compare Markets'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/calculators')}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                {language === 'de' ? 'ROI berechnen' : 'Calculate ROI'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/market-explorer')}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === 'de' ? 'Markt erkunden' : 'Explore Market'}
              </Button>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SimplifiedDashboard;
