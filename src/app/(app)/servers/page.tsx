"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircleIcon, UsersIcon, Settings2Icon, ArrowRightIcon } from "lucide-react";
import Image from "next/image";

const mockServers = [
  { id: "1", name: "Temporal Hub", description: "Central nexus for all time travelers.", members: 1024, online: 768, imageSeed: "TemporalHub" , aiHint: "futuristic hub"},
  { id: "2", name: "Paradox Plaza", description: "Discuss anomalies and share your findings.", members: 480, online: 120, imageSeed: "ParadoxPlaza", aiHint: "abstract portal" },
  { id: "3", name: "Ancient Archives", description: "A quiet place for historical research.", members: 150, online: 30, imageSeed: "AncientArchives", aiHint: "old library" },
  { id: "4", name: "Future Forgers", description: "Collaborate on projects shaping tomorrow.", members: 800, online: 500, imageSeed: "FutureForgers", aiHint: "sci-fi city" },
];

export default function ServersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Your Servers
        </h1>
        <Button asChild className="holographic-glow-primary hover:holographic-glow-accent transition-all duration-300">
          <Link href="/servers/create">
            <PlusCircleIcon className="mr-2 h-5 w-5" /> Create New Server
          </Link>
        </Button>
      </div>

      {mockServers.length === 0 ? (
        <Card className="text-center py-12 bg-card/80 backdrop-blur-sm holographic-border">
          <CardHeader>
            <CardTitle className="text-2xl">No Servers Yet!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              It looks a bit empty here. Why not create your first server?
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
          {mockServers.map((server) => (
            <Card key={server.id} className="bg-card/70 backdrop-blur-sm hover:shadow-accent/20 shadow-lg transition-all duration-300 transform hover:-translate-y-1 holographic-border overflow-hidden group">
              <CardHeader className="p-0">
                 <Image 
                  src={`https://picsum.photos/seed/${server.imageSeed}/400/200`} 
                  alt={`${server.name} banner`}
                  width={400} 
                  height={200} 
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={server.aiHint}
                 />
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{server.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground h-10 overflow-hidden mb-3">{server.description}</CardDescription>
                <div className="flex items-center text-xs text-muted-foreground gap-4">
                  <span className="flex items-center"><UsersIcon className="h-3 w-3 mr-1 text-primary/70"/> {server.members} members</span>
                  <span className="flex items-center"><span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> {server.online} online</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button asChild variant="default" size="sm" className="holographic-glow-primary group-hover:holographic-glow-accent transition-all">
                  <Link href={`/servers/${server.id}`}>
                    Enter Server <ArrowRightIcon className="ml-1 h-4 w-4"/>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                  <Link href={`/servers/${server.id}/settings`}>
                    <Settings2Icon className="h-5 w-5" />
                    <span className="sr-only">Server Settings</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
