
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

const Properties = () => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { preferences } = useUserPreferences();
  const { highContrast, largeText } = useAccessibility();
  
  // Sample properties data - in a real app, this would come from an API
  const properties = [
    { id: 1, name: 'Riverside Apartment', location: 'Berlin, Germany', price: '€350,000', type: 'Apartment' },
    { id: 2, name: 'Mountain View Villa', location: 'Munich, Germany', price: '€780,000', type: 'Villa' },
    { id: 3, name: 'City Center Penthouse', location: 'Frankfurt, Germany', price: '€1,200,000', type: 'Penthouse' },
    { id: 4, name: 'Suburban Family Home', location: 'Hamburg, Germany', price: '€450,000', type: 'House' },
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

  return (
    <div className="container mx-auto py-6">
      <h1 className={`text-3xl font-bold mb-6 ${largeText ? 'text-4xl' : ''}`}>Properties</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={handleSearch}
            className="pl-10"
            aria-label="Search properties"
          />
        </div>
        <Button variant="outline" className="flex gap-2 items-center">
          <Filter size={18} />
          Filter
        </Button>
        <Button variant="outline" className="flex gap-2 items-center" onClick={handleSort}>
          {sortDirection === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
          Sort
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading properties...</p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card 
              key={property.id} 
              className={`hover:shadow-lg transition-shadow ${highContrast ? 'border-2' : ''}`}
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
                  >
                    <Link to={`/property/${property.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground">No properties found matching your search.</p>
          <Button 
            variant="link" 
            onClick={() => setSearch('')} 
            className="mt-2"
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
};

export default Properties;
