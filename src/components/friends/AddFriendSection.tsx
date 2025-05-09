
"use client";

import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { sendFriendRequest, searchUsers } from '@/services/friend';
import { useAuth } from '@/app/(app)/AuthenticatedLayoutClientShell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoaderCircle, UserPlusIcon, SearchIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/db';

export const AddFriendSection: React.FC = () => {
  const { firebaseUser, userProfile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');


  const { data: searchResults, isLoading: isLoadingSearch, refetch: refetchSearch } = useQuery({
    queryKey: ['userSearch', submittedQuery, firebaseUser?.uid],
    queryFn: () => searchUsers(firebaseUser!.uid, submittedQuery),
    enabled: false, // Only run when refetchSearch is called
  });
  
  const sendRequestMutation = useMutation({
    mutationFn: (receiverEmail: string) => 
      sendFriendRequest(firebaseUser!.uid, userProfile!.displayName || userProfile!.email!, userProfile!.photoURL, receiverEmail),
    onSuccess: (data, variables) => {
      toast({ title: "Friend Request Sent!", description: `Request sent to ${variables}.` });
      queryClient.invalidateQueries({ queryKey: ['friendRequests', firebaseUser?.uid] });
      // Potentially clear search or update UI for the specific user
      setSubmittedQuery(''); // Clear search results after sending request
      setSearchQuery('');
    },
    onError: (err: Error) => {
      toast({ title: "Error Sending Request", description: err.message, variant: "destructive" });
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
      // Trigger the query manually
      setTimeout(() => refetchSearch(), 0); 
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter email or display name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-input/50 focus:bg-input/70"
        />
        <Button type="submit" disabled={isLoadingSearch || !searchQuery.trim()} className="holographic-glow-accent">
          {isLoadingSearch ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
          <span className="sr-only">Search</span>
        </Button>
      </form>

      {isLoadingSearch && (
        <div className="flex justify-center items-center py-4">
          <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Searching...</p>
        </div>
      )}

      {submittedQuery && !isLoadingSearch && (!searchResults || searchResults.length === 0) && (
        <p className="text-center text-muted-foreground py-4">No users found matching &quot;{submittedQuery}&quot;.</p>
      )}

      {searchResults && searchResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-primary-foreground">Search Results:</h4>
          {searchResults.map((user) => (
            <div key={user.uid} className="flex items-center justify-between p-3 bg-input/30 rounded-md">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-primary/30">
                   <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/64/64`} alt={user.displayName || user.email!} data-ai-hint="abstract profile"/>
                  <AvatarFallback className="bg-secondary text-xs">{user.displayName?.substring(0,2).toUpperCase() || user.email!.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground/90 text-sm">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => sendRequestMutation.mutate(user.email!)}
                disabled={sendRequestMutation.isPending && sendRequestMutation.variables === user.email}
                className="text-xs"
              >
                {sendRequestMutation.isPending && sendRequestMutation.variables === user.email ? (
                    <LoaderCircle className="mr-1 h-4 w-4 animate-spin"/>
                ) : (
                    <UserPlusIcon className="mr-1 h-4 w-4"/>
                )}
                Add Friend
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
