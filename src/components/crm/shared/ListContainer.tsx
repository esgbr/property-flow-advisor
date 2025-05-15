
import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ListContainerProps {
  loading: boolean;
  emptyState: ReactNode;
  children: ReactNode;
}

const ListContainer: React.FC<ListContainerProps> = ({
  loading,
  emptyState,
  children
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (React.Children.count(children) === 0) {
    return emptyState;
  }

  return (
    <div className="divide-y">
      {children}
    </div>
  );
};

export default ListContainer;
