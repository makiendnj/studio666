
"use client";

import { useAuth } from "../AuthenticatedLayoutClientShell";
import { UserAvatarWithBadge } from "@/components/layout/UserAvatarWithBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Edit3Icon, SaveIcon, PaletteIcon, ShieldAlertIcon, LoaderCircle, UploadCloudIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { updateUserProfile } from "@/services/user";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For image uploads
import { app } from "@/lib/firebase"; // Ensure app is exported from firebase config

const storage = getStorage(app);

export default function ProfilePage() {
  const { firebaseUser, userProfile, signOut, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null | undefined>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setBio(userProfile.bio || "Exploring the timestreams...");
      setPhotoURL(userProfile.photoURL);
    }
  }, [userProfile]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewAvatarFile(file);
      // Optionally, preview the image locally
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string); // Show preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!firebaseUser) return;
    setIsSaving(true);

    let newPhotoURL = userProfile?.photoURL;

    if (newAvatarFile) {
      setIsUploading(true);
      try {
        const avatarRef = ref(storage, `avatars/${firebaseUser.uid}/${newAvatarFile.name}`);
        const snapshot = await uploadBytes(avatarRef, newAvatarFile);
        newPhotoURL = await getDownloadURL(snapshot.ref);
        setPhotoURL(newPhotoURL); // Update state with new URL from Firebase
        toast({ title: "Avatar Uploaded", description: "Your new avatar is saved." });
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast({ title: "Upload Failed", description: "Could not upload your new avatar.", variant: "destructive" });
        setIsSaving(false);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    try {
      await updateUserProfile(firebaseUser.uid, { 
        displayName, 
        bio,
        photoURL: newPhotoURL // Use the potentially updated photoURL
      });
      toast({ title: "Profile Updated", description: "Your changes have been saved." });
      setIsEditing(false);
      setNewAvatarFile(null); // Clear the selected file after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Update Failed", description: "Could not save your profile changes.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (authLoading || !userProfile && firebaseUser) {
     return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-foreground">Loading Profile...</p>
      </div>
    );
  }

  if (!firebaseUser) {
    // This case should ideally be handled by the AuthProvider redirecting
    return <p className="text-center text-muted-foreground">Please sign in to view your profile.</p>;
  }
  
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="bg-card/80 backdrop-blur-sm holographic-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6 relative">
            <UserAvatarWithBadge 
              userEmail={userProfile?.email} 
              displayName={displayName}
              photoURL={photoURL} // Use state variable for preview and actual URL
              isAdmin={userProfile?.isAdmin} 
              isPioneer={userProfile?.isPioneer} 
              avatarSize="large"
            />
             {isEditing && (
              <div className="absolute bottom-0 right-1/2 translate-x-[80px] mb-[-10px]">
                <Button asChild variant="outline" size="icon" className="rounded-full h-10 w-10 bg-card hover:bg-accent/20 border-accent text-accent">
                  <Label htmlFor="avatarUpload" className="cursor-pointer">
                    <UploadCloudIcon className="h-5 w-5" />
                  </Label>
                </Button>
                <Input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {displayName || "Your Profile"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your Reverie identity and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
            <Input id="email" type="email" value={userProfile?.email || ""} disabled className="mt-1 bg-input/30"/>
          </div>

          <div>
            <Label htmlFor="displayName" className="text-muted-foreground">Display Name</Label>
            <Input 
              id="displayName" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              disabled={!isEditing || isSaving}
              className="mt-1 bg-input/50 focus:bg-input/70"
            />
          </div>
          
          <div>
            <Label htmlFor="bio" className="text-muted-foreground">Bio</Label>
            <Textarea 
              id="bio" 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing || isSaving}
              placeholder="Tell us about your adventures in time..." 
              className="mt-1 min-h-[100px] bg-input/50 focus:bg-input/70"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            {isEditing ? (
              <Button onClick={handleSaveProfile} className="holographic-glow-accent" disabled={isSaving || isUploading}>
                {isSaving || isUploading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <SaveIcon className="mr-2 h-4 w-4" />}
                {isUploading ? "Uploading..." : (isSaving ? "Saving..." : "Save Changes")}
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
            <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-accent hover:border-accent" disabled>
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
