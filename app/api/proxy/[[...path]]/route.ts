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

    // Get authorization header from request or cookies
    const authHeader = request.headers.get("authorization");
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    // Add authorization header
    if (authHeader) {
      headers["Authorization"] = authHeader;
    } else if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Proxy error response:", errorText);
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

    // Get authorization header from request or cookies
    const authHeader = request.headers.get("authorization");
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Add authorization header
    if (authHeader) {
      headers["Authorization"] = authHeader;
    } else if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Proxy error response:", errorText);
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
