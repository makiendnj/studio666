"use client";

import { usePathname, useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import { BottomNavigationBar } from '@/components/layout/BottomNavigationBar';
import { LoaderCircle } from 'lucide-react';

export interface MockUser {
  email: string;
  isAdmin: boolean;
  isPioneer: boolean;
}

interface AuthContextType {
  user: MockUser | null;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useMockAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthenticatedLayoutClientShell({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('chronoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      if (pathname !== '/auth/sign-in' && pathname !== '/auth/sign-up') { // Prevent redirect loop
        router.replace('/auth/sign-in');
      }
    }
    setIsLoading(false);
  }, [router, pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('chronoUser');
    setUser(null);
    router.replace('/auth/sign-in');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Loading ChronoChat...</p>
      </div>
    );
  }

  // If still no user after loading (e.g. redirect is happening or failed), don't render children
  // This helps prevent brief flashes of authenticated content if redirection is slow.
  if (!user && !pathname.startsWith('/auth/')) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Redirecting...</p>
      </div>
     );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut: handleSignOut }}>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-grow pb-20 md:pb-4 pt-4 px-4"> {/* padding-bottom for bottom nav, added top/horizontal padding */}
          {children}
        </main>
        {user && <BottomNavigationBar />} {/* Only show BottomNav if user is authenticated */}
      </div>
    </AuthContext.Provider>
  );
}
