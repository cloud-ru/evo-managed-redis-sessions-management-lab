import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Only handle session validation for API routes that need it
  if (req.nextUrl.pathname.startsWith("/api/me")) {
    const sid = req.cookies.get("sid")?.value;

    if (!sid) {
      return NextResponse.json({ error: "Нет сессии" }, { status: 401 });
    }

    // Forward the session ID to the API route for validation
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-session-id", sid);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/me"],
};
