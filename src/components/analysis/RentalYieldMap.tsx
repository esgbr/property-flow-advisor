
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Info, Filter, ChevronDown, Map, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMarketFilter } from '@/hooks/use-market-filter';

const RentalYieldMap: React.FC = () => {
  const { t } = useLanguage();
  const { getMarketDisplayName, userMarket } = useMarketFilter();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample neighborhood data - in a real app this would come from an API
  const allNeighborhoods = [
    { id: 'n1', name: 'Downtown', yield: 5.8, color: 'bg-amber-500', tier: 'medium' },
    { id: 'n2', name: 'Westside', yield: 6.4, color: 'bg-green-500', tier: 'high' },
    { id: 'n3', name: 'Eastside', yield: 4.2, color: 'bg-red-500', tier: 'low' },
    { id: 'n4', name: 'Northside', yield: 5.5, color: 'bg-amber-500', tier: 'medium' },
    { id: 'n5', name: 'Southside', yield: 7.1, color: 'bg-green-500', tier: 'high' },
    { id: 'n6', name: 'Old Town', yield: 6.9, color: 'bg-green-500', tier: 'high' },
    { id: 'n7', name: 'Riverside', yield: 5.2, color: 'bg-amber-500', tier: 'medium' },
    { id: 'n8', name: 'Industrial District', yield: 3.8, color: 'bg-red-500', tier: 'low' },
    { id: 'n9', name: 'University Area', yield: 6.2, color: 'bg-green-500', tier: 'high' },
    { id: 'n10', name: 'Harbor View', yield: 5.7, color: 'bg-amber-500', tier: 'medium' },
  ];

  // Filter neighborhoods based on selected filter and search query
  const filteredNeighborhoods = allNeighborhoods
    .filter(n => selectedFilter === 'all' || n.tier === selectedFilter)
    .filter(n => searchQuery === '' || n.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleNeighborhoodClick = (id: string) => {
    setSelectedArea(id);
  };

  // Clear filters function
  const clearFilters = () => {
    setSelectedFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="h-full w-full flex flex-col bg-card rounded-lg overflow-hidden border">
      <div className="p-4 bg-muted/30 border-b">
        <h3 className="font-medium flex items-center">
          {t('Rental Yield Map')}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-1 p-0 h-auto">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{t('Rental Yield Map Explanation')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {userMarket && (
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              {getMarketDisplayName()} {t('Market')}
            </Badge>
          )}
        </h3>
      </div>
      
      <div className="flex-grow p-4">
        <div className="h-full flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('Search neighborhoods...')} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                {searchQuery && (
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2" 
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4 mr-1" />
                  {selectedFilter === 'all' ? t('All Yields') : 
                   selectedFilter === 'high' ? t('High Yield') :
                   selectedFilter === 'medium' ? t('Medium Yield') : t('Low Yield')}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('Filter by Yield')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                  {t('All Yields')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter('high')}>
                  {t('High Yield')} (>6%)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter('medium')}>
                  {t('Medium Yield')} (5-6%)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter('low')}>
                  {t('Low Yield')} (&lt;5%)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(selectedFilter !== 'all' || searchQuery) && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-4 w-4 bg-red-500 rounded mr-2"></div>
                <span className="text-sm text-muted-foreground">&lt;5%</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 bg-amber-500 rounded mr-2"></div>
                <span className="text-sm text-muted-foreground">5-6%</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-muted-foreground">&gt;6%</span>
              </div>
            </div>
          </div>
          
          <div className="relative flex-grow bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
            {/* This would be an actual map in a real implementation */}
            <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
              {filteredNeighborhoods.map(neighborhood => (
                <div 
                  key={neighborhood.id}
                  className={`${neighborhood.color} rounded-lg shadow p-3 cursor-pointer transition-transform hover:scale-105 ${selectedArea === neighborhood.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  onClick={() => handleNeighborhoodClick(neighborhood.id)}
                >
                  <h4 className="font-medium text-white">{neighborhood.name}</h4>
                  <p className="text-white text-sm">{t('Yield')}: {neighborhood.yield}%</p>
                </div>
              ))}
            </div>
            
            {filteredNeighborhoods.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="bg-background/90 p-3 rounded shadow text-center">
                  <Map className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">
                    {t('No neighborhoods found')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('Try adjusting your filters')}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={clearFilters}
                  >
                    {t('Clear Filters')}
                  </Button>
                </div>
              </div>
            )}

            {filteredNeighborhoods.length > 0 && !selectedArea && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <p className="text-sm bg-background/90 p-2 rounded shadow">
                  {t('Click a neighborhood to view details')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedArea && (
        <div className="p-4 border-t bg-muted/20">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">
                {filteredNeighborhoods.find(n => n.id === selectedArea)?.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('Average Yield')}: {filteredNeighborhoods.find(n => n.id === selectedArea)?.yield}%
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                {t('View Property Listings')}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedArea(null)}>
                {t('Close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalYieldMap;
