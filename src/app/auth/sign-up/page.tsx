
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/10 holographic-border">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Join Reverie
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Create your account to explore the future of communication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="font-medium text-primary hover:text-accent hover:underline">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
