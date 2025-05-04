
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, Clock } from 'lucide-react';

interface PortfolioGoalsProps {
  onEditGoals: (action: string) => void;
}

const PortfolioGoals: React.FC<PortfolioGoalsProps> = ({ onEditGoals }) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'current' | 'timeline'>('current');

  // Sample projected growth data (would come from user settings in a real app)
  const projectedGrowth = {
    oneYear: {
      cashflow: 18000,
      equity: 1050000,
      properties: 7
    },
    threeYear: {
      cashflow: 35000,
      equity: 1800000,
      properties: 12
    },
    fiveYear: {
      cashflow: 60000,
      equity: 2500000,
      properties: 18
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">{t('investmentGoals')}</div>
          <div className="flex items-center gap-2">
            <Tabs defaultValue="current" className="w-auto">
              <TabsList className="grid grid-cols-2 h-8">
                <TabsTrigger 
                  value="current" 
                  className="text-xs px-2 py-0 h-7"
                  onClick={() => setViewMode('current')}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {t('current')}
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline" 
                  className="text-xs px-2 py-0 h-7"
                  onClick={() => setViewMode('timeline')}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {t('timeline')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={() => onEditGoals(t('editGoals'))}>{t('edit')}</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {viewMode === 'current' ? (
          <>
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">{t('cashflowGoal')}</div>
                <div className="text-sm">€15,000 / €25,000</div>
              </div>
              <Progress value={60} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+12.5%</span>
                <span className="ml-1">{t('fromLastQuarter')}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">{t('equityTarget')}</div>
                <div className="text-sm">€950,000 / €1,500,000</div>
              </div>
              <Progress value={63} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+8.3%</span>
                <span className="ml-1">{t('fromLastQuarter')}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">{t('totalPropertiesGoal')}</div>
                <div className="text-sm">6 / 10</div>
              </div>
              <Progress value={60} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 mr-1 inline-block" />
                {t('nextAcquisitionEstimate')}: Q3 2025
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">{t('passiveIncomeGoal')}</div>
                <div className="text-sm">€10,000 / €20,000</div>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">{t('oneYearProjection')}</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{t('monthlyCashflow')}</span>
                    <span>€18,000</span>
                  </div>
                  <Progress value={72} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{t('portfolioEquity')}</span>
                    <span>€1,050,000</span>
                  </div>
                  <Progress value={70} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{t('totalProperties')}</span>
                    <span>7</span>
                  </div>
                  <Progress value={70} className="h-1.5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">{t('threeYearProjection')}</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{t('monthlyCashflow')}</span>
                    <span>€35,000</span>
                  </div>
                  <Progress value={35 / 0.6} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{t('portfolioEquity')}</span>
                    <span>€1,800,000</span>
                  </div>
                  <Progress value={1800000 / 25000} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{t('totalProperties')}</span>
                    <span>12</span>
                  </div>
                  <Progress value={12 / 0.18} className="h-1.5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">{t('fiveYearProjection')}</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{t('monthlyCashflow')}</span>
                    <span>€60,000</span>
                  </div>
                  <Progress value={60 / 0.6} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{t('portfolioEquity')}</span>
                    <span>€2,500,000</span>
                  </div>
                  <Progress value={2500000 / 30000} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>{t('totalProperties')}</span>
                    <span>18</span>
                  </div>
                  <Progress value={18 / 0.2} className="h-1.5" />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioGoals;
