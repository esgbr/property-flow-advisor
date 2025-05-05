
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
  ChevronDown,
  Euro,
  Globe,
  User,
  PieChart,
  LayoutDashboard,
  Search
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAccessibility } from '../accessibility/A11yProvider';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  highlight?: boolean;
  badge?: string;
}

interface NavigationGroup {
  label: string;
  icon: React.ReactNode;
  items: NavigationItem[];
  expanded?: boolean;
}

const UnifiedNavigation: React.FC<{
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}> = ({ className, collapsed = false, onToggleCollapse }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { highContrast, largeText } = useAccessibility();
  const { preferences } = useUserPreferences();
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    main: true,
    portfolio: true,
    tools: false,
    market: false,
    account: false
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Simplified navigation structure with merged items
  const navigationGroups: NavigationGroup[] = [
    {
      label: t('main'),
      icon: <LayoutDashboard className="h-5 w-5" />,
      items: [
        { label: t('dashboard'), icon: <Home className="h-4 w-4" />, path: '/dashboard', highlight: true },
        { label: t('welcomePage'), icon: <Globe className="h-4 w-4" />, path: '/' }
      ],
      expanded: true
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
        { label: t('portfolioOptimization'), icon: <PieChart className="h-4 w-4" />, path: '/portfolio-optimization', badge: 'new' },
        { label: t('marketExplorer'), icon: <Search className="h-4 w-4" />, path: '/market-explorer' }
      ]
    },
    {
      label: language === 'de' ? 'Markt' : 'Market',
      icon: <Globe className="h-5 w-5" />,
      items: [
        { label: language === 'de' ? 'Deutsche Tools' : 'German Tools', 
          icon: <Euro className="h-4 w-4" />, 
          path: '/deutsche-immobilien-tools' 
        },
        { label: language === 'en' ? 'US Tools' : 'US Tools', 
          icon: <Calculator className="h-4 w-4" />, 
          path: '/us-real-estate-tools' 
        },
      ]
    },
    {
      label: t('account'),
      icon: <User className="h-5 w-5" />,
      items: [
        { label: t('settings'), icon: <Settings className="h-4 w-4" />, path: '/settings' },
        { label: t('education'), icon: <BookOpen className="h-4 w-4" />, path: '/education' }
      ]
    }
  ];

  return (
    <aside className={cn(
      "flex flex-col bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      highContrast ? "border-2" : "",
      className
    )}>
      <div className={cn(
        "p-4 flex items-center justify-between border-b border-border",
        highContrast ? "border-b-2" : ""
      )}>
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <Building className="h-6 w-6 text-primary" />
          {!collapsed && <span className={cn("ml-2 font-bold", largeText ? "text-lg" : "")}>PropertyFlow</span>}
        </div>
        {!collapsed && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} aria-label={t('collapseSidebar')}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {navigationGroups.map((group) => (
          collapsed ? (
            <TooltipProvider key={group.label} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full rounded-none h-12 my-1",
                      largeText ? "h-14" : ""
                    )}
                    onClick={() => navigate(group.items[0].path)}
                    aria-label={group.label}
                  >
                    {group.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {group.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Collapsible 
              key={group.label} 
              open={openGroups[group.label.toLowerCase()]} 
              onOpenChange={() => toggleGroup(group.label.toLowerCase())}
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-between rounded-none",
                    largeText ? "h-12 text-lg" : "h-10"
                  )}
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
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path.split('?')[0] || 
                                  (location.pathname.includes(item.path.split('?')[0]) && item.path.includes('?'));
                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start pl-8 rounded-none",
                        isActive && "bg-accent text-accent-foreground",
                        item.highlight && "text-primary font-medium",
                        largeText ? "h-11 text-base" : "h-9 text-sm"
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      {item.icon}
                      <span className="ml-2 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          )
        ))}
      </div>
      
      {collapsed && (
        <div className={cn(
          "p-2 border-t border-border",
          highContrast ? "border-t-2" : ""
        )}>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleCollapse}
            className="w-full"
            aria-label={t('expandSidebar')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {!collapsed && preferences.name && (
        <div className={cn(
          "p-4 border-t border-border flex items-center",
          highContrast ? "border-t-2" : ""
        )}>
          <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            {preferences.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <div className={cn("font-medium", largeText ? "text-base" : "text-sm")}>{preferences.name}</div>
            <div className={cn("text-muted-foreground capitalize", largeText ? "text-sm" : "text-xs")}>
              {preferences.experienceLevel}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default UnifiedNavigation;
