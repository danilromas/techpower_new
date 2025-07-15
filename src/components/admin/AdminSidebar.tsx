import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Cpu,
  BarChart3,
  Settings,
  Zap,
  Shield,
  Building,
  DollarSign,
  FileText,
  Warehouse
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ['admin', 'manager', 'builder'] },
  { title: "Комплектующие", url: "/products", icon: Package, roles: ['admin', 'manager', 'builder'] },
  { title: "Заказы", url: "/orders", icon: ShoppingCart, roles: ['admin', 'manager', 'builder'] },
  { title: "Клиенты", url: "/customers", icon: Users, roles: ['admin', 'manager'] },
  { title: "Пользователи", url: "/users", icon: Shield, roles: ['admin'] },
  { title: "Сборка ПК", url: "/pc-builder", icon: Cpu, roles: ['admin', 'manager', 'builder'] },
  { title: "Склад", url: "/inventory", icon: Warehouse, roles: ['admin', 'manager'] },
  { title: "Поставщики", url: "/suppliers", icon: Building, roles: ['admin', 'manager'] },
  { title: "Финансы", url: "/finance", icon: DollarSign, roles: ['admin'] },
  { title: "Отчеты", url: "/reports", icon: FileText, roles: ['admin'] },
  { title: "Аналитика", url: "/analytics", icon: BarChart3, roles: ['admin'] },
  { title: "Настройки", url: "/settings", icon: Settings, roles: ['admin', 'manager', 'builder'] },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const isCollapsed = state === "collapsed";

  const getNavClass = (url: string) => {
    const isActive = location.pathname === url;
    return `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg' 
        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
    }`;
  };

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} bg-sidebar border-r border-sidebar-border`}>
      <SidebarContent>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="bg-sidebar-primary p-2 rounded-lg">
              <Zap className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">TechPower</h1>
                <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium uppercase tracking-wider mb-4">
            Навигация
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems
                .filter(item => user && item.roles.includes(user.role))
                .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
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
}
