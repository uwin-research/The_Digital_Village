"use client";

import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white text-black border-b-2 border-black" role="banner">
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold text-[#000080] no-underline hover:text-[#0047ab] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2 rounded"
          aria-label="The Digital Village home"
          style={{ textDecoration: "none" }}
        >
          <span className="text-xl whitespace-nowrap">The Digital Village</span>
        </Link>

        <nav
          id="main-nav"
          className={`absolute left-4 right-4 top-[5.5rem] z-20 rounded-lg bg-white shadow-lg px-4 py-4 ${menuOpen ? "block" : "hidden"}`}
          aria-label="Main navigation"
        >
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-4 py-3 text-base font-semibold no-underline focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2 ${
                    pathname === link.href
                      ? "border-2 border-black bg-white text-[#000080]"
                      : "bg-white text-black hover:bg-[#e8e8e8]"
                  }`}
                  style={{ textDecoration: "none" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-4 py-3 font-semibold hover:bg-[#e8e8e8] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span>{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
          {user ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-lg bg-[#FFD700] px-4 py-3 font-semibold text-black hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/signin"
              className="rounded-lg bg-[#FFD700] px-4 py-3 font-semibold text-black no-underline hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
              style={{ textDecoration: "none" }}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="w-full border-t-2 border-black bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex flex-wrap justify-center gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-5 py-3 text-base font-semibold no-underline focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2 ${
                  pathname === link.href
                    ? "border-2 border-black bg-[#FFC107] text-black"
                    : "bg-[#FFD700] text-black hover:bg-[#FFC107]"
                }`}
                style={{ textDecoration: "none" }}
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
