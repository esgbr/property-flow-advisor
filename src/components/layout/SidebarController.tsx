
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import StreamlinedSidebar from './StreamlinedSidebar';
import { useLocation } from 'react-router-dom';

interface SidebarControllerProps {
  children: React.ReactNode;
}

const SidebarController: React.FC<SidebarControllerProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  
  // Automatically collapse sidebar on mobile or route change
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, location.pathname]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <StreamlinedSidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      <div className="flex flex-col flex-grow overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SidebarController;
