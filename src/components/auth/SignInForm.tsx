
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { MockUser } from "@/app/(app)/AuthenticatedLayoutClientShell"; // Using existing type
import { MailIcon, LockIcon, LogInIcon } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const ADMIN_EMAIL = "chxrry247@gmail.com";
const ADMIN_PASSWORD = "admin456"; // Specific password for the admin user

export function SignInForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormValues) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check for admin credentials
    if (values.email === ADMIN_EMAIL) {
      if (values.password !== ADMIN_PASSWORD) {
        toast({
          title: "Sign In Failed",
          description: "Invalid credentials for admin user.",
          variant: "destructive",
        });
        form.setError("password", { type: "manual", message: "Invalid credentials for admin user." });
        return; // Prevent login if admin credentials don't match
      }
    }
    // For non-admin users, the password validation (min 6 chars) is handled by Zod.
    // No specific password check for non-admin users in this mock setup.

    const user: MockUser = {
      email: values.email,
      isAdmin: values.email === ADMIN_EMAIL,
      isPioneer: values.email !== ADMIN_EMAIL && Math.random() < 0.3, // Simplified random pioneer status
    };
    
    localStorage.setItem('chronoUser', JSON.stringify(user));

    toast({
      title: "Signed In Successfully!",
      description: `Welcome back, ${values.email}!`,
      variant: "default",
    });
    router.push("/home");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="you@example.com" {...field} className="pl-10 bg-input/50 focus:bg-input/70 border-border/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" {...field} className="pl-10 bg-input/50 focus:bg-input/70 border-border/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full holographic-glow-primary hover:holographic-glow-accent transition-all duration-300">
          <LogInIcon className="mr-2 h-5 w-5" />
          Sign In
        </Button>
      </form>
    </Form>
  );
}
