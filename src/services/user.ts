
import type { User } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, getDocs, query, orderBy, limit,getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types/db';

const PIONEER_USER_LIMIT = 5;

export async function createUserProfile(user: User, displayName?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  
  // Check current number of users to determine pioneer status
  // This is a simplified check and might have race conditions in high-traffic scenarios.
  // A Cloud Function would be more robust for managing pioneer status.
  const usersCollection = collection(db, 'users');
  const snapshot = await getCountFromServer(usersCollection);
  const userCount = snapshot.data().count;

  const isPioneer = userCount < PIONEER_USER_LIMIT;
  
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || user.email?.split('@')[0] || 'Reverie User',
    photoURL: user.photoURL || '',
    isAdmin: user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL, // Check against admin email env var
    isPioneer,
    createdAt: serverTimestamp() as Timestamp, // Firestore will convert this
    bio: '',
  };
  await setDoc(userRef, userProfile);
  return userProfile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    // Ensure serverTimestamp isn't accidentally overwritten if not changing createdAt
    ...(data.createdAt && { createdAt: data.createdAt }), 
  });
}

export async function getTotalUsers(): Promise<number> {
    const usersCollection = collection(db, 'users');
    const snapshot = await getCountFromServer(usersCollection);
    return snapshot.data().count;
}

export async function getRecentRegistrations(count: number = 5): Promise<UserProfile[]> {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, orderBy('createdAt', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
}
