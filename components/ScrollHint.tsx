"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Requirement 2.2 / Cognition support: older adults may not always
 * realize a page keeps going below what's visible. This shows a small,
 * theme-colored arrow near the bottom of the screen whenever there is
 * more content to scroll to, and hides itself automatically once the
 * person reaches (or is very close to) the bottom of the page.
 *
 * Tapping it also scrolls down by roughly one screen, as a convenience.
 */
export function ScrollHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function checkScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = fullHeight - (scrollTop + viewportHeight);

      // Only show if the page is actually scrollable AND we're not
      // already near the bottom (leaves a little slack so it doesn't
      // flicker right at the very end).
      const pageIsScrollable = fullHeight > viewportHeight + 80;
      setVisible(pageIsScrollable && distanceFromBottom > 120);
    }

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    // Content can load/resize after mount (images, videos), so re-check shortly after.
    const t = setTimeout(checkScroll, 500);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(t);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })}
      aria-label="More content below, scroll down"
      className="fixed bottom-6 left-1/2 z-30 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 animate-bounce"
      style={{
        backgroundColor: "var(--button-bg)",
        color: "var(--button-text)",
        border: "2px solid var(--border)",
      }}
    >
      <ChevronDown className="h-6 w-6" aria-hidden />
    </button>
  );
}
