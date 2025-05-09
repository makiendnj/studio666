import type { PropsWithChildren } from 'react';
import { AppLogo } from '@/components/layout/AppLogo';

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background p-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
