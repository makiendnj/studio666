
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftIcon, ShieldAlertIcon, Trash2Icon, WrenchIcon, LoaderCircle, UsersIcon } from "lucide-react"; // Added UsersIcon
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthenticatedLayoutClientShell";
import { getServerDetails, updateServer, deleteServer as apiDeleteServer } from "@/services/server";
import type { Server } from "@/types/db";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function ServerSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.serverId as string;
  const { toast } = useToast();
  const { firebaseUser, userProfile, isLoading: authLoading } = useAuth();

  const [server, setServer] = useState<Server | null>(null);
  const [serverName, setServerName] = useState("");
  const [serverDescription, setServerDescription] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (serverId) {
      setIsLoadingData(true);
      getServerDetails(serverId)
        .then(data => {
          if (data) {
            setServer(data);
            setServerName(data.name);
            setServerDescription(data.description || "");
          } else {
            toast({ title: "Error", description: "Server not found.", variant: "destructive" });
            router.push("/servers");
          }
        })
        .catch(err => {
          console.error("Error fetching server details:", err);
          toast({ title: "Error", description: "Failed to load server details.", variant: "destructive" });
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [serverId, router, toast]);

  // Redirect if user is not the owner
  useEffect(() => {
    if (!authLoading && server && firebaseUser && server.ownerId !== firebaseUser.uid) {
      toast({ title: "Unauthorized", description: "You are not the owner of this server.", variant: "destructive" });
      router.replace(`/servers/${serverId}`);
    }
  }, [authLoading, server, firebaseUser, serverId, router, toast]);


  const handleSaveChanges = async () => {
    if (!server) return;
    setIsSaving(true);
    try {
      await updateServer(serverId, { name: serverName, description: serverDescription });
      toast({ title: "Settings Saved", description: "Server settings have been updated." });
      // Optionally refetch server data or update local state more directly
      setServer(prev => prev ? {...prev, name: serverName, description: serverDescription} : null);
    } catch (error) {
      console.error("Error saving server settings:", error);
      toast({ title: "Save Failed", description: "Could not update server settings.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteServer = async () => {
     if (!server) return;
     setIsDeleting(true);
     try {
        await apiDeleteServer(serverId);
        toast({ title: "Server Deleted", description: `Server "${server.name}" has been permanently deleted.` });
        router.push("/servers");
     } catch (error) {
        console.error("Error deleting server:", error);
        toast({ title: "Deletion Failed", description: "Could not delete the server.", variant: "destructive" });
     } finally {
        setIsDeleting(false);
     }
  };

  if (isLoadingData || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Loading Settings...</p>
      </div>
    );
  }

  if (!server || (server && firebaseUser && server.ownerId !== firebaseUser.uid)) {
    // This state should ideally be caught by the redirect logic above,
    // but serves as a fallback.
    return (
      <div className="container mx-auto py-8 max-w-3xl text-center">
        <p className="text-muted-foreground">Server not found or you do not have permission to view these settings.</p>
         <Button variant="link" asChild className="mt-4">
            <Link href="/servers">Go to Servers</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Button variant="ghost" asChild className="mb-6 text-muted-foreground hover:text-primary">
        <Link href={`/servers/${serverId}`}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Server
        </Link>
      </Button>
      <Card className="bg-card/80 backdrop-blur-sm holographic-border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Server Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage and customize <span className="font-semibold text-primary">{server.name}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* General Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground flex items-center">
              <WrenchIcon className="mr-2 h-6 w-6 text-primary" /> General
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="serverName" className="text-muted-foreground">Server Name</Label>
                <Input id="serverName" value={serverName} onChange={(e) => setServerName(e.target.value)} className="mt-1 bg-input/50 focus:bg-input/70" disabled={isSaving}/>
              </div>
              <div>
                <Label htmlFor="serverDescription" className="text-muted-foreground">Server Description</Label>
                <Textarea id="serverDescription" value={serverDescription} onChange={(e) => setServerDescription(e.target.value)} className="mt-1 min-h-[100px] bg-input/50 focus:bg-input/70" disabled={isSaving}/>
              </div>
               <Button variant="outline" className="w-full border-dashed border-border/70 hover:border-accent hover:text-accent" disabled>
                Upload Server Icon (Coming Soon)
              </Button>
              <Button onClick={handleSaveChanges} className="w-full holographic-glow-primary hover:holographic-glow-accent" disabled={isSaving}>
                {isSaving ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin"/> : null}
                Save General Settings
              </Button>
            </div>
          </section>

          <Separator className="border-border/30" />

          {/* Roles & Permissions */}
          <section>
             <h2 className="text-xl font-semibold mb-4 text-primary-foreground flex items-center">
              <UsersIcon className="mr-2 h-6 w-6 text-primary" /> Roles & Permissions
            </h2>
            <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-primary hover:border-primary" disabled>
              Manage Roles (Coming Soon)
            </Button>
          </section>

          <Separator className="border-border/30" />
          
          {/* Moderation */}
           <section>
             <h2 className="text-xl font-semibold mb-4 text-primary-foreground flex items-center">
              <ShieldAlertIcon className="mr-2 h-6 w-6 text-primary" /> Moderation
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                <Label htmlFor="content-filter" className="text-muted-foreground">Content Filter Level</Label>
                <span className="text-sm text-accent">Medium (Default)</span>
              </div>
               <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-primary hover:border-primary" disabled>
                 Configure Moderation Settings (Coming Soon)
              </Button>
            </div>
          </section>

          <Separator className="border-border/30" />

          {/* Danger Zone */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-red-500">Danger Zone</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={isDeleting}>
                  {isDeleting ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin"/> : <Trash2Icon className="mr-2 h-5 w-5" />}
                  Delete Server
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card holographic-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    server "{server.name}" and all of its associated data, including channels and messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteServer} disabled={isDeleting} className="bg-destructive hover:bg-destructive/80 text-destructive-foreground">
                    {isDeleting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Yes, delete server
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This action is irreversible. All data associated with this server will be permanently lost.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
