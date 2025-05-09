
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch,
  getCountFromServer
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase'; // Assuming storage might be used for icons/banners later
import { ref, deleteObject } from 'firebase/storage';
import type { Server, Channel } from '@/types/db';
import { deleteChannel } from './channel'; // For cascading delete

export async function createServer(
  name: string, 
  ownerId: string, 
  description?: string, 
  iconFile?: File, 
  bannerFile?: File
): Promise<Server> {
  const serverRef = await addDoc(collection(db, 'servers'), {
    name,
    description: description || '',
    ownerId,
    members: [ownerId], // Owner is initially the only member
    createdAt: serverTimestamp(),
    iconUrl: '', // Placeholder, will be updated if iconFile is provided
    bannerUrl: '', // Placeholder
  });

  let iconUrl = '';
  let bannerUrl = '';

  // TODO: Implement actual file upload to Firebase Storage if files are provided
  // For now, these are placeholders.
  // if (iconFile) { /* upload logic, get iconUrl */ }
  // if (bannerFile) { /* upload logic, get bannerUrl */ }

  // Update with actual URLs if they were uploaded
  await updateDoc(serverRef, { iconUrl, bannerUrl });
  
  // Create a default 'general' text channel
  await addDoc(collection(db, 'servers', serverRef.id, 'channels'), {
      name: 'general',
      type: 'text',
      serverId: serverRef.id,
      createdAt: serverTimestamp(),
  });

  const serverSnap = await getDoc(serverRef);
  return { id: serverSnap.id, ...serverSnap.data() } as Server;
}

export async function getServerDetails(serverId: string): Promise<Server | null> {
  const serverRef = doc(db, 'servers', serverId);
  const serverSnap = await getDoc(serverRef);
  if (serverSnap.exists()) {
    return { id: serverSnap.id, ...serverSnap.data() } as Server;
  }
  return null;
}

export async function getServersForUser(userId: string): Promise<Server[]> {
  const serversCollection = collection(db, 'servers');
  // Query for servers where the 'members' array contains the userId
  const q = query(serversCollection, where('members', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Server));
}

export async function getAllServers(): Promise<Server[]> {
  // This might be too broad for a large app, consider pagination or specific queries
  const serversCollection = collection(db, 'servers');
  const querySnapshot = await getDocs(serversCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Server));
}


export async function updateServer(serverId: string, data: Partial<Server>): Promise<void> {
  const serverRef = doc(db, 'servers', serverId);
  await updateDoc(serverRef, data);
}

export async function deleteServer(serverId: string): Promise<void> {
  const serverRef = doc(db, 'servers', serverId);
  const serverData = await getServerDetails(serverId);

  // Batch delete associated data (channels, messages would be more complex)
  const batch = writeBatch(db);

  // Delete channels
  const channelsCollection = collection(db, 'servers', serverId, 'channels');
  const channelsSnapshot = await getDocs(channelsCollection);
  channelsSnapshot.docs.forEach(channelDoc => {
    // For each channel, also consider deleting its messages (more complex, might need a Cloud Function)
    batch.delete(doc(db, 'servers', serverId, 'channels', channelDoc.id));
  });
  
  // TODO: Delete server icon/banner from Firebase Storage if they exist
  // if (serverData?.iconUrl) {
  //   const iconRef = ref(storage, serverData.iconUrl);
  //   await deleteObject(iconRef).catch(e => console.error("Error deleting icon:", e));
  // }
  // if (serverData?.bannerUrl) {
  //   const bannerRef = ref(storage, serverData.bannerUrl);
  //   await deleteObject(bannerRef).catch(e => console.error("Error deleting banner:", e));
  // }

  batch.delete(serverRef);
  await batch.commit();
}

export async function addUserToServer(serverId: string, userId: string): Promise<void> {
  const serverRef = doc(db, 'servers', serverId);
  await updateDoc(serverRef, {
    members: arrayUnion(userId)
  });
}

export async function removeUserFromServer(serverId: string, userId: string): Promise<void> {
  const serverRef = doc(db, 'servers', serverId);
  await updateDoc(serverRef, {
    members: arrayRemove(userId)
  });
}

export async function getTotalServers(): Promise<number> {
    const serversCollection = collection(db, 'servers');
    const snapshot = await getCountFromServer(serversCollection);
    return snapshot.data().count;
}
