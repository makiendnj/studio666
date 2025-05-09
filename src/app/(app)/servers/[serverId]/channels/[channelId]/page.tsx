"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeftIcon, PaperclipIcon, SendIcon, SmileIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

// Mock messages
const mockMessages = [
  { id: "m1", userId: "u1", userName: "TimeTraveler101", avatarSeed: "User300", text: "Hello from the past!", timestamp: "10:00 AM" },
  { id: "m2", userId: "u2", userName: "FutureScout", avatarSeed: "User301", text: "Greetings from the future! How's the 21st century?", timestamp: "10:01 AM" },
  { id: "m3", userId: "u1", userName: "TimeTraveler101", avatarSeed: "User300", text: "It's... eventful. You wouldn't believe the price of bread.", timestamp: "10:02 AM" },
  { id: "m4", userId: "u3", userName: "ChronoAdmin", avatarSeed: "UserAdmin", text: "Please keep discussions on-topic. This channel is for #general-chat.", timestamp: "10:05 AM", isAdmin: true },
];

// Mock current user for message alignment
const currentMockUserId = "u1"; // Assume current user is TimeTraveler101 for demo

export default function TextChannelPage() {
  const params = useParams();
  const serverId = params.serverId as string;
  const channelId = params.channelId as string;
  const [newMessage, setNewMessage] = React.useState("");

  // In a real app, fetch channel details and messages
  const channelName = `Channel ${channelId.replace('c','')}`; // Mock channel name

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    // Mock sending message
    console.log("Sending message:", newMessage);
    // Add to mockMessages, update UI etc.
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-1rem)] md:h-[calc(100vh-1rem)] bg-card/50 backdrop-blur-sm rounded-lg holographic-border overflow-hidden">
      {/* Channel Header */}
      <header className="p-3 border-b border-border/50 flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2 md:hidden text-muted-foreground hover:text-primary">
             <Link href={`/servers/${serverId}`}>
                <ArrowLeftIcon className="h-5 w-5"/>
             </Link>
          </Button>
          <h2 className="text-lg font-semibold text-primary-foreground"># {channelName}</h2>
        </div>
        {/* Add channel topic or options here */}
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-grow p-4 space-y-4">
        {mockMessages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.userId === currentMockUserId ? "justify-end" : ""}`}>
            {msg.userId !== currentMockUserId && (
              <Avatar className="h-10 w-10 border border-primary/30">
                <AvatarImage src={`https://picsum.photos/seed/${msg.avatarSeed}/40/40`} data-ai-hint="abstract avatar"/>
                <AvatarFallback className="bg-secondary text-xs">{msg.userName.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div className={`flex flex-col max-w-[70%] ${msg.userId === currentMockUserId ? "items-end" : "items-start"}`}>
              <div className={`p-3 rounded-lg shadow ${
                msg.userId === currentMockUserId 
                ? "bg-primary text-primary-foreground rounded-br-none" 
                : "bg-input/70 text-foreground rounded-bl-none"
              }`}>
                {msg.userId !== currentMockUserId && (
                  <p className={`text-xs font-semibold mb-1 ${msg.isAdmin ? 'text-accent' : 'text-muted-foreground'}`}>{msg.userName}</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              <span className="text-xs text-muted-foreground/70 mt-1">{msg.timestamp}</span>
            </div>
             {msg.userId === currentMockUserId && (
              <Avatar className="h-10 w-10 border border-primary/30">
                <AvatarImage src={`https://picsum.photos/seed/${msg.avatarSeed}/40/40`} data-ai-hint="abstract avatar"/>
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{msg.userName.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </ScrollArea>

      {/* Message Input Area */}
      <footer className="p-3 border-t border-border/50 sticky bottom-0 bg-card/80 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-accent">
            <PaperclipIcon className="h-5 w-5"/>
          </Button>
          <Input 
            type="text" 
            placeholder={`Message #${channelName}`} 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-input/50 focus:bg-input/70 border-border/50" 
          />
          <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-accent">
            <SmileIcon className="h-5 w-5"/>
          </Button>
          <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/80 holographic-glow-accent">
            <SendIcon className="h-5 w-5"/>
          </Button>
        </form>
      </footer>
    </div>
  );
}
