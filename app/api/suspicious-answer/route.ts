import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { getData, setData, deleteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const answer = getData(sessionId, "suspicious_answer");
  return NextResponse.json({ answer });
}

export async function POST(request: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = await request.json();
  const answer = typeof body?.answer === "string" ? body.answer : null;
  if (!answer) {
    return NextResponse.json({ error: "Answer required" }, { status: 400 });
  }
  setData(sessionId, "suspicious_answer", answer);
  return NextResponse.json({ answer });
}

export async function DELETE() {
  const sessionId = await getOrCreateSessionId();
  deleteData(sessionId, "suspicious_answer");
  return NextResponse.json({ ok: true });
}
