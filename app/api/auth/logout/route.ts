import { NextRequest, NextResponse } from "next/server";

import { ensureBetterAuthTables, getAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  try {
    await ensureBetterAuthTables();
    const auth = await getAuth();
    const result = await auth.api.signOut({
      headers: request.headers,
      returnHeaders: true,
    });
    const setCookie = result.headers.get("set-cookie");

    if (setCookie) {
      response.headers.append("set-cookie", setCookie);
    }
  } catch {
    // Ignore Better Auth sign-out failures and still clear the backend token.
  }

  return response;
}
