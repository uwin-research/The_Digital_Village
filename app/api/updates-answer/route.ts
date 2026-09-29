import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/currentUser";
import { getData, setData, deleteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const ctx = await getCurrentUserContext();
  if (!ctx) return NextResponse.json({ answer: null });

  const raw = getData(ctx.dataKey, "updates_answer");
  if (raw === "yes" || raw === "no") return NextResponse.json({ answer: raw });
  return NextResponse.json({ answer: null });
}

export async function POST(request: Request) {
  const ctx = await getCurrentUserContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json();
  const answer = body?.answer;
  if (answer !== "yes" && answer !== "no") {
    return NextResponse.json({ error: "Invalid answer" }, { status: 400 });
  }
  setData(ctx.dataKey, "updates_answer", answer);
  return NextResponse.json({ answer });
}

export async function DELETE() {
  const ctx = await getCurrentUserContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  deleteData(ctx.dataKey, "updates_answer");
  return NextResponse.json({ ok: true });
}
