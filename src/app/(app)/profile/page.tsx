
"use client";

import { useMockAuth } from "../AuthenticatedLayoutClientShell";
import { UserAvatarWithBadge } from "@/components/layout/UserAvatarWithBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Edit3Icon, SaveIcon, PaletteIcon, ShieldAlertIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function ProfilePage() {
  const { user, signOut } = useMockAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = React.useState(user?.email?.split('@')[0] || "Reverie User");
  const [bio, setBio] = React.useState("Exploring the timestreams...");
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSaveProfile = () => {
    // Mock save
    toast({ title: "Profile Updated", description: "Your changes have been saved (mocked)." });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="bg-card/80 backdrop-blur-sm holographic-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <UserAvatarWithBadge 
              userEmail={user?.email} 
              isAdmin={user?.isAdmin} 
              isPioneer={user?.isPioneer} 
              avatarSize="large"
            />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Your Profile
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your Reverie identity and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled className="mt-1 bg-input/30"/>
          </div>

          <div>
            <Label htmlFor="displayName" className="text-muted-foreground">Display Name</Label>
            <Input 
              id="displayName" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              disabled={!isEditing}
              className="mt-1 bg-input/50 focus:bg-input/70"
            />
          </div>
          
          <div>
            <Label htmlFor="bio" className="text-muted-foreground">Bio</Label>
            <Textarea 
              id="bio" 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              placeholder="Tell us about your adventures in time..." 
              className="mt-1 min-h-[100px] bg-input/50 focus:bg-input/70"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            {isEditing ? (
              <Button onClick={handleSaveProfile} className="holographic-glow-accent">
                <SaveIcon className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="text-primary border-primary hover:bg-primary/10">
                <Edit3Icon className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
          
          <Separator className="my-6 border-border/50"/>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">Appearance</h3>
            <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-accent hover:border-accent">
              <PaletteIcon className="mr-2 h-5 w-5 text-accent"/> Customize Theme (Coming Soon)
            </Button>
          </div>

          <Separator className="my-6 border-border/50"/>
          
          <Button variant="destructive" onClick={signOut} className="w-full">
             <ShieldAlertIcon className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
