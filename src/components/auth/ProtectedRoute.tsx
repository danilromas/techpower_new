import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, hasRole } = useAuth();

  if (!user) {
    return null; // Будет обработано в App.tsx
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            У вас нет прав доступа к этой странице. Требуется роль: {allowedRoles.join(', ')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}