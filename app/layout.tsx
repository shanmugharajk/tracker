import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "~/components/app-shell";
import { ThemeProvider } from "~/components/theme-provider";
import { cn } from "~/lib/cn";

import "~/app/styles/globals.css";
import type { Metadata } from "next";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Tracker",
  description: "Expense tracker",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tracker",
  },
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
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
