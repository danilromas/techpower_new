
import React from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export function AdminHeader() {
  const { user, logout } = useAuth();

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'manager': return 'Менеджер';
      case 'builder': return 'Сборщик';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'builder': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск..."
              className="pl-10 w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <Badge variant={getRoleColor(user?.role || '')} className="text-xs">
                  {getRoleName(user?.role || '')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={logout} title="Выйти">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
