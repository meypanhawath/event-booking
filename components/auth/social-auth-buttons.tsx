"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";

const providers: Array<{
  provider: Provider;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    provider: "google",
    label: "Continue with Google",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.8 4.8 0 0 1-2 3.1v2.6h3.2c1.9-1.8 3.1-4.5 3.1-7.5Z"
        />
        <path
          fill="currentColor"
          d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.9v2.7A10 10 0 0 0 12 22Z"
        />
        <path
          fill="currentColor"
          d="M6.2 13.7A6.1 6.1 0 0 1 5.9 12c0-.6.1-1.2.3-1.7V7.6H2.9A10 10 0 0 0 2 12c0 1.6.4 3.1.9 4.4l3.3-2.7Z"
        />
        <path
          fill="currentColor"
          d="M12 5.9c1.5 0 2.9.5 4 1.5l3-3C17 2.8 14.7 2 12 2A10 10 0 0 0 2.9 7.6l3.3 2.7C7 7.7 9.3 5.9 12 5.9Z"
        />
      </svg>
    ),
  },
  {
    provider: "github",
    label: "Continue with GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.1c-3.4.8-4.1-1.5-4.1-1.5-.5-1.3-1.3-1.6-1.3-1.6-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 .1 1.6 1 1.8 1.6.9.1 1.7-.6 2.1-1-.7-.1-1.3-.4-1.9-.9-.7-.6-1.3-1.5-1.3-3.2 0-1.2.4-2.2 1.1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 3 .9a10.2 10.2 0 0 1 5.4 0c2.1-1.2 3-.9 3-.9.6 1.4.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.9 0 1.7-.6 2.6-1.3 3.2-.6.5-1.3.8-2.1.9.4.3.7.9.7 1.8v2.7c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z"
        />
      </svg>
    ),
  },
];

export function SocialAuthButtons() {
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);

  const handleSocialLogin = async (provider: Provider) => {
    try {
      setActiveProvider(provider);
      await authClient.signIn.social({
        provider,
        callbackURL: "/auth/social-complete",
        errorCallbackURL: "/login",
      });
    } catch (error) {
      console.error("Social sign-in failed", error);
      toast.error("Social sign-in failed", {
        description: "Please try again or use email and password.",
        position: "top-right",
      });
      setActiveProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      {providers.map(({ provider, label, icon }) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          disabled={activeProvider !== null}
          onClick={() => handleSocialLogin(provider)}
          className="h-12 w-full justify-center gap-2 rounded-xl border-border bg-background text-foreground shadow-none hover:bg-muted"
        >
          {activeProvider === provider ? <LoaderCircle className="size-4 animate-spin" /> : icon}
          {label}
        </Button>
      ))}
    </div>
  );
}
