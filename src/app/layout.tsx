import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes"; // تأكد من تثبيت المكتبة npm install next-themes

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstaWeb - Build Your Site",
  description: "Create stunning link-in-bio sites in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // السطر اللي جاي ده هو اللي بيحل إيرور الـ Hydration
    <html lang="en" suppressHydrationWarning> 
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}