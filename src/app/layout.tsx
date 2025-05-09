
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // This was causing an error, removed if not fixed elsewhere or install geist
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/providers/AppProviders';
import ParticleBackground from '@/components/layout/ParticleBackground';


export const metadata: Metadata = {
  title: 'Reverie',
  description: 'Futuristic communication platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} font-sans antialiased bg-background text-foreground`}>
        <ParticleBackground />
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
