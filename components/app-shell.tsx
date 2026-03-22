import type React from "react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">Tracker</h1>
        </div>
      </header>

      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Footer */}
      <footer className="border-t shadow-lg shadow-t">
        <div className="px-4 py-4 text-sm text-muted-foreground">
          © 2026 Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
