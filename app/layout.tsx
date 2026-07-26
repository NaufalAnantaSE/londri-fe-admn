import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import ThemeScript from "@/components/theme-script";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Display face — paired with Jakarta body (Hallmark 2+1 rule). Used on headings,
// wordmark, and data numerals via the base rules in globals.css.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Londri POS — Superadmin",
  description: "Superadmin Londri POS",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
      <body className={`${jakarta.variable} ${spaceGrotesk.variable} font-sans bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}>
        <Providers>
          <div className="relative mx-auto min-h-[100dvh] max-w-md overflow-x-clip bg-slate-50/70 dark:bg-slate-950/60 shadow-sm">
            <div className="app-ambient" aria-hidden="true" />
            <div className="relative z-[1]">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
