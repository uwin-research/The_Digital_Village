import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { getData, setData, deleteData } from "@/lib/db";

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

export async function POST(request: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = await request.json();
  const email = typeof body?.email === "string" ? body.email.trim() : null;
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  setData(sessionId, "auth", JSON.stringify({ email }));
  return NextResponse.json({ user: { email } });
}

export async function DELETE() {
  const sessionId = await getOrCreateSessionId();
  deleteData(sessionId, "auth");
  return NextResponse.json({ ok: true });
}
