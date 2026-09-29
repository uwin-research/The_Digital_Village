"use client";

import { useAuth } from "@/context/AuthContext";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const LOCAL_CACHE_KEY = "golden-shield-profile-cache";

export type ColorTheme = "classic" | "highContrast" | "softBlue";

export const COLOR_THEME_OPTIONS: { id: ColorTheme; label: string; description: string }[] = [
  { id: "classic", label: "Classic (Navy & Yellow)", description: "The site's default look." },
  { id: "highContrast", label: "High Contrast (Black & White)", description: "The strongest possible contrast." },
  { id: "softBlue", label: "Soft Blue", description: "A gentler blue tone, still easy to read." },
];

/**
 * NOTE ON NAMING: this used to be called "font scale" / "text size" in
 * the UI. It was renamed to "Display Size" because it doesn't just
 * resize text — it scales the whole page (text, buttons, spacing)
 * together, the same way a phone or browser "zoom" feature works. The
 * variable/function names below were kept similar to avoid churn, but
 * the user-facing label is now "Display Size" (see ProfilePage.tsx /
 * OnboardingPage.tsx).
 */
export const DISPLAY_SCALE_MIN = 0.85;
export const DISPLAY_SCALE_MAX = 1.4;
export const DISPLAY_SCALE_STEP = 0.05;
export const DISPLAY_SCALE_DEFAULT = 1;
export const COLOR_THEME_DEFAULT: ColorTheme = "classic";

export type DevicePlatform = "android" | "ios" | null;

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  /** Data-URL (base64) of the picture the user picked, or empty string for none. */
  avatar: string;
  /**
   * Which phone type this person uses. Drives which version of the
   * training content/screenshots is shown (see TrainingPage.tsx and
   * ModulePage.tsx). null means "not answered / skipped" — in that case
   * the site currently falls back to showing the existing (iPhone-style)
   * content without a platform banner.
   */
  devicePlatform: DevicePlatform;
  /** Becomes true once the person finishes the first onboarding wizard. */
  onboarded: boolean;
}

const defaultProfile: UserProfile = { name: "", age: "", gender: "", avatar: "", devicePlatform: null, onboarded: false };

interface A11yState {
  displayScale: number;
  colorTheme: ColorTheme;
  profile: UserProfile;
  /** True once we've either loaded saved settings from the server, or confirmed there are none (avoids a flash of default styling / a flash of the wrong person's settings). */
  hydrated: boolean;
}

const defaultState: Omit<A11yState, "hydrated"> = {
  displayScale: DISPLAY_SCALE_DEFAULT,
  colorTheme: COLOR_THEME_DEFAULT,
  profile: defaultProfile,
};

function loadLocalCache(): Omit<A11yState, "hydrated"> {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      displayScale: typeof parsed.displayScale === "number" ? parsed.displayScale : DISPLAY_SCALE_DEFAULT,
      colorTheme:
        parsed.colorTheme === "classic" || parsed.colorTheme === "highContrast" || parsed.colorTheme === "softBlue"
          ? parsed.colorTheme
          : COLOR_THEME_DEFAULT,
      profile: { ...defaultProfile, ...(parsed.profile ?? {}) },
    };
  } catch {
    return defaultState;
  }
}

interface AccessibilityContextValue extends A11yState {
  increaseDisplayScale: () => void;
  decreaseDisplayScale: () => void;
  setColorTheme: (theme: ColorTheme) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  /** Saves the full profile to the database immediately (no delay) and waits for it to finish. */
  commitProfile: (newProfile: UserProfile) => Promise<void>;
  /** Puts Display Size and Color Theme back to the site's defaults (does not touch name/age/gender/picture). */
  resetAccessibilitySettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<A11yState>(() => ({ ...loadLocalCache(), hydrated: false }));
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks which email's data is currently loaded, so we know when to re-fetch.
  const loadedForEmail = useRef<string | null>(null);

