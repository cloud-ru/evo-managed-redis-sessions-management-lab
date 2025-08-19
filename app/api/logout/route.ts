import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/session";
import { parse } from "cookie";

export async function POST(req: NextRequest) {
  const cookies = parse(req.headers.get("cookie") ?? "");
  if (cookies.sid) await destroySession(cookies.sid);

  const res = NextResponse.json({ ok: true });
  res.headers.set(
    "Set-Cookie",
    "sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
  );
  return res;
} 