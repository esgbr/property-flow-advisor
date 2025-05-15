
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useScreenReader } from '@/hooks/use-screen-reader';

interface Feature {
  id: string;
  title: { en: string; de: string };
  description: { en: string; de: string };
  path: string;
  icon?: React.ReactNode;
}

interface ConnectFeaturesCardProps {
  title: { en: string; de: string };
  description: { en: string; de: string };
  features: Feature[];
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * A card component that connects related features across the application
 * Provides a consistent way to navigate between related tools
 */
const ConnectFeaturesCard: React.FC<ConnectFeaturesCardProps> = ({
  title,
  description,
  features,
  className,
  variant = 'default'
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { announceNavigation } = useScreenReader();
  
  const handleNavigate = (path: string, featureTitle: string) => {
    announceNavigation(featureTitle);
    navigate(path);
  };
  
  const isCompact = variant === 'compact';
  
  return (
    <Card className={cn(className)}>
      <CardHeader className={cn(isCompact ? "py-3 px-4" : "")}>
        <CardTitle className={cn(isCompact ? "text-base" : "")}>
          {title[language as keyof typeof title]}
        </CardTitle>
        <CardDescription>
          {description[language as keyof typeof description]}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(isCompact ? "px-4 py-2" : "")}>
        <div className={cn(
          "grid gap-4",
          isCompact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-card border rounded-md p-3 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start mb-2">
                {feature.icon && (
                  <div className="mr-3 text-primary">{feature.icon}</div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-sm sm:text-base">
                    {feature.title[language as keyof typeof feature.title]}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground flex-1 mb-3">
                {feature.description[language as keyof typeof feature.description]}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="self-start mt-auto" 
                onClick={() => handleNavigate(feature.path, feature.title[language as keyof typeof feature.title])}
              >
                {language === 'de' ? 'Öffnen' : 'Open'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectFeaturesCard;
