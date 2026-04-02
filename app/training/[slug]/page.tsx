"use client";

import { ContentBlock, getModuleBySlug, MODULES, MediaSlot, type ModuleSection } from "@/lib/modules";
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

const MODULE_2_SECTION_3_SLIDES = [
  "/module-2-section-3-slides/1.jpg",
  "/module-2-section-3-slides/2.jpg",
  "/module-2-section-3-slides/3.jpg",
  "/module-2-section-3-slides/4.jpg",
  "/module-2-section-3-slides/5.jpg",
] as const;

export default function ModulePage() {
  const params = useParams();
  const slug = params.slug as string;
  const moduleData = getModuleBySlug(slug);

  const [updatesAnswer, setUpdatesAnswerState] = useState<"yes" | "no" | null>(null);
  const [suspiciousChoice, setSuspiciousChoice] = useState<string | null>(null);
  const [suspiciousSubmitted, setSuspiciousSubmitted] = useState(false);
  const [markedComplete, setMarkedComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [all, updatesAns, suspiciousAns] = await Promise.all([
        getStoredProgress(),
        slug === "software-updates" ? getUpdatesAnswer() : null,
        slug === "scams-phishing" ? getSuspiciousAnswer() : null,
      ]);
      if (cancelled) return;
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

  const handlePrintSection3Slides = useCallback(() => {
    const printFrame = document.createElement("iframe");
    printFrame.setAttribute("aria-hidden", "true");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    document.body.appendChild(printFrame);

    const printWindow = printFrame.contentWindow;
    const printDocument = printWindow?.document;
    if (!printWindow || !printDocument) {
      printFrame.remove();
      return;
    }

    const slideMarkup = MODULE_2_SECTION_3_SLIDES.map(
      (slideSrc, index) => `
        <section class="print-slide">
          <img src="${new URL(slideSrc, window.location.origin).toString()}" alt="Module 2 Section 3 slide ${index + 1}" />
        </section>
      `
    ).join("");

    printDocument.open();
    printDocument.write(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Section 3 Slides</title>
          <style>
            @page {
              size: landscape;
              margin: 0;
            }

            html, body {
              margin: 0;
              padding: 0;
              background: #ffffff;
            }

            .print-slide {
              width: 100%;
              margin: 0;
              padding: 0;
              line-height: 0;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .print-slide + .print-slide {
              break-before: page;
              page-break-before: always;
            }

            img {
              display: block;
              width: 100%;
              max-width: none;
              height: auto;
              margin: 0;
            }
          </style>
        </head>
        <body>
          ${slideMarkup}
        </body>
      </html>`);
    printDocument.close();

    const images = Array.from(printDocument.images);
    const cleanup = () => {
      window.setTimeout(() => {
        printFrame.remove();
      }, 300);
    };

    const startPrint = () => {
      const handleAfterPrint = () => {
        printWindow.removeEventListener("afterprint", handleAfterPrint);
        cleanup();
      };

      printWindow.addEventListener("afterprint", handleAfterPrint);
      printWindow.focus();
      printWindow.print();
      window.setTimeout(cleanup, 2000);
    };

    if (images.length === 0) {
      startPrint();
      return;
    }

    let loadedImages = 0;
    const handleImageReady = () => {
      loadedImages += 1;
      if (loadedImages === images.length) {
        startPrint();
      }
    };

    images.forEach((image) => {
      if (image.complete) {
        handleImageReady();
        return;
      }

      image.addEventListener("load", handleImageReady, { once: true });
      image.addEventListener("error", handleImageReady, { once: true });
    });
  }, []);

  const handleMarkComplete = useCallback(
    async (complete: boolean) => {
      if (!moduleData) return;
      if (complete) {
        await markModuleComplete(moduleData);
        if (moduleData.slug === "software-updates") setUpdatesAnswerState("yes");
        if (moduleData.slug === "scams-phishing") {
          setSuspiciousChoice("A is suspicious");
          setSuspiciousSubmitted(true);
        }
      } else {
        await unmarkModuleComplete(moduleData);
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
  const isAppPermissions = moduleData.slug === "app-permissions";
  const nextModule = MODULES.find((module, index) => MODULES[index - 1]?.slug === slug) ?? null;
  const renderTextBlock = (text: string) => {
    const colonIndex = text.indexOf(":");

    if (colonIndex === -1) {
      return text;
    }

    const isStepHeading = /^Step \d+:/i.test(text);
    const secondColonIndex = isStepHeading ? text.indexOf(":", colonIndex + 1) : -1;

    if (secondColonIndex !== -1) {
      const label = text.slice(0, secondColonIndex).trim();
      const remainder = text.slice(secondColonIndex + 1).trim();

      if (!label || !remainder) {
        return text;
      }

      return (
        <>
          <strong>{label}:</strong> {remainder}
        </>
      );
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
        <video
          controls
          preload="metadata"
          className="w-full rounded-lg border-2 border-black bg-black"
          aria-label={slot.alt || slot.label || "Training video"}
        >
          <source src={slot.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    ) : (
      <div
        className="rounded-lg border-2 border-dashed border-black bg-[#f5f5f5] p-6"
        role="img"
        aria-label={slot.description}
      >
        <p className="mb-2 font-semibold text-black">{slot.label || slot.type}</p>
        <p className="mb-3 text-sm text-black">{slot.description}</p>
        {slot.slides && (
          <ul className="space-y-2 text-sm text-black">
            {slot.slides.map((slide, i) => (
              <li key={i}>
                <strong>Slide {i + 1}: {slide.title}</strong> {slide.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  const renderTwoFactorAuthSection = (section: ModuleSection) => {
    const textBlocks = section.blocks.filter((block): block is ContentBlock => block.type === "text");
    const mediaBlocks = section.blocks.filter((block) => block.type === "media");
    const useNumberedSteps =
      section.title.includes("Task:") || section.title.includes("Pre-emptive Solutions:");
    const introText = textBlocks[0]?.text ?? "";
    const bodyTextBlocks = textBlocks.slice(1);

    const bodyContent = useNumberedSteps ? (
      <>
        {introText && (
          <p className="text-[28px] font-bold leading-[1.6] text-black">{renderTextBlock(introText)}</p>
        )}
        {bodyTextBlocks.length > 0 && (
          <ol className="ml-6 list-decimal space-y-4">
            {bodyTextBlocks.map((block, blockIdx) => (
              <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                {renderTextBlock(block.text)}
              </li>
            ))}
          </ol>
        )}
      </>
    ) : (
      textBlocks.map((block, blockIdx) => (
        <p key={blockIdx} className="text-[24px] leading-[1.7] text-black">
          {renderTextBlock(block.text)}
        </p>
      ))
    );

    if (mediaBlocks.length === 0) {
      return (
        <div className="space-y-4">
          <h2 className="font-bold text-[#000080] text-[32px] leading-tight">{section.title}</h2>
          {bodyContent}
        </div>
      );
    }

    return (
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_420px] xl:items-start">
        <div className="space-y-4">
          <h2 className="font-bold text-[#000080] text-[32px] leading-tight">{section.title}</h2>
          {bodyContent}
        </div>
        <aside className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
          {mediaBlocks.map((block, blockIdx) => (
            <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
          ))}
        </aside>
      </div>
    );
  };

  const renderFirstLineOfDefenceSplitSection = (section: ModuleSection) => {
    const introText = section.blocks[0]?.type === "text" ? section.blocks[0].text : "";
    const pathBlocks = section.blocks.filter(
      (block, idx): block is ContentBlock => idx > 0 && block.type === "text" && block.text.startsWith("Path:")
    );
    const stepBlocks = section.blocks.filter(
      (block, idx): block is ContentBlock =>
        idx > 0 && block.type === "text" && !block.text.startsWith("Path:")
    );
    const mediaBlocks = section.blocks.filter((block) => block.type === "media");

    return (
      <div className={mediaBlocks.length > 0 ? "grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_460px] xl:items-start" : "space-y-4"}>
        <div className="space-y-4">
          <h2 className="font-bold text-[#000080] text-[32px] leading-tight">
            {section.title}
          </h2>
          {introText && (
            <p className="text-[28px] font-bold leading-[1.6] text-black">
              {introText}
            </p>
          )}
          {pathBlocks.map((block, blockIdx) => (
            <p key={blockIdx} className="text-[24px] leading-[1.7] text-black">
              {renderTextBlock(block.text)}
            </p>
          ))}
          {stepBlocks.length > 0 && (
            <ol className="ml-6 list-decimal space-y-4">
              {stepBlocks.map((block, blockIdx) => (
                <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                  {renderTextBlock(block.text)}
                </li>
              ))}
            </ol>
          )}
        </div>
        {mediaBlocks.length > 0 && (
          <aside className="xl:sticky xl:top-6">
            <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
              {mediaBlocks.map((block, blockIdx) => (
                <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
              ))}
            </div>
          </aside>
        )}
      </div>
    );
  };
  const showWideLayout =
    isGettingComfortable || isFirstLineOfDefence || isPasswordsLoggingIn || isTwoFactorAuth || isAppPermissions;
  const useLargeSectionText =
    isGettingComfortable || isFirstLineOfDefence || isPasswordsLoggingIn || isTwoFactorAuth || isAppPermissions;
  const pageWidthClass = isFirstLineOfDefence ? "max-w-7xl" : showWideLayout ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className={`module-page-root mx-auto px-4 py-8 ${pageWidthClass}`}>
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
              ? "Module 3: Two-Factor Authentication (2FA)"
              : isAppPermissions
                ? "Module 4: App Permissions & Safety"
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

      {isAppPermissions && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-sm" aria-labelledby="module-app-permissions-hero">
          <div className="relative aspect-[16/7] w-full bg-[#f5f5f5]">
            <Image
              src="/module-4-elena-permissions.png"
              alt="Elena reviewing app permissions and the six key permission types on her iPhone."
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="p-6">
            <h2 id="module-app-permissions-hero" className="text-[32px] font-bold text-[#000080]">
              Setting Boundaries for Your Digital Guests
            </h2>
            <p className="mt-3 text-[24px] leading-[1.7] text-black">
              The goal: learn which permissions apps may ask for, when to say no, and how to take back access from Settings.
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
              {!(isFirstLineOfDefence && [0, 2, 3, 4, 5, 6, 7].includes(sectionIdx)) &&
                !isTwoFactorAuth &&
                !isAppPermissions && (
                <h2 className={`mb-6 font-bold text-[#000080] ${showWideLayout ? "text-[32px] leading-tight" : "text-xl"}`}>
                  {section.title}
                </h2>
              )}
              <div className="space-y-6">
                {isFirstLineOfDefence && sectionIdx === 0 ? (
                  (() => {
                    const textBlocks = section.blocks.filter((block): block is ContentBlock => block.type === "text");
                    const mediaBlocks = section.blocks.filter((block) => block.type === "media");

                    return (
                      <div className="grid gap-6 md:gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(280px,520px)] xl:items-start">
                        <div className="space-y-4">
                          <h2 className="font-bold text-[#000080] text-[32px] leading-tight">
                            {section.title}
                          </h2>
                          {textBlocks.map((block, blockIdx) => (
                            <p key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                              {renderTextBlock(block.text)}
                            </p>
                          ))}
                        </div>
                        <aside className="xl:sticky xl:top-6">
                          <div className="space-y-4">
                            {mediaBlocks.map((block, blockIdx) => (
                              <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
                            ))}
                          </div>
                        </aside>
                      </div>
                    );
                  })()
                ) : isFirstLineOfDefence && sectionIdx === 1 ? (
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
                    const pathBlock = section.blocks.find(
                      (block, idx): block is ContentBlock => idx > 0 && block.type === "text" && block.text.startsWith("Path:")
                    );
                    const stepBlocks = section.blocks.filter(
                      (block, idx): block is ContentBlock =>
                        idx > 0 &&
                        block.type === "text" &&
                        !block.text.startsWith("Tip:") &&
                        !block.text.startsWith("Path:")
                    );
                    const mediaBlocks = section.blocks.filter((block) => block.type === "media");

                    return (
                      <div
                        className={
                          mediaBlocks.length > 0
                            ? "grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_460px] xl:items-start"
                            : "space-y-4"
                        }
                      >
                        <div className="space-y-4">
                          <h2 className="font-bold text-[#000080] text-[32px] leading-tight">
                            {section.title}
                          </h2>
                          <p className="text-[28px] font-bold leading-[1.6] text-black">
                            {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                          </p>
                          {pathBlock && (
                            <p className="text-[24px] leading-[1.7] text-black">
                              {renderTextBlock(pathBlock.text)}
                            </p>
                          )}
                          <ol className="ml-6 list-decimal space-y-3">
                            {stepBlocks.map((block, blockIdx) => (
                              <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                                {renderTextBlock(block.text)}
                              </li>
                            ))}
                          </ol>
                          <button
                            type="button"
                            onClick={handlePrintSection3Slides}
                            className="min-h-12 rounded-xl border-2 border-black bg-white px-4 py-2 text-lg font-bold text-black transition hover:bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
                          >
                            PRINT SLIDES
                          </button>
                          {tipBlock && (
                            <div className="relative mt-2 mr-40 ml-auto max-w-[320px] pt-8">
                              <aside className="absolute left-[78%] -top-[5rem] z-10 w-full max-w-[240px] -translate-x-1/2 rounded-[2rem] bg-[#d0d0d0] px-5 py-3 text-[20px] font-medium leading-[1.5] text-black shadow-sm md:left-[98%] md:-top-[4.25rem]">
                                <span className="absolute -bottom-4 left-6 h-8 w-8 rounded-full bg-[#d0d0d0]" aria-hidden />
                                <span className="absolute -bottom-9 left-3 h-5 w-5 rounded-full bg-[#d0d0d0]" aria-hidden />
                                {renderTextBlock(tipBlock.text)}
                              </aside>
                              <Image
                                src="/module-2-passcode-thinking-v2.png"
                                alt="Elena thinking while looking at her phone."
                                width={420}
                                height={263}
                                className="h-auto w-full"
                              />
                            </div>
                          )}
                        </div>
                        {mediaBlocks.length > 0 && (
                          <aside>
                            <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                              {mediaBlocks.map((block, blockIdx) => (
                                <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
                              ))}
                            </div>
                          </aside>
                        )}
                      </div>
                    );
                  })()
                ) : isFirstLineOfDefence && [3, 4, 5, 6, 7].includes(sectionIdx) ? (
                  renderFirstLineOfDefenceSplitSection(section)
                ) : (isTwoFactorAuth && sectionIdx === 1) || (isAppPermissions && sectionIdx === 2) ? (
                  (() => {
                    const pathBlock = section.blocks.find(
                      (block, idx): block is ContentBlock =>
                        idx > 0 && block.type === "text" && block.text.startsWith("Path:")
                    );
                    const stepBlocks = section.blocks.filter(
                      (block, idx): block is ContentBlock =>
                        idx > 0 &&
                        block.type === "text" &&
                        !block.text.startsWith("Path:")
                    );
                    const mediaBlocks = section.blocks.filter((block) => block.type === "media");

                    return (
                      <div
                        className={
                          mediaBlocks.length > 0
                            ? "grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_460px] xl:items-start"
                            : "space-y-4"
                        }
                      >
                        <div className="space-y-4">
                          <h2 className="font-bold text-[#000080] text-[32px] leading-tight">
                            {section.title}
                          </h2>
                          <p className="text-[28px] font-bold leading-[1.6] text-black">
                            {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                          </p>
                          {pathBlock && (
                            <p className="text-[24px] leading-[1.7] text-black">
                              {renderTextBlock(pathBlock.text)}
                            </p>
                          )}
                          <ol className="ml-6 list-decimal space-y-3">
                            {stepBlocks.map((block, blockIdx) => (
                              <li key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                                {renderTextBlock(block.text)}
                              </li>
                            ))}
                          </ol>
                        </div>
                        {mediaBlocks.length > 0 && (
                          <aside>
                            <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                              {mediaBlocks.map((block, blockIdx) => (
                                <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
                              ))}
                            </div>
                          </aside>
                        )}
                      </div>
                    );
                  })()
                ) : isTwoFactorAuth || isAppPermissions ? (
                  renderTwoFactorAuthSection(section)
                ) : isPasswordsLoggingIn && sectionIdx === 0 ? (
                  (() => {
                    const textBlocks = section.blocks.filter((block): block is ContentBlock => block.type === "text");
                    const mediaBlocks = section.blocks.filter((block) => block.type === "media");

                    return (
                      <div className={mediaBlocks.length > 0 ? "grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_420px] xl:items-start" : "space-y-4"}>
                        <div className="space-y-4">
                          {textBlocks.map((block, blockIdx) => (
                            <p key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                              {renderTextBlock(block.text)}
                            </p>
                          ))}
                        </div>
                        {mediaBlocks.length > 0 ? (
                          <div className="space-y-4">
                            {mediaBlocks.map((block, blockIdx) => (
                              <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })()
                ) : isPasswordsLoggingIn && sectionIdx === 1 ? (
                  (() => {
                    const textBlocks = section.blocks.filter((block): block is ContentBlock => block.type === "text");
                    const mediaBlocks = section.blocks.filter((block) => block.type === "media");

                    return (
                      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_420px] xl:items-start">
                        <div className="space-y-4">
                          {textBlocks.map((block, blockIdx) => (
                            <p key={blockIdx} className="text-[24px] leading-[1.7] text-black">
                              {renderTextBlock(block.text)}
                            </p>
                          ))}
                        </div>
                        <div className="space-y-4">
                          {mediaBlocks.map((block, blockIdx) => (
                            <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>
                          ))}
                        </div>
                      </div>
                    );
                  })()
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
