
"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFriendRequests, acceptFriendRequest, declineFriendRequest, cancelFriendRequest } from '@/services/friend';
import { useAuth } from '@/app/(app)/AuthenticatedLayoutClientShell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, CheckIcon, XIcon, MailQuestionIcon, SendIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import type { FriendRequest } from '@/types/db';

export const FriendRequestsList: React.FC = () => {
  const { firebaseUser } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['friendRequests', firebaseUser?.uid],
    queryFn: () => getFriendRequests(firebaseUser!.uid),
    enabled: !!firebaseUser,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', firebaseUser?.uid] });
      queryClient.invalidateQueries({ queryKey: ['friends', firebaseUser?.uid] }); // If accepting a request
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  };

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    ...mutationOptions,
    onSuccess: () => {
      toast({ title: "Friend Request Accepted!", description: "You are now connected." });
      mutationOptions.onSuccess();
    }
  });
  const declineMutation = useMutation({
    mutationFn: declineFriendRequest,
    ...mutationOptions,
     onSuccess: () => {
      toast({ title: "Friend Request Declined." });
      mutationOptions.onSuccess();
    }
  });
  const cancelMutation = useMutation({
    mutationFn: cancelFriendRequest,
    ...mutationOptions,
    onSuccess: () => {
      toast({ title: "Friend Request Cancelled." });
      mutationOptions.onSuccess();
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-destructive py-4">Error loading requests: {error.message}</p>;
  }

  const incomingRequests = requests?.incoming || [];
  const outgoingRequests = requests?.outgoing || [];

  const RequestCard: React.FC<{ request: FriendRequest, type: 'incoming' | 'outgoing' }> = ({ request, type }) => {
    const isProcessing = 
        (acceptMutation.isPending && acceptMutation.variables === request.id) ||
        (declineMutation.isPending && declineMutation.variables === request.id) ||
        (cancelMutation.isPending && cancelMutation.variables === request.id);

    return (
        <Card className="bg-input/40 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/30">
              <AvatarImage src={type === 'incoming' ? request.senderPhotoURL : `https://picsum.photos/seed/${request.receiverEmail}/64/64`} data-ai-hint="abstract avatar"/>
              <AvatarFallback className="bg-secondary text-xs">
                {type === 'incoming' ? request.senderDisplayName?.substring(0, 2).toUpperCase() : request.receiverEmail?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-foreground/90 text-sm">
                {type === 'incoming' ? request.senderDisplayName : request.receiverEmail}
              </h4>
              <p className="text-xs text-muted-foreground">
                Sent {request.createdAt?.seconds ? formatDistanceToNow(new Date(request.createdAt.seconds * 1000), { addSuffix: true }) : 'recently'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {type === 'incoming' && (
              <>
                <Button variant="ghost" size="icon" className="text-green-400 hover:bg-green-400/10 hover:text-green-300" onClick={() => acceptMutation.mutate(request.id)} disabled={isProcessing}>
                  {isProcessing && acceptMutation.variables === request.id ? <LoaderCircle className="animate-spin h-4 w-4"/> : <CheckIcon className="h-5 w-5"/>}
                </Button>
                <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-400/10 hover:text-red-300" onClick={() => declineMutation.mutate(request.id)} disabled={isProcessing}>
                  {isProcessing && declineMutation.variables === request.id ? <LoaderCircle className="animate-spin h-4 w-4"/> : <XIcon className="h-5 w-5"/>}
                </Button>
              </>
            )}
            {type === 'outgoing' && (
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => cancelMutation.mutate(request.id)} disabled={isProcessing}>
                {isProcessing && cancelMutation.variables === request.id ? <LoaderCircle className="animate-spin h-4 w-4"/> : <XIcon className="h-5 w-5"/>}
                <span className="sr-only">Cancel Request</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }


  if (incomingRequests.length === 0 && outgoingRequests.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <MailQuestionIcon className="mx-auto mt-4 h-16 w-16 opacity-30" />
        <p className="mt-4 text-lg">No pending requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {incomingRequests.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3 text-primary-foreground">Incoming Requests ({incomingRequests.length})</h3>
          <div className="space-y-3">
            {incomingRequests.map(req => <RequestCard key={req.id} request={req} type="incoming" />)}
          </div>
        </section>
      )}
      {outgoingRequests.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3 text-primary-foreground">Sent Requests ({outgoingRequests.length})</h3>
          <div className="space-y-3">
            {outgoingRequests.map(req => <RequestCard key={req.id} request={req} type="outgoing" />)}
          </div>
        </section>
      )}
    </div>
  );
};
