"use client";

import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function SiteLogo({
  href = "/",
  className,
  imageClassName,
  width = 160,
  height = 48,
  priority = false,
}: SiteLogoProps) {
  return (
    <Link href={href} className={className}>
      <Image
        src="/logo-1.png"
        alt="Eventizo logo"
        width={width}
        height={height}
        priority={priority}
        className={["block dark:hidden", imageClassName].filter(Boolean).join(" ")}
      />
      <Image
        src="/logo-2.png"
        alt="Eventizo logo"
        width={width}
        height={height}
        priority={priority}
        className={["hidden dark:block", imageClassName].filter(Boolean).join(" ")}
      />
    </Link>
  );
}
