import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NPD Process Tracker",
  description: "Track and manage New Product Development process steps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
