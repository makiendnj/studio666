import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppLogo } from "@/components/layout/AppLogo";
import { ArrowRightIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-6 text-center">
      <header className="mb-12">
        <AppLogo size="large" />
      </header>
      
      <main className="max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Welcome to ChronoChat
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10">
          Step into the future of communication. Connect, collaborate, and conquer across time and space.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="holographic-glow-primary hover:holographic-glow-accent transition-all duration-300 transform hover:scale-105">
            <Link href="/auth/sign-in">
              Sign In <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 hover:text-accent hover:border-accent transition-all duration-300 transform hover:scale-105">
            <Link href="/auth/sign-up">
              Create Account
            </Link>
          </Button>
        </div>
      </main>

      <footer className="mt-20 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ChronoChat. All rights reserved.</p>
        <p className="mt-1">Time waits for no one. Chat now.</p>
      </footer>
    </div>
  );
}
