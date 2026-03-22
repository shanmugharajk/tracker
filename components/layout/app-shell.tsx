import type React from "react";

import { getSession } from "~/lib/auth/session";

interface AppShellProps {
  children: React.ReactNode;
}

export async function AppShell({ children }: AppShellProps) {
  const session = await getSession();

  if (!session) return <>{children}</>;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Welcome
            </span>
            <span className="text-lg font-bold leading-tight">
              {session.user.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Footer */}
      <footer className="border-t shadow-lg">
        <div className="px-4 py-4 text-sm text-muted-foreground">
          © 2026 Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
