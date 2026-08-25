"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { getStoredProgress, getUpdatesAnswer, getSuspiciousAnswer } from "@/lib/progress";
import type { ModuleProgress } from "@/lib/progress";
import { useCallback, useEffect, useState } from "react";

export function useProgressData() {
  // THIS IS THE FIX: watching devicePlatform means that as soon as
  // someone switches Android <-> iOS on their Profile page, every
  // component using this hook automatically re-fetches — showing that
  // platform's own progress instead of the previous one staying on
  // screen until a manual refresh.
  const { profile } = useAccessibility();

  const [progress, setProgress] = useState<ModuleProgress>({});
  const [updatesAnswered, setUpdatesAnswered] = useState<"yes" | "no" | null>(null);
  const [suspiciousAnswered, setSuspiciousAnswered] = useState<string | null>(null);

  const reload = useCallback(() => {
    void Promise.all([getStoredProgress(), getUpdatesAnswer(), getSuspiciousAnswer()]).then(
      ([p, u, s]) => {
        setProgress(p);
        setUpdatesAnswered(u);
        setSuspiciousAnswered(s);
      }
    );
  }, []);

  useEffect(() => {
    reload();
  }, [reload, profile.devicePlatform]);

  return { progress, updatesAnswered, suspiciousAnswered, reload };
}
