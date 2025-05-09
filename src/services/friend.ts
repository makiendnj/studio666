
'use server';

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  arrayRemove,
  getDoc,
  orderBy,
  limit,
  deleteDoc,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile, FriendRequest } from '@/types/db';

// Helper function to find user by email
async function findUserByEmail(email: string): Promise<UserProfile | null> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return { uid: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as UserProfile;
  }
  return null;
}

export async function searchUsers(currentUserId: string, searchQuery: string): Promise<UserProfile[]> {
  if (!searchQuery.trim()) return [];

  const usersRef = collection(db, 'users');
  const normalizedQuery = searchQuery.toLowerCase();
  
  // It's hard to do a true "contains" search in Firestore without a third-party search service like Algolia.
  // This will find users whose email or displayName STARTS WITH the query.
  // For a more robust search, consider a different approach or a simpler exact match.
  // For this example, we'll do an exact match on email and a prefix match on displayName.

  const constraints: QueryConstraint[] = [];
   if (searchQuery.includes('@')) {
    constraints.push(where('email', '==', normalizedQuery));
  } else {
    // Firestore doesn't support case-insensitive or "contains" queries directly on strings.
    // This is a common limitation. For production, use a search service or store a normalized field.
    // As a workaround, we fetch users and filter client-side or fetch all that start with query.
    // This is not scalable.
    // For now, let's assume we can do a displayName prefix search if supported or fetch and filter.
    // For simplicity in this example, we'll query by exact displayName match for now.
    // This is not ideal for a real search experience.
    constraints.push(where('displayName', '>=', searchQuery), where('displayName', '<=', searchQuery + '\uf8ff'));
  }


  const q = query(usersRef, ...constraints, limit(10));
  const querySnapshot = await getDocs(q);
  
  const users: UserProfile[] = [];
  querySnapshot.forEach(docSnap => {
    if (docSnap.id !== currentUserId) { // Exclude current user from search results
      users.push({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
    }
  });
  
  return users;
}


export async function sendFriendRequest(senderId: string, senderDisplayName: string, senderPhotoURL: string | undefined, receiverEmail: string): Promise<FriendRequest> {
  const receiver = await findUserByEmail(receiverEmail);
  if (!receiver) {
    throw new Error('User with that email not found.');
  }
  if (receiver.uid === senderId) {
    throw new Error('You cannot send a friend request to yourself.');
  }

  // Check if a request already exists or if they are already friends
  const existingRequestQuery = query(
    collection(db, 'friendRequests'),
    where('senderId', 'in', [senderId, receiver.uid]),
    where('receiverId', 'in', [senderId, receiver.uid])
  );
  const existingRequestSnapshot = await getDocs(existingRequestQuery);
  if (!existingRequestSnapshot.empty) {
     const existingRequest = existingRequestSnapshot.docs.find(doc => doc.data().status === 'pending');
     if (existingRequest) throw new Error('Friend request already pending.');
  }
  
  const senderProfile = await getDoc(doc(db, 'users', senderId));
  if (senderProfile.exists() && senderProfile.data().friends?.includes(receiver.uid)) {
    throw new Error('You are already friends with this user.');
  }


  const requestRef = await addDoc(collection(db, 'friendRequests'), {
    senderId,
    senderDisplayName,
    senderPhotoURL: senderPhotoURL || '',
    receiverId: receiver.uid,
    receiverEmail, // Store for context, though receiver.uid is key
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const newRequestSnap = await getDoc(requestRef);
  return { id: newRequestSnap.id, ...newRequestSnap.data() } as FriendRequest;
}

export async function getFriendRequests(userId: string): Promise<{ incoming: FriendRequest[], outgoing: FriendRequest[] }> {
  const incomingQuery = query(
    collection(db, 'friendRequests'),
    where('receiverId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const outgoingQuery = query(
    collection(db, 'friendRequests'),
    where('senderId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  const [incomingSnapshot, outgoingSnapshot] = await Promise.all([
    getDocs(incomingQuery),
    getDocs(outgoingQuery),
  ]);

  const incoming = incomingSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as FriendRequest));
  const outgoing = outgoingSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as FriendRequest));
  
  return { incoming, outgoing };
}

export async function acceptFriendRequest(requestId: string): Promise<void> {
  const requestRef = doc(db, 'friendRequests', requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error('Friend request not found.');
  }
  const requestData = requestSnap.data() as FriendRequest;
  if (requestData.status !== 'pending') {
    throw new Error(`Cannot accept a request that is already ${requestData.status}.`);
  }

  const batch = writeBatch(db);
  batch.update(requestRef, { status: 'accepted', updatedAt: serverTimestamp() });

  const senderUserRef = doc(db, 'users', requestData.senderId);
  batch.update(senderUserRef, { friends: arrayUnion(requestData.receiverId) });

  const receiverUserRef = doc(db, 'users', requestData.receiverId);
  batch.update(receiverUserRef, { friends: arrayUnion(requestData.senderId) });

  await batch.commit();
}

export async function declineFriendRequest(requestId: string): Promise<void> {
  const requestRef = doc(db, 'friendRequests', requestId);
  await updateDoc(requestRef, { status: 'declined', updatedAt: serverTimestamp() });
}

export async function cancelFriendRequest(requestId: string): Promise<void> {
  // Sender cancels their own request
  const requestRef = doc(db, 'friendRequests', requestId);
  // Optionally, could change status to 'cancelled' or just delete
  await deleteDoc(requestRef); 
}


export async function removeFriend(userId: string, friendId: string): Promise<void> {
  const batch = writeBatch(db);

  const userRef = doc(db, 'users', userId);
  batch.update(userRef, { friends: arrayRemove(friendId) });

  const friendUserRef = doc(db, 'users', friendId);
  batch.update(friendUserRef, { friends: arrayRemove(userId) });
  
  // Optionally, find and update any related friend requests to 'declined' or another status
  const existingRequestQuery = query(
    collection(db, 'friendRequests'),
    where('senderId', 'in', [userId, friendId]),
    where('receiverId', 'in', [userId, friendId]),
    where('status', '==', 'accepted') 
  );
  const existingRequestSnapshot = await getDocs(existingRequestQuery);
  existingRequestSnapshot.forEach(docSnap => {
    batch.update(docSnap.ref, { status: 'declined', updatedAt: serverTimestamp() }); // Or some other status like 'unfriended'
  });


  await batch.commit();
}

export async function getFriends(userId: string): Promise<UserProfile[]> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists() || !userSnap.data().friends || userSnap.data().friends.length === 0) {
    return [];
  }
  const friendIds: string[] = userSnap.data().friends;
  
  if (friendIds.length === 0) return [];

  // Firestore 'in' query limit is 30 items per query as of late 2023.
  // For more friends, batch the queries.
  const friends: UserProfile[] = [];
  const batchSize = 30; // Firestore 'in' query limit
  for (let i = 0; i < friendIds.length; i += batchSize) {
    const batchIds = friendIds.slice(i, i + batchSize);
    if (batchIds.length > 0) {
        const q = query(collection(db, 'users'), where('uid', 'in', batchIds));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(docSnap => {
            friends.push({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
        });
    }
  }
  return friends;
}
