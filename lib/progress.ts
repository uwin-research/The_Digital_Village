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

export async function markModuleComplete(module: Pick<ModuleData, "slug" | "steps" | "afterCheckQuestion" | "hasInteractiveMessage">): Promise<void> {
  if (module.hasInteractiveMessage) {
    const existing = await getSuspiciousAnswer();
    if (!existing) await setSuspiciousAnswer("A is suspicious");
  } else if (module.afterCheckQuestion) {
    await setUpdatesAnswer("yes");
  } else if (module.steps.length > 0) {
    const progress = await getStoredProgress();
    if (!progress[module.slug]) progress[module.slug] = {};
    module.steps.forEach((s) => { progress[module.slug][s.id] = true; });
    await apiSetProgress(progress);
  }
}

export async function unmarkModuleComplete(module: Pick<ModuleData, "slug" | "steps" | "afterCheckQuestion" | "hasInteractiveMessage">): Promise<void> {
  if (module.hasInteractiveMessage) await clearSuspiciousAnswer();
  else if (module.afterCheckQuestion) await clearUpdatesAnswer();
  else if (module.steps.length > 0) await apiDeleteModuleProgress(module.slug);
}

export function countCompletedModules(
  progress: ModuleProgress,
  modules: Pick<ModuleData, "slug" | "steps" | "afterCheckQuestion" | "hasInteractiveMessage">[],
  updatesAnswered: boolean,
  suspiciousAnswered: boolean
): number {
  return modules.filter((m) => {
    if (m.hasInteractiveMessage) return suspiciousAnswered;
    if (m.afterCheckQuestion) return updatesAnswered;
    const steps = progress[m.slug];
    return steps && m.steps.every((s) => steps[s.id]);
  }).length;
}
