import {
  getProgress,
  setStepComplete as apiSetStepComplete,
  setProgress as apiSetProgress,
  getUpdatesAnswer as apiGetUpdatesAnswer,
  setUpdatesAnswerApi,
  clearUpdatesAnswer,
  getSuspiciousAnswer as apiGetSuspiciousAnswer,
  setSuspiciousAnswerApi,
  clearSuspiciousAnswer,
  deleteModuleProgress as apiDeleteModuleProgress,
} from "@/lib/api";
import type { ModuleData } from "@/lib/modules";

export type ModuleProgress = Record<string, Record<string, boolean>>;

/** Step ids from `module.steps`, or `"1"`…`"n"` when the lesson uses `sections` only (e.g. Module 2). */
export function getModuleProgressStepIds(module: Pick<ModuleData, "steps" | "sections">): string[] {
  if (module.steps.length > 0) return module.steps.map((s) => s.id);
  const n = module.sections?.length ?? 0;
  if (n > 0) return Array.from({ length: n }, (_, i) => String(i + 1));
  return [];
}

export function isModuleLessonComplete(
  module: Pick<ModuleData, "steps" | "sections" | "afterCheckQuestion" | "hasInteractiveMessage">,
  progressForSlug: Record<string, boolean> | undefined,
  updatesAnswered: boolean,
  suspiciousAnswered: boolean
): boolean {
  if (module.hasInteractiveMessage) return !!suspiciousAnswered;
  if (module.afterCheckQuestion) return !!updatesAnswered;
  const ids = getModuleProgressStepIds(module);
  if (ids.length === 0) return false;
  return !!progressForSlug && ids.every((id) => progressForSlug[id]);
}

export async function getStoredProgress(): Promise<ModuleProgress> {
  try {
    const { progress } = await getProgress();
    return progress ?? {};
  } catch {
    return {};
  }
}

export async function setStepComplete(moduleSlug: string, stepId: string, complete: boolean): Promise<void> {
  await apiSetStepComplete(moduleSlug, stepId, complete);
}

export async function getUpdatesAnswer(): Promise<"yes" | "no" | null> {
  return apiGetUpdatesAnswer();
}

export async function setUpdatesAnswer(answer: "yes" | "no"): Promise<void> {
  await setUpdatesAnswerApi(answer);
}

export async function getSuspiciousAnswer(): Promise<string | null> {
  return apiGetSuspiciousAnswer();
}

export async function setSuspiciousAnswer(answer: string): Promise<void> {
  await setSuspiciousAnswerApi(answer);
}

export async function markModuleComplete(
  module: Pick<ModuleData, "slug" | "steps" | "sections" | "afterCheckQuestion" | "hasInteractiveMessage">
): Promise<void> {
  if (module.hasInteractiveMessage) {
    const existing = await getSuspiciousAnswer();
    if (!existing) await setSuspiciousAnswer("A is suspicious");
  } else if (module.afterCheckQuestion) {
    await setUpdatesAnswer("yes");
  } else {
    const ids = getModuleProgressStepIds(module);
    if (ids.length === 0) return;
    const progress = await getStoredProgress();
    if (!progress[module.slug]) progress[module.slug] = {};
    ids.forEach((id) => {
      progress[module.slug][id] = true;
    });
    await apiSetProgress(progress);
  }
}

export async function unmarkModuleComplete(
  module: Pick<ModuleData, "slug" | "steps" | "sections" | "afterCheckQuestion" | "hasInteractiveMessage">
): Promise<void> {
  if (module.hasInteractiveMessage) await clearSuspiciousAnswer();
  else if (module.afterCheckQuestion) await clearUpdatesAnswer();
  else if (getModuleProgressStepIds(module).length > 0) await apiDeleteModuleProgress(module.slug);
}

export function countCompletedModules(
  progress: ModuleProgress,
  modules: Pick<ModuleData, "slug" | "steps" | "sections" | "afterCheckQuestion" | "hasInteractiveMessage">[],
  updatesAnswered: boolean,
  suspiciousAnswered: boolean
): number {
  return modules.filter((m) => {
    if (m.hasInteractiveMessage) return suspiciousAnswered;
    if (m.afterCheckQuestion) return updatesAnswered;
    return isModuleLessonComplete(m, progress[m.slug], updatesAnswered, suspiciousAnswered);
  }).length;
}
