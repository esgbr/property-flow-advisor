
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const RentalYieldMap: React.FC = () => {
  const { t } = useLanguage();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  
  // Sample neighborhood data - in a real app this would come from an API
  const neighborhoods = [
    { id: 'n1', name: 'Downtown', yield: 5.8, color: 'bg-amber-500' },
    { id: 'n2', name: 'Westside', yield: 6.4, color: 'bg-green-500' },
    { id: 'n3', name: 'Eastside', yield: 4.2, color: 'bg-red-500' },
    { id: 'n4', name: 'Northside', yield: 5.5, color: 'bg-amber-500' },
    { id: 'n5', name: 'Southside', yield: 7.1, color: 'bg-green-500' },
  ];

  const handleNeighborhoodClick = (id: string) => {
    setSelectedArea(id);
  };

  return (
    <div className="h-full w-full flex flex-col bg-card rounded-lg overflow-hidden border">
      <div className="p-4 bg-muted/30 border-b">
        <h3 className="font-medium flex items-center">
          {t('rentalYieldMap')}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-1 p-0 h-auto">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{t('rentalYieldMapExplanation')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
      </div>
      
      <div className="flex-grow p-4">
        <div className="h-full flex flex-col">
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
            <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
              {neighborhoods.map(neighborhood => (
                <div 
                  key={neighborhood.id}
                  className={`${neighborhood.color} rounded-lg shadow p-3 cursor-pointer transition-transform hover:scale-105 ${selectedArea === neighborhood.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  onClick={() => handleNeighborhoodClick(neighborhood.id)}
                >
                  <h4 className="font-medium text-white">{neighborhood.name}</h4>
                  <p className="text-white text-sm">{t('yield')}: {neighborhood.yield}%</p>
                </div>
              ))}
            </div>
            
            {!selectedArea && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <p className="text-sm bg-background/90 p-2 rounded shadow">
                  {t('clickNeighborhood')}
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
                {neighborhoods.find(n => n.id === selectedArea)?.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('averageYield')}: {neighborhoods.find(n => n.id === selectedArea)?.yield}%
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setSelectedArea(null)}>
              {t('close')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalYieldMap;
