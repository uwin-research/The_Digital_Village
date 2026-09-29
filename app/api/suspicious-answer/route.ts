import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/currentUser";
import { getData, setData, deleteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const ctx = await getCurrentUserContext();
  if (!ctx) return NextResponse.json({ answer: null });

  const answer = getData(ctx.dataKey, "suspicious_answer");
  return NextResponse.json({ answer });
}

export async function POST(request: Request) {
  const ctx = await getCurrentUserContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json();
  const answer = typeof body?.answer === "string" ? body.answer : null;
  if (!answer) {
    return NextResponse.json({ error: "Answer required" }, { status: 400 });
  }
  setData(ctx.dataKey, "suspicious_answer", answer);
  return NextResponse.json({ answer });
}

export async function DELETE() {
  const ctx = await getCurrentUserContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  deleteData(ctx.dataKey, "suspicious_answer");
  return NextResponse.json({ ok: true });
}
