
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

// Sample neighborhood data
const neighborhoods = [
  {
    name: 'Downtown',
    rentalYield: 5.8,
    priceGrowth: 4.2,
    occupancy: 96,
    score: 87,
    risk: 'medium'
  },
  {
    name: 'Westside',
    rentalYield: 6.2,
    priceGrowth: 3.5,
    occupancy: 98,
    score: 92,
    risk: 'low'
  },
  {
    name: 'Northpark',
    rentalYield: 7.1,
    priceGrowth: 2.8,
    occupancy: 95,
    score: 84,
    risk: 'medium'
  },
  {
    name: 'Riverside',
    rentalYield: 6.7,
    priceGrowth: 5.1,
    occupancy: 97,
    score: 90,
    risk: 'low'
  },
  {
    name: 'Eastville',
    rentalYield: 7.5,
    priceGrowth: 1.9,
    occupancy: 94,
    score: 79,
    risk: 'high'
  }
];

const NeighborhoodScorecard: React.FC = () => {
  const { t } = useLanguage();

  // Function to determine risk color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-amber-500';
      case 'high':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t('neighborhoodScorecard')}</CardTitle>
        <CardDescription>{t('topPerformingAreas')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('neighborhood')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('rentalYield')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('priceGrowth')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('occupancy')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('investorScore')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('risk')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('action')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {neighborhoods.map((neighborhood, index) => (
                <tr key={index} className="hover:bg-muted/50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {neighborhood.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {neighborhood.rentalYield}%
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {neighborhood.priceGrowth}%
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {neighborhood.occupancy}%
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="w-full bg-muted rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${neighborhood.score}%` }}
                        ></div>
                      </div>
                      <span>{neighborhood.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={getRiskColor(neighborhood.risk)}>
                      {neighborhood.risk}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <Button variant="outline" size="sm">
                      {t('details')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default NeighborhoodScorecard;
