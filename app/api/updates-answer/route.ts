import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { getData, setData, deleteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const raw = getData(sessionId, "updates_answer");
  if (raw === "yes" || raw === "no") return NextResponse.json({ answer: raw });
  return NextResponse.json({ answer: null });
}

export async function POST(request: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = await request.json();
  const answer = body?.answer;
  if (answer !== "yes" && answer !== "no") {
    return NextResponse.json({ error: "Invalid answer" }, { status: 400 });
  }
  setData(sessionId, "updates_answer", answer);
  return NextResponse.json({ answer });
}

export async function DELETE() {
  const sessionId = await getOrCreateSessionId();
  deleteData(sessionId, "updates_answer");
  return NextResponse.json({ ok: true });
}
