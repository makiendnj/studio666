"use client"; // Keep as client component if it manages client-side state/context

import type { PropsWithChildren } from 'react';
// Import any global context providers here if needed in the future
// Example: import { ThemeProvider } from 'next-themes';

export function AppProviders({ children }: PropsWithChildren) {
  // If you had a ThemeProvider or other global client-side contexts,
  // you would wrap `children` with them here.
  // For now, it's a simple pass-through.
  return <>{children}</>;
}
