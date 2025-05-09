
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, MicIcon, MicOffIcon, PhoneOffIcon, Settings2Icon, VideoIcon, VideoOffIcon, UsersIcon, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../AuthenticatedLayoutClientShell";
import { getChannelDetails } from "@/services/channel";
import { getUserProfile } from "@/services/user"; // To fetch server members for display
import { getServerDetails } from "@/services/server"; // To get server members list
import type { Channel, UserProfile, Server } from "@/types/db";
import { Badge } from "@/components/ui/badge";


// Mock participants for UI rendering - real participants would come from WebRTC state
const mockParticipantsForUI = (members: UserProfile[]): UserProfile[] => {
  return members.map(member => ({
    ...member,
    isMuted: Math.random() > 0.5, // Random mock state
    isCameraOn: Math.random() > 0.7, // Random mock state
  }));
};


export default function VoiceChannelPage() {
  const params = useParams();
  const { firebaseUser, userProfile } = useAuth();
  const serverId = params.serverId as string;
  const channelId = params.channelId as string;
  
  const [channelDetails, setChannelDetails] = useState<Channel | null>(null);
  const [serverMembers, setServerMembers] = useState<UserProfile[]>([]); // For participant list
  const [isLoading, setIsLoading] = useState(true);

  // Mock state for local user controls (UI only, no actual WebRTC)
  const [isMuted, setIsMuted] = React.useState(false);
  const [isCameraOn, setIsCameraOn] = React.useState(true);

  useEffect(() => {
    if (!serverId || !channelId) return;
    setIsLoading(true);
    Promise.all([
      getChannelDetails(serverId, channelId),
      getServerDetails(serverId).then(server => {
        if (server && server.members) {
          return Promise.all(server.members.map(uid => getUserProfile(uid)));
        }
        return [];
      })
    ])
    .then(([channelData, memberProfilesData]) => {
      setChannelDetails(channelData);
      const validMembers = memberProfilesData.filter(p => p !== null) as UserProfile[];
      setServerMembers(mockParticipantsForUI(validMembers)); // Using mock for UI state
    })
    .catch(error => console.error("Error fetching voice channel data:", error))
    .finally(() => setIsLoading(false));

  }, [serverId, channelId]);


  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-background/70 backdrop-blur-lg rounded-lg holographic-border overflow-hidden">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading voice channel...</p>
      </div>
    );
  }

  if (!channelDetails) {
    return <div className="p-4 text-center text-destructive">Voice channel not found.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-1rem)] md:h-full bg-background/70 backdrop-blur-lg rounded-lg holographic-border overflow-hidden">
      <header className="p-3 border-b border-border/50 flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10">
        <div className="flex items-center">
           <Button variant="ghost" size="icon" asChild className="mr-2 md:hidden text-muted-foreground hover:text-primary">
             <Link href={`/servers/${serverId}`}>
                <ArrowLeftIcon className="h-5 w-5"/>
             </Link>
          </Button>
          <h2 className="text-lg font-semibold text-primary-foreground flex items-center">
            <UsersIcon className="h-5 w-5 mr-2 text-primary"/> {channelDetails.name}
          </h2>
        </div>
        <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/50">
          {serverMembers.length} Participants
        </Badge>
      </header>

      <div className="flex-grow p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
        {serverMembers.map(participant => (
          <div key={participant.uid} className="relative aspect-video bg-input/50 rounded-lg shadow-lg overflow-hidden flex items-center justify-center holographic-border">
            {(participant as any).isCameraOn ? ( // Cast to any for mock properties
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage src={participant.photoURL || `https://picsum.photos/seed/${participant.uid}/300/200`} className="object-cover" data-ai-hint="person portrait"/>
                <AvatarFallback className="text-4xl bg-secondary">{participant.displayName?.substring(0,2).toUpperCase() || '??'}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/50">
                <AvatarImage src={participant.photoURL || `https://picsum.photos/seed/${participant.uid}/100/100`} data-ai-hint="abstract face"/>
                <AvatarFallback className="text-2xl sm:text-3xl bg-secondary">{participant.displayName?.substring(0,2).toUpperCase() || '??'}</AvatarFallback>
              </Avatar>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-white truncate flex items-center">
                {(participant as any).isMuted ? <MicOffIcon className="h-3 w-3 mr-1 text-red-400"/> : <MicIcon className="h-3 w-3 mr-1 text-green-400"/>}
                {participant.displayName || participant.email}
              </p>
            </div>
          </div>
        ))}
         {serverMembers.length === 0 && <p className="col-span-full text-center text-muted-foreground py-10">No one is in the voice channel yet.</p>}
      </div>

      <footer className="p-3 border-t border-border/50 sticky bottom-0 bg-card/80 backdrop-blur-md flex items-center justify-center gap-3 sm:gap-4">
        <Button 
          variant={isMuted ? "destructive" : "outline"} 
          size="icon" 
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full"
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOffIcon className="h-5 w-5 sm:h-6 sm:w-6"/> : <MicIcon className="h-5 w-5 sm:h-6 sm:w-6"/>}
        </Button>
        <Button 
          variant={isCameraOn ? "outline" : "destructive"} 
          size="icon" 
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full"
          onClick={() => setIsCameraOn(!isCameraOn)}
          title={isCameraOn ? "Turn camera off" : "Turn camera on"}
        >
          {isCameraOn ? <VideoIcon className="h-5 w-5 sm:h-6 sm:w-6"/> : <VideoOffIcon className="h-5 w-5 sm:h-6 sm:w-6"/>}
        </Button>
        <Button asChild variant="destructive" size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full holographic-glow-primary hover:holographic-glow-accent">
          <Link href={`/servers/${serverId}`} title="Leave Channel">
            <PhoneOffIcon className="h-5 w-5 sm:h-6 sm:w-6"/>
          </Link>
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full text-muted-foreground hover:text-accent" title="Settings (Coming Soon)" disabled>
          <Settings2Icon className="h-5 w-5 sm:h-6 sm:w-6"/>
        </Button>
      </footer>
    </div>
  );
}
