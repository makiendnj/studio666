"use client";

import { usePathname, useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types/db';
import { doc, onSnapshot } from 'firebase/firestore';
import { BottomNavigationBar } from '@/components/layout/BottomNavigationBar';
import { LoaderCircle } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { SideDrawerNav } from '@/components/layout/SideDrawerNav';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthenticatedLayoutClientShell({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Drawer state can be managed by the Sheet component itself if SheetTrigger is used correctly within AppHeader.
  // Or, if explicit control is needed:
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
        setUserProfile(null);
        if (!pathname.startsWith('/auth/')) {
          router.replace('/auth/sign-in');
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, [router, pathname]);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    if (firebaseUser) {
      setIsLoading(true);
      const profileRef = doc(db, 'users', firebaseUser.uid);
      unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          setUserProfile(null); 
          console.warn("User profile not found in Firestore for UID:", firebaseUser.uid);
        }
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
        setIsLoading(false);
      });
    } else {
      setUserProfile(null); 
    }
    return () => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, [firebaseUser]);


  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle redirect
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoading && (!firebaseUser || (firebaseUser && !userProfile && !pathname.startsWith('/auth/')))) {
    const message = !firebaseUser ? "Loading Reverie..." : "Loading Profile...";
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">{message}</p>
      </div>
    );
  }
  
  if (!firebaseUser && !pathname.startsWith('/auth/')) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Redirecting...</p>
      </div>
     );
  }

  const showAppShell = firebaseUser && (userProfile || pathname.startsWith('/auth/'));

  return (
    <AuthContext.Provider value={{ firebaseUser, userProfile, isLoading, signOut: handleSignOut }}>
      <Sheet> {/* Sheet component wraps content that uses SheetTrigger and SheetContent */}
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          {showAppShell && <AppHeader />} {/* AppHeader contains SheetTrigger */}
          
          <SheetContent side="left" className="w-[280px] sm:w-[300px] p-0 border-r border-border/50 bg-card overflow-y-auto">
            {/* SideDrawerNav is the content of the sheet. Links inside will use SheetClose */}
            <SideDrawerNav />
          </SheetContent>

          {/* Adjust pt-16 (4rem for header) + existing pt-4 (1rem) = pt-20 (5rem) */}
          <main className="flex-grow pb-20 md:pb-4 pt-20 px-4"> 
            {children}
          </main>
          
          {showAppShell && firebaseUser && userProfile && !pathname.startsWith('/auth/') && <BottomNavigationBar />}
        </div>
      </Sheet>
    </AuthContext.Provider>
  );
}
