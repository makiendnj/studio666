
import type { PropsWithChildren } from 'react';
import { AuthenticatedLayoutClientShell } from './AuthenticatedLayoutClientShell';

export const metadata = {
  title: 'Reverie App',
  description: 'Your personal Reverie dashboard.',
};

// This layout remains a server component, AuthenticatedLayoutClientShell handles client-side auth logic
export default function AppLayout({ children }: PropsWithChildren) {
  return <AuthenticatedLayoutClientShell>{children}</AuthenticatedLayoutClientShell>;
}
