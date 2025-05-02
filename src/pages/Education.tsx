
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, BookOpen, Book, BookUser } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Define proper types for the education content
interface EducationItem {
  id: number;
  title: string;
  description: string;
}

interface EducationCategory {
  [key: string]: EducationItem[];
}

interface EducationLevel {
  [key: string]: EducationCategory;
}

// Sample education content with proper typing
const educationContent: EducationLevel = {
  beginner: {
    investmentBasics: [
      { id: 1, title: 'Understanding Real Estate Markets', description: 'Learn the fundamentals of real estate markets and how they function.' },
      { id: 2, title: 'Types of Properties', description: 'Overview of different property types for investment.' }
    ],
    financing: [
      { id: 1, title: 'Mortgage Basics', description: 'Understanding how mortgages work for beginners.' },
      { id: 2, title: 'Downpayments', description: 'What you need to know about downpayments.' }
    ],
    taxation: [
      { id: 1, title: 'Property Tax Basics', description: 'Introduction to property taxes for new investors.' }
    ]
  },
  intermediate: {
    marketAnalysis: [
      { id: 1, title: 'Analyzing Market Trends', description: 'How to evaluate property market trends.' },
      { id: 2, title: 'Comparative Market Analysis', description: 'Learn to perform a CMA for property evaluation.' }
    ],
    financing: [
      { id: 1, title: 'Investment Loans', description: 'Different loan options for property investors.' },
      { id: 2, title: 'Refinancing Strategies', description: 'When and how to refinance investment properties.' }
    ],
    propertyManagement: [
      { id: 1, title: 'Tenant Screening', description: 'Best practices for screening potential tenants.' },
      { id: 2, title: 'Maintenance Planning', description: 'Creating effective property maintenance schedules.' }
    ]
  },
  expert: {
    advancedInvesting: [
      { id: 1, title: 'Commercial Real Estate', description: 'Advanced strategies for commercial property investment.' },
      { id: 2, title: 'Portfolio Diversification', description: 'Techniques for building a diversified property portfolio.' }
    ],
    marketAnalysis: [
      { id: 1, title: 'Predictive Analytics', description: 'Using data science to predict market movements.' }
    ],
    legalAspects: [
      { id: 1, title: 'Complex Legal Structures', description: 'Advanced legal entities for property investment.' },
      { id: 2, title: 'Cross-border Investments', description: 'Legal considerations for international property investment.' }
    ]
  }
};

const Education = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [level, setLevel] = useState('beginner');

  // Get categories for the selected level
  const categories = Object.keys(educationContent[level as keyof typeof educationContent]);
  
  // Function to map category to icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'investmentBasics':
        return <Book className="h-5 w-5" />;
      case 'financing':
        return <BookOpen className="h-5 w-5" />;
      case 'marketAnalysis':
        return <BookUser className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <GraduationCap className="inline-block mr-2 h-8 w-8" />
            {t('education')}
          </h1>
          <p className="text-muted-foreground">{t('selectLevel')}</p>
        </div>
      </div>

      {/* Education Level Tabs */}
      <Tabs defaultValue={level} onValueChange={setLevel} className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-3 max-w-md'}`}>
          <TabsTrigger value="beginner">{t('beginner')}</TabsTrigger>
          <TabsTrigger value="intermediate">{t('intermediate')}</TabsTrigger>
          <TabsTrigger value="expert">{t('expert')}</TabsTrigger>
        </TabsList>

        {Object.keys(educationContent).map((lvl) => (
          <TabsContent key={lvl} value={lvl} className="mt-6">
            <h2 className="text-xl font-semibold mb-4">{t('educationCategories')}</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                // Fix here: Properly type the items variable
                const items: EducationItem[] = educationContent[lvl as keyof typeof educationContent][category as keyof typeof educationContent[keyof typeof educationContent]] || [];
                return (
                  <Card key={category} className="card-hover">
                    <CardHeader className="flex flex-row items-center gap-2">
                      {getCategoryIcon(category)}
                      <div>
                        <CardTitle>{t(category)}</CardTitle>
                        <CardDescription>{items.length} {items.length === 1 ? 'article' : 'articles'}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {items.map((item: EducationItem) => (
                          <li key={item.id} className="hover:bg-accent p-2 rounded-md cursor-pointer transition-colors">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Education;
