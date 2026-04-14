import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';

import { Sidebar } from './sidebar';
import { Header } from './header';

export function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" />
      <SidebarInset>
        <Header />
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
