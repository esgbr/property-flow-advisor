
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { germanInvestmentTools } from '@/components/navigation/GermanInvestorNavigation';
import GermanInvestorNavigation from '@/components/navigation/GermanInvestorNavigation';
import GermanInvestorToolbar from '@/components/navigation/GermanInvestorToolbar';
import {
  Building,
  Euro,
  Calculator,
  Map,
  Search,
  Star,
  Clock,
  Filter
} from 'lucide-react';

const GermanRealEstateInvestor: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tools based on search query
  const filteredTools = searchQuery 
    ? germanInvestmentTools.filter(tool => 
        (language === 'de' ? tool.titleDe.toLowerCase() : tool.titleEn.toLowerCase())
          .includes(searchQuery.toLowerCase()) ||
        (language === 'de' ? tool.descriptionDe?.toLowerCase() : tool.descriptionEn?.toLowerCase())
          .includes(searchQuery.toLowerCase())
      )
    : germanInvestmentTools;
    
  const recentlyUsedTools = [
    'grunderwerbsteuer',
    'mietkauf',
    'afa'
  ];
  
  const favoriteTools = [
    'grunderwerbsteuer',
    'mietspiegel',
    'renditerechner'
  ];
  
  const filterToolsById = (idList: string[]) => {
    return germanInvestmentTools.filter(tool => idList.includes(tool.id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'de' ? 'Deutsche Immobilieninvestor-Tools' : 'German Real Estate Investor Tools'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'de' 
            ? 'Spezialisierte Tools für den deutschen Immobilienmarkt'
            : 'Specialized tools for the German real estate market'}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={language === 'de' ? 'Tools durchsuchen...' : 'Search tools...'}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            {language === 'de' ? 'Alle Tools' : 'All Tools'}
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Zuletzt verwendet' : 'Recently Used'}
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Favoriten' : 'Favorites'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {searchQuery && filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">
                {language === 'de' ? 'Keine Tools gefunden' : 'No tools found'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {language === 'de' 
                  ? `Es wurden keine Tools für "${searchQuery}" gefunden` 
                  : `No tools found matching "${searchQuery}"`
                }
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                {language === 'de' ? 'Suche zurücksetzen' : 'Clear search'}
              </Button>
            </div>
          ) : (
            <GermanInvestorNavigation 
              variant="grid" 
              maxItems={filteredTools.length}
            />
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">
              {language === 'de' ? 'Zuletzt verwendete Tools' : 'Recently Used Tools'}
            </h2>
            <GermanInvestorNavigation
              variant="list"
              maxItems={filterToolsById(recentlyUsedTools).length}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">
              {language === 'de' ? 'Ihre Favoriten' : 'Your Favorites'}
            </h2>
            <GermanInvestorNavigation
              variant="list"
              maxItems={filterToolsById(favoriteTools).length}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-medium mb-2">
          {language === 'de' ? 'Schnellzugriff' : 'Quick Access'}
        </h2>
        <GermanInvestorToolbar 
          variant="horizontal"
          size="sm"
          maxItems={6}
        />
      </div>
    </div>
  );
};

export default GermanRealEstateInvestor;
