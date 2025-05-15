
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

export interface ConnectedFeature {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  path: string;
  icon?: React.ReactNode;
}

interface ConnectFeaturesCardProps {
  title: Record<string, string>;
  description?: Record<string, string>;
  features: ConnectedFeature[];
  className?: string;
}

const ConnectFeaturesCard: React.FC<ConnectFeaturesCardProps> = ({
  title,
  description,
  features,
  className,
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title[language] || title.en}</CardTitle>
        {description && (
          <p className="text-muted-foreground">{description[language] || description.en}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <div className="flex items-start gap-3">
                {feature.icon && (
                  <div className="mt-0.5 text-primary">{feature.icon}</div>
                )}
                <div>
                  <h4 className="font-medium">{feature.title[language] || feature.title.en}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description[language] || feature.description.en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => window.history.back()}>
          {language === 'de' ? 'Zurück' : 'Back'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectFeaturesCard;
