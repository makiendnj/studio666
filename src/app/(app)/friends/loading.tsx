import { LoaderCircle } from "lucide-react";

export default function FriendsLoading() {
  return (
    <div className="flex h-[calc(100vh-var(--header-height,4rem)-1rem)] items-center justify-center">
      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-3 text-muted-foreground">Loading connections...</p>
    </div>
  );
}
