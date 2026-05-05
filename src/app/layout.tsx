import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DevHydrationErrorFilter } from "@/components/DevHydrationErrorFilter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cargoconnect — Maritime Logistics Marketplace",
  description:
    "AI-powered global marketplace connecting shipment senders, ports, and vessel owners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full w-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full w-full min-w-0 overflow-x-hidden font-sans"
      >
        <DevHydrationErrorFilter />
        {children}
      </body>
    </html>
  );
}
