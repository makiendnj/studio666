
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircleIcon, UsersIcon, Settings2Icon, ArrowRightIcon, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../AuthenticatedLayoutClientShell";
import { useQuery } from "@tanstack/react-query";
import { getServersForUser, getAllServers } from "@/services/server"; // Using getAllServers for now, can scope to user later
import type { Server } from "@/types/db";

export default function ServersPage() {
  const { firebaseUser, userProfile } = useAuth();

  // Fetch all servers for now. In a real app, you might fetch servers the user is a member of.
  const { data: servers, isLoading, error } = useQuery<Server[]>({
    queryKey: ['servers', firebaseUser?.uid], // Re-fetch if user changes
    queryFn: async () => {
      if (!firebaseUser) return [];
      // return getServersForUser(firebaseUser.uid); // If you want to show only user's servers
      return getAllServers(); // For discoverability, showing all servers
    },
    enabled: !!firebaseUser, // Only run query if user is available
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading servers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-destructive">
        Error loading servers: {error.message}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Explore Servers
        </h1>
        <Button asChild className="holographic-glow-primary hover:holographic-glow-accent transition-all duration-300">
          <Link href="/servers/create">
            <PlusCircleIcon className="mr-2 h-5 w-5" /> Create New Server
          </Link>
        </Button>
      </div>

      {!servers || servers.length === 0 ? (
        <Card className="text-center py-12 bg-card/80 backdrop-blur-sm holographic-border">
          <CardHeader>
            <CardTitle className="text-2xl">No Servers Yet!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              It looks a bit empty here. Why not create the first server or join one?
            </p>
            <UsersIcon className="h-24 w-24 mx-auto text-muted-foreground/50 my-6" />
          </CardContent>
          <CardFooter className="justify-center">
             <Button asChild className="holographic-glow-primary">
              <Link href="/servers/create">
                <PlusCircleIcon className="mr-2 h-5 w-5" /> Create a Server
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <Card key={server.id} className="bg-card/70 backdrop-blur-sm hover:shadow-accent/20 shadow-lg transition-all duration-300 transform hover:-translate-y-1 holographic-border overflow-hidden group">
              <CardHeader className="p-0">
                 <Image 
                  src={server.bannerUrl || `https://picsum.photos/seed/${server.id}/400/200`} 
                  alt={`${server.name} banner`}
                  width={400} 
                  height={200} 
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={server.description && server.description.length > 5 ? server.description.split(" ").slice(0,2).join(" ") : "abstract landscape"} // AI hint from description or generic
                 />
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{server.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground h-10 overflow-hidden mb-3">{server.description || "No description available."}</CardDescription>
                <div className="flex items-center text-xs text-muted-foreground gap-4">
                  <span className="flex items-center"><UsersIcon className="h-3 w-3 mr-1 text-primary/70"/> {server.members?.length || 0} members</span>
                  {/* Online count would require more complex presence system */}
                  {/* <span className="flex items-center"><span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> {0} online</span> */}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button asChild variant="default" size="sm" className="holographic-glow-primary group-hover:holographic-glow-accent transition-all">
                  <Link href={`/servers/${server.id}`}>
                    Enter Server <ArrowRightIcon className="ml-1 h-4 w-4"/>
                  </Link>
                </Button>
                {/* Only show settings if current user is the owner */}
                {userProfile?.uid === server.ownerId && (
                  <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                    <Link href={`/servers/${server.id}/settings`}>
                      <Settings2Icon className="h-5 w-5" />
                      <span className="sr-only">Server Settings</span>
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
