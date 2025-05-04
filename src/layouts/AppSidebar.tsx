
import React from 'react';
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
  User
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AppSidebar = () => {
  const { t } = useLanguage();

  const mainMenuItems = [
    { title: t('dashboard'), icon: Home, url: '/dashboard' },
    { title: t('properties'), icon: Building, url: '/properties' },
    { title: t('investorDashboard'), icon: BarChart, url: '/investor-dashboard' },
    { title: t('calculators'), icon: Calculator, url: '/calculators' },
    { title: t('education'), icon: BookOpen, url: '/education' },
  ];

  const accountMenuItems = [
    { title: t('settings'), icon: Settings, url: '/settings' },
    { title: t('profile'), icon: User, url: '/profile' },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('main')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive ? "text-primary font-medium" : "text-muted-foreground"
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
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('account')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive ? "text-primary font-medium" : "text-muted-foreground"
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
