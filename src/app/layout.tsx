import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from '@/lib/utils'
import "./globals.css";
import { ThemeProvider } from "@/context/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "HyperSets",
  description: "An online archieve of RGB profiles for HyperX NGenuity capable hardware made by the HyperXFamily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
