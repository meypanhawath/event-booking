"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/navbar";

const HIDE_NAVBAR_PREFIXES = [
  "/dashboard",
  "/admin/dashboard",
  "/user/dashboard",
  "/organizer/dashboard",
];

const HIDE_NAVBAR_PATHS = ["/login", "/register"];

export default function SiteChrome({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    HIDE_NAVBAR_PATHS.includes(pathname) ||
    HIDE_NAVBAR_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return (
    <>
      {!hideNavbar ? <Navbar /> : null}
      {children}
      <Footer />
    </>
  );
}
