
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMockAuth } from "../AuthenticatedLayoutClientShell";
import { UserAvatarWithBadge } from "@/components/layout/UserAvatarWithBadge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ZapIcon, UsersIcon, MessageSquarePlusIcon, SettingsIcon } from "lucide-react";

export default function HomePage() {
  const { user } = useMockAuth();

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 bg-card/80 backdrop-blur-sm holographic-border overflow-hidden">
        <CardHeader className="relative p-0">
          <Image 
            src="https://picsum.photos/seed/chronoheader/1200/300" 
            alt="ChronoChat Header" 
            width={1200} 
            height={300} 
            className="w-full h-48 object-cover"
            data-ai-hint="futuristic abstract"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent drop-shadow-lg">
              Welcome, {user?.email ? user.email.split('@')[0] : "Explorer"}!
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <UserAvatarWithBadge userEmail={user?.email} isAdmin={user?.isAdmin} isPioneer={user?.isPioneer} />
          <div className="flex-grow text-center md:text-left">
            <p className="text-lg text-muted-foreground mb-4">
              You&apos;ve successfully entered the ChronoStream. What will you discover today?
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button asChild variant="default" className="holographic-glow-primary hover:scale-105 transition-transform">
                <Link href="/servers">
                  <UsersIcon className="mr-2 h-5 w-5" /> Explore Servers
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-accent border-accent hover:bg-accent/10 hover:text-accent hover:border-accent hover:scale-105 transition-transform">
                <Link href="/profile">
                  <ZapIcon className="mr-2 h-5 w-5" /> Customize Profile
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Create Your Universe"
          description="Forge new servers, invite allies, and build your community across time."
          icon={MessageSquarePlusIcon}
          link="/servers/create" 
          actionText="New Server"
          aiHint="galaxy creation"
        />
        <FeatureCard
          title="Discover Channels"
          description="Tune into bustling text channels or join immersive voice streams."
          icon={ZapIcon}
          link="/servers"
          actionText="Browse Channels"
          aiHint="communication network"
        />
        <FeatureCard
          title="Profile & Settings"
          description="Personalize your ChronoChat identity and fine-tune your experience."
          icon={SettingsIcon}
          link="/settings"
          actionText="Go to Settings"
          aiHint="digital identity"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  actionText: string;
  aiHint: string;
}

function FeatureCard({ title, description, icon: Icon, link, actionText, aiHint }: FeatureCardProps) {
  return (
    <Card className="bg-card/70 backdrop-blur-sm hover:shadow-accent/20 shadow-lg transition-all duration-300 transform hover:-translate-y-1 holographic-border">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/20 text-primary">
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="text-xl text-primary-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image 
            src={`https://picsum.photos/seed/${title.replace(/\s+/g, '')}/400/200`}
            alt={title}
            width={400}
            height={200}
            className="w-full h-32 object-cover rounded-md mb-4"
            data-ai-hint={aiHint}
          />
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button asChild variant="link" className="p-0 text-accent hover:text-primary">
          <Link href={link}>{actionText} &rarr;</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
