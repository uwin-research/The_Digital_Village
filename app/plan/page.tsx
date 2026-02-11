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
import { Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function PlanPage() {
  const [progress, setProgress] = useState<ModuleProgress>({});
  const [updatesAnswered, setUpdatesAnswered] = useState<"yes" | "no" | null>(null);
  const [suspiciousAnswered, setSuspiciousAnswered] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setProgress(getStoredProgress());
    setUpdatesAnswered(getUpdatesAnswer());
    setSuspiciousAnswered(getSuspiciousAnswer());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-amber-950">My Plan</h1>
      <p className="mb-6 text-lg text-amber-800">
        Your printable checklist. Completion is saved in this browser.
      </p>

      <div className="mb-6 no-print">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-xl bg-amber-500 px-6 py-3 text-lg font-semibold text-amber-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
        >
          Print
        </button>
        <p className="mt-2 text-base text-amber-700">
          {completed} of {MODULES.length} modules completed.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm print:border print:shadow-none">
        <h2 className="mb-4 text-xl font-bold text-amber-950">Golden Shield — Training Checklist</h2>
        <p className="mb-6 text-base text-amber-800">Use this list as you work through the training.</p>

        {MODULES.map((mod) => {
          const isUpdates = mod.slug === "updates";
          const isSuspicious = mod.slug === "suspicious-messages";
          const done = isSuspicious
            ? !!suspiciousAnswered
            : isUpdates
              ? !!updatesAnswered
              : mod.steps.length > 0 &&
                !!progress[mod.slug] &&
                mod.steps.every((s) => progress[mod.slug][s.id]);

          return (
            <section key={mod.slug} className="mb-8">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-amber-950">
                {done ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-amber-950" aria-hidden>
                    <Check className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-amber-400" aria-hidden />
                )}
                {mod.title}
              </h3>
              {mod.steps.length > 0 && (
                <ul className="ml-8 list-disc space-y-1 text-base text-amber-800">
                  {mod.steps.map((s) => (
                    <li key={s.id}>{s.text}</li>
                  ))}
                </ul>
              )}
              {isUpdates && (
                <p className="ml-8 text-base text-amber-800">
                  Check for updates → If available, install on Wi-Fi when charging.
                </p>
              )}
              {isSuspicious && (
                <p className="ml-8 text-base text-amber-800">
                  Compare two messages and choose which is suspicious. Review safe action steps.
                </p>
              )}
              <div className="ml-8 mt-2 h-12 border-l-2 border-amber-200 pl-4 text-sm text-amber-600">
                Notes:
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
