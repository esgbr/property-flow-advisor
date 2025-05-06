
import { useState, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { captureException } from '@/utils/errorTracking';

// Define property performance metrics types
export interface PropertyPerformanceMetrics {
  roi: number;
  cashFlow: number;
  appreciation: number;
  netOperatingIncome: number;
  capRate: number;
  cashOnCash: number;
  grossRentalYield: number;
  netRentalYield: number;
  occupancyRate: number;
  vacancyRate: number;
  debtServiceCoverageRatio: number;
  expenseRatio: number;
  breakEvenRatio: number;
  totalReturnOnInvestment: number;
}

export interface PropertyTrend {
  period: string;
  value: number;
}

export interface PropertyPerformance {
  propertyId: string;
  metrics: PropertyPerformanceMetrics;
  historicalData: {
    cashFlow: PropertyTrend[];
    appreciation: PropertyTrend[];
    occupancy: PropertyTrend[];
  };
  lastUpdated: Date;
}

/**
 * Hook for tracking and analyzing property performance
 */
export function usePropertyPerformance(propertyId?: string) {
  const { preferences } = useUserPreferences();
  const { language } = useLanguage();
  const [performance, setPerformance] = useState<PropertyPerformance | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metricTargets, setMetricTargets] = useState<Partial<PropertyPerformanceMetrics>>({
    roi: 7.5,
    cashFlow: 500,
    netRentalYield: 5,
    occupancyRate: 95
  });

  // Fetch performance data for a specific property or portfolio
  const fetchPerformanceData = async (id?: string) => {
    if (!id && !propertyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // Mock data for demonstration purposes
      const mockData: PropertyPerformance = {
        propertyId: id || propertyId || '',
        metrics: {
          roi: 8.2,
          cashFlow: 750,
          appreciation: 5.4,
          netOperatingIncome: 32000,
          capRate: 6.8,
          cashOnCash: 7.9,
          grossRentalYield: 8.5,
          netRentalYield: 6.2,
          occupancyRate: 97,
          vacancyRate: 3,
          debtServiceCoverageRatio: 1.75,
          expenseRatio: 35,
          breakEvenRatio: 65,
          totalReturnOnInvestment: 13.6,
        },
        historicalData: {
          cashFlow: generateHistoricalData(12, 600, 900),
          appreciation: generateHistoricalData(12, 2, 7),
          occupancy: generateHistoricalData(12, 90, 98)
        },
        lastUpdated: new Date()
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPerformance(mockData);
    } catch (err) {
      setError('Failed to fetch property performance data');
      captureException(err instanceof Error ? err : new Error('Unknown error in fetchPerformanceData'));
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to generate mock historical data
  function generateHistoricalData(months: number, min: number, max: number): PropertyTrend[] {
    const data: PropertyTrend[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      
      data.push({
        period: formatDate(date),
        value: min + Math.random() * (max - min)
      });
    }
    
    return data;
  }
  
  // Format date based on locale
  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    return date.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', options);
  }
  
  // Update metric targets
  const updateMetricTarget = (metric: keyof PropertyPerformanceMetrics, value: number) => {
    setMetricTargets(prev => ({
      ...prev,
      [metric]: value
    }));
  };
  
  // Calculate performance against targets
  const getMetricPerformance = (metric: keyof PropertyPerformanceMetrics): {
    status: 'overperforming' | 'on-target' | 'underperforming';
    difference: number;
    percentageDifference: number;
  } => {
    if (!performance || !metricTargets[metric]) {
      return { 
        status: 'on-target', 
        difference: 0, 
        percentageDifference: 0 
      };
    }
    
    const actual = performance.metrics[metric];
    const target = metricTargets[metric] as number;
    const difference = actual - target;
    const percentageDifference = (difference / target) * 100;
    
    let status: 'overperforming' | 'on-target' | 'underperforming';
    
    if (percentageDifference > 5) {
      status = 'overperforming';
    } else if (percentageDifference < -5) {
      status = 'underperforming';
    } else {
      status = 'on-target';
    }
    
    return { status, difference, percentageDifference };
  };
  
  // Calculate trends from historical data
  const calculateTrend = (data: PropertyTrend[]): {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  } => {
    if (!data || data.length < 2) {
      return { trend: 'stable', percentage: 0 };
    }
    
    const first = data[0].value;
    const last = data[data.length - 1].value;
    const change = last - first;
    const percentage = (change / first) * 100;
    
    let trend: 'up' | 'down' | 'stable';
    
    if (percentage > 2) {
      trend = 'up';
    } else if (percentage < -2) {
      trend = 'down';
    } else {
      trend = 'stable';
    }
    
    return { trend, percentage: Math.abs(percentage) };
  };
  
  // Get overall property rating (1-10)
  const getOverallRating = (): number => {
    if (!performance) return 0;
    
    const { metrics } = performance;
    
    // Calculate weighted score based on key metrics
    const weightedSum = (
      metrics.cashOnCash * 0.25 +
      metrics.occupancyRate * 0.2 +
      metrics.netRentalYield * 0.2 +
      (metrics.appreciation > 0 ? metrics.appreciation * 0.15 : 0) +
      metrics.debtServiceCoverageRatio * 0.2
    );
    
    // Convert to 1-10 scale
    const normalizedScore = Math.min(
      10, 
      Math.max(
        1, 
        (weightedSum / 20) * 10
      )
    );
    
    return parseFloat(normalizedScore.toFixed(1));
  };
  
  // Initial fetch when propertyId changes
  useEffect(() => {
    if (propertyId) {
      fetchPerformanceData(propertyId);
    }
  }, [propertyId]);
  
  return {
    performance,
    loading,
    error,
    metricTargets,
    fetchPerformanceData,
    updateMetricTarget,
    getMetricPerformance,
    calculateTrend,
    getOverallRating
  };
}
