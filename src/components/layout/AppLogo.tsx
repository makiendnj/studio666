import { MessageSquareTextIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  size?: 'normal' | 'large';
  className?: string;
}

export function AppLogo({ size = 'normal', className }: AppLogoProps) {
  const iconSize = size === 'large' ? 'h-12 w-12' : 'h-8 w-8';
  const textSize = size === 'large' ? 'text-4xl' : 'text-2xl';

  return (
    <Link href="/" className={cn("flex items-center gap-2 text-primary hover:opacity-80 transition-opacity", className)}>
      <MessageSquareTextIcon className={cn(iconSize, "text-primary")} />
      <span className={cn(textSize, "font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary")}>
        ChronoChat
      </span>
    </Link>
  );
}
