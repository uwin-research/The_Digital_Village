"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/help", label: "Help" },
  { href: "/resources", label: "Resources" },
];

export function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { profile } = useAccessibility();
  const [menuOpen, setMenuOpen] = useState(false);
  const signOutInProgress = useRef(false);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Requirement 3.3: guard against accidental double-taps.
  // Requirement 2.3: confirm before a destructive action (sign out).
  const handleSignOut = () => {
    if (signOutInProgress.current) return;
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (!confirmed) return;
    signOutInProgress.current = true;
    signOut();
    setTimeout(() => {
      signOutInProgress.current = false;
    }, 500);
  };

  /**
   * THIS IS THE FIX for the Profile button getting cut off on narrow
   * phones: instead of squeezing the hamburger Menu button, the Sign
   * in/out button, AND the Profile button all into one row alongside
   * the logo (and hoping they wrap cleanly if they don't fit), the
   * account controls are now rendered once here and placed in TWO
   * different spots below:
   *   - hidden on mobile, shown inline next to the logo on md+ screens
   *   - shown as their own full-width second row ONLY on mobile
   * This guarantees mobile always has a full row's width available for
   * Sign out + Profile, instead of competing with the logo for space.
   */
  const accountControls: ReactNode = (
    <div className="flex shrink-0 items-center gap-3">
      {user ? (
        <button
          type="button"
          onClick={handleSignOut}
          className="flex min-h-[48px] items-center gap-2 rounded-lg px-3 py-2 sm:px-4 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)" }}
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden />
          <span className="text-base font-semibold">Sign out</span>
        </button>
      ) : (
        <Link
          href="/signin"
          className="flex min-h-[48px] items-center gap-2 rounded-lg px-3 py-2 sm:px-4 no-underline hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ textDecoration: "none", backgroundColor: "var(--button-bg)", color: "var(--button-text)" }}
          aria-label="Sign in"
        >
          <LogIn className="h-5 w-5 shrink-0" aria-hidden />
          <span className="text-base font-semibold">Sign in</span>
        </Link>
      )}

      {user ? (
        <Link
          href="/profile"
          aria-label="Your profile and accessibility settings"
          className="flex min-h-[48px] items-center gap-2 rounded-lg px-3 py-2 sm:px-4 no-underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            textDecoration: "none",
            border: "2px solid var(--border)",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
          ) : (
            <User className="h-5 w-5 shrink-0" aria-hidden />
          )}
          <span className="text-base font-semibold">Profile</span>
        </Link>
      ) : null}
    </div>
  );

  return (
    <header
      className="border-b-2 bg-[var(--background)] text-[var(--foreground)]"
      style={{ borderColor: "var(--border)" }}
      role="banner"
    >
      {/* Row 1: logo + hamburger (mobile) / logo + account controls (md+) */}
      <div className="flex items-center justify-between gap-x-2 pl-4 pr-2 py-2">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1 font-extrabold no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          aria-label="The Digital Village home"
          style={{ textDecoration: "none", color: "var(--heading)" }}
        >
          <span className="whitespace-nowrap text-base sm:text-xl md:text-3xl">The Digital Village</span>
        </Link>

        {/* Mobile-only dropdown nav (hidden on desktop, where the pill bar below is used instead) */}
        <nav
          id="main-nav"
          className={`absolute left-4 right-4 top-[4.5rem] z-20 rounded-lg bg-[var(--background)] shadow-lg px-4 py-3 md:hidden ${
            menuOpen ? "block" : "hidden"
          }`}
          style={{ border: "2px solid var(--border)" }}
          aria-label="Main navigation"
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-[48px] items-center rounded-lg px-4 py-2 text-base font-semibold no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    textDecoration: "none",
                    color: isActiveLink(link.href) ? "var(--heading)" : "var(--foreground)",
                    border: isActiveLink(link.href) ? "2px solid var(--border)" : "none",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {/* Hamburger toggle: mobile only */}
          <button
            type="button"
            className="flex min-h-[48px] items-center gap-2 rounded-lg px-2.5 py-2 font-semibold hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:px-3 md:hidden"
            style={{ color: "var(--foreground)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-5 w-5 shrink-0" aria-hidden /> : <Menu className="h-5 w-5 shrink-0" aria-hidden />}
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>

          {/* Account controls inline here ONLY on md+ screens */}
          <div className="hidden md:flex md:items-center md:gap-3">{accountControls}</div>
        </div>
      </div>

      {/* Row 2: account controls get their own full-width row, MOBILE ONLY */}
      <div className="flex justify-end gap-3 px-4 pb-2 md:hidden">{accountControls}</div>

      {/* Desktop-only pill nav bar */}
      <div className="hidden w-full md:block" style={{ borderTop: "2px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-4 py-2">
          <div className="flex flex-wrap justify-center gap-4">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-[48px] items-center rounded-lg px-4 py-2 text-base font-semibold no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    textDecoration: "none",
                    backgroundColor: active ? "var(--button-hover-bg)" : "var(--button-bg)",
                    color: "var(--button-text)",
                    border: active ? "2px solid var(--border)" : "none",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