  /*
   * THIS IS THE FIX for "different email shows the same data":
   * whenever the signed-in email changes (sign in, sign out, or
   * switching accounts on the same browser), re-fetch from the server
   * instead of keeping whatever was loaded for the previous person.
   */
  useEffect(() => {
    const currentEmail = user?.email ?? null;

    if (currentEmail === loadedForEmail.current) return; // nothing changed
    loadedForEmail.current = currentEmail;

    if (!currentEmail) {
      // Signed out: reset to defaults rather than keep showing the
      // previous person's settings.
      setState({ ...defaultState, hydrated: true });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (cancelled) return;
        if (data?.profile) {
          setState({
            displayScale: typeof data.profile.displayScale === "number" ? data.profile.displayScale : DISPLAY_SCALE_DEFAULT,
            colorTheme:
              data.profile.colorTheme === "classic" ||
              data.profile.colorTheme === "highContrast" ||
              data.profile.colorTheme === "softBlue"
                ? data.profile.colorTheme
                : COLOR_THEME_DEFAULT,
            profile: { ...defaultProfile, ...(data.profile.profile ?? {}) },
            hydrated: true,
          });
        } else {
          // Brand new account with no saved profile yet — use defaults,
          // which correctly means onboarded=false, so the onboarding
          // wizard will show for this new email.
          setState({ ...defaultState, hydrated: true });
        }
      } catch {
        setState((s) => ({ ...s, hydrated: true }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  // Apply visual changes immediately, and persist (locally always,
  // remotely with a short debounce).
  useEffect(() => {
    document.documentElement.style.setProperty("--user-font-scale", String(state.displayScale));
    document.documentElement.dataset.colorTheme = state.colorTheme;

    try {
      localStorage.setItem(
        LOCAL_CACHE_KEY,
        JSON.stringify({ displayScale: state.displayScale, colorTheme: state.colorTheme, profile: state.profile })
      );
    } catch {
      // ignore storage errors (e.g. private browsing)
    }

    if (!state.hydrated || !user?.email) return; // don't save before load, or when signed out
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayScale: state.displayScale, colorTheme: state.colorTheme, profile: state.profile }),
      }).catch(() => {
        // Offline or request failed — will retry next time something changes.
      });
    }, 500);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, user?.email]);

  const increaseDisplayScale = useCallback(() => {
    setState((s) => ({
      ...s,
      displayScale: Math.min(DISPLAY_SCALE_MAX, Math.round((s.displayScale + DISPLAY_SCALE_STEP) * 100) / 100),
    }));
  }, []);

  const decreaseDisplayScale = useCallback(() => {
    setState((s) => ({
      ...s,
      displayScale: Math.max(DISPLAY_SCALE_MIN, Math.round((s.displayScale - DISPLAY_SCALE_STEP) * 100) / 100),
    }));
  }, []);

  const setColorTheme = useCallback((colorTheme: ColorTheme) => {
    setState((s) => ({ ...s, colorTheme }));
  }, []);

  const setProfile = useCallback((partial: Partial<UserProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...partial } }));
  }, []);

  /**
   * THIS IS THE FIX for "progress count doesn't update right after
   * switching Android/iOS on the Profile page": the normal setProfile()
   * above only updates the screen immediately and saves to the database
   * in the background after a short delay (so rapid changes don't spam
   * the server). That's fine for most settings, but for devicePlatform
   * specifically, anything that reads progress right afterward (like
   * the "X out of 8 modules completed" count) needs the database to
   * already have the NEW platform, not the old one.
   *
   * commitProfile saves immediately (no delay) and returns a promise,
   * so the caller can `await` it and only THEN reload progress —
   * guaranteeing the server already has the new platform by that point.
   */
  const commitProfile = useCallback(
    async (newProfile: UserProfile) => {
      setState((s) => ({ ...s, profile: newProfile }));
      if (saveTimer.current) clearTimeout(saveTimer.current);
      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayScale: state.displayScale, colorTheme: state.colorTheme, profile: newProfile }),
        });
      } catch {
        // If this fails (e.g. offline), the regular background sync
        // will retry next time any setting changes.
      }
    },
    [state.displayScale, state.colorTheme]
  );

  const resetAccessibilitySettings = useCallback(() => {
    setState((s) => ({ ...s, displayScale: DISPLAY_SCALE_DEFAULT, colorTheme: COLOR_THEME_DEFAULT }));
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        increaseDisplayScale,
        decreaseDisplayScale,
        setColorTheme,
        setProfile,
        commitProfile,
        resetAccessibilitySettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
