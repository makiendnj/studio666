
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ServerIcon, UserIcon, SettingsIcon, UsersIcon, LogOutIcon } from "lucide-react"; // Changed Users2Icon to UsersIcon
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AppLogo } from "./AppLogo";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/app/(app)/AuthenticatedLayoutClientShell";
import { Button } from "../ui/button";

const navItems = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/servers", label: "Servers", icon: ServerIcon },
  { href: "/friends", label: "Friends", icon: UsersIcon }, // Changed Users2Icon to UsersIcon
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

interface SideDrawerNavProps {
 // onClose?: () => void; // Callback to close the drawer, handled by SheetClose
}

export function SideDrawerNav({}: SideDrawerNavProps) {
  const pathname = usePathname();
  const { signOut, userProfile } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="p-4 border-b border-border/50">
        <SheetClose asChild>
          <AppLogo />
        </SheetClose>
      </SheetHeader>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          return (
            <SheetClose asChild key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                  isActive && "bg-primary/10 text-primary font-semibold"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </SheetClose>
          );
        })}
      </nav>
      <Separator className="my-2 border-border/50" />
      <div className="p-4">
        {userProfile && (
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={signOut}
            >
              <LogOutIcon className="mr-2 h-5 w-5" />
              Sign Out
            </Button>
          </SheetClose>
        )}
      </div>
    </div>
  );
}
