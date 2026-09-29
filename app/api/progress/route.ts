import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/currentUser";
import { getData, setData, deleteData, deleteModuleProgress } from "@/lib/db";
import type { ModuleProgress } from "@/lib/progress";

export const dynamic = "force-dynamic";

export async function GET() {
  const ctx = await getCurrentUserContext();
  if (!ctx) return NextResponse.json({ progress: {} });

  const raw = getData(ctx.dataKey, "progress");
  if (!raw) return NextResponse.json({ progress: {} });
  try {
    const progress = JSON.parse(raw) as ModuleProgress;
    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ progress: {} });
  }
}

export async function PATCH(request: Request) {
  const ctx = await getCurrentUserContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json();
  const { moduleSlug, stepId, complete } = body as { moduleSlug?: string; stepId?: string; complete?: boolean };

  if (moduleSlug && stepId && typeof complete === "boolean") {
    const raw = getData(ctx.dataKey, "progress");
    const progress: ModuleProgress = raw ? (JSON.parse(raw) as ModuleProgress) : {};
    if (!progress[moduleSlug]) progress[moduleSlug] = {};
    progress[moduleSlug][stepId] = complete;
    setData(ctx.dataKey, "progress", JSON.stringify(progress));
    return NextResponse.json({ progress });
  }

  if (body.progress && typeof body.progress === "object") {
    setData(ctx.dataKey, "progress", JSON.stringify(body.progress));
    return NextResponse.json({ progress: body.progress });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function DELETE(request: Request) {
  const ctx = await getCurrentUserContext();
  if (!ctx) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const moduleSlug = searchParams.get("module");
  if (moduleSlug) {
    deleteModuleProgress(ctx.dataKey, moduleSlug);
  } else {
    deleteData(ctx.dataKey, "progress");
  }
  return NextResponse.json({ ok: true });
}
