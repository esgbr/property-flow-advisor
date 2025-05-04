
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import StreamlinedSidebar from './StreamlinedSidebar';

interface SidebarControllerProps {
  children: React.ReactNode;
}

const SidebarController: React.FC<SidebarControllerProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  
  useEffect(() => {
    // Automatically collapse sidebar on mobile
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <StreamlinedSidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SidebarController;
