
"use client";
// This layout doesn't need to be a client component if it's just passing children
// However, keeping it client for consistency if hooks are needed later.
// Or convert to server component:
// export default function ServerDetailLayout({ children }: { children: React.ReactNode }) {
// return <>{children}</>;
// }
// For now, let's assume it's simple and could be a server component.
// But if any part of the ServerPage itself *needs* client context *above* where the channel content goes,
// then this structure needs to be rethought.
// The current ServerPage is already a client component.

import type { PropsWithChildren } from 'react';

// This layout simply passes children through.
// The actual UI for server (channels list, members list) is in ServerPage.
// The children here will be the specific channel page (text or voice).
export default function ServerDetailLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
