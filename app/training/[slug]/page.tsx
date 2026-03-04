"use client";

import { getModuleBySlug } from "@/lib/modules";
import {
  getStoredProgress,
  setStepComplete,
  getUpdatesAnswer,
  setUpdatesAnswer,
  getSuspiciousAnswer,
  setSuspiciousAnswer,
  markModuleComplete,
  unmarkModuleComplete,
} from "@/lib/progress";
import { SettingsHelp } from "@/components/SettingsHelp";
import { ArrowLeft, Check, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const MESSAGE_A = {
  title: "Canada Post Alert",
  body: "We attempted to deliver your package, but there is an issue with your address.\nPlease confirm your details within 24 hours to avoid return to sender.\n👉 Click here to update delivery information",
};

const MESSAGE_B = {
  title: "Pharmacy Reminder",
  body: "Hello Margaret,\nThis is a reminder that your prescription is ready for pickup.\nIf you have questions, please call us at the number on your receipt.\n— Your Local Pharmacy",
};

const SUSPICIOUS_OPTIONS = [
  "A is suspicious",
  "B is suspicious",
  "Both are suspicious",
  "Neither is suspicious",
] as const;

export default function ModulePage() {
  const params = useParams();
  const slug = params.slug as string;
  const moduleData = getModuleBySlug(slug);

  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [updatesAnswer, setUpdatesAnswerState] = useState<"yes" | "no" | null>(null);
  const [suspiciousChoice, setSuspiciousChoice] = useState<string | null>(null);
  const [suspiciousSubmitted, setSuspiciousSubmitted] = useState(false);
  const [markedComplete, setMarkedComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [all, updatesAns, suspiciousAns] = await Promise.all([
        getStoredProgress(),
        slug === "updates" ? getUpdatesAnswer() : null,
        slug === "suspicious-messages" ? getSuspiciousAnswer() : null,
      ]);
      if (cancelled) return;
      setProgress(all[slug] ?? {});
      if (slug === "updates") setUpdatesAnswerState(updatesAns);
      if (slug === "suspicious-messages") {
        setSuspiciousChoice(suspiciousAns);
        setSuspiciousSubmitted(!!suspiciousAns);
      }
      const mod = getModuleBySlug(slug);
      if (mod) {
        const complete = mod.hasInteractiveMessage
          ? !!suspiciousAns
          : mod.afterCheckQuestion
            ? !!updatesAns
            : mod.steps.every((s) => (all[slug] ?? {})[s.id]);
        setMarkedComplete(complete);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [slug]);

  const toggleStep = useCallback(
    (stepId: string) => {
      const next = !progress[stepId];
      void setStepComplete(slug, stepId, next);
      setProgress((p) => ({ ...p, [stepId]: next }));
    },
    [slug, progress]
  );

  const handleUpdatesAnswer = useCallback((answer: "yes" | "no") => {
    void setUpdatesAnswer(answer);
    setUpdatesAnswerState(answer);
  }, []);

  const handleSuspiciousSubmit = useCallback((choice: string) => {
    void setSuspiciousAnswer(choice);
    setSuspiciousChoice(choice);
    setSuspiciousSubmitted(true);
  }, []);

  const handleMarkComplete = useCallback(
    async (complete: boolean) => {
      if (!moduleData) return;
      if (complete) {
        await markModuleComplete(moduleData);
        if (moduleData.steps.length > 0) {
          const allSteps: Record<string, boolean> = {};
          moduleData.steps.forEach((s) => { allSteps[s.id] = true; });
          setProgress(allSteps);
        }
        if (moduleData.slug === "updates") setUpdatesAnswerState("yes");
        if (moduleData.slug === "suspicious-messages") {
          setSuspiciousChoice("A is suspicious");
          setSuspiciousSubmitted(true);
        }
      } else {
        await unmarkModuleComplete(moduleData);
        if (moduleData.steps.length > 0) setProgress({});
        if (moduleData.slug === "updates") setUpdatesAnswerState(null);
        if (moduleData.slug === "suspicious-messages") {
          setSuspiciousChoice(null);
          setSuspiciousSubmitted(false);
        }
      }
      setMarkedComplete(complete);
    },
    [moduleData]
  );

  if (!moduleData) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-xl">Module not found.</p>
        <Link href="/training" className="mt-4 inline-block text-amber-600 underline">
          Back to Training
        </Link>
      </div>
    );
  }

  const isSuspicious = moduleData.slug === "suspicious-messages";
  const isUpdates = moduleData.slug === "updates";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/training"
        className="mb-6 inline-flex items-center gap-2 text-base font-medium text-amber-800 hover:text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
      >
        <ArrowLeft className="h-5 w-5" /> Back to Training
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-amber-950">{moduleData.title}</h1>
      {moduleData.scenario && (
        <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-base italic text-amber-900">
          {moduleData.scenario}
        </p>
      )}

      {moduleData.tip && (
        <div className="mb-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4" role="note">
          <p className="font-semibold text-amber-900">Tip</p>
          <p className="text-base text-amber-800">{moduleData.tip}</p>
        </div>
      )}

      {moduleData.reassurance && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4" role="note">
          <p className="text-base text-amber-800">{moduleData.reassurance}</p>
        </div>
      )}

      {moduleData.examples && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-base text-amber-800">{moduleData.examples}</p>
        </div>
      )}

      {moduleData.safetyCallout && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4" role="note">
          <p className="text-base text-amber-800">{moduleData.safetyCallout}</p>
        </div>
      )}

      {!isSuspicious && moduleData.steps.length > 0 && (
        <ol className="mb-8 space-y-4">
          {moduleData.steps.map((step, idx) => (
            <li key={step.id} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggleStep(step.id)}
                className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  progress[step.id]
                    ? "border-amber-600 bg-amber-500 text-amber-950"
                    : "border-amber-400 bg-white text-amber-800"
                }`}
                aria-pressed={progress[step.id]}
                aria-label={`Step ${idx + 1}: ${step.text}. ${progress[step.id] ? "Done" : "Mark as done"}`}
              >
                {progress[step.id] ? <Check className="h-4 w-4" /> : <span className="text-sm">{idx + 1}</span>}
              </button>
              <span className="pt-0.5 text-base text-amber-900">Step {idx + 1}: {step.text}</span>
            </li>
          ))}
        </ol>
      )}

      {isUpdates && (
        <>
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 font-medium text-amber-900">{moduleData.afterCheckQuestion}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleUpdatesAnswer("yes")}
                className={`rounded-lg px-5 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  updatesAnswer === "yes" ? "bg-amber-500 text-amber-950" : "bg-amber-200 text-amber-900 hover:bg-amber-300"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleUpdatesAnswer("no")}
                className={`rounded-lg px-5 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  updatesAnswer === "no" ? "bg-amber-500 text-amber-950" : "bg-amber-200 text-amber-900 hover:bg-amber-300"
                }`}
              >
                No
              </button>
            </div>
          </div>
          {updatesAnswer === "yes" && (
            <p className="mb-6 text-base font-medium text-green-800">Nice work—updates fix security problems.</p>
          )}
          {updatesAnswer === "no" && (
            <p className="mb-6 text-base text-amber-800">No problem—try again later when you&apos;re on Wi-Fi and charging.</p>
          )}
        </>
      )}

      {isSuspicious && (
        <div className="mb-8 space-y-6">
          <p className="text-base text-amber-900">Read these two messages. Which one is suspicious?</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-amber-200 bg-white p-4 shadow-sm">
              <p className="mb-2 font-bold text-amber-950">Message A</p>
              <p className="whitespace-pre-line text-base text-amber-800">{MESSAGE_A.title}</p>
              <p className="whitespace-pre-line text-base text-amber-800">{MESSAGE_A.body}</p>
            </div>
            <div className="rounded-xl border-2 border-amber-200 bg-white p-4 shadow-sm">
              <p className="mb-2 font-bold text-amber-950">Message B</p>
              <p className="whitespace-pre-line text-base text-amber-800">{MESSAGE_B.title}</p>
              <p className="whitespace-pre-line text-base text-amber-800">{MESSAGE_B.body}</p>
            </div>
          </div>

          {!suspiciousSubmitted ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="mb-3 font-medium text-amber-900">Which message is suspicious?</p>
              <div className="flex flex-col gap-2">
                {SUSPICIOUS_OPTIONS.map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-lg border border-amber-200 bg-white px-4 py-3 hover:bg-amber-50">
                    <input
                      type="radio"
                      name="suspicious"
                      value={opt}
                      checked={suspiciousChoice === opt}
                      onChange={() => setSuspiciousChoice(opt)}
                      className="h-5 w-5 accent-amber-600"
                    />
                    <span className="text-base">{opt}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => suspiciousChoice && handleSuspiciousSubmit(suspiciousChoice)}
                disabled={!suspiciousChoice}
                className="mt-4 rounded-lg bg-amber-500 px-5 py-3 font-medium text-amber-950 hover:bg-amber-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <p className="mb-2 font-bold text-amber-950">Why message A is suspicious</p>
              <ul className="mb-4 list-inside list-disc space-y-1 text-base text-amber-800">
                <li>Urgency or time limit (e.g. &quot;within 24 hours&quot;)</li>
                <li>Link to &quot;update details&quot;—could steal your information</li>
                <li>Generic wording; real services often use your name and real reference numbers</li>
              </ul>
              <p className="mb-2 font-bold text-amber-950">Safe action steps</p>
              <ul className="list-inside list-disc space-y-1 text-base text-amber-800">
                <li>Don&apos;t click links.</li>
                <li>Verify using official sources (official website or phone number you already trust).</li>
                <li>Report as spam/phishing.</li>
                <li>Delete the message.</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4" role="note">
        <p className="text-base text-amber-800">Take your time.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => handleMarkComplete(!markedComplete)}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 ${
            markedComplete
              ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
              : "bg-amber-500 text-amber-950 hover:bg-amber-400"
          }`}
        >
          <CheckCircle className="h-6 w-6" aria-hidden />
          {markedComplete ? "Mark as incomplete" : "Mark as complete"}
        </button>
        {markedComplete ? (
          <p className="text-base text-amber-800">Your progress has been saved. Click again to unmark.</p>
        ) : (
          <p className="text-sm text-amber-700">Click when you&apos;re done to track your progress.</p>
        )}
        {markedComplete && (
          <Link
            href="/training"
            className="rounded-lg bg-amber-500 px-5 py-2 font-medium text-amber-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            Back to Training
          </Link>
        )}
      </div>

      <SettingsHelp />
    </div>
  );
}
