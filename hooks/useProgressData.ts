import { getStoredProgress, getUpdatesAnswer, getSuspiciousAnswer } from "@/lib/progress";
import type { ModuleProgress } from "@/lib/progress";
import { useEffect, useState } from "react";

export function useProgressData() {
  const [progress, setProgress] = useState<ModuleProgress>({});
  const [updatesAnswered, setUpdatesAnswered] = useState<"yes" | "no" | null>(null);
  const [suspiciousAnswered, setSuspiciousAnswered] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getStoredProgress(), getUpdatesAnswer(), getSuspiciousAnswer()]).then(
      ([p, u, s]) => {
        setProgress(p);
        setUpdatesAnswered(u);
        setSuspiciousAnswered(s);
      }
    );
  }, []);

  return { progress, updatesAnswered, suspiciousAnswered };
}
