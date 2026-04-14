import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { cn } from '~/lib/cn';

import '~/app/styles/globals.css';
import { ThemeProvider } from '~/components/theme-provider';
import { TooltipProvider } from '~/components/ui/tooltip';
import { Toaster } from '~/components/ui/toaster';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Tracker',
  description: 'Tracker - Personal finance & tasks tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
