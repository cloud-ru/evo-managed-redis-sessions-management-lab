import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const sessionId = req.headers.get("x-session-id");

  if (!sessionId) {
    return NextResponse.json({ error: "Нет сессии" }, { status: 401 });
  }

  const session = await getSession(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: "Недействительная сессия" },
      { status: 401 }
    );
  }

  return NextResponse.json({ userId: session.userId });
}
