"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftIcon, ShieldAlertIcon, Trash2Icon, UserPlusIcon, UsersIcon, WrenchIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function ServerSettingsPage() {
  const params = useParams();
  const serverId = params.serverId as string;
  const { toast } = useToast();

  // Mock server data (in a real app, fetch this)
  const [serverName, setServerName] = React.useState(`Server ${serverId} Name`);
  const [serverDescription, setServerDescription] = React.useState("A placeholder description for this awesome server.");

  const handleSaveChanges = () => {
    toast({ title: "Settings Saved", description: "Server settings have been updated (mocked)." });
  };
  
  const handleDeleteServer = () => {
     toast({ title: "Server Deletion Initiated", description: "This is a critical action (mocked).", variant: "destructive" });
  };

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
            Manage and customize <span className="font-semibold text-primary">{serverName}</span>.
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
                <Input id="serverName" value={serverName} onChange={(e) => setServerName(e.target.value)} className="mt-1 bg-input/50 focus:bg-input/70"/>
              </div>
              <div>
                <Label htmlFor="serverDescription" className="text-muted-foreground">Server Description</Label>
                <Textarea id="serverDescription" value={serverDescription} onChange={(e) => setServerDescription(e.target.value)} className="mt-1 min-h-[100px] bg-input/50 focus:bg-input/70"/>
              </div>
               <Button variant="outline" className="w-full border-dashed border-border/70 hover:border-accent hover:text-accent">
                Upload Server Icon (Coming Soon)
              </Button>
              <Button onClick={handleSaveChanges} className="w-full holographic-glow-primary hover:holographic-glow-accent">Save General Settings</Button>
            </div>
          </section>

          <Separator className="border-border/30" />

          {/* Roles & Permissions */}
          <section>
             <h2 className="text-xl font-semibold mb-4 text-primary-foreground flex items-center">
              <UsersIcon className="mr-2 h-6 w-6 text-primary" /> Roles & Permissions
            </h2>
            <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-primary hover:border-primary">
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
               <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-primary hover:border-primary">
                 Configure Moderation Settings (Coming Soon)
              </Button>
            </div>
          </section>

          <Separator className="border-border/30" />

          {/* Danger Zone */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-red-500">Danger Zone</h2>
            <Button variant="destructive" onClick={handleDeleteServer} className="w-full">
              <Trash2Icon className="mr-2 h-5 w-5" /> Delete Server
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This action is irreversible. All data associated with this server will be permanently lost.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
