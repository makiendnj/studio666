"use client";
import { useMockAuth } from "../AuthenticatedLayoutClientShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheckIcon, UsersIcon, ServerIcon, BarChartIcon, AlertTriangleIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

// Mock data for admin panel
const mockAdminData = {
  totalUsers: 1258,
  activeServers: 73,
  recentRegistrations: [
    { id: "u101", email: "newuser1@example.com", date: "2024-07-28" },
    { id: "u102", email: "testuser@example.dev", date: "2024-07-27" },
  ],
  systemStatus: "All systems operational",
};

export default function AdminPage() {
  const { user, isLoading } = useMockAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user?.isAdmin) {
      router.replace("/home"); // Redirect if not admin
    }
  }, [user, isLoading, router]);

  if (isLoading || !user?.isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-foreground">Loading admin panel or unauthorized...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
       <Button variant="ghost" asChild className="mb-6 text-muted-foreground hover:text-primary">
        <Link href="/settings">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Settings
        </Link>
      </Button>
      <Card className="bg-card/80 backdrop-blur-sm holographic-border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-accent to-primary">
            <ShieldCheckIcon className="mr-3 h-8 w-8 text-red-500" /> Admin Dashboard
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Oversee and manage the ChronoChat universe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Stats Overview */}
          <section className="grid md:grid-cols-3 gap-6">
            <StatCard icon={UsersIcon} title="Total Users" value={mockAdminData.totalUsers.toLocaleString()} color="text-primary" />
            <StatCard icon={ServerIcon} title="Active Servers" value={mockAdminData.activeServers.toLocaleString()} color="text-accent" />
            <StatCard icon={BarChartIcon} title="System Status" value={mockAdminData.systemStatus} color="text-green-400" isTextValue />
          </section>

          {/* Recent Registrations */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground">Recent Registrations</h2>
            <Card className="bg-input/30">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">User ID</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Registration Date</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdminData.recentRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium text-foreground/90">{reg.id}</TableCell>
                      <TableCell className="text-foreground/90">{reg.email}</TableCell>
                      <TableCell className="text-foreground/90">{reg.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-accent">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">Manage Users</Button>
              <Button variant="outline" className="text-accent border-accent hover:bg-accent/10">Manage Servers</Button>
              <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10">View System Logs</Button>
              <Button variant="outline" className="text-muted-foreground hover:text-primary hover:border-primary">Broadcast Message</Button>
              <Button variant="destructive" className="col-span-full sm:col-span-1 md:col-span-1">
                <AlertTriangleIcon className="mr-2 h-4 w-4"/> Emergency System Shutdown (Mock)
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color?: string;
  isTextValue?: boolean;
}

function StatCard({ icon: Icon, title, value, color = "text-primary", isTextValue = false }: StatCardProps) {
  return (
    <Card className="bg-input/50 p-4 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-shadow">
      <div className="flex items-center space-x-3">
        <Icon className={`h-8 w-8 ${color}`} />
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isTextValue ? (
             <p className={`text-lg font-semibold ${color}`}>{value}</p>
          ) : (
             <p className="text-2xl font-bold text-foreground">{value}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
