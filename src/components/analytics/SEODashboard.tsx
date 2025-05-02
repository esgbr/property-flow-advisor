
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOAnalytics from './SEOAnalytics';
import AIAssistant from '../ai/AIAssistant';

const SEODashboard = () => {
  const { t } = useLanguage();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('websiteAnalytics')}</CardTitle>
            <CardDescription>{t('trackSeoAndUserMetrics')}</CardDescription>
          </div>
          <AIAssistant 
            variant="icon" 
            size="sm"
            contextData={{ pageName: 'SEO Dashboard' }}
            title={t('seoInsights')}
            description={t('getAIRecommendationsForImprovement')}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="seo">
          <TabsList className="mb-4">
            <TabsTrigger value="seo">{t('seo')}</TabsTrigger>
            <TabsTrigger value="visitors">{t('visitors')}</TabsTrigger>
            <TabsTrigger value="performance">{t('performance')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="seo">
            <SEOAnalytics />
          </TabsContent>
          
          <TabsContent value="visitors">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">{t('uniqueVisitors')}</div>
                  <div className="text-2xl font-bold">1,245</div>
                  <div className="text-xs text-green-500">+12.5% {t('fromPreviousPeriod')}</div>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">{t('pageviews')}</div>
                  <div className="text-2xl font-bold">3,827</div>
                  <div className="text-xs text-green-500">+8.2% {t('fromPreviousPeriod')}</div>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">{t('averageTimeOnSite')}</div>
                  <div className="text-2xl font-bold">4:32</div>
                  <div className="text-xs text-red-500">-1.8% {t('fromPreviousPeriod')}</div>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('trafficSources')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{t('organic')}</div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <div className="pl-4 text-sm font-medium">65%</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{t('direct')}</div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: '22%' }}></div>
                        </div>
                      </div>
                      <div className="pl-4 text-sm font-medium">22%</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{t('referral')}</div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: '8%' }}></div>
                        </div>
                      </div>
                      <div className="pl-4 text-sm font-medium">8%</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{t('social')}</div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: '5%' }}></div>
                        </div>
                      </div>
                      <div className="pl-4 text-sm font-medium">5%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('pagespeedMetrics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">{t('largestContentfulPaint')}</div>
                        <div className="text-sm text-green-500 font-medium">1.2s</div>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">{t('firstInputDelay')}</div>
                        <div className="text-sm text-green-500 font-medium">12ms</div>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">{t('cumulativeLayoutShift')}</div>
                        <div className="text-sm text-amber-500 font-medium">0.12</div>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('serverResponseTime')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">142ms</div>
                    <p className="text-sm text-muted-foreground mt-1">{t('averageResponseTime')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('resourceOptimization')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">{t('imageCompression')}:</div>
                        <div className="text-sm text-green-500">{t('optimized')}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">{t('cssMinification')}:</div>
                        <div className="text-sm text-green-500">{t('optimized')}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">{t('jsMinification')}:</div>
                        <div className="text-sm text-green-500">{t('optimized')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SEODashboard;
