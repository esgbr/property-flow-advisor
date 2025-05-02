
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  BookOpen, 
  Book, 
  BookUser, 
  Bookmark, 
  FileText, 
  Search, 
  Filter, 
  CheckSquare,
  ChevronRight,
  DownloadCloud,
  Share2,
  Award
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
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
  hasCertificate?: boolean;
  hasQuiz?: boolean;
  hasResources?: boolean;
  sections?: {
    title: string;
    content: string;
    videoUrl?: string;
  }[];
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
        isNew: true,
        hasQuiz: true,
        sections: [
          {
            title: 'Real Estate Market Cycles',
            content: 'Real estate markets typically follow cyclical patterns that can be broken down into four phases: recovery, expansion, hyper-supply, and recession. Understanding where a market sits within this cycle is crucial for making informed investment decisions.'
          },
          {
            title: 'Supply and Demand Factors',
            content: 'Property values are heavily influenced by the balance between supply (available properties) and demand (buyer interest). Factors affecting this balance include population growth, employment rates, new construction, and interest rates.'
          },
          {
            title: 'Market Indicators to Watch',
            content: 'Key indicators for evaluating real estate markets include: days on market (DOM), price-to-rent ratio, months of inventory, median home prices, and absorption rate. Tracking these metrics provides valuable insights into market conditions.'
          }
        ],
        hasResources: true
      },
      { 
        id: 2, 
        title: 'Types of Properties', 
        description: 'Overview of different property types for investment.',
        readTime: 5,
        difficulty: 'easy',
        tags: ['basics', 'properties'],
        hasResources: true
      },
      { 
        id: 3, 
        title: 'Real Estate Investment Trusts (REITs)', 
        description: 'Introduction to REITs and how they work.',
        readTime: 7,
        difficulty: 'medium',
        tags: ['reits', 'passive investing'],
        hasCertificate: true
      },
      { 
        id: 4, 
        title: 'Understanding Property Value', 
        description: 'Factors that influence property values and how to evaluate them.',
        readTime: 12,
        difficulty: 'medium',
        tags: ['valuation', 'basics'],
        isPopular: true,
        hasQuiz: true
      },
      { 
        id: 5, 
        title: 'Cash Flow Analysis for Beginners', 
        description: 'Learn how to calculate and analyze cash flow from rental properties.',
        readTime: 10,
        difficulty: 'medium',
        tags: ['cash flow', 'analysis', 'rental'],
        isNew: true,
        hasCertificate: true
      },
      { 
        id: 6, 
        title: 'Risk Management Fundamentals', 
        description: 'Essential risk management strategies for new real estate investors.',
        readTime: 8,
        difficulty: 'easy',
        tags: ['risk', 'management', 'strategy'],
        hasQuiz: true
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
        title: 'Down Payments', 
        description: 'What you need to know about down payments.',
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
        isNew: true,
        hasCertificate: true
      },
      { 
        id: 4, 
        title: 'Interest Rates and Their Impact', 
        description: 'How interest rates affect your investment strategy.',
        readTime: 8,
        difficulty: 'medium',
        tags: ['interest rates', 'economics']
      },
      { 
        id: 5, 
        title: 'Pre-Approval Process Explained', 
        description: 'Step-by-step guide to getting pre-approved for a mortgage.',
        readTime: 9,
        difficulty: 'easy',
        tags: ['pre-approval', 'mortgage', 'process'],
        isNew: true,
        hasResources: true
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
        isPopular: true,
        hasQuiz: true
      },
      { 
        id: 3, 
        title: 'Record Keeping for Taxes', 
        description: 'How to maintain proper records for tax purposes.',
        readTime: 7,
        difficulty: 'easy',
        tags: ['taxes', 'organization']
      },
      { 
        id: 4, 
        title: 'Deductible Expenses for Landlords', 
        description: 'Common tax deductions available to property owners and landlords.',
        readTime: 11,
        difficulty: 'medium',
        tags: ['deductions', 'landlord', 'taxes'],
        isNew: true,
        hasCertificate: true
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
      },
      { 
        id: 3, 
        title: 'Landlord-Tenant Laws', 
        description: 'Essential legal knowledge for landlords and property managers.',
        readTime: 13,
        difficulty: 'medium',
        tags: ['landlord', 'tenant', 'legal'],
        isNew: true,
        hasCertificate: true,
        hasResources: true
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
        isPopular: true,
        hasCertificate: true
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
        isNew: true,
        hasCertificate: true
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
        isNew: true,
        hasQuiz: true
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
        isPopular: true,
        hasCertificate: true
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
        isPopular: true,
        hasCertificate: true
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
        isNew: true,
        hasCertificate: true
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
        isPopular: true,
        hasCertificate: true
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
        isNew: true,
        hasCertificate: true
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
        isNew: true,
        hasCertificate: true
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
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [level, setLevel] = useState<ExperienceLevel>(preferences.experienceLevel || 'beginner');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [completedItems, setCompletedItems] = useState<number[]>(preferences.educationProgress?.completedModules?.map(Number) || []);
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [inProgressItems, setInProgressItems] = useState<{id: number, progress: number}[]>([]);
  
  // Get categories for the selected level
  const categories = Object.keys(educationContent[level as keyof typeof educationContent]);

  // Effect to set experience level from user preferences
  useEffect(() => {
    if (preferences.experienceLevel) {
      setLevel(preferences.experienceLevel);
    }
    
    // Load completed items from preferences
    if (preferences.educationProgress?.completedModules) {
      setCompletedItems(preferences.educationProgress.completedModules.map(Number));
    }
    
    // Start some items as "in progress" for demo purposes
    setInProgressItems([
      { id: 1, progress: 35 },
      { id: 3, progress: 70 },
      { id: 5, progress: 20 },
    ]);
  }, [preferences.experienceLevel, preferences.educationProgress]);
  
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
        (item.isPopular && selectedFilters.includes('popular')) ||
        (item.hasCertificate && selectedFilters.includes('certificate')) ||
        (item.hasQuiz && selectedFilters.includes('quiz'));
        
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
      const newCompletedItems = completedItems.filter(itemId => itemId !== id);
      setCompletedItems(newCompletedItems);
      
      // Update user preferences
      updatePreferences({
        educationProgress: {
          ...preferences.educationProgress,
          completedModules: newCompletedItems.map(String),
          lastAccessedDate: new Date().toISOString()
        }
      });
    } else {
      const newCompletedItems = [...completedItems, id];
      setCompletedItems(newCompletedItems);
      
      // Update user preferences
      updatePreferences({
        educationProgress: {
          ...preferences.educationProgress,
          completedModules: newCompletedItems.map(String),
          lastAccessedDate: new Date().toISOString()
        }
      });
      
      toast({
        title: t('marked as completed'),
        description: t('progress updated'),
      });
      
      // Remove from in-progress when completed
      setInProgressItems(inProgressItems.filter(item => item.id !== id));
    }
  };

  // Handle item click to open detail view
  const handleItemClick = (item: EducationItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
    
    // If not already in progress or completed, add to in-progress
    if (!inProgressItems.some(progressItem => progressItem.id === item.id) && 
        !completedItems.includes(item.id)) {
      setInProgressItems([...inProgressItems, { id: item.id, progress: 0 }]);
    }
  };

  const getItemProgress = (id: number): number | null => {
    const progressItem = inProgressItems.find(item => item.id === id);
    if (progressItem) {
      return progressItem.progress;
    }
    if (completedItems.includes(id)) {
      return 100;
    }
    return null;
  };

  // Fix for the type issue - create a handler that properly handles the type conversion
  const handleLevelChange = (value: string) => {
    // Ensure we only set valid values by checking if it's one of our allowed levels
    if (value === 'beginner' || value === 'intermediate' || value === 'expert') {
      setLevel(value);
    }
  };

  // Get recommended items based on user preferences and progress
  const getRecommendedItems = (): EducationItem[] => {
    let allItems: EducationItem[] = [];
    
    // Gather all items from the user's current level
    Object.values(educationContent[level as keyof typeof educationContent]).forEach(category => {
      allItems = [...allItems, ...category];
    });
    
    // Filter for items that aren't completed but match user interests
    const recommended = allItems.filter(item => 
      !completedItems.includes(item.id) && 
      ((preferences.interests && item.tags && 
        item.tags.some(tag => preferences.interests.includes(tag))) ||
       item.isPopular)
    );
    
    // Limit to 3 recommendations
    return recommended.slice(0, 3);
  };

  // Get recently viewed or in-progress content
  const getInProgressContent = (): EducationItem[] => {
    const inProgressIds = inProgressItems.map(item => item.id);
    let result: EducationItem[] = [];
    
    // Find the items that match the in-progress IDs
    Object.values(educationContent).forEach(level => {
      Object.values(level).forEach(category => {
        category.forEach(item => {
          if (inProgressIds.includes(item.id)) {
            result.push(item);
          }
        });
      });
    });
    
    return result.slice(0, 3);
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

        {/* Recommendations Section */}
        <div className="mt-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('recommendedForYou')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {getRecommendedItems().map(item => (
              <Card key={`rec-${item.id}`} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleItemClick(item)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-start justify-between">
                    <span>{item.title}</span>
                    {item.hasCertificate && (
                      <Award className="h-5 w-5 text-amber-500" />
                    )}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <span>{item.readTime} {t('minRead')}</span>
                    <Badge variant={item.difficulty === 'easy' ? 'outline' : (item.difficulty === 'medium' ? 'secondary' : 'destructive')} className="text-xs">
                      {t(item.difficulty || 'easy')}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleItemClick(item)}>
                    {t('startCourse')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Continue Learning Section */}
        {inProgressItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{t('continueReading')}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {getInProgressContent().map(item => {
                const progress = getItemProgress(item.id);
                return (
                  <Card key={`prog-${item.id}`} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleItemClick(item)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      {progress !== null && (
                        <div className="w-full mt-2">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-right mt-1 text-muted-foreground">{progress}% {t('completed')}</p>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                        <span>{item.readTime} {t('minRead')}</span>
                        <Badge variant={item.difficulty === 'easy' ? 'outline' : (item.difficulty === 'medium' ? 'secondary' : 'destructive')} className="text-xs">
                          {t(item.difficulty || 'easy')}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="default" size="sm" className="w-full mt-2">
                        {t('continueReading')} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

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

              <DropdownMenuCheckboxItem
                checked={selectedFilters.includes('certificate')}
                onCheckedChange={(checked) => {
                  setSelectedFilters(
                    checked
                      ? [...selectedFilters, 'certificate']
                      : selectedFilters.filter(f => f !== 'certificate')
                  );
                }}
              >
                {t('certificateEligible')}
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuCheckboxItem
                checked={selectedFilters.includes('quiz')}
                onCheckedChange={(checked) => {
                  setSelectedFilters(
                    checked
                      ? [...selectedFilters, 'quiz']
                      : selectedFilters.filter(f => f !== 'quiz')
                  );
                }}
              >
                {t('quizAvailable')}
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
                            <li 
                              key={item.id} 
                              className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md cursor-pointer"
                              onClick={() => handleItemClick(item)}
                            >
                              <div className="flex items-center gap-2">
                                {completedItems.includes(item.id) ? (
                                  <CheckSquare className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="w-4 h-4 rounded border border-gray-300" />
                                )}
                                <span className={completedItems.includes(item.id) ? "line-through text-muted-foreground" : ""}>
                                  {item.title}
                                </span>
                                {item.isNew && (
                                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                                    {t('new')}
                                  </Badge>
                                )}
                                {item.isPopular && (
                                  <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                                    {t('popular')}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{item.readTime}min</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveItem(item.id);
                                  }}
                                >
                                  <Bookmark className={`h-4 w-4 ${savedItems.includes(item.id) ? 'fill-current' : ''}`} />
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-center text-muted-foreground py-2">{t('noCategoryContent')}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {selectedItem && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center justify-between">
                {selectedItem.title}
                {selectedItem.hasCertificate && (
                  <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 flex items-center">
                    <Award className="h-3.5 w-3.5 mr-1" />
                    {t('certificateEligible')}
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <Badge variant={selectedItem.difficulty === 'easy' ? 'outline' : (selectedItem.difficulty === 'medium' ? 'secondary' : 'destructive')}>
                    {t(selectedItem.difficulty || 'easy')}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <span>{t('timeToComplete')}: {selectedItem.readTime} {t('minRead')}</span>
                  </Badge>
                  {selectedItem.tags?.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                <p className="text-base text-foreground my-4">{selectedItem.description}</p>
                
                {selectedItem.sections && (
                  <div className="space-y-6 mt-8">
                    {selectedItem.sections.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="text-lg font-semibold">{section.title}</h3>
                        <p className="text-muted-foreground">{section.content}</p>
                        {section.videoUrl && (
                          <div className="aspect-video bg-muted rounded-md mt-2 flex items-center justify-center">
                            {/* Video placeholder */}
                            <div className="text-center">
                              <Button variant="outline">Play Video</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-2 mt-6">
              {selectedItem.hasResources && (
                <Button variant="outline" size="sm" className="flex items-center">
                  <DownloadCloud className="mr-2 h-4 w-4" /> 
                  {t('downloadResources')}
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="flex items-center" onClick={() => handleSaveItem(selectedItem.id)}>
                <Bookmark className={`mr-2 h-4 w-4 ${savedItems.includes(selectedItem.id) ? 'fill-current' : ''}`} />
                {savedItems.includes(selectedItem.id) ? 'Saved' : t('readLater')}
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" /> 
                {t('shareProgress')}
              </Button>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
              {selectedItem.hasQuiz && (
                <Button variant="outline">
                  {t('takeQuiz')}
                </Button>
              )}
              <Button onClick={() => handleMarkComplete(selectedItem.id)}>
                {completedItems.includes(selectedItem.id) ? 'Mark as Incomplete' : t('markAsComplete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Education;
