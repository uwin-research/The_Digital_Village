"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { useProgressData } from "@/hooks/useProgressData";
import { isModuleLessonComplete } from "@/lib/progress";
import { MODULES } from "@/lib/modules";
import { getNavModulesForPlatform } from "@/lib/trainingNavModules";
import { CheckCircle, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TrainingPage() {
  const { progress, updatesAnswered, suspiciousAnswered } = useProgressData();
  const { profile } = useAccessibility();
  const navModules = getNavModulesForPlatform(profile.devicePlatform);

  return (
    <div className="min-h-screen">
      {/* Hero Header - uses device-optimized artwork */}
      <header className="relative h-[100dvh] min-h-[100vh] w-full overflow-hidden bg-white">
        <picture>
          <source media="(max-width: 767px)" srcSet="/digital-village-hero-mobile.png" />
          <source media="(min-width: 768px) and (max-width: 1199px) and (orientation: portrait)" srcSet="/digital-village-hero-tablet.png" />
          <source media="(min-width: 768px) and (max-width: 1199px) and (orientation: landscape)" srcSet="/digital-village-hero-tablet.png" />
          <source media="(min-width: 1200px)" srcSet="/digital-village-hero.png?v=2" />
          <img
            src="/digital-village-hero.png?v=2"
            alt="The Digital Village: Arthur, Elena, and Sam at the sunset patio table, learning together with their devices"
            className="h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
        </picture>
      </header>

      {/*
        Requirement 5 (Responsive Design) - large screens:
        widened the max width and added a 4-column layout at very wide
        breakpoints (2xl, 1536px+) so the module grid uses the extra
        room on big monitors instead of leaving large empty margins on
        either side. Card content itself is unchanged, just how many
        fit per row.
      */}
      <div className="mx-auto max-w-6xl px-4 py-8 2xl:max-w-[100rem]">
        {/*
          Requirement 2.2-style clarity: tell the person which phone
          version of the training they're seeing, so switching Android/
          iOS in their Profile doesn't feel confusing or silent.
        */}
        {profile.devicePlatform ? (
          <div
            className="mb-6 flex items-center gap-3 rounded-xl border-2 p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          >
            <Smartphone className="h-6 w-6 shrink-0" style={{ color: "var(--heading)" }} aria-hidden />
            <p className="text-base" style={{ color: "var(--foreground)" }}>
              Training is shown for <strong>{profile.devicePlatform === "ios" ? "iPhone (iOS)" : "Android"}</strong>{" "}
              based on your Profile settings.
            </p>
          </div>
        ) : null}

        {/* Module Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {navModules.map((mod) => {
            const moduleData = MODULES.find((m) => m.slug === mod.slug);
            const isComplete = moduleData
              ? isModuleLessonComplete(
                  moduleData,
                  progress[mod.slug],
                  !!updatesAnswered,
                  !!suspiciousAnswered
                )
              : false;

            return (
              <article
                key={mod.slug}
                className="flex flex-col overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-white shadow-lg transition-shadow hover:shadow-xl focus-within:ring-2 focus-within:ring-[var(--heading)]"
              >
                <div className="relative min-h-[100px] border-b border-[var(--border)] bg-white">
                  {mod.image ? (
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={mod.image}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, (max-width: 1536px) 33vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-[100px] items-center justify-center p-6">
                      {mod.icon}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {isComplete && (
                    <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-green-700 px-3 py-2 text-sm font-semibold text-white">
                      <span>Completed</span>
                      <CheckCircle className="h-4 w-4 shrink-0" aria-hidden />
                    </div>
                  )}
                  <h2 className="mb-1 text-lg font-bold text-[var(--heading)]">
                    {mod.storyTitle}
                  </h2>
                  <p className="mb-2 text-sm font-bold text-[var(--foreground)]">{mod.title}</p>
                  <p className="mb-4 flex-1 text-base text-[var(--foreground)]">
                    {mod.description}
                  </p>
                  <Link
                    href={`/training/${mod.slug}`}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-3 font-semibold no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)", textDecoration: "none" }}
                  >
                    {mod.buttonLabel}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-8 rounded-xl border border-[var(--border)] bg-white p-4">
          <p className="text-base font-medium text-[var(--foreground)]">
            Before you start: If you get stuck, ask a trusted person to sit with you.
          </p>
        </div>
      </div>

    </div>
  );
}
