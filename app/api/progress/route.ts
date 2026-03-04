import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { getData, setData, deleteData, deleteModuleProgress } from "@/lib/db";
import type { ModuleProgress } from "@/lib/progress";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const raw = getData(sessionId, "progress");
  if (!raw) return NextResponse.json({ progress: {} });
  try {
    const progress = JSON.parse(raw) as ModuleProgress;
    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ progress: {} });
  }
}

export async function PATCH(request: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = await request.json();
  const { moduleSlug, stepId, complete } = body as { moduleSlug?: string; stepId?: string; complete?: boolean };

  if (moduleSlug && stepId && typeof complete === "boolean") {
    const raw = getData(sessionId, "progress");
    const progress: ModuleProgress = raw ? (JSON.parse(raw) as ModuleProgress) : {};
    if (!progress[moduleSlug]) progress[moduleSlug] = {};
    progress[moduleSlug][stepId] = complete;
    setData(sessionId, "progress", JSON.stringify(progress));
    return NextResponse.json({ progress });
  }

  if (body.progress && typeof body.progress === "object") {
    setData(sessionId, "progress", JSON.stringify(body.progress));
    return NextResponse.json({ progress: body.progress });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function DELETE(request: Request) {
  const sessionId = await getOrCreateSessionId();
  const { searchParams } = new URL(request.url);
  const moduleSlug = searchParams.get("module");
  if (moduleSlug) {
    deleteModuleProgress(sessionId, moduleSlug);
  } else {
    deleteData(sessionId, "progress");
  }
  return NextResponse.json({ ok: true });
}
