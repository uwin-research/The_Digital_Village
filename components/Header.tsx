"use client";

import { useAuth } from "@/context/AuthContext";
import { useAccessibility } from "@/context/AccessibilityContext";
import { Shield, Menu, X, Contrast } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/glossary", label: "Glossary" },
  { href: "/help", label: "Help" },
  { href: "/resources", label: "Resources" },
];

export function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { textSize, setTextSize, highContrast, setHighContrast } = useAccessibility();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-amber-50/80 text-amber-950" role="banner">
      {/* Row 1: Golden Shield at left edge + menu + Sign in */}
      <div className="flex items-center justify-between gap-2 pl-4 pr-4 py-2">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
          aria-label="Golden Shield home"
        >
              <Shield className="h-8 w-8 text-amber-600" aria-hidden />
              <span className="text-xl whitespace-nowrap">Golden Shield</span>
        </Link>

        <nav
              id="main-nav"
              className={`absolute left-4 right-4 top-[6.5rem] z-20 rounded-lg border border-amber-200 bg-amber-50 shadow-lg px-4 py-3 ${menuOpen ? "block" : "hidden"}`}
              aria-label="Main navigation"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded px-3 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${pathname === link.href ? "bg-amber-200 text-amber-900" : "hover:bg-amber-100"}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

        <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className="rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="main-nav"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </button>
            {user ? (
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded px-3 py-2 text-base font-medium hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/signin"
                className="rounded px-3 py-2 text-base font-medium hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Sign in
              </Link>
            )}
        </div>
      </div>

      <div className="pl-4 pr-4 py-2">
        {/* Row 2: Text size + Contrast at left edge */}
        <div
          className="mt-1 flex flex-wrap items-center gap-2 text-sm justify-start"
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
          <span className="font-medium text-amber-900">Contrast:</span>
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
      </div>

      {/* Full-width line and nav links */}
      <div className="w-full border-t-2 border-amber-200">
        <div className="mx-auto max-w-5xl px-4 py-2">
          <div className="flex flex-wrap justify-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${pathname === link.href ? "bg-amber-200 text-amber-900" : "hover:bg-amber-100 text-amber-900"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
