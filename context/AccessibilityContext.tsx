"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "golden-shield-a11y";
const TEXT_SIZE_KEY = "golden-shield-text-size";
const HIGH_CONTRAST_KEY = "golden-shield-high-contrast";

type TextSize = "small" | "medium" | "large";

interface A11yState {
  textSize: TextSize;
  highContrast: boolean;
}

const defaultState: A11yState = { textSize: "medium", highContrast: false };

function loadState(): A11yState {
  if (typeof window === "undefined") return defaultState;
  try {
    const t = localStorage.getItem(TEXT_SIZE_KEY) as TextSize | null;
    const h = localStorage.getItem(HIGH_CONTRAST_KEY);
    return {
      textSize: t === "small" || t === "medium" || t === "large" ? t : "medium",
      highContrast: h === "true",
    };
  } catch {
    return defaultState;
  }
}

interface AccessibilityContextValue extends A11yState {
  setTextSize: (size: TextSize) => void;
  setHighContrast: (on: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<A11yState>(defaultState);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.textSize = state.textSize;
    document.documentElement.dataset.highContrast = state.highContrast ? "true" : "false";
    if (typeof window !== "undefined") {
      localStorage.setItem(TEXT_SIZE_KEY, state.textSize);
      localStorage.setItem(HIGH_CONTRAST_KEY, String(state.highContrast));
    }
  }, [state]);

  const setTextSize = useCallback((textSize: TextSize) => {
    setState((s) => ({ ...s, textSize }));
  }, []);

  const setHighContrast = useCallback((highContrast: boolean) => {
    setState((s) => ({ ...s, highContrast }));
  }, []);

  return (
    <AccessibilityContext.Provider value={{ ...state, setTextSize, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
