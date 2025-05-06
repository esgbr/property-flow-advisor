
import React from 'react';
import { useMarketFilter, FeatureMarketConfig } from '@/hooks/use-market-filter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MarketSpecificFeaturesProps {
  features?: FeatureMarketConfig[];
  showTitle?: boolean;
  limit?: number;
  showViewAll?: boolean;
  viewAllPath?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'grid';
  title?: string;
  description?: string;
}

const MarketSpecificFeatures: React.FC<MarketSpecificFeaturesProps> = ({
  features = [],
  showTitle = true,
  limit = 4,
  showViewAll = false,
  viewAllPath = '/tools',
  className,
  variant = 'default',
  title,
  description
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { shouldShowFeature, userMarket, getLocalizedMarketName } = useMarketFilter();
  
  // Filter features based on user's market
  const filteredFeatures = features
    .filter(shouldShowFeature)
    .slice(0, limit);
  
  // If no features match the market, don't render anything
  if (filteredFeatures.length === 0) {
    return null;
  }
  
  const defaultTitle = language === 'de' 
    ? `Tools für ${getLocalizedMarketName()}`
    : `Tools for ${getLocalizedMarketName()}`;
  
  const defaultDescription = language === 'de'
    ? 'Spezialisierte Tools für Ihren ausgewählten Markt'
    : 'Specialized tools for your selected market';
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className={className}>
      {showTitle && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            {title || defaultTitle}
          </h2>
          {description && (
            <p className="text-muted-foreground mt-1">
              {description || defaultDescription}
            </p>
          )}
        </div>
      )}
      
      <div className={cn(
        "grid gap-4",
        variant === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "",
        variant === 'compact' ? "grid-cols-1" : ""
      )}>
        {filteredFeatures.map((feature) => (
          <Card 
            key={feature.id} 
            className={cn(
              "transition-all hover:shadow-md cursor-pointer",
              variant === 'compact' ? "border-l-4 border-l-primary" : ""
            )}
            onClick={() => feature.path && handleNavigate(feature.path)}
          >
            <CardHeader className={variant === 'compact' ? "p-3" : ""}>
              <div className="flex items-center">
                {feature.icon && (
                  <div className="mr-2 text-primary">
                    {feature.icon}
                  </div>
                )}
                <CardTitle className={variant === 'compact' ? "text-base" : ""}>
                  {feature.title || feature.id}
                </CardTitle>
              </div>
              {feature.description && (
                <CardDescription>
                  {feature.description}
                </CardDescription>
              )}
            </CardHeader>
            
            {variant !== 'compact' && (
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto group"
                >
                  {language === 'de' ? 'Öffnen' : 'Open'}
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
      
      {showViewAll && filteredFeatures.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(viewAllPath)}
            className="group"
          >
            {language === 'de' ? 'Alle Tools anzeigen' : 'View all tools'}
            <ExternalLink className="ml-1 h-4 w-4 group-hover:rotate-45 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MarketSpecificFeatures;
