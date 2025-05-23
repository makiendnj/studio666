
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlusIcon, UsersIcon, ListChecksIcon, SearchIcon } from "lucide-react";
import { MyFriendsList } from '@/components/friends/MyFriendsList';
import { FriendRequestsList } from '@/components/friends/FriendRequestsList';
import { AddFriendSection } from '@/components/friends/AddFriendSection';

export default function FriendsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="bg-card/80 backdrop-blur-sm holographic-border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            <UsersIcon className="mr-3 h-8 w-8 text-primary" /> Your Connections
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your friends, pending requests, and find new people to connect with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my-friends" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6 bg-input/30">
              <TabsTrigger value="my-friends" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <UsersIcon className="mr-2 h-5 w-5" /> My Friends
              </TabsTrigger>
              <TabsTrigger value="requests" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <ListChecksIcon className="mr-2 h-5 w-5" /> Requests
              </TabsTrigger>
              <TabsTrigger value="add-friend" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <UserPlusIcon className="mr-2 h-5 w-5" /> Add Friend
              </TabsTrigger>
            </TabsList>
            <TabsContent value="my-friends">
              <Card className="bg-input/20">
                <CardHeader>
                  <CardTitle className="text-xl">My Friends</CardTitle>
                  <CardDescription>View and manage your current friends.</CardDescription>
                </CardHeader>
                <CardContent>
                  <MyFriendsList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="requests">
              <Card className="bg-input/20">
                <CardHeader>
                  <CardTitle className="text-xl">Friend Requests</CardTitle>
                  <CardDescription>Manage incoming and view outgoing friend requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FriendRequestsList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="add-friend">
              <Card className="bg-input/20">
                <CardHeader>
                  <CardTitle className="text-xl">Add New Friend</CardTitle>
                  <CardDescription>Search for users by their display name or email.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AddFriendSection />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
