import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { 
  Building, 
  Calculator, 
  Home, 
  BarChart, 
  BookOpen, 
  Settings,
  User,
  Folder,
  Shield,
  PieChart,
  ChevronRight,
  ChevronDown,
  Users
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AppSidebar = () => {
  const { t } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    main: true,
    tools: false,
    account: false
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Main navigation items
  const mainMenuItems = [
    { title: t('dashboard'), icon: Home, url: '/dashboard' },
    { title: t('properties'), icon: Building, url: '/properties' },
    { title: t('investorDashboard'), icon: BarChart, url: '/investor-dashboard' },
    { title: 'CRM', icon: Users, url: '/crm' },
  ];

  // Tools items (previously scattered across multiple categories)
  const toolsMenuItems = [
    { title: t('calculators'), icon: Calculator, url: '/calculators' },
    { title: t('education'), icon: BookOpen, url: '/education' },
    { title: t('portfolioOptimization'), icon: PieChart, url: '/portfolio-optimization', new: true },
    { title: t('documentManagement'), icon: Folder, url: '/documents' },
  ];

  // Account items
  const accountMenuItems = [
    { title: t('settings'), icon: Settings, url: '/settings' },
    { title: t('profile'), icon: User, url: '/profile' },
    { title: t('security'), icon: Shield, url: '/settings?tab=security', new: true },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-3 py-2 mb-4">
          <NavLink to="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PropertyFlow</span>
          </NavLink>
        </div>
        
        <SidebarGroup>
          <div className="px-3 mb-1 flex items-center justify-between">
            <SidebarGroupLabel>{t('main')}</SidebarGroupLabel>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => toggleGroup('main')}
            >
              {expandedGroups.main ? 
                <ChevronDown className="h-4 w-4" /> :
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </div>
          
          {expandedGroups.main && (
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => 
                          cn(
                            "flex items-center py-2 px-3 rounded-md group transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )
                        }
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <div className="px-3 mb-1 flex items-center justify-between">
            <SidebarGroupLabel>{t('tools')}</SidebarGroupLabel>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => toggleGroup('tools')}
            >
              {expandedGroups.tools ? 
                <ChevronDown className="h-4 w-4" /> :
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </div>
          
          {expandedGroups.tools && (
            <SidebarGroupContent>
              <SidebarMenu>
                {toolsMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => 
                          cn(
                            "flex items-center py-2 px-3 rounded-md group transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )
                        }
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        <span className="flex-1">{item.title}</span>
                        {item.new && (
                          <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                            {t('new')}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <div className="px-3 mb-1 flex items-center justify-between">
            <SidebarGroupLabel>{t('account')}</SidebarGroupLabel>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => toggleGroup('account')}
            >
              {expandedGroups.account ? 
                <ChevronDown className="h-4 w-4" /> :
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </div>
          
          {expandedGroups.account && (
            <SidebarGroupContent>
              <SidebarMenu>
                {accountMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => 
                          cn(
                            "flex items-center py-2 px-3 rounded-md group transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )
                        }
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        <span className="flex-1">{item.title}</span>
                        {item.new && (
                          <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                            {t('new')}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
