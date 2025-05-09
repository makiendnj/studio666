
"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFriends, removeFriend } from '@/services/friend';
import { useAuth } from '@/app/(app)/AuthenticatedLayoutClientShell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoaderCircle, UserXIcon, UsersIcon, MessageSquareIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export const MyFriendsList: React.FC = () => {
  const { firebaseUser } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: friends, isLoading, error } = useQuery({
    queryKey: ['friends', firebaseUser?.uid],
    queryFn: () => getFriends(firebaseUser!.uid),
    enabled: !!firebaseUser,
  });

  const removeFriendMutation = useMutation({
    mutationFn: (friendId: string) => removeFriend(firebaseUser!.uid, friendId),
    onSuccess: () => {
      toast({ title: "Friend Removed", description: "They are no longer in your connections." });
      queryClient.invalidateQueries({ queryKey: ['friends', firebaseUser?.uid] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests', firebaseUser?.uid] }); // In case it affects request status
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading friends...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-destructive py-4">Error loading friends: {error.message}</p>;
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <UsersIcon className="mx-auto mt-4 h-16 w-16 opacity-30" />
        <p className="mt-4 text-lg">No friends yet.</p>
        <p className="text-sm">Why not add some new connections?</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <Card key={friend.uid} className="bg-input/40 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/50">
                <AvatarImage src={friend.photoURL || `https://picsum.photos/seed/${friend.uid}/64/64`} alt={friend.displayName || 'User'} data-ai-hint="abstract avatar" />
                <AvatarFallback className="bg-secondary text-xs">{friend.displayName?.substring(0, 2).toUpperCase() || '??'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-primary-foreground">{friend.displayName || friend.email}</h3>
                <p className="text-xs text-muted-foreground">{friend.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* Placeholder for direct message button */}
              <Button variant="outline" size="icon" className="text-primary border-primary hover:bg-primary/10" disabled>
                <MessageSquareIcon className="h-5 w-5" />
                <span className="sr-only">Message {friend.displayName}</span>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeFriendMutation.mutate(friend.uid)}
                disabled={removeFriendMutation.isPending}
                className="bg-destructive/80 hover:bg-destructive"
              >
                {removeFriendMutation.isPending && removeFriendMutation.variables === friend.uid ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <UserXIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Remove {friend.displayName}</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
