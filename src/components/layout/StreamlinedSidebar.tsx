
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Calculator, 
  Home, 
  Settings, 
  BarChart3,
  FileText,
  BookOpen,
  Menu,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavigationGroup {
  label: string;
  icon: React.ReactNode;
  items: NavigationItem[];
  expanded?: boolean;
}

const StreamlinedSidebar: React.FC<{
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}> = ({ className, collapsed = false, onToggleCollapse }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    portfolio: true,
    tools: false,
    resources: false
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const navigationGroups: NavigationGroup[] = [
    {
      label: t('home'),
      icon: <Home className="h-5 w-5" />,
      items: [
        { label: t('dashboard'), icon: <Home className="h-4 w-4" />, path: '/dashboard' },
        { label: t('welcomePage'), icon: <Home className="h-4 w-4" />, path: '/' }
      ]
    },
    {
      label: t('portfolio'),
      icon: <Building className="h-5 w-5" />,
      items: [
        { label: t('investorDashboard'), icon: <BarChart3 className="h-4 w-4" />, path: '/investor-dashboard' },
        { label: t('properties'), icon: <Building className="h-4 w-4" />, path: '/properties' }
      ],
      expanded: true
    },
    {
      label: t('tools'),
      icon: <Calculator className="h-5 w-5" />,
      items: [
        { label: t('calculators'), icon: <Calculator className="h-4 w-4" />, path: '/calculators' },
        { label: t('decisionTools'), icon: <FileText className="h-4 w-4" />, path: '/decision' }
      ]
    },
    {
      label: t('resources'),
      icon: <BookOpen className="h-5 w-5" />,
      items: [
        { label: t('education'), icon: <BookOpen className="h-4 w-4" />, path: '/education' }
      ]
    },
    {
      label: t('settings'),
      icon: <Settings className="h-5 w-5" />,
      items: [
        { label: t('settings'), icon: <Settings className="h-4 w-4" />, path: '/settings' },
        { label: t('userProfile'), icon: <Settings className="h-4 w-4" />, path: '/user-profile' }
      ]
    }
  ];

  return (
    <aside className={cn(
      "flex flex-col bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <Building className="h-6 w-6 text-primary" />
          {!collapsed && <span className="ml-2 font-bold">PropertyFlow</span>}
        </div>
        {!collapsed && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {navigationGroups.map((group) => (
          collapsed ? (
            <Button
              key={group.label}
              variant="ghost"
              size="icon"
              className="w-full rounded-none h-12 my-1"
              onClick={() => navigate(group.items[0].path)}
            >
              {group.icon}
            </Button>
          ) : (
            <Collapsible 
              key={group.label} 
              open={openGroups[group.label.toLowerCase()]} 
              onOpenChange={() => toggleGroup(group.label.toLowerCase())}
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between rounded-none h-10"
                >
                  <div className="flex items-center">
                    {group.icon}
                    <span className="ml-2">{group.label}</span>
                  </div>
                  {openGroups[group.label.toLowerCase()] ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {group.items.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start pl-8 rounded-none h-9",
                      location.pathname === item.path && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )
        ))}
      </div>
      
      {collapsed && (
        <div className="p-2 border-t border-border">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleCollapse}
            className="w-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </aside>
  );
};

export default StreamlinedSidebar;
