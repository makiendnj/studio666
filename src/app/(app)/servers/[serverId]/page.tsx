"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, CogIcon, HashIcon, MessageSquareIcon, PlusIcon, UsersIcon, VoicemailIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

// Mock data
const mockServerDetails = {
  name: "Temporal Hub",
  description: "Central nexus for all time travelers.",
  bannerUrl: "https://picsum.photos/seed/TemporalHubBanner/1200/300",
  aiHint: "futuristic cityscape",
  channels: [
    { id: "c1", name: "general-chat", type: "text" },
    { id: "c2", name: "announcements", type: "text" },
    { id: "c3", name: "paradox-reports", type: "text" },
    { id: "v1", name: "Nexus Lounge", type: "voice" },
    { id: "v2", name: "Research Lab", type: "voice" },
  ],
  members: Array.from({ length: 25 }, (_, i) => ({ 
    id: `u${i}`, 
    name: `TimeTraveler${i + 101}`, 
    avatarSeed: `User${i+300}`,
    status: Math.random() > 0.3 ? "online" : "offline",
  })),
};

export default function ServerPage() {
  const params = useParams();
  const serverId = params.serverId as string;
  // In a real app, fetch server details based on serverId
  const server = mockServerDetails; 

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-1rem)] md:h-[calc(100vh-1rem)]"> {/* Adjust for potential header and padding */}
      {/* Header */}
      <header className="relative h-40 md:h-56 mb-4 rounded-lg overflow-hidden shadow-lg">
        <Image 
          src={server.bannerUrl} 
          alt={`${server.name} Banner`} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint={server.aiHint}
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
        <Button variant="ghost" asChild className="absolute top-2 right-2 text-white hover:bg-white/20 backdrop-blur-sm">
          <Link href={`/servers/${serverId}/settings`}>
            <CogIcon className="h-5 w-5" /> <span className="ml-1 hidden sm:inline">Settings</span>
          </Link>
        </Button>
      </header>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        {/* Channels Panel */}
        <Card className="md:col-span-3 bg-card/70 backdrop-blur-sm holographic-border flex flex-col min-h-0">
          <CardHeader className="py-3 px-4 border-b border-border/50">
            <CardTitle className="text-lg flex justify-between items-center">
              Channels <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-accent"><PlusIcon className="h-4 w-4"/></Button>
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-2 space-y-1">
              {server.channels.filter(c => c.type === 'text').length > 0 && <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">TEXT CHANNELS</p>}
              {server.channels.filter(c => c.type === 'text').map(channel => (
                <Button key={channel.id} variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:bg-primary/10 hover:text-primary">
                  <Link href={`/servers/${serverId}/channels/${channel.id}`}>
                    <HashIcon className="h-4 w-4 mr-2"/> {channel.name}
                  </Link>
                </Button>
              ))}
              {server.channels.filter(c => c.type === 'voice').length > 0 && <p className="mt-3 px-2 py-1 text-xs font-semibold text-muted-foreground">VOICE CHANNELS</p>}
              {server.channels.filter(c => c.type === 'voice').map(channel => (
                 <Button key={channel.id} variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:bg-primary/10 hover:text-primary">
                  <Link href={`/servers/${serverId}/voice/${channel.id}`}>
                    <VoicemailIcon className="h-4 w-4 mr-2"/> {channel.name}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Main Chat Area (Placeholder) */}
        <Card className="md:col-span-6 bg-card/70 backdrop-blur-sm holographic-border flex flex-col items-center justify-center text-center min-h-0">
          <CardContent className="p-6">
            <MessageSquareIcon className="h-24 w-24 text-muted-foreground/30 mx-auto mb-4"/>
            <h2 className="text-2xl font-semibold text-primary-foreground">Welcome to {server.name}!</h2>
            <p className="text-muted-foreground">Select a channel to start chatting or join a voice call.</p>
            <p className="text-xs text-muted-foreground/70 mt-2">(Chat functionality coming soon)</p>
          </CardContent>
        </Card>

        {/* Members Panel */}
        <Card className="md:col-span-3 bg-card/70 backdrop-blur-sm holographic-border flex flex-col min-h-0">
          <CardHeader className="py-3 px-4 border-b border-border/50">
            <CardTitle className="text-lg">Members ({server.members.length})</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-2 space-y-1">
              {server.members.map(member => (
                <div key={member.id} className="flex items-center p-2 rounded hover:bg-primary/10 cursor-pointer">
                  <Avatar className="h-8 w-8 mr-2 border border-primary/50">
                    <AvatarImage src={`https://picsum.photos/seed/${member.avatarSeed}/40/40`} data-ai-hint="abstract avatar" />
                    <AvatarFallback className="text-xs bg-secondary">{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground truncate flex-grow">{member.name}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${member.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500 opacity-50'}`}></span>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
