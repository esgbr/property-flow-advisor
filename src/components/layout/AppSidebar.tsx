
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Calculator, Calendar, Wrench, Check, Settings, GraduationCap } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';

const AppSidebar = () => {
  const { t } = useLanguage();

  const menuItems = [
    {
      title: t('dashboard'),
      icon: Home,
      path: '/'
    },
    {
      title: t('properties'),
      icon: FileText,
      path: '/properties'
    },
    {
      title: t('calculators'),
      icon: Calculator,
      path: '/calculators'
    },
    {
      title: t('schedule'),
      icon: Calendar,
      path: '/schedule'
    },
    {
      title: t('refurbishment'),
      icon: Wrench,
      path: '/refurbishment'
    },
    {
      title: t('decision'),
      icon: Check,
      path: '/decision'
    },
    {
      title: t('education'),
      icon: GraduationCap,
      path: '/education'
    },
    {
      title: t('settings'),
      icon: Settings,
      path: '/settings'
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-3 py-2">
          <h1 className="text-xl font-bold text-sidebar-foreground">PropertyFlow</h1>
          <p className="text-xs text-sidebar-foreground/70">Investor Platform</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('mainNavigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <SidebarTrigger />
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
