"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { Contrast } from "lucide-react";

export function AccessibilityBar() {
  const { textSize, setTextSize, highContrast, setHighContrast } = useAccessibility();

  return (
    <div
      className="flex flex-wrap items-center gap-2 border-b border-amber-200 bg-amber-100/80 px-4 py-2 text-sm"
      role="region"
      aria-label="Accessibility options"
    >
      <span className="font-medium text-amber-900">Text size:</span>
      <div className="flex gap-1">
        {(["small", "medium", "large"] as const).map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setTextSize(size)}
            className={`rounded px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-amber-600 ${textSize === size ? "bg-amber-500 text-amber-950" : "bg-amber-200 text-amber-900 hover:bg-amber-300"}`}
            aria-pressed={textSize === size}
            aria-label={`Text size ${size}`}
          >
            {size === "small" ? "A-" : size === "medium" ? "A" : "A+"}
          </button>
        ))}
      </div>
      <span className="ml-2 font-medium text-amber-900">Contrast:</span>
      <button
        type="button"
        onClick={() => setHighContrast(!highContrast)}
        className={`flex items-center gap-1 rounded px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-amber-600 ${highContrast ? "bg-amber-600 text-white" : "bg-amber-200 text-amber-900 hover:bg-amber-300"}`}
        aria-pressed={highContrast}
        aria-label="Toggle high contrast"
      >
        <Contrast className="h-4 w-4" />
        High contrast
      </button>
    </div>
  );
}
