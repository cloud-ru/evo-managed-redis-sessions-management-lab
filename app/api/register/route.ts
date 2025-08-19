import { NextRequest, NextResponse } from "next/server";
import { Credentials, createUser } from "@/lib/user";
import { createSession } from "@/lib/session";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const creds = Credentials.safeParse(body);
  if (!creds.success)
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });

  try {
    const userId = await createUser(creds.data.email, creds.data.password);
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
  } catch (error) {
    // Handle duplicate email error
    if (error instanceof Error && error.message.includes("уже существует")) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Ошибка регистрации" }, { status: 500 });
  }
}
