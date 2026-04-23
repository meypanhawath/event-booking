import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import StoreProvider from "../components/StoreProvider";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Eventizo",
  description: "Book amazing events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            {children}
        <Toaster position="top-right" offset={80} />
            <Footer />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
