// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "InstaWeb - Build Your Digital Identity in Seconds",
    template: "%s | InstaWeb",
  },
  description:
    "Create stunning personal websites, portfolios, and link pages in seconds. No coding required. Join thousands of creators building their digital presence with InstaWeb.",
  keywords: [
    "link in bio",
    "personal website builder",
    "portfolio builder",
    "landing page",
    "no-code website",
    "digital identity",
    "linktree alternative",
  ],
  authors: [{ name: "InstaWeb" }],
  creator: "InstaWeb",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://instaweb.me",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "InstaWeb",
    title: "InstaWeb - Build Your Digital Identity in Seconds",
    description:
      "Create stunning personal websites and portfolios in seconds. No coding required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InstaWeb - Build Your Digital Identity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaWeb - Build Your Digital Identity in Seconds",
    description:
      "Create stunning personal websites and portfolios in seconds. No coding required.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">{children}</div>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
