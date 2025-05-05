
// Use forwardRef to properly type the ref
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import { useFocusTrap } from '@/hooks/use-focus-trap';

// Import icons
import {
  Home,
  Building,
  BarChart3,
  Calculator,
  Settings,
  Menu,
  X,
  Globe,
  Briefcase,
  MapPin,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
  subItems?: NavItem[];
}

interface EnhancedNavigationProps {
  layout?: 'vertical' | 'horizontal';
  variant?: 'default' | 'minimal' | 'expanded';
  className?: string;
}

const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: <Home className="h-5 w-5" />,
    description: 'Return to the home page'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <Building className="h-5 w-5" />,
    description: 'View your property dashboard'
  },
  {
    id: 'properties',
    label: 'Properties',
    path: '/properties',
    icon: <Building className="h-5 w-5" />,
    description: 'Manage your property portfolio',
    subItems: [
      {
        id: 'property-list',
        label: 'Property List',
        path: '/properties',
        icon: <Building className="h-4 w-4" />
      },
      {
        id: 'property-comparison',
        label: 'Property Comparison',
        path: '/property-comparator',
        icon: <BarChart3 className="h-4 w-4" />
      }
    ]
  },
  {
    id: 'analysis',
    label: 'Analysis',
    path: '/market-analysis',
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'Analyze market trends and data',
    subItems: [
      {
        id: 'market-explorer',
        label: 'Market Explorer',
        path: '/market-explorer',
        icon: <MapPin className="h-4 w-4" />
      },
      {
        id: 'portfolio-analytics',
        label: 'Portfolio Analytics',
        path: '/portfolio-analytics',
        icon: <TrendingUp className="h-4 w-4" />
      }
    ]
  },
  {
    id: 'calculators',
    label: 'Calculators',
    path: '/calculators',
    icon: <Calculator className="h-5 w-5" />,
    description: 'Use financial calculators'
  },
  {
    id: 'tools',
    label: 'Tools',
    path: '/tools',
    icon: <Briefcase className="h-5 w-5" />,
    description: 'Access specialized tools',
    subItems: [
      {
        id: 'german-tools',
        label: 'German RE Tools',
        path: '/deutsche-immobilien-tools',
        icon: <Globe className="h-4 w-4" />
      },
      {
        id: 'us-tools',
        label: 'US RE Tools',
        path: '/us-real-estate-tools',
        icon: <Globe className="h-4 w-4" />
      },
      {
        id: 'document-center',
        label: 'Document Center',
        path: '/documents',
        icon: <FileText className="h-4 w-4" />
      },
      {
        id: 'tenant-management',
        label: 'Tenant Management',
        path: '/tenant-management',
        icon: <Users className="h-4 w-4" />
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />,
    description: 'Configure application settings'
  }
];

const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  layout = 'horizontal',
  variant = 'default',
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { highContrast, largeText, reduceMotion } = useAccessibility();
  const mobileMenuRef = useRef<HTMLDivElement>(null); // Fixed to HTMLDivElement
  
  // Use focus trap for the mobile menu
  const menuFocusTrapRef = useFocusTrap<HTMLDivElement>(isMobileMenuOpen);
  
  // Combined refs using a callback ref pattern for the mobile menu
  const setMenuRef = (element: HTMLDivElement | null) => {
    if (element) {
      if (mobileMenuRef) mobileMenuRef.current = element;
      if (menuFocusTrapRef) menuFocusTrapRef.current = element;
    }
  };
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Handle overlay click to close menu
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsMobileMenuOpen(false);
    }
  };

  // Toggle sub-items visibility
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Check if a nav item is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Get transition classes based on user preferences
  const getTransitionClass = () => {
    return reduceMotion ? '' : 'transition-all duration-200';
  };

  // Render navigation links
  const renderNavLinks = (items: NavItem[], isSubItem = false) => {
    return items.map((item) => {
      const active = isActive(item.path);
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isExpanded = expandedItems.includes(item.id);
      
      // Base classes for nav items
      let navItemClasses = cn(
        "flex items-center gap-2 rounded-lg px-3 py-2",
        getTransitionClass(),
        active 
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted",
        highContrast && active && "outline outline-2 outline-foreground",
        isSubItem ? "text-sm ml-6" : "",
        largeText ? "text-base py-3" : ""
      );
      
      return (
        <div key={item.id} className={cn("relative", isSubItem ? "my-1" : "my-1")}>
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size={largeText ? "default" : "sm"}
                  className={navItemClasses}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpanded(item.id);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  aria-expanded={hasSubItems ? isExpanded : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-grow truncate">{item.label}</span>
                  {hasSubItems && (
                    <span className={`h-4 w-4 ${isExpanded ? 'rotate-90' : ''} ${getTransitionClass()}`}>
                      {/* Small chevron icon */}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-4 w-4"
                      >
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {item.description && (
                <TooltipContent side={layout === 'vertical' ? 'right' : 'bottom'}>
                  <p>{item.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
          
          {/* Sub-items */}
          {hasSubItems && isExpanded && (
            <div className={cn(
              "pl-2 my-1", 
              getTransitionClass(),
              reduceMotion ? "" : "animate-in fade-in slide-in-from-left-2"
            )}>
              {renderNavLinks(item.subItems, true)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={cn(
          "hidden md:block",
          layout === 'vertical' ? "w-60" : "w-full",
          className
        )}
        aria-label="Main Navigation"
      >
        <div className={cn(
          "flex",
          layout === 'vertical' ? "flex-col space-y-1" : "flex-row space-x-1"
        )}>
          {renderNavLinks(navigationItems)}
        </div>
      </nav>

      {/* Mobile Navigation Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="p-1"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/50",
            reduceMotion ? "" : "animate-in fade-in"
          )}
          onClick={handleOverlayClick}
        >
          {/* Mobile Menu */}
          <div
            ref={setMenuRef}
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-background p-4 shadow-lg",
              reduceMotion ? "" : "animate-in slide-in-from-left",
            )}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-grow overflow-y-auto">
                <div className="flex flex-col space-y-1">
                  {renderNavLinks(navigationItems)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedNavigation;
