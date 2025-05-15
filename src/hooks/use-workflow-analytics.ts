
import { useMemo } from 'react';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { workflowDefinitions, WorkflowType } from '@/data/workflow-definitions';

/**
 * Hook for analyzing workflow usage and statistics
 */
export function useWorkflowAnalytics(workflowTypes: WorkflowType[] = ['steuer', 'immobilien', 'finanzierung', 'analyse']) {
  const { workflows } = useWorkflowState();
  
  // Calculate statistics for individual workflows
  const getWorkflowStatistics = (workflowType: WorkflowType) => {
    const workflowId = `workflow_${workflowType}`;
    const workflow = workflows[workflowId];
    const { steps } = workflowDefinitions[workflowType];
    
    // Default values if workflow doesn't exist
    if (!workflow || !workflow.completedSteps) {
      return {
        workflowType,
        totalSteps: steps.length,
        completedSteps: 0,
        progress: 0,
        isStarted: false,
        isCompleted: false,
        startedAt: null,
        lastInteractionAt: null,
        currentStepId: null
      };
    }
    
    const completedCount = workflow.completedSteps.length;
    const progress = Math.round((completedCount / steps.length) * 100);
    const isCompleted = completedCount === steps.length;
    
    return {
      workflowType,
      totalSteps: steps.length,
      completedSteps: completedCount,
      progress,
      isStarted: completedCount > 0,
      isCompleted,
      startedAt: workflow.startedAt,
      lastInteractionAt: workflow.lastInteractionAt,
      currentStepId: workflow.currentStep
    };
  };
  
  // Calculate overall statistics for all workflows
  const getOverallStatistics = () => {
    const stats = workflowTypes.map(getWorkflowStatistics);
    
    const totalSteps = stats.reduce((acc, curr) => acc + curr.totalSteps, 0);
    const totalCompleted = stats.reduce((acc, curr) => acc + curr.completedSteps, 0);
    const startedWorkflows = stats.filter(s => s.isStarted).length;
    const completedWorkflows = stats.filter(s => s.isCompleted).length;
    const incompleteWorkflows = stats.filter(s => s.isStarted && !s.isCompleted).length;
    
    return {
      totalSteps,
      totalCompleted,
      overallProgress: totalSteps ? Math.round((totalCompleted / totalSteps) * 100) : 0,
      startedWorkflows,
      completedWorkflows,
      incompleteWorkflows
    };
  };
  
  // Get recommended next workflows based on current progress
  const getRecommendedWorkflows = () => {
    const stats = workflowTypes.map(getWorkflowStatistics);
    
    // Find workflows with some progress but not completed
    const inProgress = stats.filter(s => s.isStarted && !s.isCompleted)
      .sort((a, b) => b.progress - a.progress); // Sort by progress (highest first)
    
    // Find workflows not started yet
    const notStarted = stats.filter(s => !s.isStarted);
    
    return {
      continueWorkflows: inProgress.slice(0, 2), // Top 2 in-progress workflows
      startWorkflows: notStarted.slice(0, 2)     // Suggest 2 new workflows
    };
  };
  
  return {
    getWorkflowStatistics,
    getOverallStatistics,
    getRecommendedWorkflows,
    // Individual statistics for easy access
    workflowStats: useMemo(() => 
      Object.fromEntries(
        workflowTypes.map(type => [type, getWorkflowStatistics(type)])
      ), 
    [workflows, workflowTypes])
  };
}

export default useWorkflowAnalytics;
