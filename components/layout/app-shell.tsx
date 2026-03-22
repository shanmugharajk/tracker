import type React from "react";

import { getSession } from "~/lib/auth/session";

import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
}

export async function AppShell({ children }: AppShellProps) {
  const session = await getSession();

  if (!session) return <>{children}</>;

  return (
    <div className="flex h-dvh flex-col">
      <Header userName={session.user.name} />

      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {children}
      </main>

      <footer className="shrink-0 border-t">
        <div className="px-4 py-3 text-center text-xs text-muted-foreground md:px-8 md:text-left md:text-sm">
          © 2026 Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
