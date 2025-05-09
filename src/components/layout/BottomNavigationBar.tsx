"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ServerIcon, UserIcon, SettingsIcon, Users2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/servers", label: "Servers", icon: ServerIcon },
  { href: "/friends", label: "Friends", icon: Users2Icon },
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function BottomNavigationBar() {
  const pathname = usePathname();

  // Hide BottomNav on specific deeply nested pages if SideDrawerNav is preferred there.
  // For example, on channel pages, to avoid too much clutter.
  // This is an example, adjust based on UX preference.
  const hideOnRoutes = [
    /^\/servers\/[^/]+\/channels\/[^/]+/, 
    /^\/servers\/[^/]+\/voice\/[^/]+/
  ];
  const shouldHide = hideOnRoutes.some(routeRegex => routeRegex.test(pathname));

  if (shouldHide) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-t border-border/50 shadow-t-lg md:hidden z-30"> {/* Lower z-index than header/drawer */}
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors group pt-1",
                isActive && "text-primary"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn(
                "h-6 w-6 mb-0.5 transition-transform group-hover:scale-110",
                isActive && "text-primary" 
                // isActive && "holographic-glow-primary rounded-full p-0.5" // Glow effect was a bit much here
                )} />
              <span className={cn("text-[0.65rem] leading-tight", isActive ? "font-semibold" : "font-normal")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
