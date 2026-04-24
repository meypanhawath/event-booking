import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import SiteChrome from "@/components/layout/site-chrome";
import "./globals.css";
import StoreProvider from "../components/StoreProvider";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.BETTER_AUTH_URL ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Event Booking",
    template: "%s | Event Booking",
  },
  description: "Book amazing events",
  applicationName: "Event Booking",
  openGraph: {
    type: "website",
    siteName: "Event Booking",
    title: "Event Booking",
    description: "Book amazing events",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Booking",
    description: "Book amazing events",
  },
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
            <SiteChrome>{children}</SiteChrome>
            <Toaster position="top-right" offset={80} />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
