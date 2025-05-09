
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/services/user";
import { MailIcon, LockIcon, UserPlusIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      if (user) {
        const userProfile = await createUserProfile(user); // Creates profile with pioneer logic
        toast({
          title: "Account Created!",
          description: `Welcome to Reverie, ${userProfile.displayName}! ${userProfile.isPioneer ? "You're a Pioneer User!" : ""}`,
        });
        router.push("/home"); // Auth listener will handle profile sync
      } else {
        throw new Error("User not created.");
      }

    } catch (error: any) {
      console.error("Sign up error:", error);
      let errorMessage = "An unknown error occurred during sign up.";
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email address is already registered.';
            form.setError("email", { type: "manual", message: errorMessage });
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            form.setError("email", { type: "manual", message: errorMessage });
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please choose a stronger password.';
            form.setError("password", { type: "manual", message: errorMessage });
            break;
          default:
            errorMessage = 'Failed to create account. Please try again.';
        }
      }
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  <Input placeholder="you@example.com" {...field} className="pl-10 bg-input/50 focus:bg-input/70 border-border/50" disabled={isSubmitting} />
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
                  <Input type="password" placeholder="Create a strong password" {...field} className="pl-10 bg-input/50 focus:bg-input/70 border-border/50" disabled={isSubmitting} />
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
                  <Input type="password" placeholder="Confirm your password" {...field} className="pl-10 bg-input/50 focus:bg-input/70 border-border/50" disabled={isSubmitting} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full holographic-glow-primary hover:holographic-glow-accent transition-all duration-300" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : <UserPlusIcon className="mr-2 h-5 w-5" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
