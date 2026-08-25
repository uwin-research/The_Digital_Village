import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { getAccount, createAccount, setData } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const confirmPassword = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match. Please type the same password in both boxes." }, { status: 400 });
  }
  if (getAccount(email)) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please sign in instead." },
      { status: 409 }
    );
  }

  const { hash, salt } = hashPassword(password);
  createAccount(email, hash, salt);

  // Sign them in immediately after creating the account, same as a normal sign-in.
  const sessionId = await getOrCreateSessionId();
  setData(sessionId, "auth", JSON.stringify({ email }));

  return NextResponse.json({ user: { email } });
}
