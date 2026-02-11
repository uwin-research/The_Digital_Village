"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NeedHelpButton } from "@/components/NeedHelpButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Suspense } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-amber-950 focus:outline-none"
      >
        Skip to main content
      </a>
      <Header />
      <Suspense fallback={<main id="main-content" className="min-h-[60vh] flex items-center justify-center" role="main"><p className="text-xl">Loading…</p></main>}>
        <ProtectedRoute>
          <main id="main-content" className="min-h-[60vh]" role="main">
            {children}
          </main>
        </ProtectedRoute>
      </Suspense>
      <Footer />
      <NeedHelpButton />
    </>
  );
}
