import { NextRequest, NextResponse } from "next/server";
import { Credentials, verifyUser } from "@/lib/user";
import { createSession } from "@/lib/session";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const creds = Credentials.safeParse(body);
  if (!creds.success)
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });

  const userId = await verifyUser(creds.data.email, creds.data.password);
  if (!userId)
    return NextResponse.json(
      { error: "Неверный email или пароль" },
      { status: 401 }
    );

  const sess = await createSession(userId);
  const res = NextResponse.json({ ok: true });
  res.headers.set(
    "Set-Cookie",
    serialize("sid", sess.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
  );
  return res;
}
