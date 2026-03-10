"use client";

import { HelpCircle } from "lucide-react";
import Link from "next/link";

export function NeedHelpButton() {
  return (
    <Link
      href="/help"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-lg border-2 border-black bg-[#FFD700] px-6 py-4 text-lg font-semibold text-black shadow-lg hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
      aria-label="Need help? Go to help page"
    >
      <HelpCircle className="h-6 w-6" aria-hidden />
      <span>Need help?</span>
    </Link>
  );
}
