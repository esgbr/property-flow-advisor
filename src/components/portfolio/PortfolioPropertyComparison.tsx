
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart, Building, Calendar, DollarSign, Percent, TrendingDown, TrendingUp } from 'lucide-react';
import { usePropertyPerformance } from '@/hooks/use-property-performance';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample property data
const sampleProperties = [
  { id: 'prop1', name: 'City Apartment', type: 'apartment', location: 'Berlin', purchaseDate: '2022-05-15', purchasePrice: 350000 },
  { id: 'prop2', name: 'Suburban House', type: 'house', location: 'Munich', purchaseDate: '2021-08-22', purchasePrice: 620000 },
  { id: 'prop3', name: 'Commercial Office', type: 'commercial', location: 'Frankfurt', purchaseDate: '2023-01-30', purchasePrice: 890000 },
  { id: 'prop4', name: 'Vacation Rental', type: 'house', location: 'Hamburg', purchaseDate: '2022-11-12', purchasePrice: 480000 },
];

interface PropertyMetricProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const PropertyMetric: React.FC<PropertyMetricProps> = ({ label, value, trend, trendValue }) => {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center">
        <p className="text-xl font-medium">{value}</p>
        {trend && (
          <span className={`ml-2 flex items-center text-xs ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
            {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
};

const PortfolioPropertyComparison: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedProperties, setSelectedProperties] = useState<string[]>(['prop1', 'prop2']);
  const [comparisonMetric, setComparisonMetric] = useState<string>('roi');
  
  const { performance: prop1Performance } = usePropertyPerformance('prop1');
  const { performance: prop2Performance } = usePropertyPerformance('prop2');
  const { performance: prop3Performance } = usePropertyPerformance('prop3');
  const { performance: prop4Performance } = usePropertyPerformance('prop4');
  
  // Map property IDs to performance data
  const propertyPerformanceMap = useMemo(() => ({
    'prop1': prop1Performance,
    'prop2': prop2Performance,
    'prop3': prop3Performance,
    'prop4': prop4Performance
  }), [prop1Performance, prop2Performance, prop3Performance, prop4Performance]);
  
  // Filter properties that are selected
  const filteredProperties = useMemo(() => 
    sampleProperties.filter(prop => selectedProperties.includes(prop.id)),
    [selectedProperties]
  );
  
  // Toggle property selection
  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };
  
  // Get localized metric name
  const getMetricName = (metricKey: string): string => {
    const metricNames: Record<string, Record<string, string>> = {
      'roi': { en: 'Return on Investment', de: 'Kapitalrendite' },
      'cashFlow': { en: 'Monthly Cash Flow', de: 'Monatlicher Cashflow' },
      'appreciation': { en: 'Annual Appreciation', de: 'Jährliche Wertsteigerung' },
      'capRate': { en: 'Cap Rate', de: 'Kapitalisierungsrate' },
      'cashOnCash': { en: 'Cash on Cash Return', de: 'Cash-on-Cash-Rendite' },
      'netRentalYield': { en: 'Net Rental Yield', de: 'Netto-Mietrendite' },
      'occupancyRate': { en: 'Occupancy Rate', de: 'Belegungsrate' },
      'debtServiceCoverageRatio': { en: 'DSCR', de: 'Schuldendienstdeckungsgrad' }
    };
    
    return metricNames[metricKey]?.[language === 'de' ? 'de' : 'en'] || metricKey;
  };
  
  // Format value based on metric type
  const formatMetricValue = (value: number | undefined, metricKey: string): string => {
    if (value === undefined) return '-';
    
    switch (metricKey) {
      case 'cashFlow':
        return `€${value.toLocaleString()}`;
      case 'roi':
      case 'appreciation':
      case 'capRate':
      case 'cashOnCash':
      case 'netRentalYield':
        return `${value.toFixed(2)}%`;
      case 'occupancyRate':
        return `${value.toFixed(1)}%`;
      case 'debtServiceCoverageRatio':
        return value.toFixed(2);
      default:
        return value.toString();
    }
  };
  
  // Get performance class based on metric
  const getPerformanceClass = (value: number | undefined, metricKey: string): string => {
    if (value === undefined) return '';
    
    const thresholds: Record<string, [number, number]> = {
      'roi': [5, 8],
      'cashFlow': [300, 700],
      'appreciation': [3, 5],
      'capRate': [4, 7],
      'cashOnCash': [6, 8],
      'netRentalYield': [4, 6],
      'occupancyRate': [90, 95],
      'debtServiceCoverageRatio': [1.25, 1.5]
    };
    
    const [low, high] = thresholds[metricKey] || [0, 0];
    
    if (value >= high) return 'text-green-500 font-medium';
    if (value >= low) return 'text-amber-500';
    return 'text-red-500';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('propertyComparison')}</CardTitle>
        <CardDescription>{t('compareYourProperties')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">
              <BarChart className="h-4 w-4 mr-2" />
              {t('metrics')}
            </TabsTrigger>
            <TabsTrigger value="details">
              <Building className="h-4 w-4 mr-2" />
              {t('details')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">{t('selectProperties')}</label>
                <div className="flex flex-wrap gap-2">
                  {sampleProperties.map(property => (
                    <Badge 
                      key={property.id}
                      variant={selectedProperties.includes(property.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePropertySelection(property.id)}
                    >
                      {property.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">{t('compareBy')}</label>
                <Select value={comparisonMetric} onValueChange={setComparisonMetric}>
                  <SelectTrigger className="w-full md:w-[240px]">
                    <SelectValue placeholder={t('selectMetric')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roi">{getMetricName('roi')}</SelectItem>
                    <SelectItem value="cashFlow">{getMetricName('cashFlow')}</SelectItem>
                    <SelectItem value="appreciation">{getMetricName('appreciation')}</SelectItem>
                    <SelectItem value="capRate">{getMetricName('capRate')}</SelectItem>
                    <SelectItem value="cashOnCash">{getMetricName('cashOnCash')}</SelectItem>
                    <SelectItem value="netRentalYield">{getMetricName('netRentalYield')}</SelectItem>
                    <SelectItem value="occupancyRate">{getMetricName('occupancyRate')}</SelectItem>
                    <SelectItem value="debtServiceCoverageRatio">{getMetricName('debtServiceCoverageRatio')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Comparison Chart */}
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-4">{getMetricName(comparisonMetric)} {t('comparison')}</h3>
                {filteredProperties.map(property => {
                  const performanceData = propertyPerformanceMap[property.id];
                  const metricValue = performanceData?.metrics[comparisonMetric as keyof typeof performanceData.metrics];
                  
                  // Calculate max value for visualization (20% above max value)
                  const maxValue = Math.max(
                    ...filteredProperties
                      .map(p => propertyPerformanceMap[p.id]?.metrics[comparisonMetric as keyof typeof performanceData.metrics] || 0)
                  ) * 1.2;
                  
                  const progressPercentage = metricValue !== undefined ? (metricValue / maxValue) * 100 : 0;
                  
                  return (
                    <div key={property.id} className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{property.name}</div>
                        <div className={getPerformanceClass(metricValue, comparisonMetric)}>
                          {formatMetricValue(metricValue, comparisonMetric)}
                        </div>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <Table>
              <TableCaption>{t('propertyComparisonDetails')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('property')}</TableHead>
                  <TableHead>{t('location')}</TableHead>
                  <TableHead>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {t('purchased')}
                    </span>
                  </TableHead>
                  <TableHead>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {t('price')}
                    </span>
                  </TableHead>
                  <TableHead>
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {t('roi')}
                    </span>
                  </TableHead>
                  <TableHead>
                    <span className="flex items-center">
                      <Percent className="h-4 w-4 mr-1" />
                      {t('occupancy')}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map(property => {
                  const performanceData = propertyPerformanceMap[property.id];
                  
                  return (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{new Date(property.purchaseDate).toLocaleDateString(
                        language === 'de' ? 'de-DE' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}</TableCell>
                      <TableCell>€{property.purchasePrice.toLocaleString()}</TableCell>
                      <TableCell className={getPerformanceClass(
                        performanceData?.metrics.roi, 'roi'
                      )}>
                        {formatMetricValue(performanceData?.metrics.roi, 'roi')}
                      </TableCell>
                      <TableCell className={getPerformanceClass(
                        performanceData?.metrics.occupancyRate, 'occupancyRate'
                      )}>
                        {formatMetricValue(performanceData?.metrics.occupancyRate, 'occupancyRate')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PortfolioPropertyComparison;
