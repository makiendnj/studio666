
"use client";

import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional
import { useState } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
  // useState ensures QueryClient is only created once per component instance,
  // preventing re-creation on re-renders, which is important for React Query.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Global default query options can go here
        // staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: process.env.NODE_ENV === 'production', // Disable refetch on focus in dev for convenience
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optional: React Query Devtools for debugging */}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
