import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import { buildApiUrl } from "@/lib/api-url";
import { getDashboardPath } from "@/lib/auth-utils";
import type { AuthResponse, RegisterRequest, UserProfile } from "@/lib/types/auth";

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API is not configured");
  }

  return apiBaseUrl;
}

export function deriveSocialPassword(email: string) {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not configured");
  }

  const digest = createHash("sha256").update(`${secret}:${email.toLowerCase()}`).digest("hex");
  return `Ev!${digest.slice(0, 28)}9`;
}

export function suggestUsername(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);

  if (normalized.length >= 3) {
    return normalized;
  }

  return `user${Date.now().toString().slice(-6)}`;
}

export function splitDisplayName(name?: string | null) {
  const value = name?.trim();
  if (!value) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...rest] = value.split(/\s+/);
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

export function setBackendTokenCookie(response: NextResponse, accessToken: string) {
  response.cookies.set({
    name: "token",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function fetchBackendMe(accessToken: string) {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(buildApiUrl(apiBaseUrl, "/auth/me"), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as UserProfile;
}

export async function loginToBackend(credentials: { emailOrUsername: string; password: string }) {
  const apiBaseUrl = getApiBaseUrl();
  const loginResponse = await fetch(buildApiUrl(apiBaseUrl, "/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!loginResponse.ok) {
    const message = await loginResponse.text();
    throw new Error(message || "Invalid credentials");
  }

  const authData = (await loginResponse.json()) as AuthResponse;
  const user = authData.accessToken ? await fetchBackendMe(authData.accessToken) : null;

  return {
    ...authData,
    user,
    redirectTo: getDashboardPath(user?.roles ?? authData.roles),
  };
}

export async function registerBackendUser(payload: RegisterRequest) {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(buildApiUrl(apiBaseUrl, "/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
    const message = errorData.message || "Registration failed";
    const error = new Error(message) as Error & {
      status?: number;
      data?: unknown;
    };

    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return (await response.json()) as AuthResponse;
}
