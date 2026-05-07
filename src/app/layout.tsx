import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // ضفنا المكتبة هنا

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
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* ضفنا مكون الإشعارات هنا عشان يظهر فوق كل حاجة */}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}