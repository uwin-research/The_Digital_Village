import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { getData, setData, deleteData, getAccount } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const raw = getData(sessionId, "auth");
  if (!raw) return NextResponse.json({ user: null });
  try {
    const user = JSON.parse(raw) as { email: string };
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}

/**
 * THIS IS THE FIX: previously this endpoint accepted any password (it
 * didn't even require one) as long as an email was supplied. It now
 * looks up the real account created via /api/auth/register and checks
 * the password against the stored hash.
 */
export async function POST(request: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = await request.json();
  const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Please enter both your email and password." }, { status: 400 });
  }

  const account = getAccount(email);
  if (!account) {
    return NextResponse.json(
      { error: "No account found with that email. Please create an account first." },
      { status: 404 }
    );
  }

  const passwordOk = verifyPassword(password, account.passwordHash, account.passwordSalt);
  if (!passwordOk) {
    return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
  }

  setData(sessionId, "auth", JSON.stringify({ email }));
  return NextResponse.json({ user: { email } });
}

export async function DELETE() {
  const sessionId = await getOrCreateSessionId();
  deleteData(sessionId, "auth");
  return NextResponse.json({ ok: true });
}
