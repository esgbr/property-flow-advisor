
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col h-full overflow-hidden ${className}`}>
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-4 md:p-6 space-y-6 pb-20">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PageLayout;
