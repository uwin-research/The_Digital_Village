"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function SettingsHelp() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/80" aria-labelledby="settings-help-heading">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset"
        aria-expanded={open}
        aria-controls="settings-help-content"
        id="settings-help-heading"
      >
        Can&apos;t find Settings?
        {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      <div
        id="settings-help-content"
        className={`border-t border-amber-200 px-4 py-3 ${open ? "block" : "hidden"}`}
      >
        <div className="space-y-4 text-base text-amber-900">
          <div>
            <p className="font-medium">iPhone:</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Swipe down from the middle of the Home Screen to search.</li>
              <li>Type: Settings.</li>
              <li>If you don&apos;t see it, swipe right to open the App Library, then search.</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Android:</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Swipe down and tap the gear icon (Settings), or use the search bar and type Settings.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
