import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const pathString = path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API}/${pathString}${searchParams ? `?${searchParams}` : ""}`;

    console.log("Proxying GET to:", url);

    // Define public endpoints that don't require authentication
    const isPublicEndpoint = pathString.startsWith("events");

    // Get authorization header from request or cookies
    const authHeader = request.headers.get("authorization");
    const cookieStore = await cookies();

    // Try Better Auth session cookie first, then fallback to session_token
    let sessionCookie = cookieStore.get("auth_session")?.value;
    if (!sessionCookie) {
      sessionCookie = cookieStore.get("session_token")?.value;
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": "Event-Booking-Frontend/1.0",
    };

    // For public endpoints, don't send auth at all
    // For private endpoints, add auth if available
    if (!isPublicEndpoint) {
      if (authHeader) {
        headers["Authorization"] = authHeader;
      } else if (sessionCookie) {
        headers["Authorization"] = `Bearer ${sessionCookie}`;
      }

      // Only forward cookies for private endpoints
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }
    } else {
      // For public endpoints - no auth, no cookies - just plain headers
      console.log("Public endpoint - no auth headers sent");
    }

    console.log("Request headers:", {
      ...headers,
      Cookie: headers.Cookie ? "***" : undefined,
    });

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      const errorStatus = res.status;
      console.error(
        `Proxy error (${errorStatus}):`,
        errorText.substring(0, 200),
      );
      return NextResponse.json(
        { message: "API error", details: errorText },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy GET error:", error);
    return NextResponse.json(
      { message: "Internal proxy error", error: String(error) },
      { status: 502 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const pathString = path.join("/");
    const url = `${process.env.NEXT_PUBLIC_API}/${pathString}`;

    const body = await request.json();
    console.log("Proxying POST to:", url, "body:", body);

    // Define public endpoints that don't require authentication
    const isPublicEndpoint = pathString.startsWith("events");

    // Get authorization header from request or cookies
    const authHeader = request.headers.get("authorization");
    const cookieStore = await cookies();

    // Try Better Auth session cookie first, then fallback to session_token
    let sessionCookie = cookieStore.get("auth_session")?.value;
    if (!sessionCookie) {
      sessionCookie = cookieStore.get("session_token")?.value;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Event-Booking-Frontend/1.0",
    };

    // For public endpoints, don't send auth at all
    // For private endpoints, add auth if available
    if (!isPublicEndpoint) {
      if (authHeader) {
        headers["Authorization"] = authHeader;
      } else if (sessionCookie) {
        headers["Authorization"] = `Bearer ${sessionCookie}`;
      }

      // Only forward cookies for private endpoints
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }
    } else {
      // For public endpoints - no auth, no cookies - just plain headers
      console.log("Public endpoint - no auth headers sent");
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      const errorStatus = res.status;
      console.error(
        `Proxy error (${errorStatus}):`,
        errorText.substring(0, 200),
      );
      return NextResponse.json(
        { message: "API error", details: errorText },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy POST error:", error);
    return NextResponse.json(
      { message: "Internal proxy error", error: String(error) },
      { status: 502 },
    );
  }
}
