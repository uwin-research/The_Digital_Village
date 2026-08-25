"use client";

import {
  COLOR_THEME_OPTIONS,
  DISPLAY_SCALE_MAX,
  DISPLAY_SCALE_MIN,
  useAccessibility,
} from "@/context/AccessibilityContext";
import { useProgressData } from "@/hooks/useProgressData";
import { MODULES } from "@/lib/modules";
import { isModuleLessonComplete } from "@/lib/progress";
import { getNavModulesForPlatform } from "@/lib/trainingNavModules";
import { Check, Minus, Plus, RotateCcw, User } from "lucide-react";
import { useState, type ChangeEvent } from "react";

const GENDER_OPTIONS = ["Female", "Male", "Prefer not to say", "Other"];
const DEVICE_OPTIONS: { id: "android" | "ios"; label: string }[] = [
  { id: "android", label: "Android" },
  { id: "ios", label: "iPhone (iOS)" },
];

export default function ProfilePage() {
  const {
    profile,
    setProfile,
    commitProfile,
    displayScale,
    increaseDisplayScale,
    decreaseDisplayScale,
    colorTheme,
    setColorTheme,
    resetAccessibilitySettings,
  } = useAccessibility();

  const { progress, updatesAnswered, suspiciousAnswered, reload } = useProgressData();

  const navModules = getNavModulesForPlatform(profile.devicePlatform);
  const totalModules = navModules.length;
  const completedCount = navModules.filter((navMod) => {
    const moduleData = MODULES.find((m) => m.slug === navMod.slug);
    return moduleData
      ? isModuleLessonComplete(moduleData, progress[navMod.slug], !!updatesAnswered, !!suspiciousAnswered)
      : false;
  }).length;

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [devicePlatform, setDevicePlatform] = useState<"android" | "ios" | null>(profile.devicePlatform);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [saved, setSaved] = useState(false);

  function handlePictureChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    const newProfile = { ...profile, name, age, gender, avatar, devicePlatform };
    await commitProfile(newProfile);
    // THIS IS THE FIX: only reload progress AFTER the database has
    // confirmed it saved the new platform, so the "X out of 8" count
    // reflects the platform just switched to, not the previous one.
    reload();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const displayScalePercent = Math.round(displayScale * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p
        className="mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold"
        style={{ backgroundColor: "var(--background)", color: "var(--heading)", border: "1px solid var(--border)" }}
      >
        You are on the Profile & Settings page
      </p>
      <h1 className="mb-2 text-3xl font-bold" style={{ color: "var(--heading)" }}>
        Your Profile
      </h1>
      <p
        className="mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold"
        style={{ backgroundColor: "var(--background)", color: "var(--heading)", border: "1px solid var(--border)" }}
      >
        {completedCount} out of {totalModules} modules completed
      </p>
      <p className="mb-6 text-base" style={{ color: "var(--foreground)" }}>
        We only use these details to make your experience on this site better — for example, showing your name and
        making the training feel more personal. We never share this information anywhere else.
      </p>

      {/* ---------- Profile details ---------- */}
      <section aria-labelledby="profile-details-heading" className="mb-8 rounded-2xl border-2 border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 id="profile-details-heading" className="mb-4 text-xl font-bold text-[var(--heading)]">
          Your details
        </h2>

        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--border)] bg-[#f5f5f5]">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-[var(--heading)]" aria-hidden />
            )}
          </div>
          <label className="inline-flex min-h-[48px] cursor-pointer items-center rounded-lg border-2 border-[var(--border)] bg-white px-4 py-2 text-base font-semibold hover:bg-[#e8e8e8] focus-within:ring-2 focus-within:ring-[var(--heading)]">
            Change picture
            <input type="file" accept="image/*" onChange={handlePictureChange} className="sr-only" />
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="p-name" className="mb-1 block text-base font-medium text-[var(--foreground)]">
              Name
            </label>
            <input
              id="p-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-2 border-[var(--border)] px-4 py-3 text-base focus:border-[var(--heading)] focus:outline-none focus:ring-2 focus:ring-[var(--heading)]"
            />
          </div>
          <div>
            <label htmlFor="p-age" className="mb-1 block text-base font-medium text-[var(--foreground)]">
              Age
            </label>
            <input
              id="p-age"
              type="number"
              inputMode="numeric"
              min={0}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border-2 border-[var(--border)] px-4 py-3 text-base focus:border-[var(--heading)] focus:outline-none focus:ring-2 focus:ring-[var(--heading)]"
            />
          </div>
          <fieldset>
            <legend className="mb-1 text-base font-medium text-[var(--foreground)]">Gender</legend>
            <div className="flex flex-col gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 hover:bg-[#e8e8e8]"
                >
                  <input
                    type="radio"
                    name="p-gender"
                    value={opt}
                    checked={gender === opt}
                    onChange={() => setGender(opt)}
                    className="h-5 w-5 accent-[var(--heading)]"
                  />
                  <span className="text-base">{opt}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1 text-base font-medium text-[var(--foreground)]">Which phone do you use?</legend>
            <p className="mb-2 text-sm text-[var(--foreground)] opacity-70">
              This helps us show you training steps and screenshots that match your phone. Changing this will
              switch the training content shown across the site.
            </p>
            <div className="flex flex-col gap-2">
              {DEVICE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 hover:bg-[#e8e8e8]"
                >
                  <input
                    type="radio"
                    name="p-device"
                    value={opt.id}
                    checked={devicePlatform === opt.id}
                    onChange={() => setDevicePlatform(opt.id)}
                    className="h-5 w-5 accent-[var(--heading)]"
                  />
                  <span className="text-base">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="rounded-lg px-5 py-3 font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)", borderColor: "var(--border)" }}
          >
            Save details
          </button>
          {saved ? <p className="mt-2 text-base font-medium text-green-800">Saved.</p> : null}
        </div>
      </section>

      {/* ---------- Accessibility settings ---------- */}
      <section aria-labelledby="accessibility-heading" className="rounded-2xl border-2 border-[var(--border)] bg-white p-6 shadow-sm">
        <h2 id="accessibility-heading" className="mb-2 text-xl font-bold text-[var(--heading)]">
          Make this site work for you
        </h2>
        <p className="mb-6 text-base text-[var(--foreground)]">
          By default, this site already follows accessibility guidelines for older adults. You can also adjust it
          further to your own preference below — every option here is still checked to stay easy to read.
        </p>

        {/* Display Size (this is a page-wide zoom, not just text) */}
        <div className="mb-8">
          <p className="mb-2 text-base font-semibold text-[var(--foreground)]">Display Size</p>
          <p className="mb-3 text-sm text-[var(--foreground)] opacity-70">
            This makes everything on the page bigger or smaller together — text, buttons, and spacing — like
            zooming in or out.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={decreaseDisplayScale}
              disabled={displayScale <= DISPLAY_SCALE_MIN}
              aria-label="Make text smaller"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] bg-white hover:bg-[#e8e8e8] focus:outline-none focus:ring-2 focus:ring-[var(--heading)] disabled:opacity-40"
            >
              <Minus className="h-6 w-6" aria-hidden />
            </button>
            <div
              className="flex min-w-[5.5rem] flex-1 items-center justify-center rounded-lg border-2 border-[var(--border)] bg-[#f5f5f5] px-4 py-3 text-lg font-bold text-[var(--foreground)]"
              aria-live="polite"
            >
              {displayScalePercent}%
            </div>
            <button
              type="button"
              onClick={increaseDisplayScale}
              disabled={displayScale >= DISPLAY_SCALE_MAX}
              aria-label="Make text bigger"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] bg-white hover:bg-[#e8e8e8] focus:outline-none focus:ring-2 focus:ring-[var(--heading)] disabled:opacity-40"
            >
              <Plus className="h-6 w-6" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-sm text-black/70">
            Try tapping + or - and the page will update right away.
          </p>
        </div>

        {/* Color theme */}
        <div>
          <p className="mb-2 text-base font-semibold text-[var(--foreground)]">Color theme</p>
          <div className="space-y-3">
            {COLOR_THEME_OPTIONS.map((opt) => {
              const selected = colorTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColorTheme(opt.id)}
                  aria-pressed={selected}
                  className={`flex w-full min-h-[48px] items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[var(--heading)] ${
                    selected ? "border-[var(--heading)] bg-[#eef1ff]" : "border-[var(--border)] bg-white hover:bg-[#f5f5f5]"
                  }`}
                >
                  <span>
                    <span className="block text-base font-semibold text-[var(--foreground)]">{opt.label}</span>
                    <span className="block text-sm text-black/70">{opt.description}</span>
                  </span>
                  {selected ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--heading)] text-white">
                      <Check className="h-5 w-5" aria-hidden />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-black/70">
            Every color option here has already been checked to be easy to read — pick whichever feels most
            comfortable to you.
          </p>
        </div>

        {/* Reset */}
        <div className="mt-8 border-t border-[var(--border)]/20 pt-6">
          <button
            type="button"
            onClick={resetAccessibilitySettings}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border-2 border-[var(--border)] bg-white px-4 py-2 text-base font-semibold text-[var(--foreground)] hover:bg-[#e8e8e8] focus:outline-none focus:ring-2 focus:ring-[var(--heading)] focus:ring-offset-2"
          >
            <RotateCcw className="h-5 w-5 shrink-0" aria-hidden />
            <span>Reset to default display size and color</span>
          </button>
          <p className="mt-2 text-sm text-black/70">
            If a button or setting got changed by accident, tap this to put the display size and color theme back to
            how the site started — your name, age, gender, and picture will not be affected.
          </p>
        </div>
      </section>
    </div>
  );
}
