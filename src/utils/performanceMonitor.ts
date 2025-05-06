/**
 * Performance monitoring utilities for application optimization
 */

// Define a type for our performance metrics
interface PerformanceMetric {
  componentName: string;
  renderTime: number;
  timestamp: Date;
  additionalData?: Record<string, any>;
}

// Setup storage for metrics
const performanceMetrics: PerformanceMetric[] = [];
const METRICS_LIMIT = 100;

/**
 * Record a component render time
 * @param componentName - The name of the component being monitored
 * @param renderTime - The time taken to render in milliseconds
 * @param additionalData - Any additional data to associate with this metric
 */
export const recordRenderTime = (
  componentName: string, 
  renderTime: number,
  additionalData?: Record<string, any>
) => {
  const metric: PerformanceMetric = {
    componentName,
    renderTime,
    timestamp: new Date(),
    additionalData
  };

  // Add to metrics array but keep size limited
  performanceMetrics.push(metric);
  if (performanceMetrics.length > METRICS_LIMIT) {
    performanceMetrics.shift();
  }
  
  // Log to console in development only
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Performance] ${componentName}: ${renderTime}ms`);
  }
};

/**
 * Get average render time for a component
 * @param componentName - The name of the component to analyze
 * @returns The average render time in milliseconds
 */
export const getAverageRenderTime = (componentName: string): number => {
  const componentMetrics = performanceMetrics.filter(
    metric => metric.componentName === componentName
  );
  
  if (componentMetrics.length === 0) return 0;
  
  const totalTime = componentMetrics.reduce(
    (sum, metric) => sum + metric.renderTime, 
    0
  );
  
  return totalTime / componentMetrics.length;
};

/**
 * Get all performance data
 * @returns All recorded performance metrics
 */
export const getAllPerformanceData = (): PerformanceMetric[] => {
  return [...performanceMetrics];
};

/**
 * Get performance summary by component
 * @returns Summary of performance data grouped by component
 */
export const getPerformanceSummary = (): Record<string, { 
  averageRenderTime: number; 
  renderCount: number;
  maxRenderTime: number;
}> => {
  const summary: Record<string, {
    averageRenderTime: number;
    renderCount: number;
    maxRenderTime: number;
    totalTime: number;
  }> = {};
  
  performanceMetrics.forEach(metric => {
    if (!summary[metric.componentName]) {
      summary[metric.componentName] = {
        averageRenderTime: 0,
        renderCount: 0,
        maxRenderTime: 0,
        totalTime: 0
      };
    }
    
    const componentData = summary[metric.componentName];
    componentData.renderCount += 1;
    componentData.totalTime += metric.renderTime;
    componentData.maxRenderTime = Math.max(
      componentData.maxRenderTime, 
      metric.renderTime
    );
  });
  
  // Calculate averages
  Object.keys(summary).forEach(component => {
    const data = summary[component];
    data.averageRenderTime = data.totalTime / data.renderCount;
    // Remove the intermediate total that we don't want to expose
    delete data.totalTime;
  });
  
  return summary;
};

/**
 * Clear all stored performance metrics
 */
export const clearPerformanceMetrics = (): void => {
  performanceMetrics.length = 0;
};

/**
 * Performance monitor hook for React components
 */
export const usePerformanceMonitoring = (componentName: string) => {
  let startTime = Date.now();
  
  const trackRender = () => {
    startTime = Date.now();
  };
  
  const endTracking = (additionalData?: Record<string, any>) => {
    const renderTime = Date.now() - startTime;
    recordRenderTime(componentName, renderTime, additionalData);
    return renderTime;
  };
  
  return {
    trackRender,
    endTracking
  };
};
