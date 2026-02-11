"use client";

import { MODULES } from "@/lib/modules";
import {
  getStoredProgress,
  getUpdatesAnswer,
  getSuspiciousAnswer,
  countCompletedModules,
  type ModuleForCount,
  type ModuleProgress,
} from "@/lib/progress";
import { Lock, Fingerprint, Smartphone, Download, Search, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ICONS = [Lock, Fingerprint, Smartphone, Download, Search, MessageSquare];

function useProgress() {
  const [progress, setProgress] = useState<ModuleProgress>({});
  const [updatesAnswered, setUpdatesAnswered] = useState<"yes" | "no" | null>(null);
  const [suspiciousAnswered, setSuspiciousAnswered] = useState<string | null>(null);
  useEffect(() => {
    setProgress(getStoredProgress());
    setUpdatesAnswered(getUpdatesAnswer());
    setSuspiciousAnswered(getSuspiciousAnswer());
  }, []);
  return { progress, updatesAnswered, suspiciousAnswered };
}

export default function TrainingPage() {
  const { progress, updatesAnswered, suspiciousAnswered } = useProgress();

  const modulesForCount: ModuleForCount[] = MODULES.map((m) => ({
    slug: m.slug,
    steps: m.steps,
    afterCheckQuestion: m.afterCheckQuestion,
    hasInteractiveMessage: m.hasInteractiveMessage,
  }));

  const completed = countCompletedModules(
    progress,
    modulesForCount,
    !!updatesAnswered,
    !!suspiciousAnswered
  );
  const total = MODULES.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-amber-950">
        Free Training: Stay Safer on Your Phone
      </h1>
      <p className="mb-6 text-lg text-amber-800">
        Work through each module at your own pace. You&apos;re doing great.
      </p>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-base font-medium text-amber-900">
          Before you start: If you get stuck, ask a trusted person to sit with you.
        </p>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-base font-medium text-amber-900">
          <span>Progress</span>
          <span>
            {completed} of {total} completed
          </span>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-amber-200"
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Training progress"
        >
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
          />
        </div>
        {completed > 0 && (
          <p className="mt-2 text-base text-amber-700">You&apos;re doing great.</p>
        )}
      </div>

      <ol className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((mod, i) => {
          const Icon = ICONS[i] ?? Lock;
          const isComplete =
            mod.hasInteractiveMessage
              ? !!suspiciousAnswered
              : mod.afterCheckQuestion
                ? !!updatesAnswered
                : mod.steps.length > 0 &&
                  !!progress[mod.slug] &&
                  mod.steps.every((s) => progress[mod.slug][s.id]);

          return (
            <li key={mod.slug}>
              <Link
                href={`/training/${mod.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-900"
                  aria-hidden
                >
                  <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-amber-950">{mod.title}</span>
                  <span className="ml-2 text-sm text-amber-700">
                    About {mod.estimatedMinutes} min
                  </span>
                  {isComplete && (
                    <span className="ml-2 text-sm font-medium text-green-700">Done</span>
                  )}
                </div>
                <span className="rounded-lg bg-amber-100 px-3 py-2 font-medium text-amber-900">
                  Start
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
