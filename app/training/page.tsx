"use client";

import { useProgressData } from "@/hooks/useProgressData";
import { countCompletedModules } from "@/lib/progress";
import { MODULES } from "@/lib/modules";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DASHBOARD_MODULES = [
  {
    slug: "getting-comfortable",
    title: "Module 1: Getting Comfortable with Your Device",
    storyTitle: "Making the Screen Work for You",
    description:
      "Font size, gestures, and what to do when you make a mistake. Learn to use your device without fear.",
    buttonLabel: "Start Learning",
    image: "/arthur-accessibility.png",
    icon: null,
  },
  {
    slug: "first-line-of-defence",
    title: "Module 2: Your First Line of Defence",
    storyTitle: "Screen Lock & Biometrics",
    description:
      "Why screen lock matters, PINs vs. patterns, Face ID, and what to do if your phone is lost.",
    buttonLabel: "Lock Your Device",
    image: "/elena-security.png",
    icon: null,
  },
  {
    slug: "passwords-logging-in",
    title: "Module 3: Passwords & Logging in Safely",
    storyTitle: "Strong Passwords & Passphrases",
    description:
      "Weak vs. strong passwords, the passphrase method, and why your email is your master key.",
    buttonLabel: "Secure Your Keys",
    image: "/sam-passwords.png",
    icon: null,
  },
  {
    slug: "two-factor-auth",
    title: "Module 4: Two-Factor Authentication (2FA)",
    storyTitle: "The Double Lock",
    description:
      "Add a second lock to your accounts. Learn what 2FA is, how to set it up, and backup codes.",
    buttonLabel: "Add 2FA",
    image: "/two-factor-auth.png",
    icon: null,
  },
  {
    slug: "app-permissions",
    title: "Module 5: App Permissions & Safety",
    storyTitle: "When to Say Yes or No",
    description:
      "What app permissions are, the six key permissions, and how to spot app store red flags.",
    buttonLabel: "Check Permissions",
    image: "/app-permissions.png",
    icon: null,
  },
  {
    slug: "software-updates",
    title: "Module 6: Software Updates & Habits",
    storyTitle: "The Monthly Safety Routine",
    description:
      "Why updates matter, how to check for them, automatic updates, and the monthly safety checklist.",
    buttonLabel: "Start the Routine",
    image: "/software-updates.png",
    icon: null,
  },
  {
    slug: "scams-phishing",
    title: "Module 7: Recognising Scams & Phishing",
    storyTitle: "The PAUSE Method",
    description:
      "Common scams, the PAUSE method, and what to do if you spot a suspicious message.",
    buttonLabel: "Spot the Scam",
    image: "/scams-phishing.png",
    icon: null,
  },
  {
    slug: "public-wifi-browsing",
    title: "Module 8: Public Wi-Fi & Safe Browsing",
    storyTitle: "Browse Safely Away from Home",
    description:
      "Public Wi-Fi risks, recognising secure websites, and what a VPN is.",
    buttonLabel: "Browse Safely",
    image: "/public-wifi-browsing.png",
    icon: null,
  },
  {
    slug: "caches-cookies-clutter",
    title: "Module 9: Caches, Cookies & Digital Clutter",
    storyTitle: "Clear the Clutter",
    description:
      "What a cache is, clearing cookies and history, and private browsing mode.",
    buttonLabel: "Clear Clutter",
    image: "/caches-cookies-clutter.png",
    icon: null,
  },
];

export default function TrainingPage() {
  const { progress, updatesAnswered, suspiciousAnswered } = useProgressData();

  const completed = countCompletedModules(
    progress,
    MODULES,
    !!updatesAnswered,
    !!suspiciousAnswered
  );
  const total = MODULES.length;

  return (
    <div className="min-h-screen">
      {/* Hero Header - fills viewport in all screen formats */}
      <header className="relative h-[100dvh] min-h-[100vh] w-full min-w-full overflow-hidden bg-white">
        <Image
          src="/digital-village-hero.png?v=2"
          alt="The Digital Village: Arthur, Elena, and Sam at the sunset patio table, learning together with their devices"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          unoptimized
        />
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-base font-medium text-black">
            <span>Progress</span>
            <span>
              {completed} of {total} completed
            </span>
          </div>
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-[#e0e0e0]"
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label="Training progress"
          >
            <div
              className="h-full rounded-full bg-[#000080] transition-all"
              style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
            />
          </div>
          {completed > 0 && (
            <p className="mt-2 text-base text-black">You&apos;re doing great.</p>
          )}
        </div>

        {/* Module Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARD_MODULES.map((mod) => {
            const moduleData = MODULES.find((m) => m.slug === mod.slug);
            const isComplete = moduleData
              ? moduleData.hasInteractiveMessage
                ? !!suspiciousAnswered
                : moduleData.afterCheckQuestion
                  ? !!updatesAnswered
                  : moduleData.steps.length > 0 &&
                    !!progress[mod.slug] &&
                    moduleData.steps.every((s) => progress[mod.slug][s.id])
              : false;

            return (
              <article
                key={mod.slug}
                className="flex flex-col overflow-hidden rounded-2xl border-2 border-black bg-white shadow-lg transition-shadow hover:shadow-xl focus-within:ring-2 focus-within:ring-[#000080]"
              >
                <div className="relative min-h-[100px] border-b border-black bg-white">
                  {mod.image ? (
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={mod.image}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 33vw"
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
                      <CheckCircle className="h-4 w-4" aria-hidden />
                      <span>Completed</span>
                    </div>
                  )}
                  <h2 className="mb-1 text-lg font-bold text-[#000080]">
                    {mod.storyTitle}
                  </h2>
                  <p className="mb-2 text-sm font-medium text-black">
                    {mod.title}
                  </p>
                  <p className="mb-4 flex-1 text-base text-black">
                    {mod.description}
                  </p>
                  <Link
                    href={`/training/${mod.slug}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#FFD700] px-4 py-3 font-semibold text-black no-underline hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
                    style={{ textDecoration: "none" }}
                  >
                    {mod.buttonLabel}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-8 rounded-xl border border-black bg-white p-4">
          <p className="text-base font-medium text-black">
            Before you start: If you get stuck, ask a trusted person to sit with you.
          </p>
        </div>
      </div>

    </div>
  );
}
