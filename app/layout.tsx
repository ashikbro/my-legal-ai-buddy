import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Legal AI Buddy",
  description: "Local-first contract review assistant",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
