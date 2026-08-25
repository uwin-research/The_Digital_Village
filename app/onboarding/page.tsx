"use client";

import {
  COLOR_THEME_OPTIONS,
  DISPLAY_SCALE_MAX,
  DISPLAY_SCALE_MIN,
  useAccessibility,
} from "@/context/AccessibilityContext";
import { Check, Minus, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

const GENDER_OPTIONS = ["Female", "Male", "Prefer not to say", "Other"];
const DEVICE_OPTIONS: { id: "android" | "ios"; label: string }[] = [
  { id: "android", label: "Android" },
  { id: "ios", label: "iPhone (iOS)" },
];

export default function OnboardingPage() {
  const {
    profile,
    setProfile,
    displayScale,
    increaseDisplayScale,
    decreaseDisplayScale,
    colorTheme,
    setColorTheme,
  } = useAccessibility();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [devicePlatform, setDevicePlatform] = useState<"android" | "ios" | null>(profile.devicePlatform);

  function handlePictureChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  /** Step 1 "Continue": save the details typed in, then move to Step 2. */
  function handleContinueFromDetails() {
    setProfile({ name, age, gender, avatar, devicePlatform });
    setStep(2);
  }

  /** Step 2 "Done" or "Skip": either way, onboarding is finished and we go to Training. */
  function finishOnboarding() {
    setProfile({ onboarded: true });
    router.push("/training");
  }

  const displayScalePercent = Math.round(displayScale * 100);

  return (
    <div className="mx-auto max-w-md px-4 py-10 md:max-w-lg lg:max-w-xl md:py-16 2xl:max-w-2xl">
      <div className="rounded-2xl border-2 p-6 md:p-8 lg:p-10 shadow-md" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
        {/* Requirement 2.2 (Position Trace): always show which step this is */}
        <p
          className="mb-4 inline-block rounded-full px-3 py-1 text-sm font-semibold"
          style={{ border: "1px solid var(--border)", color: "var(--heading)" }}
        >
          Step {step} of 2
        </p>

        {step === 1 ? (
          <>
            <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--heading)" }}>
              Welcome to The Digital Village
            </h1>
            <p className="mb-2 text-base" style={{ color: "var(--foreground)" }}>
              We only use these details to make your experience on this site better and more personal. We never use
              them for any other purpose, and never share them anywhere else.
            </p>
            <p className="mb-6 text-base" style={{ color: "var(--foreground)" }}>
              Everything below is optional except one thing — please tell us if you use Android or iPhone, so we
              can show you the right training content. You can fill in the rest now or later from your Profile
              page.
            </p>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1 block text-base font-medium" style={{ color: "var(--foreground)" }}>
                  Your name <span style={{ color: "var(--heading)" }}>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border-2 px-4 py-3 text-base focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--border)" }}
                  placeholder="e.g. Elena"
                />
              </div>

              <div>
                <label htmlFor="age" className="mb-1 block text-base font-medium" style={{ color: "var(--foreground)" }}>
                  Your age
                </label>
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-lg border-2 px-4 py-3 text-base focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--border)" }}
                  placeholder="e.g. 72"
                />
              </div>

              <fieldset>
                <legend className="mb-1 text-base font-medium" style={{ color: "var(--foreground)" }}>
                  Gender <span style={{ color: "var(--heading)" }}>*</span>
                </legend>
                <div className="flex flex-col gap-2">
                  {GENDER_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={opt}
                        checked={gender === opt}
                        onChange={() => setGender(opt)}
                        className="h-5 w-5"
                        style={{ accentColor: "var(--heading)" }}
                      />
                      <span className="text-base" style={{ color: "var(--foreground)" }}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-1 text-base font-medium" style={{ color: "var(--foreground)" }}>
                  Which phone do you use? <span style={{ color: "var(--heading)" }}>*</span>
                </legend>
                <p className="mb-2 text-sm" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  This helps us show you training steps and screenshots that match your phone.
                </p>
                <div className="flex flex-col gap-2">
                  {DEVICE_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <input
                        type="radio"
                        name="devicePlatform"
                        value={opt.id}
                        checked={devicePlatform === opt.id}
                        onChange={() => setDevicePlatform(opt.id)}
                        className="h-5 w-5"
                        style={{ accentColor: "var(--heading)" }}
                      />
                      <span className="text-base" style={{ color: "var(--foreground)" }}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <p className="mb-2 text-base font-medium" style={{ color: "var(--foreground)" }}>
                  Profile picture (optional)
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                  >
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8" style={{ color: "var(--heading)" }} aria-hidden />
                    )}
                  </div>
                  <label
                    className="inline-flex min-h-[48px] cursor-pointer items-center rounded-lg border-2 px-4 py-2 text-base font-semibold focus-within:ring-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Choose a picture
                    <input type="file" accept="image/*" onChange={handlePictureChange} className="sr-only" />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleContinueFromDetails}
                  disabled={!devicePlatform}
                  aria-disabled={!devicePlatform}
                  className="w-full rounded-xl border-2 px-6 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)", borderColor: "var(--border)" }}
                >
                  Continue
                </button>
              </div>
              {!devicePlatform ? (
                <p className="mt-2 text-sm" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                  Please choose Android or iPhone above to continue — this is the only required field, so we know
                  which training content to show you.
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--heading)" }}>
              Let&apos;s make this platform easier for you
            </h1>
            <p className="mb-6 text-base" style={{ color: "var(--foreground)" }}>
              This site already follows accessibility guidelines by default, even if you skip this step. You can
              also adjust the display size and color theme to your own preference below — you can always change these
              later from your Profile page too.
            </p>

            {/* Display Size (this is a page-wide zoom, not just text) */}
            <div className="mb-8">
              <p className="mb-1 text-base font-semibold" style={{ color: "var(--foreground)" }}>
                Display Size
              </p>
              <p className="mb-3 text-sm" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                This makes everything on the page bigger or smaller together — text, buttons, and spacing — like
                zooming in or out.
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={decreaseDisplayScale}
                  disabled={displayScale <= DISPLAY_SCALE_MIN}
                  aria-label="Make text smaller"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 focus:outline-none focus:ring-2 disabled:opacity-40"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                >
                  <Minus className="h-6 w-6" style={{ color: "var(--foreground)" }} aria-hidden />
                </button>
                <div
                  className="flex min-w-[5.5rem] flex-1 items-center justify-center rounded-lg border-2 px-4 py-3 text-lg font-bold"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  aria-live="polite"
                >
                  {displayScalePercent}%
                </div>
                <button
                  type="button"
                  onClick={increaseDisplayScale}
                  disabled={displayScale >= DISPLAY_SCALE_MAX}
                  aria-label="Make text bigger"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 focus:outline-none focus:ring-2 disabled:opacity-40"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                >
                  <Plus className="h-6 w-6" style={{ color: "var(--foreground)" }} aria-hidden />
                </button>
              </div>
            </div>

            {/* Color theme */}
            <div className="mb-8">
              <p className="mb-2 text-base font-semibold" style={{ color: "var(--foreground)" }}>
                Color theme
              </p>
              <div className="space-y-3">
                {COLOR_THEME_OPTIONS.map((opt) => {
                  const selected = colorTheme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setColorTheme(opt.id)}
                      aria-pressed={selected}
                      className="flex w-full min-h-[48px] items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left focus:outline-none focus:ring-2"
                      style={{
                        borderColor: selected ? "var(--heading)" : "var(--border)",
                        backgroundColor: selected ? "var(--background)" : "var(--background)",
                      }}
                    >
                      <span>
                        <span className="block text-base font-semibold" style={{ color: "var(--foreground)" }}>
                          {opt.label}
                        </span>
                        <span className="block text-sm" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                          {opt.description}
                        </span>
                      </span>
                      {selected ? (
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: "var(--heading)", color: "#ffffff" }}
                        >
                          <Check className="h-5 w-5" aria-hidden />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={finishOnboarding}
                className="flex-1 rounded-xl border-2 px-6 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ borderColor: "var(--border)", color: "var(--foreground)", backgroundColor: "var(--background)" }}
              >
                Skip
              </button>
              <button
                type="button"
                onClick={finishOnboarding}
                className="flex-1 rounded-xl border-2 px-6 py-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)", borderColor: "var(--border)" }}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
