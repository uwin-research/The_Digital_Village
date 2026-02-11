"use client";

import { HelpCircle } from "lucide-react";
import Link from "next/link";

export function NeedHelpButton() {
  return (
    <Link
      href="/help"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-lg font-semibold text-amber-950 shadow-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
      aria-label="Need help? Go to help page"
    >
      <HelpCircle className="h-6 w-6" aria-hidden />
      <span>Need help?</span>
    </Link>
  );
}
