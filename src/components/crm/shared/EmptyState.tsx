
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description
}) => {
  return (
    <div className="p-8 text-center animate-fade-in">
      <div className="mx-auto w-12 h-12 mb-4 text-muted-foreground opacity-30">
        <Icon className="h-full w-full" />
      </div>
      <h3 className="mt-2 text-lg font-medium">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
