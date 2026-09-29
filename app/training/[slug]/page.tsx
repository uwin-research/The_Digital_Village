"use client";

import { TrainingModuleExplorer } from "@/components/TrainingModuleExplorer";
import { MODULE_HEADING_LABEL } from "@/lib/moduleHeadingLabels";
import { ContentBlock, getModuleBySlug, MediaSlot, type ModuleSection } from "@/lib/modules";
import {
  getStoredProgress,
  getUpdatesAnswer,
  setUpdatesAnswer,
  getSuspiciousAnswer,
  setSuspiciousAnswer,
  markModuleComplete,
  unmarkModuleComplete,
  isModuleLessonComplete,
} from "@/lib/progress";

import { printModule2Section3Slides } from "@/lib/printModule2Slides";
import { RowWithContextTip, SectionHeadingWithContextTip } from "@/components/InlineContextualTip";
import {
  getSectionOverviewTip,
  getStepOrActivityTip,
  PATH_NOTATION_TIP,
  sectionMentionsSettingsOrPath,
  stripSectionNumberPrefix,
} from "@/lib/lessonContextTips";
import { getSectionPlainCorpus, isTipTextRedundantWithCorpus } from "@/lib/tipTextDedup";
import { ArrowLeft, CheckCircle, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

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
  /**
   * THIS MATTERS FOR ANDROID MODULES: Android module slugs are the
   * same as their iOS counterparts with "-android" appended (e.g.
   * "first-line-of-defence-android"). A lot of layout logic below
   * checks the EXACT slug to decide things like hero images and
   * special section formatting. Without stripping the suffix here,
   * every one of those checks would silently fail to match for Android
   * modules, and they'd fall back to plain/generic layout instead of
   * the intended rich one. baseSlug is used for all those layout
   * comparisons; the real `slug` is still used for data lookups,
   * progress tracking, and anchors, since those must stay unique per
   * module.
   */
  const baseSlug = slug.replace(/-android$/, "");
  const moduleData = getModuleBySlug(slug);
  const { profile } = useAccessibility();

  const [updatesAnswer, setUpdatesAnswerState] = useState<"yes" | "no" | null>(null);
  const [suspiciousChoice, setSuspiciousChoice] = useState<string | null>(null);
  const [suspiciousSubmitted, setSuspiciousSubmitted] = useState(false);
  const [markedComplete, setMarkedComplete] = useState(false);
  const [openContextTipId, setOpenContextTipId] = useState<string | null>(null);

  useEffect(() => {
    setOpenContextTipId(null);
  }, [slug]);

  useEffect(() => {
    if (!openContextTipId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenContextTipId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openContextTipId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [all, updatesAns, suspiciousAns] = await Promise.all([
        getStoredProgress(),
        baseSlug === "software-updates" ? getUpdatesAnswer() : null,
        baseSlug === "scams-phishing" ? getSuspiciousAnswer() : null,
      ]);
      if (cancelled) return;
      if (baseSlug === "software-updates") setUpdatesAnswerState(updatesAns);
      if (baseSlug === "scams-phishing") {
        setSuspiciousChoice(suspiciousAns);
        setSuspiciousSubmitted(!!suspiciousAns);
      }
      const mod = getModuleBySlug(slug);
      if (mod) {
        const complete = isModuleLessonComplete(
          mod,
          all[slug],
          !!updatesAns,
          !!suspiciousAns
        );
        setMarkedComplete(complete);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
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
    printModule2Section3Slides();
  }, []);

  /** In-module anchors: `lesson-sec-0` = first section, etc. Used by Module 2 lock-type table rows. */
  const scrollToLessonSection = useCallback((sectionIdx: number) => {
    document.getElementById(`lesson-sec-${sectionIdx}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleMarkComplete = useCallback(
    async (complete: boolean) => {
      if (!moduleData) return;
      if (complete) {
        await markModuleComplete(moduleData);
        if (baseSlug === "software-updates") setUpdatesAnswerState("yes");
        if (baseSlug === "scams-phishing") {
          setSuspiciousChoice("A is suspicious");
          setSuspiciousSubmitted(true);
        }
      } else {
        await unmarkModuleComplete(moduleData);
        if (baseSlug === "software-updates") setUpdatesAnswerState(null);
        if (baseSlug === "scams-phishing") {
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
        <Link href="/training" className="mt-4 inline-block text-[var(--link)] underline">
          Back to modules
        </Link>
      </div>
    );
  }

  const isSuspicious = baseSlug === "scams-phishing";
  const isUpdates = baseSlug === "software-updates";
  const isGettingComfortable = baseSlug === "getting-comfortable";
  const isFirstLineOfDefence = baseSlug === "first-line-of-defence";
  const isPasswordsLoggingIn = baseSlug === "passwords-logging-in";
  const isTwoFactorAuth = baseSlug === "two-factor-auth";
  const isAppPermissions = baseSlug === "app-permissions";
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

    if (!label) {
      return text;
    }

    if (!remainder) {
      return <strong>{text.trim()}</strong>;
    }

    return (
      <>
        <strong>{label}:</strong> {remainder}
      </>
    );
  };
  /**
   * Requirement 4.1 (Hearing - Multimedia Control & Alternates):
   * videos now render an optional <track kind="captions"> when the
   * module data provides a captionsSrc (.vtt file). Until real caption
   * files are authored, videos fall back gracefully (no track element)
   * rather than breaking.
   */
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
          className="w-full rounded-lg border-2 border-[var(--border)] bg-black"
          aria-label={slot.alt || slot.label || "Training video"}
        >
          <source src={slot.src} type="video/mp4" />
          {slot.captionsSrc ? (
            <track
              kind="captions"
              src={slot.captionsSrc}
              srcLang="en"
              label="English captions"
              default
            />
          ) : null}
          Your browser does not support the video tag.
        </video>
        </div>
    ) : (
      <div
        className="rounded-lg border-2 border-dashed border-[var(--border)] bg-[#f5f5f5] p-6"
        role="img"
        aria-label={slot.description}
      >
        <p className="mb-2 font-semibold text-[var(--foreground)]">{slot.label || slot.type}</p>
        <p className="mb-3 text-sm text-[var(--foreground)]">{slot.description}</p>
        {slot.slides && (
          <ul className="space-y-2 text-sm text-[var(--foreground)]">
            {slot.slides.map((slide, i) => (
              <li key={i}>
                <strong>Slide {i + 1}: {slide.title}</strong> {slide.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    );

  const sectionHeadingTipExtras = (
    section: ModuleSection,
    sectionIdx: number,
    sectionCorpus: string
  ): ReactNode => {
    const hasPath = section.blocks.some(
      (b): b is ContentBlock => b.type === "text" && b.text.startsWith("Path:")
    );
    const contextual = section.blocks.filter(
      (b): b is ContentBlock => b.type === "text" && !!b.contextualTip
    );
    const showPathTip = hasPath && !isTipTextRedundantWithCorpus(PATH_NOTATION_TIP, sectionCorpus);

    return (
      <>
        {showPathTip ? (
          <p className="mt-4 border-t border-[var(--border)]/15 pt-4 text-base leading-relaxed whitespace-pre-wrap text-[var(--foreground)]">
            {PATH_NOTATION_TIP}
          </p>
        ) : null}
        {contextual.map((b, i) => {
          const tip = b.contextualTip ?? "";
          if (
            isTipTextRedundantWithCorpus(tip, b.text) ||
            isTipTextRedundantWithCorpus(tip, sectionCorpus)
          ) {
            return null;
          }
          return (
            <p
              key={i}
              className="mt-4 border-t border-[var(--border)]/15 pt-4 text-base leading-relaxed whitespace-pre-wrap text-[var(--foreground)]"
            >
              {tip}
            </p>
          );
        })}
        {baseSlug === "first-line-of-defence" && sectionIdx === 2
          ? (() => {
              const tipFromLesson = section.blocks.find(
                (b): b is ContentBlock => b.type === "text" && b.text.startsWith("Tip:")
              );
              if (!tipFromLesson) return null;
              if (isTipTextRedundantWithCorpus(tipFromLesson.text, sectionCorpus)) return null;
              return (
                <p className="mt-4 border-t border-[var(--border)]/15 pt-4 text-base leading-relaxed text-[var(--foreground)]">
                  {renderTextBlock(tipFromLesson.text)}
                </p>
              );
            })()
          : null}
      </>
    );
  };

  const renderSectionHeadingWithTip = (
    sectionIdx: number,
    section: ModuleSection,
    title: string,
    headingClassName: string
  ) => {
    const sectionCorpus =
      getSectionPlainCorpus(section) +
      (sectionIdx === 0 && moduleData.tip?.trim() ? `\n${moduleData.tip.trim()}` : "");
    const overviewText = getSectionOverviewTip(slug, sectionIdx, moduleData.tip, section);
    const showOverview = !isTipTextRedundantWithCorpus(overviewText, sectionCorpus);

    return (
      <SectionHeadingWithContextTip
        tipId={`${slug}-sec-${sectionIdx}`}
        openTipId={openContextTipId}
        setOpenTipId={setOpenContextTipId}
        title={title}
        contextLabel={stripSectionNumberPrefix(section.title)}
        headingClassName={headingClassName}
        showSettingsFinder={sectionMentionsSettingsOrPath(section)}
      >
        {showOverview ? <p className="whitespace-pre-wrap">{overviewText}</p> : null}
        {sectionHeadingTipExtras(section, sectionIdx, sectionCorpus)}
      </SectionHeadingWithContextTip>
    );
  };

  /** 2FA "turn on" task, App Permissions "take back a key" — intro, Path line, numbered steps, video. */
  function taskPathWithVideo(section: ModuleSection, sectionIdx: number) {
    const pathBlock = section.blocks.find(
      (block, idx): block is ContentBlock =>
        idx > 0 && block.type === "text" && block.text.startsWith("Path:")
    );
    const stepBlocks = section.blocks.filter(
      (block, idx): block is ContentBlock =>
        idx > 0 && block.type === "text" && !block.text.startsWith("Path:")
    );
    const mediaBlocks = section.blocks.filter((block) => block.type === "media");
    const grid =
      mediaBlocks.length > 0
        ? "grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_460px] xl:items-start"
        : "space-y-4";

    return (
      <div className={grid}>
        <div className="space-y-4">
          {renderSectionHeadingWithTip(
            sectionIdx,
            section,
            section.title,
            "mb-0 font-bold text-[var(--heading)] text-[1.45rem] leading-tight"
          )}
          <p className="text-[1.27rem] font-bold leading-[1.6] text-[var(--foreground)]">
            {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
          </p>
          {pathBlock && (
            <p className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">{renderTextBlock(pathBlock.text)}</p>
          )}
          <ol className="ml-6 list-decimal space-y-3">
            {stepBlocks.map((block, blockIdx) => (
              <li key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
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
  }

  const renderWideSplitSection = (section: ModuleSection, sectionIdx: number) => {
    const textBlocks = section.blocks.filter((block): block is ContentBlock => block.type === "text");
    const mediaBlocks = section.blocks.filter((block) => block.type === "media");
    const useNumberedSteps =
      section.title.includes("Task:") || section.title.includes("Pre-emptive Solutions:");
    const introText = textBlocks[0]?.text ?? "";
    const bodyTextBlocks = textBlocks.slice(1);

    const bodyContent = useNumberedSteps ? (
      <>
        {introText && (
          <p className="text-[1.27rem] font-bold leading-[1.6] text-[var(--foreground)]">{renderTextBlock(introText)}</p>
        )}
        {bodyTextBlocks.length > 0 && (
          <ol className="ml-6 list-decimal space-y-4">
            {bodyTextBlocks.map((block, blockIdx) => (
              <li key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
                {renderTextBlock(block.text)}
              </li>
            ))}
          </ol>
        )}
      </>
    ) : (
      textBlocks.map((block, blockIdx) => (
        <p key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
          {renderTextBlock(block.text)}
        </p>
      ))
    );

    if (mediaBlocks.length === 0) {
      return (
        <div className="space-y-4">
          {renderSectionHeadingWithTip(
            sectionIdx,
            section,
            section.title,
            "mb-0 font-bold text-[var(--heading)] text-[1.45rem] leading-tight"
          )}
          {bodyContent}
        </div>
      );
    }

    return (
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_420px] xl:items-start">
        <div className="space-y-4">
          {renderSectionHeadingWithTip(
            sectionIdx,
            section,
            section.title,
            "mb-0 font-bold text-[var(--heading)] text-[1.45rem] leading-tight"
          )}
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

  const renderDefenceSplitSection = (section: ModuleSection, sectionIdx: number) => {
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
          {renderSectionHeadingWithTip(
            sectionIdx,
            section,
            section.title,
            "mb-0 font-bold text-[var(--heading)] text-[1.45rem] leading-tight"
          )}
          {introText && (
            <p className="text-[1.27rem] font-bold leading-[1.6] text-[var(--foreground)]">
              {introText}
            </p>
          )}
          {pathBlocks.map((block, blockIdx) => (
            <p key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
              {renderTextBlock(block.text)}
            </p>
          ))}
          {stepBlocks.length > 0 && (
            <ol className="ml-6 list-decimal space-y-4">
              {stepBlocks.map((block, blockIdx) => (
                <li key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
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
  const pageWidthClass = isFirstLineOfDefence
    ? "max-w-6xl 2xl:max-w-7xl"
    : showWideLayout
      ? "max-w-5xl 2xl:max-w-6xl"
      : "max-w-3xl 2xl:max-w-4xl";

  return (
    /*
     * THIS IS THE FIX for lesson pages going edge-to-edge on wide
     * screens: the max-width values above were reduced (one module was
     * effectively unconstrained at max-w-[100rem]), AND the horizontal
     * padding now grows with the screen (px-4 on phones, up to px-10 on
     * large monitors), so there's always guaranteed breathing room on
     * both sides no matter how wide the screen or how small Display
     * Size is set.
     */
    <div className={`module-page-root mx-auto px-4 py-8 sm:px-6 lg:px-10 ${pageWidthClass}`}>
      <Link
        href="/training"
        className="mb-6 inline-flex items-center gap-2 text-base font-medium text-[var(--foreground)] hover:text-[var(--heading)] focus:outline-none focus:ring-2 focus:ring-[var(--heading)] rounded"
      >
        <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden /> Back to modules
      </Link>

      {profile.devicePlatform ? (
        <div
          className="mb-6 flex items-center gap-3 rounded-xl border-2 p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
        >
          <Smartphone className="h-6 w-6 shrink-0" style={{ color: "var(--heading)" }} aria-hidden />
          <p className="text-base" style={{ color: "var(--foreground)" }}>
            These steps are shown for <strong>{profile.devicePlatform === "ios" ? "iPhone (iOS)" : "Android"}</strong>{" "}
            based on your Profile settings.
          </p>
        </div>
      ) : null}

      <h1 className={`mb-2 font-bold text-[var(--heading)] ${showWideLayout ? "text-[1.45rem] leading-tight" : "text-3xl"}`}>
        {MODULE_HEADING_LABEL[slug] ?? moduleData.title}
      </h1>
      {moduleData.scenario && (
        <p className={`mb-6 rounded-lg border-2 border-[var(--border)] bg-white p-4 italic text-[var(--foreground)] ${showWideLayout ? "text-[1.09rem] leading-[1.7]" : "text-base"}`}>
          {moduleData.scenario}
        </p>
      )}

      {/*
        Requirement 2.2 (Cognition - Current Position Trace): a lesson
        overview / jump-list so the learner can see the whole shape of
        this lesson up front and always tell how far through it they
        are, instead of only discovering sections by scrolling.
      */}
      {moduleData.sections && moduleData.sections.length > 1 && (
        <nav aria-label="Sections in this lesson" className="mb-8 rounded-xl border-2 border-[var(--border)] bg-white p-4">
          <p className="mb-2 text-base font-bold text-[var(--heading)]">
            This lesson has {moduleData.sections.length} sections:
          </p>
          <ol className="ml-5 list-decimal space-y-1">
            {moduleData.sections.map((section, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => scrollToLessonSection(idx)}
                  className="rounded text-left text-base text-[var(--link)] underline hover:text-[var(--heading)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heading)]"
                >
                  {stripSectionNumberPrefix(section.title)}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {isFirstLineOfDefence && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-white shadow-sm" aria-labelledby="module-2-hero">
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
            <h2 id="module-2-hero" className="text-[1.45rem] font-bold text-[var(--heading)]">
              Securing Your Digital Front Door
            </h2>
          </div>
        </section>
      )}

      {isGettingComfortable && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-white shadow-sm" aria-labelledby="module-1-hero">
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
            <h2 id="module-1-hero" className="text-[1.45rem] font-bold text-[var(--heading)]">
              Making the Screen Work for You
            </h2>
          </div>
        </section>
      )}

      {isPasswordsLoggingIn && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-white shadow-sm" aria-labelledby="module-3-hero">
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
            <h2 id="module-3-hero" className="text-[1.45rem] font-bold text-[var(--heading)]">
              The Master Keys to Your Digital Life
            </h2>
            <p className="mt-3 text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
              The goal: teach Sam how to create strong passwords that are easy to remember, and introduce him to a digital notebook that does the heavy lifting.
            </p>
          </div>
        </section>
      )}

      {isTwoFactorAuth && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-white shadow-sm" aria-labelledby="module-4-hero">
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
            <h2 id="module-4-hero" className="text-[1.45rem] font-bold text-[var(--heading)]">
              The Second Lock for Your Digital Door
            </h2>
            <p className="mt-3 text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
              The goal: help Sam understand that a password alone is not enough, and show him how a one-time code on his phone blocks strangers from getting in.
            </p>
          </div>
        </section>
      )}

      {isAppPermissions && (
        <section className="mb-8 overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-white shadow-sm" aria-labelledby="module-app-permissions-hero">
          <div className="relative aspect-[16/7] w-full bg-[#f5f5f5]">
            <Image
              src="/module-4-elena-permissions.png"
              alt="Elena reviewing app permissions on her iPhone."
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="p-6">
            <h2 id="module-app-permissions-hero" className="text-[1.45rem] font-bold text-[var(--heading)]">
              Setting Boundaries for Your Digital Guests
            </h2>
            <p className="mt-3 text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
              The goal: learn which permissions apps may ask for, when to say no, and how to take back access from Settings.
            </p>
          </div>
        </section>
      )}

      {moduleData.reassurance && (
        <div className="mb-6 rounded-xl border-2 border-[var(--border)] bg-white p-4" role="note">
          <p className="text-base text-[var(--foreground)]">{moduleData.reassurance}</p>
        </div>
      )}

      {moduleData.examples && (
        <div className="mb-6 rounded-xl border-2 border-[var(--border)] bg-white p-4">
          <p className="text-base text-[var(--foreground)]">{moduleData.examples}</p>
        </div>
      )}

      {moduleData.safetyCallout && (
        <div className="mb-6 rounded-xl border-2 border-[var(--border)] bg-white p-4" role="note">
          <p className="text-base text-[var(--foreground)]">{moduleData.safetyCallout}</p>
        </div>
      )}

      {!isSuspicious && moduleData.sections ? (
        <div className="mb-8 space-y-10">
          {moduleData.sections.map((section, sectionIdx) => (
            <section
              key={sectionIdx}
              id={`lesson-sec-${sectionIdx}`}
              className="scroll-mt-28 rounded-xl border-2 border-[var(--border)] bg-white p-6 shadow-sm"
            >
              {!(isFirstLineOfDefence && [0, 2, 3, 4].includes(sectionIdx)) &&
                !isTwoFactorAuth &&
                !isAppPermissions &&
                renderSectionHeadingWithTip(
                  sectionIdx,
                  section,
                  section.title,
                  `mb-0 font-bold text-[var(--heading)] ${showWideLayout ? "text-[1.45rem] leading-tight" : "text-xl"}`
                )}
              <div className="space-y-6">
                {isFirstLineOfDefence && sectionIdx === 0 ? (
                  (() => {
                    const textBlocks = section.blocks.filter((block): block is ContentBlock => block.type === "text");
                    const mediaBlocks = section.blocks.filter((block) => block.type === "media");

                    return (
                      <div className="grid gap-6 md:gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(280px,520px)] xl:items-start">
                        <div className="space-y-4">
                          {renderSectionHeadingWithTip(
                            sectionIdx,
                            section,
                            section.title,
                            "mb-0 font-bold text-[var(--heading)] text-[1.45rem] leading-tight"
                          )}
                          {textBlocks.map((block, blockIdx) => (
                            <p key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
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
                    <p className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
                      Different locks offer different levels of security and convenience. Here are four common types—each
                      with a simple house analogy so it is easy to picture. Tap{" "}
                      <span className="font-semibold">PIN</span>, <span className="font-semibold">Pattern</span>, or{" "}
                      <span className="font-semibold">Password</span> to jump to the passcode setup steps (Section 3), or
                      tap <span className="font-semibold">Biometrics</span> for the Face ID / fingerprint lesson (Section
                      4).
                    </p>
                    <div className="overflow-x-auto rounded-xl border-2 border-[var(--border)]">
                      <table className="min-w-full border-collapse text-left text-[1.09rem] text-[var(--foreground)]">
                        <thead className="bg-[#cfcfcf]">
                          <tr>
                            <th className="border-b-2 border-[var(--border)] px-4 py-4 font-bold">Lock Type</th>
                            <th className="border-b-2 border-[var(--border)] px-4 py-4 font-bold">What is it?</th>
                            <th className="border-b-2 border-[var(--border)] px-4 py-4 font-bold">The House Analogy</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            tabIndex={0}
                            role="link"
                            aria-label="Go to Section 3: passcode setup"
                            className="cursor-pointer bg-white transition-colors hover:bg-[#e8eeff] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--heading)]"
                            onClick={() => scrollToLessonSection(2)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                scrollToLessonSection(2);
                              }
                            }}
                          >
                            <td className="border-t-2 border-[var(--border)] px-4 py-4 font-semibold text-[var(--heading)]">PIN</td>
                            <td className="border-t-2 border-[var(--border)] px-4 py-4">A short sequence of numbers.</td>
                            <td className="border-t-2 border-[var(--border)] px-4 py-4">Like a keypad code on your front door.</td>
                          </tr>
                          <tr
                            tabIndex={0}
                            role="link"
                            aria-label="Go to Section 3: passcode setup"
                            className="cursor-pointer bg-[#d9d9d9] transition-colors hover:bg-[#e8eeff] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--heading)]"
                            onClick={() => scrollToLessonSection(2)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                scrollToLessonSection(2);
                              }
                            }}
                          >
                            <td className="border-t-2 border-[var(--border)] px-4 py-4 font-semibold text-[var(--heading)]">Pattern</td>
                            <td className="border-t-2 border-[var(--border)] px-4 py-4">A shape you draw on a grid of dots.</td>
                            <td className="border-t-2 border-[var(--border)] px-4 py-4">
                              Like a secret &quot;knock&quot; or a specific way you turn a handle.
                            </td>
                          </tr>
                          <tr
                            tabIndex={0}
                            role="link"
                            aria-label="Go to Section 3: passcode setup"
                            className="cursor-pointer bg-white transition-colors hover:bg-[#e8eeff] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--heading)]"
                            onClick={() => scrollToLessonSection(2)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                scrollToLessonSection(2);
                              }
                            }}
                          >
                            <td className="border-t-2 border-[var(--border)] px-4 py-4 font-semibold text-[var(--heading)]">Password</td>
                            <td className="border-t-2 border-[var(--border)] px-4 py-4">A mix of letters, numbers, and symbols.</td>
                            <td className="border-t-2 border-[var(--border)] px-4 py-4">
                              A long, complex physical key that is hard to copy.
                            </td>
                          </tr>
                          <tr
                            tabIndex={0}
                            role="link"
                            aria-label="Go to Section 4: biometrics setup"
                            className="cursor-pointer bg-[#d9d9d9] transition-colors hover:bg-[#e8eeff] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--heading)]"
                            onClick={() => scrollToLessonSection(3)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                scrollToLessonSection(3);
                              }
                            }}
                          >
                            <td className="border-t-2 border-[var(--border)] px-4 py-4 font-semibold text-[var(--heading)]">Biometrics</td>
                            <td className="border-t-2 border-[var(--border)] px-4 py-4">Using your fingerprint or face to unlock.</td>
                            <td className="border-t-2 border-[var(--border)] px-4 py-4">
                              Like a high-tech lock that opens only when it &quot;sees&quot; you or feels your touch.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : isFirstLineOfDefence && sectionIdx === 2 ? (
                  (() => {
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
                          {renderSectionHeadingWithTip(
                            sectionIdx,
                            section,
                            section.title,
                            "mb-0 font-bold text-[var(--heading)] text-[1.45rem] leading-tight"
                          )}
                          <p className="text-[1.27rem] font-bold leading-[1.6] text-[var(--foreground)]">
                            {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                          </p>
                          {pathBlock && (
                            <p className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">{renderTextBlock(pathBlock.text)}</p>
                          )}
                          <ol className="ml-6 list-decimal space-y-3">
                            {stepBlocks.map((block, blockIdx) => (
                              <li key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
                                {renderTextBlock(block.text)}
                              </li>
                            ))}
                          </ol>
                          <button
                            type="button"
                            onClick={handlePrintSection3Slides}
                            className="min-h-12 rounded-xl border-2 border-[var(--border)] bg-white px-4 py-2 text-lg font-bold text-[var(--foreground)] transition hover:bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-[var(--heading)] focus:ring-offset-2"
                          >
                            PRINT SLIDES
                          </button>
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
                ) : isFirstLineOfDefence && [3, 4].includes(sectionIdx) ? (
                  renderDefenceSplitSection(section, sectionIdx)
                ) : (isTwoFactorAuth && sectionIdx === 1) || (isAppPermissions && sectionIdx === 2) ? (
                  taskPathWithVideo(section, sectionIdx)
                ) : isTwoFactorAuth || isAppPermissions ? (
                  renderWideSplitSection(section, sectionIdx)
                ) : isPasswordsLoggingIn && sectionIdx === 0 ? (
                  (() => {
                    const textBlocks = section.blocks.filter((block): block is ContentBlock => block.type === "text");
                    const mediaBlocks = section.blocks.filter((block) => block.type === "media");

                    return (
                      <div className={mediaBlocks.length > 0 ? "grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_420px] xl:items-start" : "space-y-4"}>
                        <div className="space-y-4">
                          {textBlocks.map((block, blockIdx) => (
                            <p key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
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
                            <p key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
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
                    <p className="text-[1.27rem] font-bold leading-[1.6] text-[var(--foreground)]">
                      {section.blocks[0]?.type === "text" ? section.blocks[0].text : ""}
                    </p>
                    <ol className="ml-6 list-decimal space-y-4">
                      {section.blocks.slice(1).map((block, blockIdx) =>
                        block.type === "text" ? (
                          <li key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
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
                              <p key={blockIdx} className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">
                                {renderTextBlock(block.text)}
                              </p>
                            );
                          }

                          return <div key={blockIdx}>{renderMediaBlock(block.slot)}</div>;
                        })}
                        {autofillBlock && (
                          <div className="rounded-xl border-2 border-[var(--border)] bg-[#f5f5f5] p-6" role="note">
                            <p className="mb-2 text-[1.09rem] font-bold text-[var(--heading)]">Definition Box</p>
                            <p className="text-[1.09rem] leading-[1.7] text-[var(--foreground)]">{renderTextBlock(autofillBlock.text)}</p>
                          </div>
                        )}
                      </>
                    );
                  })()
                ) : (
                  section.blocks.map((block, blockIdx) =>
                    block.type === "text" ? (
                      <p
                        key={blockIdx}
                        className={
                          useLargeSectionText ? "text-[1.09rem] leading-[1.7] text-[var(--foreground)]" : "text-base leading-relaxed text-[var(--foreground)]"
                        }
                      >
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
          <div className="mb-8">
            <RowWithContextTip
              tipId={`${slug}-steps-help`}
              openTipId={openContextTipId}
              setOpenTipId={setOpenContextTipId}
              contextLabel="Help for all steps in this lesson"
              showSettingsFinder={baseSlug === "software-updates"}
              panelBody={
                <div className="space-y-4 text-base leading-relaxed text-[var(--foreground)]">
                  {moduleData.steps.map((step, idx) => (
                    <div key={step.id}>
                      <p className="font-semibold text-[var(--heading)]">Step {idx + 1}</p>
                      <p className="whitespace-pre-wrap">{getStepOrActivityTip(slug, idx)}</p>
                    </div>
                  ))}
                  {baseSlug === "software-updates" && moduleData.afterCheckQuestion ? (
                    <div className="border-t border-[var(--border)]/20 pt-4">
                      <p className="font-semibold text-[var(--heading)]">Check-in</p>
                      <p className="mb-2">{moduleData.afterCheckQuestion}</p>
                      <p className="whitespace-pre-wrap">{getStepOrActivityTip(slug, 4)}</p>
                    </div>
                  ) : null}
                </div>
              }
            >
              <p className="text-lg font-semibold text-[var(--heading)]">Help for this lesson&apos;s steps</p>
            </RowWithContextTip>
            <ol className="mt-4 ml-6 list-decimal space-y-4 text-[var(--foreground)]">
              {moduleData.steps.map((step, idx) => (
                <li key={step.id} className="text-base">
                  <span className="font-semibold">Step {idx + 1}:</span> {step.text}
                </li>
              ))}
            </ol>
          </div>
        )
      )}

      {isUpdates && (
        <>
          <div className="mb-6 rounded-xl border-2 border-[var(--border)] bg-white p-4">
            <p className="mb-2 font-medium text-[var(--foreground)]">{moduleData.afterCheckQuestion}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleUpdatesAnswer("yes")}
                className={`rounded-lg px-5 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--heading)] ${
                  updatesAnswer === "yes" ? "bg-[var(--heading)] text-white border-2 border-[var(--border)]" : "bg-[#e0e0e0] text-[var(--foreground)] border-2 border-[var(--border)] hover:bg-[#d0d0d0]"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleUpdatesAnswer("no")}
                className={`rounded-lg px-5 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--heading)] ${
                  updatesAnswer === "no" ? "bg-[var(--heading)] text-white border-2 border-[var(--border)]" : "bg-[#e0e0e0] text-[var(--foreground)] border-2 border-[var(--border)] hover:bg-[#d0d0d0]"
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
            <p className="mb-6 text-base text-[var(--foreground)]">No problem—try again later when you&apos;re on Wi-Fi and charging.</p>
          )}
        </>
      )}

      {isSuspicious && (
        <div className="mb-8 space-y-6">
          <RowWithContextTip
            tipId={`${slug}-scam-lesson-help`}
            openTipId={openContextTipId}
            setOpenTipId={setOpenContextTipId}
            contextLabel="Help for this scam-spotting lesson"
            panelBody={
              <div className="space-y-4 text-base leading-relaxed text-[var(--foreground)]">
                <p className="whitespace-pre-wrap">{getStepOrActivityTip(slug, 0)}</p>
                <p className="whitespace-pre-wrap border-t border-[var(--border)]/15 pt-4">{getStepOrActivityTip(slug, 2)}</p>
              </div>
            }
          >
            <p className="text-base text-[var(--foreground)] sm:text-lg">
              Read these two messages. Which one is suspicious?
            </p>
          </RowWithContextTip>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-[var(--border)] bg-white p-4 shadow-sm">
              <p className="mb-2 font-bold text-[var(--heading)]">Message A</p>
              <p className="whitespace-pre-line text-base text-[var(--foreground)]">{MESSAGE_A.title}</p>
              <p className="whitespace-pre-line text-base text-[var(--foreground)]">{MESSAGE_A.body}</p>
            </div>
            <div className="rounded-xl border-2 border-[var(--border)] bg-white p-4 shadow-sm">
              <p className="mb-2 font-bold text-[var(--heading)]">Message B</p>
              <p className="whitespace-pre-line text-base text-[var(--foreground)]">{MESSAGE_B.title}</p>
              <p className="whitespace-pre-line text-base text-[var(--foreground)]">{MESSAGE_B.body}</p>
            </div>
          </div>

          {!suspiciousSubmitted ? (
            <div className="rounded-xl border-2 border-[var(--border)] bg-white p-4">
              <p className="mb-3 font-medium text-[var(--foreground)]">Which message is suspicious?</p>
              <div className="flex flex-col gap-2">
                {SUSPICIOUS_OPTIONS.map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 hover:bg-[#e8e8e8]">
                    <input
                      type="radio"
                      name="suspicious"
                      value={opt}
                      checked={suspiciousChoice === opt}
                      onChange={() => setSuspiciousChoice(opt)}
                      className="h-5 w-5 accent-[var(--heading)]"
                    />
                    <span className="text-base">{opt}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => suspiciousChoice && handleSuspiciousSubmit(suspiciousChoice)}
                disabled={!suspiciousChoice}
                className="mt-4 rounded-lg border-2 border-[var(--border)] bg-[var(--heading)] px-5 py-3 font-medium text-white hover:bg-[var(--link)] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--heading)]"
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-[var(--border)] bg-white p-6">
              <p className="mb-2 font-bold text-[var(--heading)]">Why message A is suspicious</p>
              <ul className="mb-4 list-inside list-disc space-y-1 text-base text-[var(--foreground)]">
                <li>Urgency or time limit (e.g. &quot;within 24 hours&quot;)</li>
                <li>Link to &quot;update details&quot;—could steal your information</li>
                <li>Generic wording; real services often use your name and real reference numbers</li>
              </ul>
              <p className="mb-2 font-bold text-[var(--heading)]">Safe action steps</p>
              <ul className="list-inside list-disc space-y-1 text-base text-[var(--foreground)]">
                <li>Don&apos;t click links.</li>
                <li>Verify using official sources (official website or phone number you already trust).</li>
                <li>Report as spam/phishing.</li>
                <li>Delete the message.</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 rounded-xl border-2 border-[var(--border)] bg-white p-4" role="note">
        <p className="text-base text-[var(--foreground)]">Take your time.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-start gap-3">
        <Link
          href="/training"
          className="rounded-lg px-5 py-3 font-medium no-underline focus:outline-none focus:ring-2"
          style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)", textDecoration: "none" }}
        >
          Back to modules
        </Link>
        <div className="ml-auto flex min-w-0 max-w-full flex-col items-end gap-2">
          <button
            type="button"
            aria-pressed={markedComplete}
            onClick={() => handleMarkComplete(!markedComplete)}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--heading)] focus:ring-offset-2 ${
              markedComplete
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-[#e8e8e8] text-[var(--foreground)] hover:bg-[#d0d0d0]"
            }`}
          >
            <span>{markedComplete ? "Completed" : "Mark as complete"}</span>
            <CheckCircle className="h-6 w-6 shrink-0" aria-hidden />
          </button>
          {markedComplete ? (
            <p className="max-w-[min(100%,20rem)] text-right text-base text-[var(--foreground)]">Your progress has been saved.</p>
          ) : (
            <p className="max-w-[min(100%,20rem)] text-right text-sm text-[var(--foreground)]">
              Click when you&apos;re done to track your progress.
            </p>
          )}
        </div>
      </div>

      <TrainingModuleExplorer currentSlug={slug} progressRefreshKey={markedComplete} />
    </div>
  );
}
