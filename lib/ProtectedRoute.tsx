'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from './store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, _isRehydrated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Wait for redux-persist to rehydrate state before checking authentication
    if (!_isRehydrated) return;
    
    // Wait for auth state to be determined
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Redirect to home if admin access is required but user is not admin
    if (requireAdmin && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, isLoading, _isRehydrated, requireAdmin, router]);

  // Show loading state while rehydrating or checking authentication
  if (!_isRehydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children until authentication is verified
  if (!isAuthenticated || !user) {
    return null;
  }

  // Don't render children if admin access is required but user is not admin
  if (requireAdmin && user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}

// Convenience wrapper for user-only routes
export function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAdmin={false}>{children}</ProtectedRoute>;
}

// Convenience wrapper for admin-only routes
export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}
