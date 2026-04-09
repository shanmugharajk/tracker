'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';

import { NavGroup, sidebarData } from './config';

function getPageTitle(pathname: string, data: NavGroup[]) {
  const match = data
    .flatMap((group) => group.items)
    .find((item) => item.url === pathname);

  return match?.title;
}

export function Header() {
  const pathname = usePathname();

  const title = useMemo(
    () => getPageTitle(pathname, sidebarData) ?? 'Dashboard',
    [pathname]
  );

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <span>{title}</span>
      </div>
    </header>
  );
}
