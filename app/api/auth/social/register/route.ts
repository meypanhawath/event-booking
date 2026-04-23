import { NextRequest, NextResponse } from "next/server";

import { ensureBetterAuthTables, getAuth } from "@/lib/auth";
import { deriveSocialPassword, loginToBackend, registerBackendUser, setBackendTokenCookie } from "@/lib/server/backend-auth";

export async function POST(request: NextRequest) {
  await ensureBetterAuthTables();
  const auth = await getAuth();

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user.email) {
    return NextResponse.json({ message: "No active social session" }, { status: 401 });
  }

  const body = (await request.json()) as {
    username?: string;
    phoneNumber?: string;
  };

  if (!body.username?.trim() || !body.phoneNumber?.trim()) {
    return NextResponse.json(
      { message: "Username and phone number are required" },
      { status: 400 }
    );
  }

  const password = deriveSocialPassword(session.user.email);

  try {
    await registerBackendUser({
      username: body.username.trim(),
      email: session.user.email,
      phoneNumber: body.phoneNumber.trim(),
      password,
      confirmPassword: password,
    });

    const backendAuth = await loginToBackend({
      emailOrUsername: session.user.email,
      password,
    });

    const response = NextResponse.json({
      redirectTo: backendAuth.redirectTo,
      user: backendAuth.user,
    });

    setBackendTokenCookie(response, backendAuth.accessToken);
    return response;
  } catch (error) {
    const backendError = error as Error & {
      status?: number;
      data?: { message?: string; errors?: Record<string, string[]> };
    };

    return NextResponse.json(
      {
        message: backendError.data?.message || backendError.message || "Social registration failed",
        errors: backendError.data?.errors,
      },
      { status: backendError.status || 400 }
    );
  }
}
