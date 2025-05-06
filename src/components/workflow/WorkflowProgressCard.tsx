
import React from 'react';
import { WorkflowType } from '@/hooks/use-workflow';

export interface WorkflowProgressCardProps {
  workflowType: WorkflowType;
  className?: string;
  showProgress?: boolean;
  currentStep?: string;
}

const WorkflowProgressCard: React.FC<WorkflowProgressCardProps> = ({
  workflowType,
  className = '',
  showProgress = true,
  currentStep
}) => {
  // Component implementation
  return (
    <div className={className}>
      {/* Component content */}
      <p>Workflow Progress for {workflowType} - {currentStep}</p>
      {showProgress && <div>Progress indicator</div>}
    </div>
  );
};

export default WorkflowProgressCard;
