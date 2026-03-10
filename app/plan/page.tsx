"use client";

import { MODULES } from "@/lib/modules";
import { countCompletedModules } from "@/lib/progress";
import { useProgressData } from "@/hooks/useProgressData";
import { Check } from "lucide-react";

export default function PlanPage() {
  const { progress, updatesAnswered, suspiciousAnswered } = useProgressData();

  const completed = countCompletedModules(
    progress,
    MODULES,
    !!updatesAnswered,
    !!suspiciousAnswered
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#000080]">My Plan</h1>
      <p className="mb-6 text-lg text-black">
        Your printable checklist. Completion is saved in the database.
      </p>

      <div className="mb-6 no-print">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-xl bg-[#000080] px-6 py-4 text-lg font-semibold text-white border-2 border-black hover:bg-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
        >
          Print
        </button>
        <p className="mt-2 text-base text-black">
          {completed} of {MODULES.length} modules completed.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-sm print:border print:shadow-none">
        <h2 className="mb-4 text-xl font-bold text-[#000080]">The Digital Village — Training Checklist</h2>
        <p className="mb-6 text-base text-black">Use this list as you work through the training.</p>

        {MODULES.map((mod) => {
          const isUpdates = mod.slug === "software-updates";
          const isSuspicious = mod.slug === "scams-phishing";
          const done = isSuspicious
            ? !!suspiciousAnswered
            : isUpdates
              ? !!updatesAnswered
              : mod.steps.length > 0 &&
                !!progress[mod.slug] &&
                mod.steps.every((s) => progress[mod.slug][s.id]);

          return (
            <section key={mod.slug} className="mb-8">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-[#000080]">
                {done ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#000080] text-white" aria-hidden>
                    <Check className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black" aria-hidden />
                )}
                {mod.title}
              </h3>
              {mod.steps.length > 0 && (
                <ul className="ml-8 list-disc space-y-1 text-base text-black">
                  {mod.steps.map((s) => (
                    <li key={s.id}>{s.text}</li>
                  ))}
                </ul>
              )}
              {isUpdates && (
                <p className="ml-8 text-base text-black">
                  Check for updates → If available, install on Wi-Fi when charging.
                </p>
              )}
              {isSuspicious && (
                <p className="ml-8 text-base text-black">
                  Compare two messages and choose which is suspicious. Review safe action steps.
                </p>
              )}
              <div className="ml-8 mt-2 h-12 border-l-2 border-black pl-4 text-sm text-black">
                Notes:
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
