
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { MockUser } from "@/app/(app)/AuthenticatedLayoutClientShell";
import { MailIcon, LockIcon, UserPlusIcon } from "lucide-react";

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

// This counter is a simple mock for "first 5 users" logic.
// In a real app, this state would be managed server-side.
let userSignupCount = 0; 
const MAX_PIONEER_USERS = 5;

export function SignUpForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API

    userSignupCount++;
    const isPioneer = userSignupCount <= MAX_PIONEER_USERS;

    const user: MockUser = {
      email: values.email,
      isAdmin: false, // New sign-ups are not admins
      isPioneer,
    };
    
    localStorage.setItem('reverieUser', JSON.stringify(user)); // Updated localStorage key

    toast({
      title: "Account Created!",
      description: `Welcome to Reverie, ${values.email}! ${isPioneer ? "You're a Pioneer User!" : ""}`,
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
                  <Input type="password" placeholder="Create a strong password" {...field} className="pl-10 bg-input/50 focus:bg-input/70 border-border/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="password" placeholder="Confirm your password" {...field} className="pl-10 bg-input/50 focus:bg-input/70 border-border/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full holographic-glow-primary hover:holographic-glow-accent transition-all duration-300">
          <UserPlusIcon className="mr-2 h-5 w-5" />
          Create Account
        </Button>
      </form>
    </Form>
  );
}
