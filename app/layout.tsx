import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import StoreProvider from "../components/StoreProvider";
import { Tooltip } from "@/components/ui/tooltip";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Booking",
  description: "Book amazing events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <Navbar />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
            <Footer />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
