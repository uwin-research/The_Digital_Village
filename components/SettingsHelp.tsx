"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function SettingsHelp() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border-2 border-black bg-white" aria-labelledby="settings-help-heading">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full min-h-[48px] items-center justify-between px-4 py-3 text-left font-medium text-black hover:bg-[#e8e8e8] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-inset"
        aria-expanded={open}
        aria-controls="settings-help-content"
        id="settings-help-heading"
      >
        Can&apos;t find Settings?
        {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      <div
        id="settings-help-content"
        className={`border-t-2 border-black px-4 py-3 ${open ? "block" : "hidden"}`}
      >
        <div className="space-y-4 text-base text-black">
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
