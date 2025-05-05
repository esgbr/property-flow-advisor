
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Building, 
  Calculator, 
  Settings, 
  BarChart, 
  BookOpen,
  Globe,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  User,
  PieChart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../accessibility/A11yProvider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AccessibilitySettingsButton from '@/components/accessibility/AccessibilitySettingsButton';
import { useAnnouncement } from '@/utils/announcer';
import { Badge } from '@/components/ui/badge';
import { useFocusTrap } from '@/hooks/use-focus-trap';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

interface EnhancedNavigationProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigation?: () => void;
  className?: string;
}

const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({ 
  collapsed = false, 
  onToggleCollapse,
  onNavigation,
  className 
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { largeText, highContrast, screenReader } = useAccessibility();
  const { announce } = useAnnouncement();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    tools: false,
    market: false,
    settings: false
  });
  
  // Focus trap for mobile menu
  const mobileMenuRef = useFocusTrap(mobileMenuOpen);
  
  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        announce('Navigation menu closed', true);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, announce]);
  
  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    // Announce to screen reader
    if (screenReader) {
      const isNowExpanded = !expandedGroups[id];
      const groupName = navigationGroups.find(g => g.id === id)?.label || id;
      announce(`${groupName} menu ${isNowExpanded ? 'expanded' : 'collapsed'}`, false);
    }
  };
  
  // Handle navigation to standardize behavior
  const handleNavigate = (path: string, label: string) => {
    navigate(path);
    if (screenReader) {
      announce(`Navigating to ${label}`, true);
    }
    if (isMobile) {
      setMobileMenuOpen(false);
    }
    if (onNavigation) {
      onNavigation();
    }
  };
  
  // Streamlined navigation groups
  const navigationGroups: NavGroup[] = [
    {
      id: 'dashboard',
      label: t('Main'),
      icon: <LayoutDashboard className="h-5 w-5" />,
      items: [
        { 
          label: t('Home'), 
          icon: <Home className="h-4 w-4" />, 
          path: '/' 
        },
        { 
          label: t('Dashboard'), 
          icon: <LayoutDashboard className="h-4 w-4" />, 
          path: '/dashboard' 
        },
        { 
          label: t('Properties'), 
          icon: <Building className="h-4 w-4" />, 
          path: '/properties' 
        },
        { 
          label: t('Investor Dashboard'), 
          icon: <BarChart className="h-4 w-4" />, 
          path: '/investor-dashboard' 
        },
      ]
    },
    {
      id: 'tools',
      label: t('Tools'),
      icon: <Calculator className="h-5 w-5" />,
      items: [
        { 
          label: t('Calculators'), 
          icon: <Calculator className="h-4 w-4" />, 
          path: '/calculators' 
        },
        { 
          label: t('Market Explorer'), 
          icon: <Search className="h-4 w-4" />, 
          path: '/market-explorer' 
        },
        { 
          label: t('Portfolio Analytics'), 
          icon: <PieChart className="h-4 w-4" />, 
          path: '/portfolio-analytics', 
          badge: 'new' 
        }
      ]
    },
    {
      id: 'market',
      label: t('Market'),
      icon: <Globe className="h-5 w-5" />,
      items: [
        { 
          label: t('German Tools'), 
          icon: <Calculator className="h-4 w-4" />, 
          path: '/deutsche-immobilien-tools' 
        },
        { 
          label: t('US Tools'), 
          icon: <Calculator className="h-4 w-4" />, 
          path: '/us-real-estate-tools' 
        },
        { 
          label: t('Market Analysis'), 
          icon: <BarChart className="h-4 w-4" />, 
          path: '/market-analysis' 
        }
      ]
    },
    {
      id: 'settings',
      label: t('Account'),
      icon: <Settings className="h-5 w-5" />,
      items: [
        { 
          label: t('Profile'), 
          icon: <User className="h-4 w-4" />, 
          path: '/profile' 
        },
        { 
          label: t('Settings'), 
          icon: <Settings className="h-4 w-4" />, 
          path: '/settings' 
        },
        { 
          label: t('Education'), 
          icon: <BookOpen className="h-4 w-4" />, 
          path: '/education' 
        },
        { 
          label: t('Accessibility'), 
          icon: <User className="h-4 w-4" />, 
          path: '/accessibility' 
        }
      ]
    }
  ];
  
  if (isMobile) {
    return (
      <>
        {/* Mobile version */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            setMobileMenuOpen(true);
            announce('Navigation menu opened', true);
          }} 
          className={className}
          aria-label={t('Open navigation menu')}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('Open navigation menu')}</span>
        </Button>
        
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
              onClick={() => {
                setMobileMenuOpen(false);
                announce('Navigation menu closed', false);
              }}
              aria-hidden="true" 
            />
            
            {/* Drawer */}
            <div 
              ref={mobileMenuRef}
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-background border-r",
                highContrast ? "border-r-2" : "",
                "p-6 shadow-lg overflow-y-auto"
              )}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                  <span className={cn("font-bold", largeText ? "text-lg" : "")}>PropertyFlow</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    announce('Navigation menu closed', false);
                  }}
                  aria-label={t('Close navigation menu')}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">{t('Close navigation menu')}</span>
                </Button>
              </div>
              
              {navigationGroups.map((group) => (
                <div key={group.id} className="mb-6">
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-between rounded-md mb-2",
                      largeText ? "h-12 text-lg" : "h-10"
                    )}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="flex items-center">
                      {group.icon}
                      <span className="ml-2">{group.label}</span>
                    </div>
                    {expandedGroups[group.id] ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </Button>
                  
                  {expandedGroups[group.id] && (
                    <div className="ml-2 space-y-1">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        
                        return (
                          <Button
                            key={item.label}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start pl-8 rounded-md",
                              isActive && "bg-accent text-accent-foreground",
                              largeText ? "h-11 text-base" : "h-9 text-sm"
                            )}
                            onClick={() => handleNavigate(item.path, item.label)}
                          >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                            {item.badge && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex items-center gap-2 pt-6 mt-6 border-t">
                <ThemeToggle />
                <AccessibilitySettingsButton />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  
  // Desktop version
  return (
    <div className={cn(
      "h-full flex flex-col bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      highContrast ? "border-r-2" : "",
      className
    )}>
      <div className={cn(
        "p-4 flex items-center justify-between border-b",
        highContrast ? "border-b-2" : ""
      )}>
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <LayoutDashboard className="h-6 w-6 text-primary" />
          {!collapsed && <span className={cn("ml-2 font-bold", largeText ? "text-lg" : "")}>PropertyFlow</span>}
        </div>
        {!collapsed && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} aria-label={t('Collapse sidebar')}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {navigationGroups.map((group) => (
          collapsed ? (
            <div key={group.id} className="py-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-full rounded-none h-12",
                  largeText ? "h-14" : ""
                )}
                onClick={() => handleNavigate(group.items[0].path, group.items[0].label)}
                aria-label={group.label}
                title={group.label}
              >
                {group.icon}
              </Button>
            </div>
          ) : (
            <div key={group.id} className="mb-2">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-between rounded-none p-3",
                  largeText ? "h-12 text-lg" : "h-10"
                )}
                onClick={() => toggleGroup(group.id)}
                aria-expanded={expandedGroups[group.id]}
              >
                <div className="flex items-center">
                  {group.icon}
                  <span className="ml-2">{group.label}</span>
                </div>
                {expandedGroups[group.id] ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </Button>
              
              {expandedGroups[group.id] && (
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start pl-8 rounded-none",
                          isActive && "bg-accent text-accent-foreground",
                          largeText ? "h-11 text-base" : "h-9 text-sm"
                        )}
                        onClick={() => handleNavigate(item.path, item.label)}
                      >
                        {item.icon}
                        <span className="ml-2 truncate">{item.label}</span>
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          )
        ))}
      </div>
      
      {/* Toggle collapse button */}
      {collapsed && (
        <div className={cn(
          "p-2 border-t",
          highContrast ? "border-t-2" : ""
        )}>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleCollapse}
            className="w-full"
            aria-label={t('Expand sidebar')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Bottom section with theme toggle and accessibility button */}
      <div className={cn(
        "p-4 border-t flex items-center",
        highContrast ? "border-t-2" : "",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <ThemeToggle />
        {!collapsed && <AccessibilitySettingsButton />}
      </div>
    </div>
  );
};

export default EnhancedNavigation;
