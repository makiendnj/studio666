
"use client";
import { useAuth } from "../AuthenticatedLayoutClientShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheckIcon, UsersIcon, ServerIcon, BarChartIcon, AlertTriangleIcon, ArrowLeftIcon, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getTotalUsers, getRecentRegistrations } from "@/services/user";
import { getTotalServers } from "@/services/server";
import type { UserProfile } from "@/types/db";
import { formatDistanceToNow } from 'date-fns';


interface AdminData {
  totalUsers: number;
  activeServers: number; // Using totalServers as "active" for now
  recentRegistrations: UserProfile[];
  systemStatus: string; 
}

export default function AdminPage() {
  const { userProfile, isLoading: authLoading } = useAuth(); // Changed from user to userProfile
  const router = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !userProfile?.isAdmin) {
      router.replace("/home"); 
    }
  }, [userProfile, authLoading, router]);

  useEffect(() => {
    if (userProfile?.isAdmin) {
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          const [usersCount, serversCount, registrations] = await Promise.all([
            getTotalUsers(),
            getTotalServers(),
            getRecentRegistrations(5)
          ]);
          setAdminData({
            totalUsers: usersCount,
            activeServers: serversCount, // Using total as "active"
            recentRegistrations: registrations,
            systemStatus: "All systems operational" // Default, can be dynamic later
          });
        } catch (error) {
          console.error("Error fetching admin data:", error);
          setAdminData({ // Set to empty/error state
            totalUsers: 0,
            activeServers: 0,
            recentRegistrations: [],
            systemStatus: "Error fetching data"
          });
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [userProfile?.isAdmin]);

  if (authLoading || isLoadingData || !userProfile?.isAdmin || !adminData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading admin panel...</p>
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
            Oversee and manage the Reverie universe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Stats Overview */}
          <section className="grid md:grid-cols-3 gap-6">
            <StatCard icon={UsersIcon} title="Total Users" value={adminData.totalUsers.toLocaleString()} color="text-primary" />
            <StatCard icon={ServerIcon} title="Total Servers" value={adminData.activeServers.toLocaleString()} color="text-accent" />
            <StatCard 
              icon={BarChartIcon} 
              title="System Status" 
              value={adminData.systemStatus} 
              color={adminData.systemStatus === "All systems operational" ? "text-green-400" : "text-muted-foreground"} 
              isTextValue 
            />
          </section>

          {/* Recent Registrations */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground">Recent Registrations</h2>
            <Card className="bg-input/30">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">Display Name</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Registration Date</TableHead>
                    <TableHead className="text-muted-foreground text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminData.recentRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                        No recent registrations to display.
                      </TableCell>
                    </TableRow>
                  ) : (
                    adminData.recentRegistrations.map((reg) => (
                      <TableRow key={reg.uid}>
                        <TableCell className="font-medium text-foreground/90">{reg.displayName}</TableCell>
                        <TableCell className="text-foreground/90">{reg.email}</TableCell>
                        <TableCell className="text-foreground/90">
                           {reg.createdAt?.seconds ? formatDistanceToNow(new Date(reg.createdAt.seconds * 1000), { addSuffix: true }) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          {reg.isPioneer && <span className="text-xs text-primary font-semibold">Pioneer</span>}
                           {/* <Button variant="ghost" size="sm" className="text-primary hover:text-accent">Manage</Button> */}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-primary-foreground">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="text-primary border-primary hover:bg-primary/10" disabled>Manage Users</Button>
              <Button variant="outline" className="text-accent border-accent hover:bg-accent/10" disabled>Manage Servers</Button>
              <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10" disabled>View System Logs</Button>
              <Button variant="outline" className="text-muted-foreground hover:text-primary hover:border-primary" disabled>Broadcast Message</Button>
              <Button variant="destructive" className="col-span-full sm:col-span-1 md:col-span-1" disabled>
                <AlertTriangleIcon className="mr-2 h-4 w-4"/> Emergency System Shutdown
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
