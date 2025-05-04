
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  markets: InvestmentMarket[];
}

interface FeatureGridProps {
  features: Feature[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  const { t } = useLanguage();

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">{t('Key Features')}</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={feature.id} className="border shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <div className="mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={feature.action}>
                {t('Explore')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
