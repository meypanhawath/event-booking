import { NextRequest, NextResponse } from "next/server";

import { ensureBetterAuthTables, getAuth } from "@/lib/auth";
import { deriveSocialPassword, loginToBackend, splitDisplayName, suggestUsername, setBackendTokenCookie } from "@/lib/server/backend-auth";

export async function POST(request: NextRequest) {
  await ensureBetterAuthTables();
  const auth = await getAuth();

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user.email) {
    return NextResponse.json({ message: "No active social session" }, { status: 401 });
  }

  try {
    const backendAuth = await loginToBackend({
      emailOrUsername: session.user.email,
      password: deriveSocialPassword(session.user.email),
    });

    const response = NextResponse.json({
      redirectTo: backendAuth.redirectTo,
      user: backendAuth.user,
    });

    setBackendTokenCookie(response, backendAuth.accessToken);
    return response;
  } catch {
    const { firstName, lastName } = splitDisplayName(session.user.name);
    return NextResponse.json({
      needsOnboarding: true,
      email: session.user.email,
      name: session.user.name ?? "",
      image: session.user.image ?? null,
      firstName,
      lastName,
      suggestedUsername: suggestUsername(session.user.email.split("@")[0] || session.user.name || "user"),
    });
  }
}
