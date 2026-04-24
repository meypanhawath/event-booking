import type { LoginRequest } from "@/lib/types/auth";

export async function loginAdmin(credentials: LoginRequest) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data;
}

