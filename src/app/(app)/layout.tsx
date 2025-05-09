import type { PropsWithChildren } from 'react';
import { AuthenticatedLayoutClientShell } from './AuthenticatedLayoutClientShell';

export const metadata = {
  title: 'ChronoChat App',
  description: 'Your personal ChronoChat dashboard.',
};

export default function AppLayout({ children }: PropsWithChildren) {
  return <AuthenticatedLayoutClientShell>{children}</AuthenticatedLayoutClientShell>;
}
