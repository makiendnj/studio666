
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeftIcon, CheckCircleIcon, UploadCloudIcon } from "lucide-react";
import Link from "next/link";

const createServerSchema = z.object({
  name: z.string().min(3, "Server name must be at least 3 characters.").max(50, "Server name too long."),
  description: z.string().max(200, "Description too long.").optional(),
  // icon: z.any().optional(), // Placeholder for file upload
});

type CreateServerFormValues = z.infer<typeof createServerSchema>;

export default function CreateServerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<CreateServerFormValues>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: CreateServerFormValues) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Server Created!",
      description: `Server "${values.name}" is now live (mocked).`,
    });
    router.push("/servers"); // Redirect to servers list or the new server's page
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6 text-muted-foreground hover:text-primary">
        <Link href="/servers">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Servers
        </Link>
      </Button>
      <Card className="bg-card/80 backdrop-blur-sm holographic-border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Create New Server
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Establish your own corner in the Reverie universe.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Server Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Quantum Cafe" {...field} className="bg-input/50 focus:bg-input/70"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief description of your server's purpose." {...field} className="min-h-[100px] bg-input/50 focus:bg-input/70"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel className="text-muted-foreground">Server Icon (Optional)</FormLabel>
                <FormControl>
                  <Button variant="outline" type="button" className="w-full border-dashed border-border/70 hover:border-accent hover:text-accent">
                    <UploadCloudIcon className="mr-2 h-5 w-5"/> Upload Icon (Coming Soon)
                  </Button>
                </FormControl>
                <FormMessage />
              </FormItem>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full holographic-glow-primary hover:holographic-glow-accent transition-all duration-300">
                <CheckCircleIcon className="mr-2 h-5 w-5" /> Create Server
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
