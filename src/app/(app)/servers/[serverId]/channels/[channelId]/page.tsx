
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeftIcon, PaperclipIcon, SendIcon, SmileIcon, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../../AuthenticatedLayoutClientShell";
import { getChannelDetails } from "@/services/channel";
import { sendMessage, getMessagesListener } from "@/services/message";
import type { Channel, Message } from "@/types/db";
import { format } from 'date-fns'; // For timestamp formatting

export default function TextChannelPage() {
  const params = useParams();
  const { firebaseUser, userProfile } = useAuth();
  const serverId = params.serverId as string;
  const channelId = params.channelId as string;
  
  const [channelDetails, setChannelDetails] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingChannel, setIsLoadingChannel] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!serverId || !channelId) return;
    setIsLoadingChannel(true);
    getChannelDetails(serverId, channelId)
      .then(details => {
        setChannelDetails(details);
      })
      .catch(error => console.error("Error fetching channel details:", error))
      .finally(() => setIsLoadingChannel(false));
  }, [serverId, channelId]);

  useEffect(() => {
    if (!serverId || !channelId) return () => {};

    const unsubscribe = getMessagesListener(serverId, channelId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [serverId, channelId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !firebaseUser || !userProfile || !channelDetails) return;
    
    setIsSending(true);
    try {
      await sendMessage(
        serverId, 
        channelId, 
        firebaseUser.uid, 
        userProfile.displayName || userProfile.email || "User", 
        newMessage.trim(),
        userProfile.photoURL || `User${firebaseUser.uid.substring(0,5)}` // Use photoURL or fallback seed
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Show toast or error message
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingChannel) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg holographic-border overflow-hidden">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading channel...</p>
      </div>
    );
  }

  if (!channelDetails) {
    return <div className="p-4 text-center text-destructive">Channel not found.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-1rem)] md:h-full bg-card/50 backdrop-blur-sm rounded-lg holographic-border overflow-hidden">
      <header className="p-3 border-b border-border/50 flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2 md:hidden text-muted-foreground hover:text-primary">
             <Link href={`/servers/${serverId}`}>
                <ArrowLeftIcon className="h-5 w-5"/>
             </Link>
          </Button>
          <h2 className="text-lg font-semibold text-primary-foreground"># {channelDetails.name}</h2>
        </div>
        {channelDetails.topic && <p className="text-xs text-muted-foreground truncate hidden md:block">{channelDetails.topic}</p>}
      </header>

      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.userId === firebaseUser?.uid ? "justify-end" : ""}`}>
            {msg.userId !== firebaseUser?.uid && (
              <Avatar className="h-10 w-10 border border-primary/30">
                <AvatarImage src={msg.userAvatarSeed && !msg.userAvatarSeed.startsWith('User') ? msg.userAvatarSeed : `https://picsum.photos/seed/${msg.userAvatarSeed || msg.userId}/40/40`} data-ai-hint="abstract avatar"/>
                <AvatarFallback className="bg-secondary text-xs">{msg.userName.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div className={`flex flex-col max-w-[70%] ${msg.userId === firebaseUser?.uid ? "items-end" : "items-start"}`}>
              <div className={`p-3 rounded-lg shadow ${
                msg.userId === firebaseUser?.uid 
                ? "bg-primary text-primary-foreground rounded-br-none" 
                : "bg-input/70 text-foreground rounded-bl-none"
              }`}>
                {msg.userId !== firebaseUser?.uid && (
                  <p className={`text-xs font-semibold mb-1 ${userProfile?.uid === msg.userId && userProfile?.isAdmin ? 'text-accent' : 'text-muted-foreground'}`}>{msg.userName}</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              <span className="text-xs text-muted-foreground/70 mt-1">
                {msg.timestamp?.seconds ? format(new Date(msg.timestamp.seconds * 1000), 'p') : 'Sending...'}
              </span>
            </div>
             {msg.userId === firebaseUser?.uid && (
              <Avatar className="h-10 w-10 border border-primary/30">
                <AvatarImage src={userProfile?.photoURL || `https://picsum.photos/seed/${userProfile?.displayName || firebaseUser.uid}/40/40`} data-ai-hint="abstract avatar"/>
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{userProfile?.displayName?.substring(0,2).toUpperCase() || 'ME'}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <footer className="p-3 border-t border-border/50 sticky bottom-0 bg-card/80 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-accent" disabled>
            <PaperclipIcon className="h-5 w-5"/>
          </Button>
          <Input 
            type="text" 
            placeholder={`Message #${channelDetails.name}`} 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow bg-input/50 focus:bg-input/70 border-border/50" 
            disabled={isSending}
          />
          <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-accent" disabled>
            <SmileIcon className="h-5 w-5"/>
          </Button>
          <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/80 holographic-glow-accent" disabled={isSending || !newMessage.trim()}>
            {isSending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : <SendIcon className="h-5 w-5"/>}
          </Button>
        </form>
      </footer>
    </div>
  );
}
