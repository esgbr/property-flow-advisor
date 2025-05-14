
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import SkipLinks from '@/components/accessibility/SkipLinks';

const Properties = () => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { preferences } = useUserPreferences();
  const { highContrast, largeText } = useAccessibility();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Set up keyboard shortcuts for this page
  useKeyboardNavigation([
    {
      key: 'f',
      ctrl: true,
      description: 'Focus search',
      action: () => searchInputRef.current?.focus()
    },
    {
      key: 's',
      ctrl: true,
      description: 'Toggle sort direction',
      action: () => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    }
  ]);
  
  // Sample properties data - in a real app, this would come from an API
  const properties = [
    { id: 1, name: 'Riverside Apartment', location: 'Berlin, Germany', price: '€350,000', type: 'Apartment' },
    { id: 2, name: 'Mountain View Villa', location: 'Munich, Germany', price: '€780,000', type: 'Villa' },
    { id: 3, name: 'City Center Penthouse', location: 'Frankfurt, Germany', price: '€1,200,000', type: 'Penthouse' },
    { id: 4, name: 'Suburban Family Home', location: 'Hamburg, Germany', price: '€450,000', type: 'House' },
    { id: 5, name: 'Modern Office Space', location: 'Berlin, Germany', price: '€890,000', type: 'Commercial' },
    { id: 6, name: 'Historic Townhouse', location: 'Dresden, Germany', price: '€520,000', type: 'House' },
    { id: 7, name: 'Lakefront Property', location: 'Bavaria, Germany', price: '€1,500,000', type: 'Villa' }
  ];
  
  // Filter properties based on search
  const filteredProperties = properties.filter(
    (property) => 
      property.name.toLowerCase().includes(search.toLowerCase()) ||
      property.location.toLowerCase().includes(search.toLowerCase()) ||
      property.type.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = `/property/${id}`;
    }
  };
  
  // Focus search on ctrl+f
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'f') && !isInputElement(document.activeElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Helper function to check if element is an input
  const isInputElement = (element: Element | null): boolean => {
    return element instanceof HTMLInputElement || 
           element instanceof HTMLTextAreaElement || 
           element?.getAttribute('contenteditable') === 'true';
  };

  return (
    <MainLayout contentId="properties-content">
      <SkipLinks links={[
        { id: 'properties-content', label: 'Skip to content' },
        { id: 'property-search', label: 'Skip to search' },
        { id: 'property-list', label: 'Skip to property list' }
      ]} />
      
      <div id="properties-content" tabIndex={-1}>
        <h1 className={`text-3xl font-bold mb-6 ${largeText ? 'text-4xl' : ''}`}>Properties</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6" id="property-search">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search properties..."
              value={search}
              onChange={handleSearch}
              className="pl-10"
              aria-label="Search properties"
              accessKey="s"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex gap-2 items-center"
            aria-label="Filter properties"
            accessKey="f"
          >
            <Filter size={18} aria-hidden="true" />
            <span>Filter</span>
            <span className="sr-only"> (Alt+F)</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex gap-2 items-center" 
            onClick={handleSort}
            aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
            aria-pressed={sortDirection === 'desc'}
            accessKey="o"
          >
            {sortDirection === 'asc' ? <SortAsc size={18} aria-hidden="true" /> : <SortDesc size={18} aria-hidden="true" />}
            <span>Sort</span>
            <span className="sr-only"> (Alt+O)</span>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64" aria-live="polite">
            <p>Loading properties...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8"
            id="property-list"
            role="list"
            aria-label="Properties"
          >
            {filteredProperties.map((property) => (
              <Card 
                key={property.id} 
                className={`hover:shadow-lg transition-shadow ${highContrast ? 'border-2' : ''}`}
                role="listitem"
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className={largeText ? 'text-2xl' : 'text-xl'}>{property.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-muted-foreground mb-4">{property.location}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{property.price}</p>
                    <Button 
                      asChild
                      className={`${highContrast ? 'border-2' : ''}`}
                      onKeyDown={(e) => handleKeyDown(e, property.id)}
                      aria-label={`View details for ${property.name}`}
                    >
                      <Link to={`/property/${property.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div 
            className="text-center py-10 border rounded-lg"
            aria-live="polite"
          >
            <p className="text-muted-foreground">No properties found matching your search.</p>
            <Button 
              variant="link" 
              onClick={() => setSearch('')} 
              className="mt-2"
              aria-label="Clear search"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Properties;
