import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Librarian Game",
  description: "Tidy an arcane library, one series at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
