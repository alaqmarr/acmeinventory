import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/providers/AlertProvider";

const outfit = Outfit({ 
  variable: "--font-outfit", 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Acme Industrial Equipments",
  description:
    "Inventory Management System for Acme Industrial Equipments Company",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased min-h-screen bg-slate-100/60 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900`}
      >
        <AlertProvider> {children} </AlertProvider>
      </body>
    </html>
  );
}
