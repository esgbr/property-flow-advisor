import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, BookOpen, Book, BookUser, Bookmark, FileText, Search, Filter, CheckSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AIAssistant from '@/components/ai/AIAssistant';
import { useToast } from '@/components/ui/use-toast';

// Define proper types for the education content
interface EducationItem {
  id: number;
  title: string;
  description: string;
  content?: string;
  readTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

interface EducationCategory {
  [key: string]: EducationItem[];
}

interface EducationLevel {
  [key: string]: EducationCategory;
}

// Enhanced education content with proper typing
const educationContent: EducationLevel = {
  beginner: {
    investmentBasics: [
      { 
        id: 1, 
        title: 'Understanding Real Estate Markets', 
        description: 'Learn the fundamentals of real estate markets and how they function.',
        readTime: 8,
        difficulty: 'easy',
        tags: ['basics', 'markets'],
        isNew: true
      },
      { 
        id: 2, 
        title: 'Types of Properties', 
        description: 'Overview of different property types for investment.',
        readTime: 5,
        difficulty: 'easy',
        tags: ['basics', 'properties']
      },
      { 
        id: 3, 
        title: 'Real Estate Investment Trusts (REITs)', 
        description: 'Introduction to REITs and how they work.',
        readTime: 7,
        difficulty: 'medium',
        tags: ['reits', 'passive investing']
      },
      { 
        id: 4, 
        title: 'Understanding Property Value', 
        description: 'Factors that influence property values and how to evaluate them.',
        readTime: 12,
        difficulty: 'medium',
        tags: ['valuation', 'basics'],
        isPopular: true
      }
    ],
    financing: [
      { 
        id: 1, 
        title: 'Mortgage Basics', 
        description: 'Understanding how mortgages work for beginners.',
        readTime: 10,
        difficulty: 'easy',
        tags: ['mortgage', 'financing'],
        isPopular: true
      },
      { 
        id: 2, 
        title: 'Downpayments', 
        description: 'What you need to know about downpayments.',
        readTime: 6,
        difficulty: 'easy',
        tags: ['financing', 'basics']
      },
      { 
        id: 3, 
        title: 'Loan Types for First-Time Investors', 
        description: 'Overview of loan options for new real estate investors.',
        readTime: 15,
        difficulty: 'medium',
        tags: ['loans', 'financing'],
        isNew: true
      },
      { 
        id: 4, 
        title: 'Interest Rates and Their Impact', 
        description: 'How interest rates affect your investment strategy.',
        readTime: 8,
        difficulty: 'medium',
        tags: ['interest rates', 'economics']
      }
    ],
    taxation: [
      { 
        id: 1, 
        title: 'Property Tax Basics', 
        description: 'Introduction to property taxes for new investors.',
        readTime: 9,
        difficulty: 'easy',
        tags: ['taxes', 'basics']
      },
      { 
        id: 2, 
        title: 'Tax Benefits for Homeowners', 
        description: 'Understanding tax advantages of property ownership.',
        readTime: 12,
        difficulty: 'medium',
        tags: ['taxes', 'benefits'],
        isPopular: true
      },
      { 
        id: 3, 
        title: 'Record Keeping for Taxes', 
        description: 'How to maintain proper records for tax purposes.',
        readTime: 7,
        difficulty: 'easy',
        tags: ['taxes', 'organization']
      }
    ],
    legalBasics: [
      { 
        id: 1, 
        title: 'Real Estate Contracts', 
        description: 'Basics of real estate contracts and agreements.',
        readTime: 14,
        difficulty: 'medium',
        tags: ['legal', 'contracts'],
        isNew: true
      },
      { 
        id: 2, 
        title: 'Property Rights', 
        description: 'Understanding fundamental property rights.',
        readTime: 8,
        difficulty: 'easy',
        tags: ['legal', 'rights']
      }
    ]
  },
  intermediate: {
    marketAnalysis: [
      { 
        id: 1, 
        title: 'Analyzing Market Trends', 
        description: 'How to evaluate property market trends.',
        readTime: 15,
        difficulty: 'medium',
        tags: ['analysis', 'trends'],
        isPopular: true
      },
      { 
        id: 2, 
        title: 'Comparative Market Analysis', 
        description: 'Learn to perform a CMA for property evaluation.',
        readTime: 20,
        difficulty: 'medium',
        tags: ['analysis', 'valuation']
      },
      { 
        id: 3, 
        title: 'Using Economic Indicators', 
        description: 'Which economic indicators matter for real estate investors.',
        readTime: 18,
        difficulty: 'hard',
        tags: ['economics', 'analysis'],
        isNew: true
      }
    ],
    financing: [
      { 
        id: 1, 
        title: 'Investment Loans', 
        description: 'Different loan options for property investors.',
        readTime: 12,
        difficulty: 'medium',
        tags: ['loans', 'financing']
      },
      { 
        id: 2, 
        title: 'Refinancing Strategies', 
        description: 'When and how to refinance investment properties.',
        readTime: 14,
        difficulty: 'medium',
        tags: ['refinancing', 'strategy'],
        isPopular: true
      },
      { 
        id: 3, 
        title: 'Creative Financing Methods', 
        description: 'Alternative ways to finance real estate investments.',
        readTime: 25,
        difficulty: 'hard',
        tags: ['creative financing', 'strategy'],
        isNew: true
      }
    ],
    propertyManagement: [
      { 
        id: 1, 
        title: 'Tenant Screening', 
        description: 'Best practices for screening potential tenants.',
        readTime: 10,
        difficulty: 'medium',
        tags: ['tenants', 'management'],
        isPopular: true
      },
      { 
        id: 2, 
        title: 'Maintenance Planning', 
        description: 'Creating effective property maintenance schedules.',
        readTime: 8,
        difficulty: 'medium',
        tags: ['maintenance', 'management']
      },
      { 
        id: 3, 
        title: 'Rental Rate Optimization', 
        description: 'How to set optimal rental rates for maximum return.',
        readTime: 12,
        difficulty: 'medium',
        tags: ['rental rates', 'optimization']
      },
      { 
        id: 4, 
        title: 'Handling Problem Tenants', 
        description: 'Legal and effective ways to deal with difficult tenants.',
        readTime: 15,
        difficulty: 'hard',
        tags: ['tenants', 'conflict resolution'],
        isNew: true
      }
    ],
    advancedTaxation: [
      { 
        id: 1, 
        title: '1031 Exchanges', 
        description: 'How to defer taxes with 1031 property exchanges.',
        readTime: 22,
        difficulty: 'hard',
        tags: ['taxes', 'exchanges'],
        isPopular: true
      },
      { 
        id: 2, 
        title: 'Depreciation Strategies', 
        description: 'Maximizing depreciation benefits for investors.',
        readTime: 18,
        difficulty: 'medium',
        tags: ['taxes', 'depreciation']
      }
    ]
  },
  expert: {
    advancedInvesting: [
      { 
        id: 1, 
        title: 'Commercial Real Estate', 
        description: 'Advanced strategies for commercial property investment.',
        readTime: 25,
        difficulty: 'hard',
        tags: ['commercial', 'advanced'],
        isPopular: true
      },
      { 
        id: 2, 
        title: 'Portfolio Diversification', 
        description: 'Techniques for building a diversified property portfolio.',
        readTime: 20,
        difficulty: 'hard',
        tags: ['portfolio', 'diversification']
      },
      { 
        id: 3, 
        title: 'Syndication Opportunities', 
        description: 'How to participate in or create real estate syndications.',
        readTime: 30,
        difficulty: 'hard',
        tags: ['syndication', 'partnerships'],
        isNew: true
      }
    ],
    marketAnalysis: [
      { 
        id: 1, 
        title: 'Predictive Analytics', 
        description: 'Using data science to predict market movements.',
        readTime: 25,
        difficulty: 'hard',
        tags: ['analytics', 'data science'],
        isNew: true
      },
      { 
        id: 2, 
        title: 'Macroeconomic Factors', 
        description: 'How global economic trends affect local real estate markets.',
        readTime: 22,
        difficulty: 'hard',
        tags: ['economics', 'global markets']
      },
      { 
        id: 3, 
        title: 'Market Cycle Timing', 
        description: 'Advanced techniques for timing market cycles.',
        readTime: 28,
        difficulty: 'hard',
        tags: ['market cycles', 'timing'],
        isPopular: true
      }
    ],
    legalAspects: [
      { 
        id: 1, 
        title: 'Complex Legal Structures', 
        description: 'Advanced legal entities for property investment.',
        readTime: 24,
        difficulty: 'hard',
        tags: ['legal', 'structures']
      },
      { 
        id: 2, 
        title: 'Cross-border Investments', 
        description: 'Legal considerations for international property investment.',
        readTime: 30,
        difficulty: 'hard',
        tags: ['international', 'legal'],
        isNew: true
      },
      { 
        id: 3, 
        title: 'Asset Protection Strategies', 
        description: 'Protecting your real estate portfolio from legal threats.',
        readTime: 26,
        difficulty: 'hard',
        tags: ['asset protection', 'legal'],
        isPopular: true
      }
    ],
    developmentProjects: [
      { 
        id: 1, 
        title: 'Land Development', 
        description: 'Complete guide to developing raw land for profit.',
        readTime: 35,
        difficulty: 'hard',
        tags: ['development', 'land'],
        isNew: true
      },
      { 
        id: 2, 
        title: 'Construction Management', 
        description: 'Overseeing construction projects for developers.',
        readTime: 30,
        difficulty: 'hard',
        tags: ['construction', 'management'],
        isPopular: true
      }
    ]
  }
};

type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';

const Education = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();
  const [level, setLevel] = useState<ExperienceLevel>(preferences.experienceLevel || 'beginner');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [completedItems, setCompletedItems] = useState<number[]>([]);

