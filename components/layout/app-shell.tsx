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
    <div className="flex h-screen flex-col overflow-hidden">
      <Header userName={session.user.name} />

      <main className="flex-1 overflow-y-auto">{children}</main>

      <footer className="border-t shadow-lg">
        <div className="px-4 py-4 text-sm text-muted-foreground">
          © 2026 Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
