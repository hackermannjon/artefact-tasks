import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { themeScript } from "@/components/theme/themeScript";
import "@/styles/globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "Tasks",
  description: "A small task manager built with Next.js 15 and tRPC.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1f" },
    { media: "(prefers-color-scheme: light)", color: "#f5f6fb" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The inline script may set data-theme before React hydrates.
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
