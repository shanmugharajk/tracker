'use client';

import { Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';

import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';

import { NavGroup, sidebarData } from './config';

function getPageTitle(pathname: string, data: NavGroup[]) {
  const match = data
    .flatMap((group) => group.items)
    .find((item) => item.url === pathname);

  return match?.title;
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="relative shrink-0 flex items-center justify-center"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="relative flex items-center justify-center size-4">
        <Sun className="absolute size-4 transition-all duration-200 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 transition-all duration-200 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      </span>
    </Button>
  );
}

export function Header() {
  const pathname = usePathname();

  const title = useMemo(
    () => getPageTitle(pathname, sidebarData) ?? 'Dashboard',
    [pathname]
  );

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <span>{title}</span>
      </div>
      <div className="px-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
