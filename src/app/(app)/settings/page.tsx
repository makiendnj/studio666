
"use client";

import { useMockAuth } from "../AuthenticatedLayoutClientShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BellIcon, PaletteIcon, ShieldCheckIcon, LogOutIcon, UserCogIcon, InfoIcon, MessageCircleQuestionIcon } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, signOut } = useMockAuth();

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card className="bg-card/80 backdrop-blur-sm holographic-border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            App Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Customize your Reverie experience and manage your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Account Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground flex items-center">
              <UserCogIcon className="mr-2 h-6 w-6 text-primary" /> Account
            </h2>
            <div className="space-y-4">
              <Button variant="outline" asChild className="w-full justify-start text-muted-foreground hover:text-primary hover:border-primary">
                <Link href="/profile">Edit Profile</Link>
              </Button>
              <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                <Label htmlFor="privacy-mode" className="text-muted-foreground">Privacy Mode</Label>
                <Switch id="privacy-mode" className="data-[state=checked]:bg-accent" />
              </div>
            </div>
          </section>

          <Separator className="border-border/30" />

          {/* Notifications Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground flex items-center">
              <BellIcon className="mr-2 h-6 w-6 text-primary" /> Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                <Label htmlFor="desktop-notifications" className="text-muted-foreground">Desktop Notifications</Label>
                <Switch id="desktop-notifications" checked className="data-[state=checked]:bg-accent"/>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                <Label htmlFor="sound-notifications" className="text-muted-foreground">Notification Sounds</Label>
                <Switch id="sound-notifications" checked className="data-[state=checked]:bg-accent"/>
              </div>
            </div>
          </section>
          
          <Separator className="border-border/30" />

          {/* Appearance Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground flex items-center">
              <PaletteIcon className="mr-2 h-6 w-6 text-primary" /> Appearance
            </h2>
             <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-accent hover:border-accent">
               Change Theme (Coming Soon...)
            </Button>
          </section>

          {user?.isAdmin && (
            <>
              <Separator className="border-border/30" />
              <section>
                <h2 className="text-xl font-semibold mb-4 text-red-500 flex items-center">
                  <ShieldCheckIcon className="mr-2 h-6 w-6 text-red-500" /> Admin Panel
                </h2>
                <Button variant="destructive" asChild className="w-full justify-start">
                  <Link href="/admin">Access Admin Dashboard</Link>
                </Button>
              </section>
            </>
          )}

          <Separator className="border-border/30" />
          
          {/* About & Support Section */}
           <section>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground flex items-center">
              <InfoIcon className="mr-2 h-6 w-6 text-primary" /> About & Support
            </h2>
            <div className="space-y-4">
               <Button variant="outline" asChild className="w-full justify-start text-muted-foreground hover:text-primary hover:border-primary">
                <Link href="/about">About Reverie</Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start text-muted-foreground hover:text-primary hover:border-primary">
                <Link href="/support">
                  <MessageCircleQuestionIcon className="mr-2 h-5 w-5"/> Help & Support
                </Link>
              </Button>
            </div>
          </section>

          <Separator className="border-border/30" />

          <Button variant="ghost" onClick={signOut} className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOutIcon className="mr-2 h-5 w-5"/> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
