
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, TrendingUp, Map, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MarketAnalysisTools: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="h-5 w-5 mr-2" />
          {t('marketAnalysis')}
        </CardTitle>
        <CardDescription>{t('researchMarketsAndIdentifyOpportunities')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends">
          <TabsList className="mb-6 grid grid-cols-3">
            <TabsTrigger value="trends">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('marketTrends')}
            </TabsTrigger>
            <TabsTrigger value="neighborhood">
              <Map className="h-4 w-4 mr-2" />
              {t('neighborhoodAnalysis')}
            </TabsTrigger>
            <TabsTrigger value="demographics">
              <Users className="h-4 w-4 mr-2" />
              {t('demographics')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">{t('medianHomePrice')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€320,500</div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" /> +5.2% {t('yearOverYear')}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">{t('medianRent')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€1,450</div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" /> +3.8% {t('yearOverYear')}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">{t('priceToRentRatio')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18.4</div>
                    <div className="flex items-center text-xs text-amber-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" /> +1.2% {t('yearOverYear')}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">{t('averageCapRate')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5.8%</div>
                    <div className="flex items-center text-xs text-red-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" /> -0.3% {t('yearOverYear')}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle>{t('marketTrendsChart')}</CardTitle>
                  <CardDescription>{t('propertyValuesTrendLast5Years')}</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">{t('upgradeToAccessDetailedMarketData')}</p>
                    <Button className="mt-4" size="sm">
                      {t('unlockMarketData')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle>{t('inventoryLevels')}</CardTitle>
                    <CardDescription>{t('availablePropertiesOnMarket')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">847</div>
                        <div className="text-sm text-muted-foreground">{t('listedProperties')}</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">2.4</div>
                        <div className="text-sm text-muted-foreground">{t('monthsOfInventory')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle>{t('absorptionRate')}</CardTitle>
                    <CardDescription>{t('marketActivityMetric')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">42%</div>
                        <div className="text-sm text-muted-foreground">{t('absorptionRate')}</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">28</div>
                        <div className="text-sm text-muted-foreground">{t('medianDaysOnMarket')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="neighborhood">
            <div className="h-96 flex items-center justify-center border rounded-lg bg-muted/20">
              <div className="text-center">
                <Map className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">{t('neighborhoodAnalysis')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('accessDetailedNeighborhoodData')}</p>
                <Button>
                  {t('unlockNeighborhoodData')}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="demographics">
            <div className="h-96 flex items-center justify-center border rounded-lg bg-muted/20">
              <div className="text-center">
                <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">{t('demographicData')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('accessDemographicInsights')}</p>
                <Button>
                  {t('unlockDemographicData')}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketAnalysisTools;
