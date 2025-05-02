
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

// Sample SEO data
const visitorsData = [
  { name: '1', visitors: 120 },
  { name: '2', visitors: 140 },
  { name: '3', visitors: 130 },
  { name: '4', visitors: 170 },
  { name: '5', visitors: 160 },
  { name: '6', visitors: 190 },
  { name: '7', visitors: 210 },
  { name: '8', visitors: 230 },
  { name: '9', visitors: 200 },
  { name: '10', visitors: 240 },
  { name: '11', visitors: 220 },
  { name: '12', visitors: 250 },
  { name: '13', visitors: 280 },
  { name: '14', visitors: 260 },
];

const keywordsData = [
  { keyword: 'real estate investment', position: 5, change: 2 },
  { keyword: 'property analysis tools', position: 12, change: -3 },
  { keyword: 'rental property calculator', position: 8, change: 1 },
  { keyword: 'real estate roi', position: 15, change: 0 },
  { keyword: 'property management app', position: 23, change: 5 },
];

const SEOAnalytics: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useLanguage();
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('seoAnalytics')}</CardTitle>
        <CardDescription>{t('monitorYourWebsitePerformance')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{t('websiteVisitors')}</h3>
            <p className="text-sm text-muted-foreground">{t('last14DaysVisitors')}</p>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{t('keywordRankings')}</h3>
            <p className="text-sm text-muted-foreground">{t('topKeywordsAndPositions')}</p>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('keyword')}</TableHead>
                  <TableHead className="w-24">{t('position')}</TableHead>
                  <TableHead className="w-24 text-right">{t('change')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywordsData.map((keyword) => (
                  <TableRow key={keyword.keyword}>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                    <TableCell>{keyword.position}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {keyword.change > 0 ? (
                          <>
                            <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">{keyword.change}</span>
                          </>
                        ) : keyword.change < 0 ? (
                          <>
                            <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                            <span className="text-red-500">{Math.abs(keyword.change)}</span>
                          </>
                        ) : (
                          <>
                            <MinusIcon className="mr-1 h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">0</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">{t('averageSessionDuration')}</div>
              <div className="text-2xl font-bold">2:35</div>
            </div>
            
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">{t('bounceRate')}</div>
              <div className="text-2xl font-bold">42.3%</div>
            </div>
            
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">{t('organicTraffic')}</div>
              <div className="text-2xl font-bold">68%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOAnalytics;
