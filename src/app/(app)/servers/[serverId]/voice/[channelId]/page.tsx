"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, MicIcon, MicOffIcon, PhoneOffIcon, Settings2Icon, VideoIcon, VideoOffIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

// Mock participants
const mockParticipants = [
  { id: "u1", name: "TimeTraveler101", avatarSeed: "User300", isMuted: false, isCameraOn: true },
  { id: "u2", name: "FutureScout", avatarSeed: "User301", isMuted: true, isCameraOn: false },
  { id: "u3", name: "ChronoAdmin", avatarSeed: "UserAdmin", isMuted: false, isCameraOn: false },
  { id: "u4", name: "EchoSphereUser", avatarSeed: "User302", isMuted: false, isCameraOn: true },
];

// Mock current user for controls
const currentMockUserId = "u1"; 

export default function VoiceChannelPage() {
  const params = useParams();
  const serverId = params.serverId as string;
  const channelId = params.channelId as string;
  
  // In a real app, fetch channel details
  const channelName = `Voice Channel ${channelId.replace('v','')}`; // Mock channel name

  // Mock state for local user controls
  const [isMuted, setIsMuted] = React.useState(false);
  const [isCameraOn, setIsCameraOn] = React.useState(true);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-1rem)] md:h-[calc(100vh-1rem)] bg-background/70 backdrop-blur-lg rounded-lg holographic-border overflow-hidden">
      {/* Channel Header */}
      <header className="p-3 border-b border-border/50 flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10">
        <div className="flex items-center">
           <Button variant="ghost" size="icon" asChild className="mr-2 md:hidden text-muted-foreground hover:text-primary">
             <Link href={`/servers/${serverId}`}>
                <ArrowLeftIcon className="h-5 w-5"/>
             </Link>
          </Button>
          <h2 className="text-lg font-semibold text-primary-foreground flex items-center">
            <UsersIcon className="h-5 w-5 mr-2 text-primary"/> {channelName}
          </h2>
        </div>
        <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/50">
          {mockParticipants.length} Participants
        </Badge>
      </header>

      {/* Participants Grid */}
      <div className="flex-grow p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
        {mockParticipants.map(participant => (
          <div key={participant.id} className="relative aspect-video bg-input/50 rounded-lg shadow-lg overflow-hidden flex items-center justify-center holographic-border">
            {participant.isCameraOn ? (
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage src={`https://picsum.photos/seed/${participant.avatarSeed}/300/200`} className="object-cover" data-ai-hint="person portrait"/>
                <AvatarFallback className="text-4xl bg-secondary">{participant.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/50">
                <AvatarImage src={`https://picsum.photos/seed/${participant.avatarSeed}/100/100`} data-ai-hint="abstract face"/>
                <AvatarFallback className="text-2xl sm:text-3xl bg-secondary">{participant.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-white truncate flex items-center">
                {participant.isMuted ? <MicOffIcon className="h-3 w-3 mr-1 text-red-400"/> : <MicIcon className="h-3 w-3 mr-1 text-green-400"/>}
                {participant.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Footer */}
      <footer className="p-3 border-t border-border/50 sticky bottom-0 bg-card/80 backdrop-blur-md flex items-center justify-center gap-3 sm:gap-4">
        <Button 
          variant={isMuted ? "destructive" : "outline"} 
          size="icon" 
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOffIcon className="h-5 w-5 sm:h-6 sm:w-6"/> : <MicIcon className="h-5 w-5 sm:h-6 sm:w-6"/>}
        </Button>
        <Button 
          variant={isCameraOn ? "outline" : "destructive"} 
          size="icon" 
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full"
          onClick={() => setIsCameraOn(!isCameraOn)}
        >
          {isCameraOn ? <VideoIcon className="h-5 w-5 sm:h-6 sm:w-6"/> : <VideoOffIcon className="h-5 w-5 sm:h-6 sm:w-6"/>}
        </Button>
        <Button variant="destructive" size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full holographic-glow-primary hover:holographic-glow-accent">
          <Link href={`/servers/${serverId}`}>
            <PhoneOffIcon className="h-5 w-5 sm:h-6 sm:w-6"/>
          </Link>
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full text-muted-foreground hover:text-accent">
          <Settings2Icon className="h-5 w-5 sm:h-6 sm:w-6"/>
        </Button>
      </footer>
    </div>
  );
}
