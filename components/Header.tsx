"use client";

import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, Menu, X } from "lucide-react";
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
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="bg-white text-black border-b-2 border-black" role="banner">
      <div className="flex items-center justify-between gap-2 pl-4 pr-2 py-2">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1 font-extrabold no-underline focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2 rounded"
          aria-label="The Digital Village home"
          style={{ textDecoration: "none", color: "#000080" }}
        >
          <span className="whitespace-nowrap text-xl md:text-3xl">The Digital Village</span>
        </Link>

        <nav
          id="main-nav"
          className={`absolute left-4 right-4 top-[4.5rem] z-20 rounded-lg bg-white shadow-lg px-4 py-3 ${menuOpen ? "block" : "hidden"}`}
          aria-label="Main navigation"
        >
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-4 py-2 text-sm font-semibold no-underline focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2 ${
                    isActiveLink(link.href)
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
            className="flex items-center rounded-lg px-3 py-2 font-semibold hover:bg-[#e8e8e8] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          {user ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-lg bg-[#FFD700] px-3 py-2 text-black hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" aria-hidden />
            </button>
          ) : (
            <Link
              href="/signin"
              className="rounded-lg bg-[#FFD700] px-3 py-2 text-black no-underline hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
              style={{ textDecoration: "none" }}
              aria-label="Sign in"
            >
              <LogIn className="h-5 w-5" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      <div className="w-full border-t-2 border-black bg-white">
        <div className="mx-auto max-w-5xl px-4 py-2">
          <div className="flex flex-wrap justify-center gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold no-underline focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2 ${
                  isActiveLink(link.href)
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