  // Get categories for the selected level
  const categories = Object.keys(educationContent[level as keyof typeof educationContent]);

  // Effect to set experience level from user preferences
  useEffect(() => {
    if (preferences.experienceLevel) {
      setLevel(preferences.experienceLevel);
    }
  }, [preferences.experienceLevel]);
  
  // Function to map category to icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'investmentBasics':
        return <Book className="h-5 w-5" />;
      case 'financing':
        return <BookOpen className="h-5 w-5" />;
      case 'marketAnalysis':
        return <BookUser className="h-5 w-5" />;
      case 'legalBasics':
      case 'legalAspects':
        return <FileText className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  // Function to filter items based on search and filters
  const filterItems = (items: EducationItem[]): EducationItem[] => {
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesFilters = selectedFilters.length === 0 || 
        (item.tags && item.tags.some(tag => selectedFilters.includes(tag))) ||
        (item.isNew && selectedFilters.includes('new')) ||
        (item.isPopular && selectedFilters.includes('popular'));
        
      return matchesSearch && matchesFilters;
    });
  };

  // Get all unique tags for filtering
  const getAllTags = (): string[] => {
    const tags = new Set<string>();
    Object.values(educationContent).forEach(level => {
      Object.values(level).forEach(category => {
        category.forEach(item => {
          if (item.tags) {
            item.tags.forEach(tag => tags.add(tag));
          }
        });
      });
    });
    return Array.from(tags);
  };

  const allTags = getAllTags();
  
  // Handle saving and marking as complete
  const handleSaveItem = (id: number) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(itemId => itemId !== id));
      toast({
        title: t('itemRemoved'),
        description: t('itemRemovedFromSaved'),
      });
    } else {
      setSavedItems([...savedItems, id]);
      toast({
        title: t('itemSaved'),
        description: t('itemAddedToSaved'),
      });
    }
  };

  const handleMarkComplete = (id: number) => {
    if (completedItems.includes(id)) {
      setCompletedItems(completedItems.filter(itemId => itemId !== id));
    } else {
      setCompletedItems([...completedItems, id]);
      toast({
        title: t('marked as completed'),
        description: t('progress updated'),
      });
    }
  };

  // Fix for the type issue - create a handler that properly handles the type conversion
  const handleLevelChange = (value: string) => {
    // Ensure we only set valid values by checking if it's one of our allowed levels
    if (value === 'beginner' || value === 'intermediate' || value === 'expert') {
      setLevel(value);
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
        <AIAssistant 
          contextData={{ 
            experienceLevel: level,
            completedItems: completedItems.length 
          }}
          title={t('learningAssistant')}
          description={t('getPersonalizedLearningRecommendations')}
        />
      </div>

      {/* Education Level Tabs */}
      <Tabs defaultValue={level} onValueChange={handleLevelChange} className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-3 max-w-md'}`}>
          <TabsTrigger value="beginner">{t('beginner')}</TabsTrigger>
          <TabsTrigger value="intermediate">{t('intermediate')}</TabsTrigger>
          <TabsTrigger value="expert">{t('expert')}</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchEducationalContent')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                {t('filter')}
                {selectedFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('filterBy')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuCheckboxItem
                checked={selectedFilters.includes('new')}
                onCheckedChange={(checked) => {
                  setSelectedFilters(
                    checked
                      ? [...selectedFilters, 'new']
                      : selectedFilters.filter(f => f !== 'new')
                  );
                }}
              >
                {t('newContent')}
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuCheckboxItem
                checked={selectedFilters.includes('popular')}
                onCheckedChange={(checked) => {
                  setSelectedFilters(
                    checked
                      ? [...selectedFilters, 'popular']
                      : selectedFilters.filter(f => f !== 'popular')
                  );
                }}
              >
                {t('popularContent')}
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t('topics')}</DropdownMenuLabel>
              
              {allTags.map(tag => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedFilters.includes(tag)}
                  onCheckedChange={(checked) => {
                    setSelectedFilters(
                      checked
                        ? [...selectedFilters, tag]
                        : selectedFilters.filter(f => f !== tag)
                    );
                  }}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
              
              {selectedFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedFilters([])}
                    >
                      {t('clearFilters')}
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {Object.keys(educationContent).map((lvl) => (
          <TabsContent key={lvl} value={lvl} className="mt-6">
            <h2 className="text-xl font-semibold mb-4">{t('educationCategories')}</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                // Properly type the items variable
                const items: EducationItem[] = educationContent[lvl as keyof typeof educationContent][category as keyof typeof educationContent[keyof typeof educationContent]] || [];
                
                // Filter items based on search and filters
                const filteredItems = filterItems(items);
                
                return (
                  <Card key={category} className={`card-hover ${filteredItems.length === 0 ? 'opacity-70' : ''}`}>
                    <CardHeader className="flex flex-row items-center gap-2">
                      {getCategoryIcon(category)}
                      <div>
                        <CardTitle>{t(category)}</CardTitle>
                        <CardDescription>{filteredItems.length} {filteredItems.length === 1 ? 'article' : 'articles'}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {filteredItems.length > 0 ? (
                        <ul className="space-y-3">
                          {filteredItems.map((item: EducationItem) => (
                            <li key={item.id} className="hover:bg-accent p-3 rounded-md transition-colors">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium">
                                  {item.title}
                                  {item.isNew && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t('new')}</span>}
                                  {item.isPopular && <span className="ml-2 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 px-2 py-0.5 rounded-full">{t('popular')}</span>}
                                </h3>
                                <div className="flex space-x-1">
                                  <button 
                                    onClick={() => handleSaveItem(item.id)}
                                    className={`p-1 rounded-full hover:bg-muted ${savedItems.includes(item.id) ? 'text-primary' : 'text-muted-foreground'}`}
                                  >
                                    <Bookmark className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleMarkComplete(item.id)}
                                    className={`p-1 rounded-full hover:bg-muted ${completedItems.includes(item.id) ? 'text-green-500' : 'text-muted-foreground'}`}
                                  >
                                    <CheckSquare className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                {item.readTime && (
                                  <span className="mr-3">{item.readTime} {t('minRead')}</span>
                                )}
                                {item.difficulty && (
                                  <span className={`${
                                    item.difficulty === 'easy' ? 'text-green-600' :
                                    item.difficulty === 'medium' ? 'text-amber-600' : 'text-red-600'
                                  }`}>
                                    {t(item.difficulty)}
                                  </span>
                                )}
                              </div>
                              {item.tags && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          {searchTerm || selectedFilters.length > 0 ? t('noMatchingContent') : t('noCategoryContent')}
                        </div>
                      )}
                    </CardContent>
                    {filteredItems.length > 0 && (
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          {t('viewAllInCategory')}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </div>
            
            {/* Progress summary */}
            <div className="mt-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{t('learningProgress')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="flex-1 mr-4">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ 
                            width: `${Math.min(100, (completedItems.length / 10) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {completedItems.length} / {Object.values(educationContent[level as keyof typeof educationContent]).flat().length} {t('completed')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Education;
