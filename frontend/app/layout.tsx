import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BandUp — Your vocabulary, leveling up",
  description: "A daily vocabulary ritual built for your IELTS goals.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
