"use client";

import { ContentBlock, getModuleBySlug, MODULES, MediaSlot } from "@/lib/modules";
import {
  getStoredProgress,
  getUpdatesAnswer,
  setUpdatesAnswer,
  getSuspiciousAnswer,
  setSuspiciousAnswer,
  markModuleComplete,
  unmarkModuleComplete,
} from "@/lib/progress";
import { SettingsHelp } from "@/components/SettingsHelp";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";
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

const PASSPHRASE_EXAMPLES = [
  "Bicycle-Apple-Garden-26",
  "Lantern-River-Maple-83",
  "Library-Teacup-Sunrise-41",
  "Piano-Window-Meadow-72",
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
  const [passphraseIndex, setPassphraseIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [all, updatesAns, suspiciousAns] = await Promise.all([
        getStoredProgress(),
        slug === "software-updates" ? getUpdatesAnswer() : null,
        slug === "scams-phishing" ? getSuspiciousAnswer() : null,
      ]);
      if (cancelled) return;
      setProgress(all[slug] ?? {});
      if (slug === "software-updates") setUpdatesAnswerState(updatesAns);
      if (slug === "scams-phishing") {
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
        if (moduleData.slug === "software-updates") setUpdatesAnswerState("yes");
        if (moduleData.slug === "scams-phishing") {
          setSuspiciousChoice("A is suspicious");
          setSuspiciousSubmitted(true);
        }
      } else {
        await unmarkModuleComplete(moduleData);
        if (moduleData.steps.length > 0) setProgress({});
        if (moduleData.slug === "software-updates") setUpdatesAnswerState(null);
        if (moduleData.slug === "scams-phishing") {
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
        <Link href="/training" className="mt-4 inline-block text-[#0047ab] underline">
          Back to Training
        </Link>
      </div>
    );
  }

  const isSuspicious = moduleData.slug === "scams-phishing";
  const isUpdates = moduleData.slug === "software-updates";
  const isGettingComfortable = moduleData.slug === "getting-comfortable";
  const isFirstLineOfDefence = moduleData.slug === "first-line-of-defence";
  const isPasswordsLoggingIn = moduleData.slug === "passwords-logging-in";
  const isTwoFactorAuth = moduleData.slug === "two-factor-auth";
  const nextModule = MODULES.find((module, index) => MODULES[index - 1]?.slug === slug) ?? null;
  const renderTextBlock = (text: string) => {
    const colonIndex = text.indexOf(":");

    if (colonIndex === -1) {
      return text;
    }

    const label = text.slice(0, colonIndex).trim();
    const remainder = text.slice(colonIndex + 1).trim();

    if (!label || !remainder) {
      return text;
    }

    return (
      <>
        <strong>{label}:</strong> {remainder}
      </>
    );
  };
  const renderMediaBlock = (slot: MediaSlot) =>
    slot.src && slot.type === "image" ? (
      <Image
        src={slot.src}
        alt={slot.alt || slot.label || "Training image"}
        width={1200}
        height={675}
        className="h-auto w-full rounded-lg bg-white"
      />
    ) : slot.src && slot.type === "video" ? (
      <div className="space-y-3">
        {slot.label && (
          <p className="text-base font-semibold text-[#000080]">{slot.label}</p>
        )}
        <video
          controls
          preload="metadata"
          className="w-full rounded-lg border-2 border-black bg-black"
          aria-label={slot.alt || slot.label || "Training video"}
        >
          <source src={slot.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {slot.description && (
          <p className="text-sm text-black">{slot.description}</p>
        )}
      </div>
    ) : (
      <div
        className="rounded-lg border-2 border-dashed border-black bg-[#f5f5f5] p-6"
        role={slot.src ? undefined : "img"}
        aria-label={slot.src ? undefined : slot.description}
      >
        <>
          <p className="mb-2 font-semibold text-black">[MEDIA SLOT: {slot.type.toUpperCase()}]</p>
          {slot.label && (
            <p className="mb-2 text-sm font-medium text-black">Label: {slot.label}</p>
          )}
          <p className="mb-3 text-sm text-black">{slot.description}</p>
          {slot.slides && (
            <ul className="space-y-2 text-sm text-black">
              {slot.slides.map((slide, i) => (
                <li key={i}>
                  <strong>Slide {i + 1}: {slide.title}</strong> — {slide.text}
                </li>
              ))}
            </ul>
          )}
        </>
      </div>
    );
  const showWideLayout = isGettingComfortable || isFirstLineOfDefence || isPasswordsLoggingIn || isTwoFactorAuth;
  const useLargeSectionText = isGettingComfortable || isFirstLineOfDefence || isPasswordsLoggingIn || isTwoFactorAuth;

  return (
    <div className={`mx-auto px-4 py-8 ${showWideLayout ? "max-w-5xl" : "max-w-3xl"}`}>
      <Link
        href="/training"
        className="mb-6 inline-flex items-center gap-2 text-base font-medium text-black hover:text-[#000080] focus:outline-none focus:ring-2 focus:ring-[#000080] rounded"
      >
        <ArrowLeft className="h-5 w-5" /> Back to Training
      </Link>

      <h1 className={`mb-2 font-bold text-[#000080] ${showWideLayout ? "text-[32px] leading-tight" : "text-3xl"}`}>
        {isGettingComfortable
          ? "Module 1: Getting Comfortable with Your Device"
          : isFirstLineOfDefence
          ? "Module 2: Your First Line of Defence"
          : isPasswordsLoggingIn
            ? "Module 3: Passwords & Logging in Safely"
            : isTwoFactorAuth
              ? "Module 4: Two-Factor Authentication (2FA)"
            : moduleData.title}
      </h1>
      {moduleData.scenario && (
        <p className={`mb-6 rounded-lg border-2 border-black bg-white p-4 italic text-black ${showWideLayout ? "text-[24px] leading-[1.7]" : "text-base"}`}>
          {moduleData.scenario}
        </p>
      )}

      {isFirstLineOfDefence && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-sm" aria-labelledby="module-2-hero">
          <div className="relative aspect-[16/7] w-full bg-[#f5f5f5]">
            <Image
              src="/elena-security.png"
              alt="Elena smiling while holding her phone securely."
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="p-6">
            <h2 id="module-2-hero" className="text-[32px] font-bold text-[#000080]">
              Securing Your Digital Front Door
            </h2>
          </div>
        </section>
      )}

      {isGettingComfortable && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-sm" aria-labelledby="module-1-hero">
          <div className="relative aspect-[16/7] w-full bg-[#f5f5f5]">
            <Image
              src="/arthur-accessibility.png"
              alt="Arthur smiling while using a tablet with large, readable text."
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="p-6">
            <h2 id="module-1-hero" className="text-[32px] font-bold text-[#000080]">
              Making the Screen Work for You
            </h2>
          </div>
        </section>
      )}

      {isPasswordsLoggingIn && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-sm" aria-labelledby="module-3-hero">
          <div className="relative aspect-[16/7] w-full bg-[#f5f5f5]">
            <Image
              src="/sam-passwords.png"
              alt="Sam learning safer passwords on his device."
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="p-6">
            <h2 id="module-3-hero" className="text-[32px] font-bold text-[#000080]">
              The Master Keys to Your Digital Life
            </h2>
            <p className="mt-3 text-[24px] leading-[1.7] text-black">
              The goal: teach Sam how to create strong passwords that are easy to remember, and introduce him to a digital notebook that does the heavy lifting.
            </p>
          </div>
        </section>
      )}

      {isTwoFactorAuth && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-sm" aria-labelledby="module-4-hero">
          <div className="relative aspect-[16/7] w-full bg-[#f5f5f5]">
            <Image
              src="/two-factor-auth.png"
              alt="Sam learning about two-factor authentication on his phone."
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="p-6">
            <h2 id="module-4-hero" className="text-[32px] font-bold text-[#000080]">
              The Second Lock for Your Digital Door
            </h2>
            <p className="mt-3 text-[24px] leading-[1.7] text-black">
              The goal: help Sam understand that a password alone is not enough, and show him how a one-time code on his phone blocks strangers from getting in.
            </p>
          </div>
        </section>
      )}

      {moduleData.tip && (
        <div className="mb-6 rounded-xl border-l-4 border-2 border-[#000080] bg-white p-4" role="note">
          <p className="font-semibold text-black">Tip</p>
          <p className="text-base text-black">{moduleData.tip}</p>
        </div>
      )}

      {moduleData.reassurance && (
        <div className="mb-6 rounded-xl border-2 border-black bg-white p-4" role="note">
          <p className="text-base text-black">{moduleData.reassurance}</p>
        </div>
      )}

      {moduleData.examples && (
        <div className="mb-6 rounded-xl border-2 border-black bg-white p-4">
          <p className="text-base text-black">{moduleData.examples}</p>
        </div>
      )}

      {moduleData.safetyCallout && (
        <div className="mb-6 rounded-xl border-2 border-black bg-white p-4" role="note">
          <p className="text-base text-black">{moduleData.safetyCallout}</p>
        </div>
      )}

      {!isSuspicious && moduleData.sections ? (
        <div className="mb-8 space-y-10">
          {moduleData.sections.map((section, sectionIdx) => (
            <section key={sectionIdx} className="rounded-xl border-2 border-black bg-white p-6 shadow-sm">
              <h2 className={`mb-6 font-bold text-[#000080] ${showWideLayout ? "text-[32px] leading-tight" : "text-xl"}`}>
                {section.title}
              </h2>
              <div className="space-y-6">
                {isFirstLineOfDefence && sectionIdx === 1 ? (
                  <>
                    <p className="text-[24px] leading-[1.7] text-black">
                      There are three main ways to lock your phone. Each has its own strengths.
                    </p>
                    <div className="overflow-x-auto rounded-xl border-2 border-black">
                      <table className="min-w-full border-collapse text-left text-[24px] text-black">
                        <thead className="bg-[#cfcfcf]">
                          <tr>
                            <th className="border-b-2 border-black px-4 py-4 font-bold">Lock Type</th>
                            <th className="border-b-2 border-black px-4 py-4 font-bold">Definition</th>
                            <th className="border-b-2 border-black px-4 py-4 font-bold">Security vs. Ease</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="border-t-2 border-black px-4 py-4 font-semibold text-[#000080]">PIN</td>
                            <td className="border-t-2 border-black px-4 py-4">A secret 4 or 6-digit number.</td>
                            <td className="border-t-2 border-black px-4 py-4">High Security: Hard to guess. Medium Ease: Must be remembered.</td>
                          </tr>
                          <tr className="bg-[#d9d9d9]">
                            <td className="border-t-2 border-black px-4 py-4 font-semibold text-[#000080]">Pattern</td>
                            <td className="border-t-2 border-black px-4 py-4">Connecting dots in a specific shape.</td>
                            <td className="border-t-2 border-black px-4 py-4">Medium Security: Finger streaks can give it away. High Ease: Very fast.</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="border-t-2 border-black px-4 py-4 font-semibold text-[#000080]">Password</td>
                            <td className="border-t-2 border-black px-4 py-4">A mix of letters and numbers.</td>
                            <td className="border-t-2 border-black px-4 py-4">Very High Security: Hardest to crack. Low Ease: Hard to type on small screens.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : isFirstLineOfDefence && sectionIdx === 2 ? (
                  (() => {
                    const tipBlock = section.blocks.find(
                      (block, idx): block is ContentBlock => idx > 0 && block.type === "text" && block.text.startsWith("Tip:")
                    );
                    const stepBlocks = section.blocks.filter(
                      (block, idx): block is ContentBlock => idx > 0 && block.type === "text" && !block.text.startsWith("Tip:")
                    );
                    const mediaBlocks = section.blocks.filter((block) => block.type === "media");

                    return (
                      <>
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_420px] md:items-start">
                          <div className="space-y-4">
                            <p className="text-[28px] font-bold leading-[1.6] text-black">
                              {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                            </p>
                            <ol className="ml-6 list-decimal space-y-3">
                              {stepBlocks.map((block, blockIdx) => (
                                <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                                  {renderTextBlock(block.text)}
                                </li>
                              ))}
                            </ol>
                            {tipBlock && (
                              <div className="relative mt-28 max-w-[420px] pt-20">
                                <aside className="absolute left-[76%] -top-[5.5rem] z-10 w-full max-w-[260px] -translate-x-1/2 rounded-[2rem] bg-[#d0d0d0] px-6 py-4 text-[22px] font-medium leading-[1.6] text-black shadow-sm md:left-[108%] md:-top-[4.5rem] shadow-sm">
                                  <span className="absolute -bottom-4 left-6 h-8 w-8 rounded-full bg-[#d0d0d0]" aria-hidden />
                                  <span className="absolute -bottom-9 left-3 h-5 w-5 rounded-full bg-[#d0d0d0]" aria-hidden />
                                  {renderTextBlock(tipBlock.text)}
                                </aside>
                                <Image
                                  src="/module-2-passcode-thinking-v2.png"
                                  alt="Elena thinking while looking at her phone."
                                  width={640}
                                  height={400}
                                  className="h-auto w-full"
                                />
                              </div>
                            )}
                          </div>
                          <div className="space-y-4">
                            {mediaBlocks.map((block, blockIdx) => (
                              <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()
                ) : isFirstLineOfDefence && sectionIdx === 3 ? (
                  <>
                    <p className="text-[28px] font-bold leading-[1.6] text-black">
                      {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                    </p>
                    <ol className="ml-6 list-decimal space-y-4">
                      {section.blocks.slice(1).map((block, blockIdx) =>
                        block.type === "text" ? (
                          <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                            {renderTextBlock(block.text)}
                          </li>
                        ) : (
                          <li key={blockIdx} className="list-none">
                            <div
                              className="rounded-lg border-2 border-dashed border-black bg-[#f5f5f5] p-6"
                              role={block.slot.src ? undefined : "img"}
                              aria-label={block.slot.src ? undefined : block.slot.description}
                            >
                              {block.slot.src && block.slot.type === "video" ? (
                                <div className="space-y-3">
                                  {block.slot.label && (
                                    <p className="text-base font-semibold text-[#000080]">{block.slot.label}</p>
                                  )}
                                  <video
                                    controls
                                    preload="metadata"
                                    className="w-full rounded-lg border-2 border-black bg-black"
                                    aria-label={block.slot.alt || block.slot.label || "Training video"}
                                  >
                                    <source src={block.slot.src} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                  {block.slot.description && (
                                    <p className="text-sm text-black">{block.slot.description}</p>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <p className="mb-2 font-semibold text-black">[MEDIA SLOT: {block.slot.type.toUpperCase()}]</p>
                                  {block.slot.label && (
                                    <p className="mb-2 text-sm font-medium text-black">Label: {block.slot.label}</p>
                                  )}
                                  <p className="mb-3 text-sm text-black">{block.slot.description}</p>
                                </>
                              )}
                            </div>
                          </li>
                        )
                      )}
                    </ol>
                  </>
                ) : isFirstLineOfDefence && [4, 5, 6, 7].includes(sectionIdx) ? (
                  <>
                    <p className="text-[28px] font-bold leading-[1.6] text-black">
                      {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                    </p>
                    <ol className="ml-6 list-decimal space-y-4">
                      {section.blocks.slice(1).map((block, blockIdx) =>
                        block.type === "text" ? (
                          <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                            {renderTextBlock(block.text)}
                          </li>
                        ) : (
                          <li key={blockIdx} className="list-none">
                            <div
                              className="rounded-lg border-2 border-dashed border-black bg-[#f5f5f5] p-6"
                              role={block.slot.src ? undefined : "img"}
                              aria-label={block.slot.src ? undefined : block.slot.description}
                            >
                              {block.slot.src && block.slot.type === "video" ? (
                                <div className="space-y-3">
                                  {block.slot.label && (
                                    <p className="text-base font-semibold text-[#000080]">{block.slot.label}</p>
                                  )}
                                  <video
                                    controls
                                    preload="metadata"
                                    className="w-full rounded-lg border-2 border-black bg-black"
                                    aria-label={block.slot.alt || block.slot.label || "Training video"}
                                  >
                                    <source src={block.slot.src} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                  {block.slot.description && (
                                    <p className="text-sm text-black">{block.slot.description}</p>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <p className="mb-2 font-semibold text-black">[MEDIA SLOT: {block.slot.type.toUpperCase()}]</p>
                                  {block.slot.label && (
                                    <p className="mb-2 text-sm font-medium text-black">Label: {block.slot.label}</p>
                                  )}
                                  <p className="mb-3 text-sm text-black">{block.slot.description}</p>
                                </>
                              )}
                            </div>
                          </li>
                        )
                      )}
                    </ol>
                  </>
                ) : isTwoFactorAuth && sectionIdx === 1 ? (
                  <>
                    <p className="text-[28px] font-bold leading-[1.6] text-black">
                      {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                    </p>
                    <ol className="ml-6 list-decimal space-y-4">
                      {section.blocks.slice(1).map((block, blockIdx) =>
                        block.type === "text" ? (
                          <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                            {renderTextBlock(block.text)}
                          </li>
                        ) : (
                          <li key={blockIdx} className="list-none">
                            <div>{renderMediaBlock(block.slot)}</div>
                          </li>
                        )
                      )}
                    </ol>
                  </>
                ) : isTwoFactorAuth && sectionIdx === 2 ? (
                  <>
                    {section.blocks.map((block, blockIdx) =>
                      block.type === "text" ? (
                        <p key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                          {renderTextBlock(block.text)}
                        </p>
                      ) : (
                        <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
                      )
                    )}
                  </>
                ) : isTwoFactorAuth && [4, 5].includes(sectionIdx) ? (
                  <>
                    <p className="text-[28px] font-bold leading-[1.6] text-black">
                      {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                    </p>
                    <ol className="ml-6 list-decimal space-y-4">
                      {section.blocks.slice(1).map((block, blockIdx) =>
                        block.type === "text" ? (
                          <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                            {renderTextBlock(block.text)}
                          </li>
                        ) : (
                          <li key={blockIdx} className="list-none">
                            <div>{renderMediaBlock(block.slot)}</div>
                          </li>
                        )
                      )}
                    </ol>
                  </>
                ) : isPasswordsLoggingIn && sectionIdx === 1 ? (
                  <>
                    {section.blocks.map((block, blockIdx) =>
                      block.type === "text" ? (
                        <p key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                          {renderTextBlock(block.text)}
                        </p>
                      ) : (
                        <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
                      )
                    )}
                    <div className="rounded-xl border-2 border-black bg-[#fffdf2] p-6">
                      <h3 className="mb-3 text-[24px] font-bold text-[#000080]">Passphrase Generator</h3>
                      <p className="mb-4 text-[24px] leading-[1.7] text-black">
                        Click the button to see an example of a strong, word-based password.
                      </p>
                      <div className="rounded-lg border-2 border-black bg-white p-4">
                        <p className="text-[24px] font-bold text-black break-words">
                          {PASSPHRASE_EXAMPLES[passphraseIndex]}
                        </p>
                      </div>
              <button
                type="button"
                        onClick={() => setPassphraseIndex((current) => (current + 1) % PASSPHRASE_EXAMPLES.length)}
                        className="mt-4 rounded-xl border-2 border-black bg-[#FFD700] px-6 py-4 text-lg font-semibold text-black hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
                      >
                        Show another example
              </button>
                    </div>
                  </>
                ) : isPasswordsLoggingIn && sectionIdx === 4 ? (
                  <>
                    <p className="text-[28px] font-bold leading-[1.6] text-black">
                      {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                    </p>
                    <ol className="ml-6 list-decimal space-y-4">
                      {section.blocks.slice(1).map((block, blockIdx) =>
                        block.type === "text" ? (
                          <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                            {renderTextBlock(block.text)}
                          </li>
                        ) : (
                          <li key={blockIdx} className="list-none">
                            <div>{renderMediaBlock(block.slot)}</div>
                          </li>
                        )
                      )}
                    </ol>
                  </>
                ) : isPasswordsLoggingIn && sectionIdx === 5 ? (
                  (() => {
                    const autofillBlock =
                      section.blocks.find(
                        (block): block is ContentBlock =>
                          block.type === "text" && block.text.startsWith("Definition: Autofill:")
                      ) ?? null;

                    return (
                      <>
                        {section.blocks.map((block, blockIdx) => {
                          if (block.type === "text" && block.text.startsWith("Definition: Autofill:")) {
                            return null;
                          }

                          if (block.type === "text") {
                            return (
                              <p key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                                {renderTextBlock(block.text)}
                              </p>
                            );
                          }

                          return <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>;
                        })}
                        {autofillBlock && (
                          <div className="rounded-xl border-2 border-black bg-[#f5f5f5] p-6" role="note">
                            <p className="mb-2 text-[24px] font-bold text-[#000080]">Definition Box</p>
                            <p className="text-[24px] leading-[1.7] text-black">{renderTextBlock(autofillBlock.text)}</p>
                          </div>
                        )}
                      </>
                    );
                  })()
                ) : (
                  section.blocks.map((block, blockIdx) =>
                    block.type === "text" ? (
                      <p key={blockIdx} className={`${useLargeSectionText ? "text-[24px] leading-[1.7]" : "text-base leading-relaxed"} text-black`}>
                        {renderTextBlock(block.text)}
                      </p>
                    ) : (
                      <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
                    )
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      ) : (
        !isSuspicious &&
        moduleData.steps.length > 0 && (
          <ol className="mb-8 ml-6 list-decimal space-y-4">
            {moduleData.steps.map((step, idx) => (
              <li key={step.id} className="text-base text-black">
                Step {idx + 1}: {step.text}
            </li>
          ))}
        </ol>
        )
      )}

      {isUpdates && (
        <>
          <div className="mb-6 rounded-xl border-2 border-black bg-white p-4">
            <p className="mb-2 font-medium text-black">{moduleData.afterCheckQuestion}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleUpdatesAnswer("yes")}
                className={`rounded-lg px-5 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#000080] ${
                  updatesAnswer === "yes" ? "bg-[#000080] text-white border-2 border-black" : "bg-[#e0e0e0] text-black border-2 border-black hover:bg-[#d0d0d0]"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleUpdatesAnswer("no")}
                className={`rounded-lg px-5 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#000080] ${
                  updatesAnswer === "no" ? "bg-[#000080] text-white border-2 border-black" : "bg-[#e0e0e0] text-black border-2 border-black hover:bg-[#d0d0d0]"
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
            <p className="mb-6 text-base text-black">No problem—try again later when you&apos;re on Wi-Fi and charging.</p>
          )}
        </>
      )}

      {isSuspicious && (
        <div className="mb-8 space-y-6">
          <p className="text-base text-black">Read these two messages. Which one is suspicious?</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-sm">
              <p className="mb-2 font-bold text-[#000080]">Message A</p>
              <p className="whitespace-pre-line text-base text-black">{MESSAGE_A.title}</p>
              <p className="whitespace-pre-line text-base text-black">{MESSAGE_A.body}</p>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-sm">
              <p className="mb-2 font-bold text-[#000080]">Message B</p>
              <p className="whitespace-pre-line text-base text-black">{MESSAGE_B.title}</p>
              <p className="whitespace-pre-line text-base text-black">{MESSAGE_B.body}</p>
            </div>
          </div>

          {!suspiciousSubmitted ? (
            <div className="rounded-xl border-2 border-black bg-white p-4">
              <p className="mb-3 font-medium text-black">Which message is suspicious?</p>
              <div className="flex flex-col gap-2">
                {SUSPICIOUS_OPTIONS.map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-black bg-white px-4 py-3 hover:bg-[#e8e8e8]">
                    <input
                      type="radio"
                      name="suspicious"
                      value={opt}
                      checked={suspiciousChoice === opt}
                      onChange={() => setSuspiciousChoice(opt)}
                      className="h-5 w-5 accent-[#000080]"
                    />
                    <span className="text-base">{opt}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => suspiciousChoice && handleSuspiciousSubmit(suspiciousChoice)}
                disabled={!suspiciousChoice}
                className="mt-4 rounded-lg border-2 border-black bg-[#000080] px-5 py-3 font-medium text-white hover:bg-[#0047ab] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#000080]"
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-black bg-white p-6">
              <p className="mb-2 font-bold text-[#000080]">Why message A is suspicious</p>
              <ul className="mb-4 list-inside list-disc space-y-1 text-base text-black">
                <li>Urgency or time limit (e.g. &quot;within 24 hours&quot;)</li>
                <li>Link to &quot;update details&quot;—could steal your information</li>
                <li>Generic wording; real services often use your name and real reference numbers</li>
              </ul>
              <p className="mb-2 font-bold text-[#000080]">Safe action steps</p>
              <ul className="list-inside list-disc space-y-1 text-base text-black">
                <li>Don&apos;t click links.</li>
                <li>Verify using official sources (official website or phone number you already trust).</li>
                <li>Report as spam/phishing.</li>
                <li>Delete the message.</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 rounded-xl border-2 border-black bg-white p-4" role="note">
        <p className="text-base text-black">Take your time.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => handleMarkComplete(!markedComplete)}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2 ${
            markedComplete
              ? "bg-[#e8e8e8] text-black hover:bg-[#d0d0d0]"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          <CheckCircle className="h-6 w-6" aria-hidden />
          {markedComplete ? "Mark as incomplete" : "Mark as complete"}
        </button>
        {markedComplete ? (
          <p className="text-base text-black">Your progress has been saved. Click again to unmark.</p>
        ) : (
          <p className="text-sm text-black">Click when you&apos;re done to track your progress.</p>
        )}
        <div className="flex w-full flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-3">
          <Link
            href="/training"
              className="rounded-lg px-5 py-3 font-medium text-black bg-[#FFD700] no-underline hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080]"
              style={{ textDecoration: "none" }}
          >
            Back to Training
          </Link>
          </div>
          {markedComplete && nextModule && (
            <div className="ml-auto">
              <Link
                href={`/training/${nextModule.slug}`}
                className="inline-flex rounded-xl bg-[#FFD700] px-6 py-4 text-lg font-semibold text-black no-underline hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
                style={{ textDecoration: "none" }}
              >
                Next Lesson
              </Link>
            </div>
          )}
        </div>
      </div>

      <SettingsHelp />
    </div>
  );
}
