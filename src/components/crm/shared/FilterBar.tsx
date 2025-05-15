
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Filter } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  filterOptions: FilterOption[];
  showFavoritesOnly: boolean;
  onFavoritesToggle: () => void;
  searchPlaceholder: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  filterOptions,
  showFavoritesOnly,
  onFavoritesToggle,
  searchPlaceholder
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row gap-2 md:items-center">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={searchPlaceholder}
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={language === 'de' ? 'Typ' : 'Type'} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant={showFavoritesOnly ? "default" : "outline"} 
          size="icon"
          onClick={onFavoritesToggle}
          title={language === 'de' ? 'Nur Favoriten anzeigen' : 'Show favorites only'}
          className="transition-transform hover:scale-105"
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
