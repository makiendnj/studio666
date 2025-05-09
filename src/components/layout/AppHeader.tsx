"use client";

import { AppLogo } from "@/components/layout/AppLogo";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, UserCircle2Icon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/(app)/AuthenticatedLayoutClientShell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatarWithBadge } from "./UserAvatarWithBadge";


export function AppHeader() {
  const { userProfile, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-border/50 bg-card/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <AppLogo />
      </div>
      <div className="flex items-center gap-4">
        {userProfile ? (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <UserAvatarWithBadge 
                  photoURL={userProfile.photoURL} 
                  displayName={userProfile.displayName}
                  userEmail={userProfile.email}
                  avatarSize="small"
                  className="scale-90" // Adjust size to fit header
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userProfile.displayName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userProfile.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              {userProfile.isAdmin && (
                 <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="icon" asChild>
            <Link href="/auth/sign-in">
              <UserCircle2Icon className="h-6 w-6" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}

