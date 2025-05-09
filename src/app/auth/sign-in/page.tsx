import { SignInForm } from '@/components/auth/SignInForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/10 holographic-border">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Sign in to continue your journey in ChronoChat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/sign-up" className="font-medium text-primary hover:text-accent hover:underline">
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
