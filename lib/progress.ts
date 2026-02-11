const PROGRESS_KEY = "golden-shield-progress";
const UPDATES_ANSWER_KEY = "golden-shield-updates-answer";
const SUSPICIOUS_ANSWER_KEY = "golden-shield-suspicious-answer";
const QUIZ_PRE_KEY = "golden-shield-quiz-pre";
const QUIZ_POST_KEY = "golden-shield-quiz-post";

export type ModuleProgress = Record<string, Record<string, boolean>>;

export function getStoredProgress(): ModuleProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ModuleProgress;
  } catch {
    return {};
  }
}

export function setStepComplete(moduleSlug: string, stepId: string, complete: boolean): void {
  if (typeof window === "undefined") return;
  const progress = getStoredProgress();
  if (!progress[moduleSlug]) progress[moduleSlug] = {};
  progress[moduleSlug][stepId] = complete;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getUpdatesAnswer(): "yes" | "no" | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(UPDATES_ANSWER_KEY);
  if (raw === "yes" || raw === "no") return raw;
  return null;
}

export function setUpdatesAnswer(answer: "yes" | "no"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(UPDATES_ANSWER_KEY, answer);
}

export function getSuspiciousAnswer(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SUSPICIOUS_ANSWER_KEY);
}

export function setSuspiciousAnswer(answer: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUSPICIOUS_ANSWER_KEY, answer);
}

export type ModuleForComplete = {
  slug: string;
  steps: { id: string }[];
  afterCheckQuestion?: string;
  hasInteractiveMessage?: boolean;
};

export function markModuleComplete(module: ModuleForComplete): void {
  if (typeof window === "undefined") return;
  if (module.hasInteractiveMessage) {
    if (!getSuspiciousAnswer()) setSuspiciousAnswer("A is suspicious");
  } else if (module.afterCheckQuestion) {
    setUpdatesAnswer("yes");
  } else if (module.steps.length > 0) {
    const progress = getStoredProgress();
    if (!progress[module.slug]) progress[module.slug] = {};
    module.steps.forEach((s) => { progress[module.slug][s.id] = true; });
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
}

export function unmarkModuleComplete(module: ModuleForComplete): void {
  if (typeof window === "undefined") return;
  if (module.hasInteractiveMessage) {
    localStorage.removeItem(SUSPICIOUS_ANSWER_KEY);
  } else if (module.afterCheckQuestion) {
    localStorage.removeItem(UPDATES_ANSWER_KEY);
  } else if (module.steps.length > 0) {
    const progress = getStoredProgress();
    if (progress[module.slug]) {
      delete progress[module.slug];
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  }
}

export function getQuizPreScores(): number[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUIZ_PRE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as number[];
  } catch {
    return null;
  }
}

export function setQuizPreScores(scores: number[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUIZ_PRE_KEY, JSON.stringify(scores));
}

export function getQuizPostScores(): number[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUIZ_POST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as number[];
  } catch {
    return null;
  }
}

export function setQuizPostScores(scores: number[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUIZ_POST_KEY, JSON.stringify(scores));
}

export type ModuleForCount = {
  slug: string;
  steps: { id: string }[];
  afterCheckQuestion?: string;
  hasInteractiveMessage?: boolean;
};

export function countCompletedModules(
  progress: ModuleProgress,
  modules: ModuleForCount[],
  updatesAnswered: boolean,
  suspiciousAnswered: boolean
): number {
  let count = 0;
  for (const m of modules) {
    if (m.hasInteractiveMessage) {
      if (suspiciousAnswered) count++;
    } else if (m.afterCheckQuestion) {
      if (updatesAnswered) count++;
    } else if (m.steps.length > 0) {
      const steps = progress[m.slug];
      if (steps && m.steps.every((s) => steps[s.id])) count++;
    }
  }
  return count;
}
