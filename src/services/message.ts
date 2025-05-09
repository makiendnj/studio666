
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message } from '@/types/db';

export async function sendMessage(
  serverId: string, 
  channelId: string, 
  userId: string, 
  userName: string, 
  text: string,
  userAvatarSeed?: string // Or actual photoURL
): Promise<void> {
  const messagesCollection = collection(db, 'servers', serverId, 'channels', channelId, 'messages');
  await addDoc(messagesCollection, {
    text,
    userId,
    userName, // Denormalized
    userAvatarSeed: userAvatarSeed || userName.substring(0,2).toUpperCase(), // Fallback for seed
    channelId,
    serverId,
    timestamp: serverTimestamp(),
  });
}

// Listener for real-time messages
export function getMessagesListener(
  serverId: string, 
  channelId: string, 
  callback: (messages: Message[]) => void, 
  messageLimit: number = 50
): () => void { // Returns an unsubscribe function
  const messagesCollection = collection(db, 'servers', serverId, 'channels', channelId, 'messages');
  const q = query(messagesCollection, orderBy('timestamp', 'desc'), limit(messageLimit));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Message))
      .reverse(); // Reverse to show oldest first or keep as is for newest first display
    callback(messages);
  }, (error) => {
    console.error("Error fetching messages: ", error);
    // Handle error, maybe by calling callback with an empty array or an error state
    callback([]);
  });

  return unsubscribe; // Return the unsubscribe function
}
