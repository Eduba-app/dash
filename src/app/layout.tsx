import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";

const poppins = Poppins({
  variable: "--font-geist-sans",     
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  display: "swap",                   
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eduba Admin",
  description: "Eduba Smart Learning - Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SessionProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}