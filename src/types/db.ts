
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  bio?: string;
  photoURL?: string;
  isAdmin: boolean;
  isPioneer: boolean;
  createdAt: Timestamp;
  // Add other user-specific fields here
}

export interface Server {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  bannerUrl?: string;
  iconUrl?: string; // For server icon
  members: string[]; // Array of user UIDs
  createdAt: Timestamp;
  // Add other server-specific fields here
}

export interface Channel {
  id:string;
  name: string;
  type: 'text' | 'voice';
  serverId: string;
  topic?: string;
  createdAt: Timestamp;
  // Add other channel-specific fields here
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string; // Denormalized for easy display
  userAvatarSeed?: string; // Or actual photoURL
  channelId: string;
  serverId: string;
  timestamp: Timestamp;
  // Add other message-specific fields (e.g., attachments)
}

export interface VoiceParticipant {
    uid: string;
    name: string;
    avatarSeed: string; // Or actual photoURL
    isMuted: boolean;
    isCameraOn: boolean;
}
