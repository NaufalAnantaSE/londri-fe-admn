import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import ThemeScript from "@/components/theme-script";

export const metadata: Metadata = {
  title: "Londri POS — Superadmin",
  description: "Superadmin Londri POS",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Providers>
          <div className="mx-auto min-h-[100dvh] max-w-md bg-white dark:bg-slate-900 shadow-sm dark:bg-slate-900">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
