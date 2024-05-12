import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from '@/lib/utils'
import "./globals.css";
import { ThemeProvider } from "@/context/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";
import { Analytics } from "@vercel/analytics/react"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "HyperSets",
  description: "Share, discover, and illuminate your HyperX NGenuity setup. Welcome to HyperSets, an online archieve of RGB profiles made by the HyperXFamily.",
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
          <Analytics/> 
        </ThemeProvider>
      </body>
    </html>
  );
}
