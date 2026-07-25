import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import ThemeScript from "@/components/theme-script";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

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
      <body className={`${jakarta.variable} font-sans bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}>
        <Providers>
          <div className="mx-auto min-h-[100dvh] max-w-md bg-white dark:bg-slate-900 shadow-sm">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
