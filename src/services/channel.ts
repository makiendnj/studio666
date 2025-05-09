
import { 
  doc, 
  addDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  orderBy, 
  getDocs,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Channel, Message } from '@/types/db';

export async function createChannel(serverId: string, name: string, type: 'text' | 'voice', topic?: string): Promise<Channel> {
  const channelRef = await addDoc(collection(db, 'servers', serverId, 'channels'), {
    name,
    type,
    serverId,
    topic: topic || '',
    createdAt: serverTimestamp(),
  });
  const channelSnap = await getDoc(channelRef);
  return { id: channelSnap.id, ...channelSnap.data() } as Channel;
}

export async function getChannelDetails(serverId: string, channelId: string): Promise<Channel | null> {
  const channelRef = doc(db, 'servers', serverId, 'channels', channelId);
  const channelSnap = await getDoc(channelRef);
  if (channelSnap.exists()) {
    return { id: channelSnap.id, ...channelSnap.data() } as Channel;
  }
  return null;
}

export async function getChannelsForServer(serverId: string): Promise<Channel[]> {
  const channelsCollection = collection(db, 'servers', serverId, 'channels');
  const q = query(channelsCollection, orderBy('createdAt', 'asc')); // Or order by name, etc.
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Channel));
}

export async function updateChannel(serverId: string, channelId: string, data: Partial<Channel>): Promise<void> {
  const channelRef = doc(db, 'servers', serverId, 'channels', channelId);
  await updateDoc(channelRef, data);
}

export async function deleteChannel(serverId: string, channelId: string): Promise<void> {
  const channelRef = doc(db, 'servers', serverId, 'channels', channelId);
  const batch = writeBatch(db);

  // Delete messages in the channel (can be very many, consider batched deletes or Cloud Function for large scale)
  const messagesCollection = collection(db, 'servers', serverId, 'channels', channelId, 'messages');
  const messagesSnapshot = await getDocs(messagesCollection);
  messagesSnapshot.docs.forEach(messageDoc => {
    batch.delete(doc(db, 'servers', serverId, 'channels', channelId, 'messages', messageDoc.id));
  });

  batch.delete(channelRef);
  await batch.commit();
}
