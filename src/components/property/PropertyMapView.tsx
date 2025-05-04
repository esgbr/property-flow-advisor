
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Map, 
  Search, 
  Home, 
  Building, 
  Plus, 
  X,
  Layers,
  Filter
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PropertyMapViewProps {
  onPropertySelect?: (propertyId: string) => void;
}

const PropertyMapView: React.FC<PropertyMapViewProps> = ({ onPropertySelect }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [mapView, setMapView] = useState<'standard' | 'satellite' | 'hybrid'>('standard');

  // Sample properties for demonstration
  const properties = [
    { id: 'prop1', name: '123 Main St', lat: 40.7128, lng: -74.0060, type: 'apartment', status: 'owned' },
    { id: 'prop2', name: '456 Elm St', lat: 40.7282, lng: -74.0776, type: 'house', status: 'prospect' },
    { id: 'prop3', name: '789 Oak Ave', lat: 40.7489, lng: -73.9680, type: 'commercial', status: 'owned' },
    { id: 'prop4', name: '101 Pine Rd', lat: 40.7112, lng: -73.9900, type: 'apartment', status: 'analyzing' },
  ];

  const propertyTypeIcons: Record<string, React.ReactNode> = {
    'apartment': <Building className="h-5 w-5" />,
    'house': <Home className="h-5 w-5" />,
    'commercial': <Building className="h-5 w-5" />,
  };

  const propertyStatusColors: Record<string, string> = {
    'owned': 'bg-green-500',
    'prospect': 'bg-blue-500',
    'analyzing': 'bg-amber-500',
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedProperty(propertyId);
    if (onPropertySelect) {
      onPropertySelect(propertyId);
    }
  };

  const filteredProperties = properties.filter(property => 
    (selectedFilter === 'all' || property.type === selectedFilter || property.status === selectedFilter) &&
    (searchQuery === '' || property.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleChangeMapView = (view: 'standard' | 'satellite' | 'hybrid') => {
    setMapView(view);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center">
            <Map className="h-5 w-5 mr-2 text-primary" />
            {t('Property Map')}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Layers className="h-4 w-4 mr-2" />
                  {mapView === 'standard' ? t('Standard') : 
                   mapView === 'satellite' ? t('Satellite') : t('Hybrid')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('Map View')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleChangeMapView('standard')}>
                  {t('Standard')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChangeMapView('satellite')}>
                  {t('Satellite')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChangeMapView('hybrid')}>
                  {t('Hybrid')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm" variant="default">
              <Plus className="h-4 w-4 mr-1" />
              {t('Add Property')}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('Search properties...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            {searchQuery && (
              <button 
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2" 
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('Filter')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{t('Property Type')}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedFilter('all')}>{t('All Properties')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('apartment')}>{t('Apartments')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('house')}>{t('Houses')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('commercial')}>{t('Commercial')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t('Status')}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedFilter('owned')}>{t('Owned')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('prospect')}>{t('Prospects')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('analyzing')}>{t('Analyzing')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="h-[400px] relative bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
          {/* This would be replaced with an actual map implementation */}
          <div className="absolute inset-0 p-4">
            <div className="text-center mb-4 text-sm text-muted-foreground">
              {mapView === 'standard' ? 'Standard Map View' : 
               mapView === 'satellite' ? 'Satellite View' : 'Hybrid View'}
            </div>
            
            {filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Map className="h-12 w-12 text-muted-foreground/40 mb-2" />
                <p className="text-muted-foreground">{t('No properties match your criteria')}</p>
                {(searchQuery || selectedFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                    }}
                  >
                    {t('Clear Filters')}
                  </Button>
                )}
              </div>
            ) : (
              // Simulated property markers on map
              filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                    selectedProperty === property.id ? 'scale-125' : 'scale-100'
                  }`}
                  style={{ 
                    top: `${((property.lat - 40.7) / 0.05) * 100}%`, 
                    left: `${((property.lng + 74) / 0.15) * 100}%`
                  }}
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full ${propertyStatusColors[property.status]} text-white flex items-center justify-center shadow-lg`}
                    >
                      {propertyTypeIcons[property.type]}
                    </div>
                    {selectedProperty === property.id && (
                      <div className="mt-1 bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
                        {property.name}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {filteredProperties.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">{t('Properties')} ({filteredProperties.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filteredProperties.map(property => (
                <Button
                  key={property.id}
                  variant={selectedProperty === property.id ? "default" : "outline"}
                  size="sm"
                  className="justify-start text-xs h-auto py-1.5"
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <span className={`w-2 h-2 rounded-full ${propertyStatusColors[property.status]} mr-2`}></span>
                  {property.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyMapView;
