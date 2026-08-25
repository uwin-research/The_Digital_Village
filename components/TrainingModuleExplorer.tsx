"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { useProgressData } from "@/hooks/useProgressData";
import { MODULES } from "@/lib/modules";
import { isModuleLessonComplete, type ModuleProgress } from "@/lib/progress";
import { getNavModulesForPlatform, type TrainingNavModule } from "@/lib/trainingNavModules";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

type TrainingModuleExplorerProps = {
  currentSlug: string;
  progressRefreshKey?: number | string | boolean;
};

function isModuleComplete(
  mod: TrainingNavModule,
  progress: ModuleProgress,
  updatesAnswered: boolean,
  suspiciousAnswered: boolean
): boolean {
  const moduleData = MODULES.find((m) => m.slug === mod.slug);
  return moduleData
    ? isModuleLessonComplete(moduleData, progress[mod.slug], updatesAnswered, suspiciousAnswered)
    : false;
}

/**
 * THIS IS THE PLATFORM FIX: this function used to always look through
 * the global TRAINING_NAV_MODULES list (all 16 modules, both phone
 * types mixed together). It now takes the person's OWN 8-module list
 * as a parameter, so suggestions never cross over into the other
 * phone type's modules.
 */
function pickSuggestedNext(
  navModules: TrainingNavModule[],
  currentSlug: string,
  progress: ModuleProgress,
  updatesAnswered: boolean,
  suspiciousAnswered: boolean
): TrainingNavModule {
  const n = navModules.length;
  const idx = navModules.findIndex((m) => m.slug === currentSlug);

  if (idx === -1) {
    const firstIncomplete = navModules.find(
      (m) => !isModuleComplete(m, progress, updatesAnswered, suspiciousAnswered)
    );
    return firstIncomplete ?? navModules[0];
  }

  /*
   * THIS IS THE FIX: this used to just return whatever module came
   * immediately after the current one in the list, even if that module
   * was already marked complete — so completing Module 1 and 2 could
   * still suggest Module 2 again. It now searches forward (wrapping
   * around the end of the list) for the first module that ISN'T
   * already complete, so it always points to genuinely unfinished work.
   */
  for (let offset = 1; offset <= n; offset++) {
    const candidate = navModules[(idx + offset) % n];
    if (!isModuleComplete(candidate, progress, updatesAnswered, suspiciousAnswered)) {
      return candidate;
    }
  }
  // Everything is complete — fall back to simply the next one in sequence.
  return navModules[(idx + 1) % n];
}

export function TrainingModuleExplorer({ currentSlug, progressRefreshKey }: TrainingModuleExplorerProps) {
  const { profile } = useAccessibility();
  const navModules = useMemo(() => getNavModulesForPlatform(profile.devicePlatform), [profile.devicePlatform]);

  const { progress, updatesAnswered, suspiciousAnswered, reload } = useProgressData();

  useEffect(() => {
    void reload();
  }, [currentSlug, progressRefreshKey, reload]);

  const suggested = useMemo(
    () => pickSuggestedNext(navModules, currentSlug, progress, !!updatesAnswered, !!suspiciousAnswered),
    [navModules, currentSlug, progress, updatesAnswered, suspiciousAnswered]
  );

  // THIS IS THE FIX for the confusing reordering: the list used to move
  // whichever module was "suggested next" to the very top, which broke
  // the natural Module 1, 2, 3... sequence and made it look like modules
  // were jumping around. Now the list always stays in its original
  // order — `suggested` is only used to decide which row gets the
  // "Suggested next" label, in its own natural position.
  const totalModules = navModules.length;
  const completedCount = useMemo(
    () => navModules.filter((m) => isModuleComplete(m, progress, !!updatesAnswered, !!suspiciousAnswered)).length,
    [navModules, progress, updatesAnswered, suspiciousAnswered]
  );
  const currentPosition = useMemo(
    () => navModules.findIndex((m) => m.slug === currentSlug) + 1,
    [navModules, currentSlug]
  );

  return (
    <nav
      className="mt-10 border-t border-[var(--border)] pt-8"
      aria-labelledby="training-learn-next-heading"
    >
      <h2 id="training-learn-next-heading" className="text-lg font-semibold text-[var(--heading)]">
        Which module would you like to learn next?
      </h2>

      {/* Step counter / progress trace - announced to screen readers when it changes */}
      <p
        className="mt-2 inline-block rounded-full bg-[#f3f4f6] px-3 py-1 text-sm font-semibold text-[var(--heading)]"
        aria-live="polite"
      >
        {currentPosition > 0 ? `You're on Module ${currentPosition} of ${totalModules}` : `${totalModules} modules total`} —{" "}
        {completedCount} of {totalModules} completed
      </p>

      <p className="mt-2 max-w-xl text-base font-semibold text-[var(--foreground)]">
        Tap any row to open that lesson. One idea is highlighted below as a gentle suggestion—you can still choose any
        module you prefer.
      </p>

      <ul className="mt-5 list-none divide-y divide-neutral-200 rounded-lg border border-neutral-300 bg-white p-0">
        {navModules.map((mod) => {
          const isComplete = isModuleComplete(mod, progress, !!updatesAnswered, !!suspiciousAnswered);
          const isHere = mod.slug === currentSlug;
          const isSuggested = mod.slug === suggested.slug && !isHere;
          const statusLabel = isComplete ? "Done" : "Not Done";

          return (
            <li key={mod.slug}>
              <Link
                href={`/training/${mod.slug}`}
                className={`grid min-h-[48px] grid-cols-1 gap-1 px-4 py-3 no-underline transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--heading)] sm:grid-cols-[minmax(0,1fr)_5.5rem] sm:items-center sm:gap-4 sm:py-3.5 ${
                  isHere ? "border-l-4 border-l-[var(--heading)] bg-[#f3f4f6]" : ""
                }`}
                style={{ textDecoration: "none" }}
                aria-current={isHere ? "page" : undefined}
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold leading-snug text-[var(--foreground)]">
                    <span>{mod.title}</span>
                    {isHere ? (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)" }}
                      >
                        You are here
                      </span>
                    ) : null}
                    {isSuggested ? (
                      <span className="rounded-full bg-[#cce5ff] px-2 py-0.5 text-xs font-bold text-[var(--heading)]">
                        Suggested next
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-sm text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]">{mod.purposeLine}</p>
                </div>
                <p className={`flex items-center gap-1 text-sm font-medium sm:justify-end sm:text-right ${isComplete ? "text-green-800" : "text-[color-mix(in_srgb,var(--foreground)_55%,transparent)]"}`}>
                  {isComplete ? <CheckCircle className="h-4 w-4 shrink-0" aria-hidden /> : null}
                  <span>{statusLabel}</span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}