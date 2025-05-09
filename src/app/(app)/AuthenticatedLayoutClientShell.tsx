
"use client";

import { usePathname, useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types/db';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { BottomNavigationBar } from '@/components/layout/BottomNavigationBar';
import { LoaderCircle } from 'lucide-react';

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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        setFirebaseUser(user);
        // No need to redirect if already on auth pages during signup/signin
        if (pathname.startsWith('/auth/')) {
           // If user is set and on auth page, perhaps they just signed in/up, redirect to home
           // router.replace('/home'); // Careful with redirect loops if user is not fully set up yet
        }
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
          // This case might happen if user is authenticated but profile creation failed/is delayed
          // Or if user was deleted from Firestore but still has an auth session (should be rare)
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
      setUserProfile(null); // Clear profile if no Firebase user
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
      // Auth state change will trigger redirect via onAuthStateChanged
      // router.replace('/auth/sign-in'); // Already handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle sign out error (e.g., show toast)
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Loading Reverie...</p>
      </div>
    );
  }
  
  // If no firebaseUser (meaning not authenticated) AND not on an auth page, show loading/redirecting.
  if (!firebaseUser && !pathname.startsWith('/auth/')) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Redirecting...</p>
      </div>
     );
  }

  // If firebaseUser exists but profile is still loading (and not on auth page), show loading.
  // This avoids rendering children that might depend on userProfile before it's ready.
  if (firebaseUser && !userProfile && !pathname.startsWith('/auth/')) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Loading Profile...</p>
      </div>
     );
  }


  return (
    <AuthContext.Provider value={{ firebaseUser, userProfile, isLoading, signOut: handleSignOut }}>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-grow pb-20 md:pb-4 pt-4 px-4">
          {children}
        </main>
        {/* Show BottomNav if user is authenticated (has firebaseUser and userProfile) and not on an auth page */}
        {firebaseUser && userProfile && !pathname.startsWith('/auth/') && <BottomNavigationBar />}
      </div>
    </AuthContext.Provider>
  );
}
