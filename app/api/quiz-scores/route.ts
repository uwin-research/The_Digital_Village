import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { getData, setData } from "@/lib/db";

export const dynamic = "force-dynamic";

function parseScores(raw: string | null): number[] | null {
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) && arr.every((n) => typeof n === "number") ? arr : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  return NextResponse.json({
    preScores: parseScores(getData(sessionId, "quiz_pre")),
    postScores: parseScores(getData(sessionId, "quiz_post")),
  });
}

export async function POST(request: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = await request.json();
  const { type, scores } = body as { type?: "pre" | "post"; scores?: number[] };
  if (type !== "pre" && type !== "post") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (!Array.isArray(scores) || !scores.every((n) => typeof n === "number")) {
    return NextResponse.json({ error: "Invalid scores" }, { status: 400 });
  }
  const key = type === "pre" ? "quiz_pre" : "quiz_post";
  setData(sessionId, key, JSON.stringify(scores));
  return NextResponse.json({ scores });
}
