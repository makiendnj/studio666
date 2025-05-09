
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeftIcon, CogIcon, HashIcon, MessageSquareIcon, PlusIcon, UsersIcon, VoicemailIcon, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getServerDetails } from "@/services/server";
import { getChannelsForServer, createChannel as apiCreateChannel } from "@/services/channel";
import { getUserProfile } from "@/services/user";
import type { Server, Channel, UserProfile } from "@/types/db";
import { useAuth } from "../../AuthenticatedLayoutClientShell";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function ServerPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { firebaseUser, userProfile } = useAuth();
  const serverId = params.serverId as string;

  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>("text");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  const { data: server, isLoading: isLoadingServer, error: serverError, refetch: refetchServer } = useQuery<Server | null>({
    queryKey: ['server', serverId],
    queryFn: () => getServerDetails(serverId),
    enabled: !!serverId,
  });

  const { data: channels, isLoading: isLoadingChannels, error: channelsError, refetch: refetchChannels } = useQuery<Channel[]>({
    queryKey: ['channels', serverId],
    queryFn: () => getChannelsForServer(serverId),
    enabled: !!serverId,
  });
  
  const { data: members, isLoading: isLoadingMembers, error: membersError } = useQuery<UserProfile[]>({
    queryKey: ['serverMembers', serverId, server?.members],
    queryFn: async () => {
      if (!server || !server.members || server.members.length === 0) return [];
      const memberProfiles = await Promise.all(
        server.members.map(uid => getUserProfile(uid))
      );
      return memberProfiles.filter(profile => profile !== null) as UserProfile[];
    },
    enabled: !!server && !!server.members && server.members.length > 0,
  });

  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || !firebaseUser || !server) return;
    setIsCreatingChannel(true);
    try {
      await apiCreateChannel(serverId, newChannelName.trim(), newChannelType);
      toast({ title: "Channel Created", description: `Channel "${newChannelName}" added.` });
      setNewChannelName("");
      refetchChannels(); // Refetch channels list
    } catch (error) {
      console.error("Error creating channel:", error);
      toast({ title: "Error", description: "Failed to create channel.", variant: "destructive" });
    } finally {
      setIsCreatingChannel(false);
    }
  };
  
  if (isLoadingServer || isLoadingChannels || isLoadingMembers && !server && !channels) {
     return (
      <div className="flex h-[calc(100vh-var(--header-height,4rem)-1rem)] md:h-[calc(100vh-1rem)] items-center justify-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading server...</p>
      </div>
    );
  }

  if (serverError || !server) {
    return <div className="text-center py-10 text-destructive">Error loading server details or server not found. {serverError?.message}</div>;
  }
  if (channelsError) {
     return <div className="text-center py-10 text-destructive">Error loading channels. {channelsError?.message}</div>;
  }

  const isOwner = firebaseUser?.uid === server.ownerId;

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-1rem)] md:h-[calc(100vh-1rem)]">
      <header className="relative h-40 md:h-56 mb-4 rounded-lg overflow-hidden shadow-lg">
        <Image 
          src={server.bannerUrl || `https://picsum.photos/seed/${server.id}Banner/1200/300`} 
          alt={`${server.name} Banner`} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint={server.description && server.description.length > 5 ? server.description.split(" ").slice(0,2).join(" ") : "abstract landscape"}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 md:p-6 flex flex-col justify-end">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{server.name}</h1>
          <p className="text-sm text-gray-300 drop-shadow-sm truncate">{server.description}</p>
        </div>
        <Button variant="ghost" asChild className="absolute top-2 left-2 text-white hover:bg-white/20 backdrop-blur-sm">
          <Link href="/servers">
            <ArrowLeftIcon className="h-5 w-5" /> <span className="ml-1 hidden sm:inline">Servers</span>
          </Link>
        </Button>
        {isOwner && (
          <Button variant="ghost" asChild className="absolute top-2 right-2 text-white hover:bg-white/20 backdrop-blur-sm">
            <Link href={`/servers/${serverId}/settings`}>
              <CogIcon className="h-5 w-5" /> <span className="ml-1 hidden sm:inline">Settings</span>
            </Link>
          </Button>
        )}
      </header>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        <Card className="md:col-span-3 bg-card/70 backdrop-blur-sm holographic-border flex flex-col min-h-0">
          <CardHeader className="py-3 px-4 border-b border-border/50">
            <CardTitle className="text-lg flex justify-between items-center">
              Channels
              {isOwner && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-accent"><PlusIcon className="h-4 w-4"/></Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-card holographic-border">
                    <DialogHeader>
                      <DialogTitle className="text-primary">Create New Channel</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input 
                        placeholder="Channel name (e.g., announcements)" 
                        value={newChannelName} 
                        onChange={(e) => setNewChannelName(e.target.value)}
                        className="bg-input/50"
                      />
                       <Select value={newChannelType} onValueChange={(value) => setNewChannelType(value as 'text' | 'voice')}>
                        <SelectTrigger className="w-full bg-input/50">
                          <SelectValue placeholder="Select channel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Channel</SelectItem>
                          <SelectItem value="voice">Voice Channel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="button" onClick={handleCreateChannel} disabled={isCreatingChannel || !newChannelName.trim()} className="holographic-glow-primary">
                        {isCreatingChannel ? <LoaderCircle className="animate-spin mr-2"/> : null} Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-2 space-y-1">
              {channels?.filter(c => c.type === 'text').length > 0 && <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">TEXT CHANNELS</p>}
              {channels?.filter(c => c.type === 'text').map(channel => (
                <Button key={channel.id} variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:bg-primary/10 hover:text-primary">
                  <Link href={`/servers/${serverId}/channels/${channel.id}`}>
                    <HashIcon className="h-4 w-4 mr-2"/> {channel.name}
                  </Link>
                </Button>
              ))}
              {channels?.filter(c => c.type === 'voice').length > 0 && <p className="mt-3 px-2 py-1 text-xs font-semibold text-muted-foreground">VOICE CHANNELS</p>}
              {channels?.filter(c => c.type === 'voice').map(channel => (
                 <Button key={channel.id} variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:bg-primary/10 hover:text-primary">
                  <Link href={`/servers/${serverId}/voice/${channel.id}`}>
                    <VoicemailIcon className="h-4 w-4 mr-2"/> {channel.name}
                  </Link>
                </Button>
              ))}
               {channels?.length === 0 && <p className="p-2 text-sm text-muted-foreground">No channels yet.</p>}
            </CardContent>
          </ScrollArea>
        </Card>

        <div className="md:col-span-6 min-h-0">
          {/* This area will be replaced by the child route (channel page) */}
           <Card className="bg-card/70 backdrop-blur-sm holographic-border flex flex-col items-center justify-center text-center h-full">
            <CardContent className="p-6">
              <MessageSquareIcon className="h-24 w-24 text-muted-foreground/30 mx-auto mb-4"/>
              <h2 className="text-2xl font-semibold text-primary-foreground">Welcome to {server.name}!</h2>
              <p className="text-muted-foreground">Select a channel to start chatting or join a voice call.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-3 bg-card/70 backdrop-blur-sm holographic-border flex flex-col min-h-0">
          <CardHeader className="py-3 px-4 border-b border-border/50">
            <CardTitle className="text-lg">Members ({members?.length || 0})</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-2 space-y-1">
              {isLoadingMembers && <LoaderCircle className="mx-auto my-4 h-6 w-6 animate-spin text-primary" />}
              {membersError && <p className="p-2 text-sm text-destructive">Error loading members.</p>}
              {members?.map(member => (
                <div key={member.uid} className="flex items-center p-2 rounded hover:bg-primary/10 cursor-pointer">
                  <Avatar className="h-8 w-8 mr-2 border border-primary/50">
                    <AvatarImage src={member.photoURL || `https://picsum.photos/seed/${member.uid}/40/40`} data-ai-hint="abstract avatar" />
                    <AvatarFallback className="text-xs bg-secondary">{member.displayName?.substring(0,2).toUpperCase() || '??'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground truncate flex-grow">{member.displayName || member.email}</span>
                  {/* Real online status is complex, for now a placeholder */}
                  <span className={`h-2.5 w-2.5 rounded-full bg-gray-500 opacity-50`}></span> 
                </div>
              ))}
              {members?.length === 0 && !isLoadingMembers && <p className="p-2 text-sm text-muted-foreground">No members found.</p>}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
