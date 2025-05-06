
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { School, BookOpen, Video, FileText, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const Education = () => {
  const { language } = useLanguage();
  const { preferences } = useUserPreferences();
  
  const educationResources = [
    {
      title: language === 'de' ? 'Grundlagen der Immobilieninvestition' : 'Real Estate Investment Basics',
      description: language === 'de' ? 'Lernen Sie die grundlegenden Konzepte der Immobilieninvestition' : 'Learn the basic concepts of real estate investing',
      type: 'article',
      timeToRead: '15 min',
      level: 'beginner',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: language === 'de' ? 'Cashflow-Analyse für Vermietungsobjekte' : 'Rental Property Cash Flow Analysis',
      description: language === 'de' ? 'Verstehen Sie, wie Sie den Cashflow Ihrer Vermietungsobjekte analysieren' : 'Understanding how to analyze the cash flow from your rental properties',
      type: 'video',
      timeToRead: '25 min',
      level: 'intermediate',
      icon: <Video className="h-5 w-5" />
    },
    {
      title: language === 'de' ? 'Immobilienfinanzierung und Kreditarten' : 'Real Estate Financing and Loan Types',
      description: language === 'de' ? 'Ein umfassender Überblick über Finanzierungsoptionen' : 'A comprehensive overview of financing options',
      type: 'article',
      timeToRead: '20 min',
      level: 'intermediate',
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: language === 'de' ? 'Steuerstrategien für Immobilieninvestoren' : 'Tax Strategies for Real Estate Investors',
      description: language === 'de' ? 'Lernen Sie, wie Sie Ihre Steuerlast optimieren können' : 'Learn how to optimize your tax burden',
      type: 'article',
      timeToRead: '30 min',
      level: 'advanced',
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: language === 'de' ? 'Erweiterte Immobilienportfolio-Strategien' : 'Advanced Real Estate Portfolio Strategies',
      description: language === 'de' ? 'Strategien zur Diversifikation und Skalierung Ihres Portfolios' : 'Strategies for diversifying and scaling your portfolio',
      type: 'video',
      timeToRead: '45 min',
      level: 'expert',
      icon: <Video className="h-5 w-5" />
    }
  ];
  
  // Filter resources based on user experience level
  const userLevel = preferences.experienceLevel || 'beginner';
  const getLevelValue = (level: string) => {
    switch (level) {
      case 'beginner': return 1;
      case 'intermediate': return 2;
      case 'advanced': return 3;
      case 'expert': return 4;
      default: return 1;
    }
  };
  
  const userLevelValue = getLevelValue(userLevel);
  
  const relevantResources = educationResources.filter(resource => {
    const resourceLevel = getLevelValue(resource.level);
    return resourceLevel <= userLevelValue + 1; // Show resources up to one level above user's level
  });

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <School className="h-8 w-8 mr-2" />
        <h1 className="text-3xl font-bold">{language === 'de' ? 'Bildungsressourcen' : 'Educational Resources'}</h1>
      </div>
      
      <p className="text-muted-foreground mb-8">
        {language === 'de' 
          ? 'Erweitern Sie Ihr Wissen über Immobilieninvestitionen mit unseren kurierten Ressourcen'
          : 'Expand your knowledge of real estate investing with our curated resources'}
      </p>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {relevantResources.map((resource, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                {resource.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>{resource.type}</span>
                  <span>•</span>
                  <span>{resource.timeToRead}</span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{resource.description}</p>
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                {language === 'de' ? 'Jetzt lesen' : 'Read now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Education;
