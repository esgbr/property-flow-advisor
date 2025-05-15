
import { useCallback, useMemo } from 'react';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';

/**
 * Hook to analyze workflow data and generate statistics
 */
export const useWorkflowAnalytics = (workflowTypes: WorkflowType[]) => {
  // Initialize workflow hooks for each workflow type
  const workflows = useMemo(() => {
    return workflowTypes.map(type => ({
      type,
      hook: useWorkflow(type)
    }));
  }, [workflowTypes]);
  
  // Get overall statistics across all workflows
  const getOverallStatistics = useCallback(() => {
    const stats = {
      totalSteps: 0,
      completedSteps: 0,
      overallProgress: 0,
      completedWorkflows: 0,
      incompleteWorkflows: 0
    };
    
    workflows.forEach(({ hook }) => {
      const steps = hook.getStepsWithStatus();
      const completed = steps.filter(step => step.isComplete).length;
      
      stats.totalSteps += steps.length;
      stats.completedSteps += completed;
      
      // Check if workflow is complete
      if (completed === steps.length && steps.length > 0) {
        stats.completedWorkflows += 1;
      } else if (completed > 0) {
        stats.incompleteWorkflows += 1;
      }
    });
    
    // Calculate overall progress
    stats.overallProgress = stats.totalSteps > 0 
      ? Math.round((stats.completedSteps / stats.totalSteps) * 100) 
      : 0;
    
    return stats;
  }, [workflows]);
  
  // Get daily progress statistics for a date range
  const getDailyProgress = useCallback((days: number = 30) => {
    // This would typically query from a workflow history database
    // For now, we'll return mock data
    const today = new Date();
    const dailyData: { date: string; completedSteps: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      dailyData.push({
        date: date.toISOString().split('T')[0],
        completedSteps: Math.floor(Math.random() * 3) // Mock data
      });
    }
    
    return dailyData;
  }, []);
  
  // Get workflow-specific statistics
  const getWorkflowStatistics = useCallback(() => {
    return workflows.map(({ type, hook }) => {
      const steps = hook.getStepsWithStatus();
      const completed = steps.filter(step => step.isComplete).length;
      
      return {
        type,
        totalSteps: steps.length,
        completedSteps: completed,
        progress: hook.getWorkflowProgress(),
        isComplete: completed === steps.length && steps.length > 0
      };
    });
  }, [workflows]);
  
  return {
    getOverallStatistics,
    getDailyProgress,
    getWorkflowStatistics
  };
};

export default useWorkflowAnalytics;
