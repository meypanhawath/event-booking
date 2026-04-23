import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#c14fe6]">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          The page you tried to open does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="rounded-2xl bg-[#c14fe6] hover:bg-[#b347d4]">
            <Link href="/">Back to landing page</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/events">Browse events</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
