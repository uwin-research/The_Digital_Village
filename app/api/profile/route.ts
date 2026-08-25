import { NextResponse } from "next/server";
import { getCurrentUserEmail } from "@/lib/currentUser";
import { getData, setData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const email = await getCurrentUserEmail();
  if (!email) return NextResponse.json({ profile: null });

  const raw = getData(email, "profile");
  if (!raw) return NextResponse.json({ profile: null });
  try {
    return NextResponse.json({ profile: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ profile: null });
  }
}

export async function POST(request: Request) {
  const email = await getCurrentUserEmail();
  if (!email) {
    return NextResponse.json({ error: "You must be signed in to save profile settings." }, { status: 401 });
  }

  const body = await request.json();
  setData(email, "profile", JSON.stringify(body));
  return NextResponse.json({ ok: true });
}
