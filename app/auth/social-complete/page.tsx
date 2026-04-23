"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, Phone, User } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type OnboardingState = {
  email: string;
  name: string;
  image: string | null;
  firstName: string;
  lastName: string;
  suggestedUsername: string;
};

export default function SocialCompletePage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [isResolving, startResolving] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
  });
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (isSessionPending || resolvedRef.current || !session?.user.email) {
      return;
    }

    resolvedRef.current = true;

    startResolving(async () => {
      const response = await fetch("/api/auth/social/session", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok && data.redirectTo) {
        router.replace(data.redirectTo);
        router.refresh();
        return;
      }

      if (data.needsOnboarding) {
        setOnboarding(data);
        setFormData((current) => ({
          ...current,
          username: data.suggestedUsername,
        }));
        return;
      }

      toast.error("Unable to complete social sign-in", {
        description: data.message || "Please try again.",
        position: "top-right",
      });
      router.replace("/login");
    });
  }, [isSessionPending, router, session]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.username.trim() || !formData.phoneNumber.trim()) {
      toast.error("Username and phone number are required", {
        position: "top-right",
      });
      return;
    }

    startSubmitting(async () => {
      const response = await fetch("/api/auth/social/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok && data.redirectTo) {
        toast.success("Account connected successfully", {
          position: "top-right",
        });
        router.replace(data.redirectTo);
        router.refresh();
        return;
      }

      const fieldErrors = data.errors as Record<string, string[]> | undefined;
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          toast.error(`${field}: ${messages.join(", ")}`, {
            position: "top-right",
          });
        });
      } else {
        toast.error("Social sign-in could not be linked", {
          description:
            data.message ||
            "If this email already belongs to a password account, please sign in with email and password first.",
          position: "top-right",
        });
      }
    });
  };

  if (isSessionPending || isResolving) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <LoaderCircle className="size-8 animate-spin text-primary" />
          <h1 className="text-2xl font-semibold">Finishing social sign-in</h1>
          <p className="text-sm text-muted-foreground">
            We are checking whether this social account already exists in Eventizo.
          </p>
        </div>
      </main>
    );
  }

  if (!session?.user.email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Social session not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your OAuth session has expired or was not created correctly.
          </p>
          <Link href="/login" className="mt-6 inline-flex text-sm font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Complete your account</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Social sign-in is ready. We only need the fields required by your backend account.
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-muted px-4 py-4 text-sm">
          <p className="font-medium text-foreground">{onboarding?.name || session.user.name || "Social account"}</p>
          <p className="text-muted-foreground">{session.user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                value={formData.username}
                onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
                className="h-12 border-border bg-background pl-10"
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(event) => setFormData((current) => ({ ...current, phoneNumber: event.target.value }))}
                className="h-12 border-border bg-background pl-10"
                placeholder="e.g. 012345678"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                Finishing setup...
              </span>
            ) : (
              "Continue to Eventizo"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
