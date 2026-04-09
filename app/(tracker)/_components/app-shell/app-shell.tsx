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
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
