
import type { PropsWithChildren } from 'react';
import { AuthenticatedLayoutClientShell } from './AuthenticatedLayoutClientShell';

export const metadata = {
  title: 'Reverie App',
  description: 'Your personal Reverie dashboard.',
};

export default function AppLayout({ children }: PropsWithChildren) {
  return <AuthenticatedLayoutClientShell>{children}</AuthenticatedLayoutClientShell>;
}
