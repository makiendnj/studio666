import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ShieldCheckIcon, CrownIcon } from 'lucide-react'; // Updated icons
import { cn } from '@/lib/utils';

interface UserAvatarWithBadgeProps {
  userEmail?: string | null;
  isAdmin?: boolean;
  isPioneer?: boolean;
  className?: string;
  avatarSize?: 'small' | 'medium' | 'large';
}

export function UserAvatarWithBadge({ 
  userEmail, 
  isAdmin, 
  isPioneer, 
  className,
  avatarSize = 'medium' 
}: UserAvatarWithBadgeProps) {
  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    const namePart = email.split('@')[0];
    return namePart.substring(0, 2).toUpperCase();
  };

  const avatarClass = {
    small: "h-10 w-10 text-sm",
    medium: "h-16 w-16 text-xl",
    large: "h-24 w-24 text-3xl"
  }[avatarSize];

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <Avatar className={cn(avatarClass, "border-2 border-primary shadow-lg shadow-primary/30")}>
        <AvatarImage 
          src={`https://picsum.photos/seed/${userEmail || 'default'}/128/128`} 
          alt={userEmail || 'User Avatar'} 
          data-ai-hint="abstract portrait"
        />
        <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
          {getInitials(userEmail)}
        </AvatarFallback>
      </Avatar>
      {userEmail && avatarSize !== 'small' && <p className="mt-2 text-sm text-muted-foreground truncate max-w-xs">{userEmail}</p>}
      {(isAdmin || isPioneer) && (
        <div className={cn(
          "mt-2 flex gap-2",
          avatarSize === 'small' && "absolute -bottom-2 left-1/2 -translate-x-1/2"
        )}>
          {isAdmin && (
            <Badge variant="destructive" className="border-accent bg-accent/80 text-accent-foreground backdrop-blur-sm shadow-md shadow-accent/50">
              <CrownIcon className="mr-1 h-3 w-3" /> Admin
            </Badge>
          )}
          {isPioneer && !isAdmin && (
            <Badge variant="secondary" className="border-primary bg-primary/80 text-primary-foreground backdrop-blur-sm shadow-md shadow-primary/50">
              <ShieldCheckIcon className="mr-1 h-3 w-3" /> Pioneer
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
