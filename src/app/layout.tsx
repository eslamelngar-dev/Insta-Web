import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "InstaWeb | Professional Site Builder",
  description: "Deploy high-end websites in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}