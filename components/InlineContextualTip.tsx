"use client";

import { Lightbulb, X } from "lucide-react";
import type { ReactNode } from "react";

export function SettingsFinderHelp() {
  return (
    <div className="mt-4 space-y-4 border-t border-black/20 pt-4 text-base text-black">
      <p className="font-semibold text-[#000080]">Can&apos;t find Settings?</p>
      <div>
        <p className="font-medium">iPhone</p>
        <ul className="mt-1 list-inside list-disc space-y-1">
          <li>Swipe down from the middle of the Home Screen to search.</li>
          <li>Type: Settings.</li>
          <li>If you don&apos;t see it, swipe right to open the App Library, then search.</li>
        </ul>
      </div>
      <div>
        <p className="font-medium">Android</p>
        <ul className="mt-1 list-inside list-disc space-y-1">
          <li>Swipe down and tap the gear icon (Settings), or use the search bar and type Settings.</li>
        </ul>
      </div>
    </div>
  );
}

function TipCloseButton({ label, onClose }: { label: string; onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-2 top-2 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border-2 border-black bg-[#f5f5f5] px-2 py-1.5 text-black hover:bg-[#e8e8e8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#000080]"
      aria-label={label}
    >
      <X className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
      <span className="pr-0.5 text-sm font-semibold">Close</span>
    </button>
  );
}

type SectionHeadingWithTipProps = {
  tipId: string;
  openTipId: string | null;
  setOpenTipId: (id: string | null) => void;
  title: string;
  contextLabel: string;
  headingClassName: string;
  showSettingsFinder: boolean;
  children: ReactNode;
};

/** Section title on the left, contextual bulb top-right on the same row */
export function SectionHeadingWithContextTip({
  tipId,
  openTipId,
  setOpenTipId,
  title,
  contextLabel,
  headingClassName,
  showSettingsFinder,
  children,
}: SectionHeadingWithTipProps) {
  const open = openTipId === tipId;
  const panelId = `context-tip-${tipId}`;

  return (
    <div className="not-prose mb-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className={`${headingClassName} min-w-0 flex-1 pr-2`}>{title}</h2>
        <button
          type="button"
          onClick={() => setOpenTipId(open ? null : tipId)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`Tips for this section: ${contextLabel}`}
          className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-[#b8860b] bg-[#fff8e7] px-3 py-2 text-[#7a5200] shadow-sm hover:bg-[#fff0cc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#000080] focus-visible:ring-offset-2"
        >
          <Lightbulb className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          <span className="max-w-[5.5rem] text-left text-xs font-bold leading-tight sm:max-w-none sm:text-sm">
            Tips
          </span>
        </button>
      </div>
      {open ? (
        <div
          id={panelId}
          role="region"
          className="relative mt-3 rounded-xl border-2 border-black bg-white p-4 pr-28 text-left shadow-md sm:pr-32"
        >
          <TipCloseButton label={`Close help: ${contextLabel}`} onClose={() => setOpenTipId(null)} />
          <div className="text-base leading-relaxed text-black">
            {children}
            {showSettingsFinder ? <SettingsFinderHelp /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Compact bulb + panel for step lines, quiz intro, etc. */
export function RowWithContextTip({
  tipId,
  openTipId,
  setOpenTipId,
  contextLabel,
  showSettingsFinder,
  children,
  panelBody,
}: {
  tipId: string;
  openTipId: string | null;
  setOpenTipId: (id: string | null) => void;
  contextLabel: string;
  showSettingsFinder?: boolean;
  children: ReactNode;
  panelBody: ReactNode;
}) {
  const open = openTipId === tipId;
  const panelId = `context-tip-${tipId}`;

  return (
    <div className="not-prose w-full space-y-2">
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <div className="min-w-0 max-w-full flex-1">{children}</div>
        <button
          type="button"
          onClick={() => setOpenTipId(open ? null : tipId)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`Tips: ${contextLabel}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-[#b8860b] bg-[#fff8e7] px-3 py-2 text-[#7a5200] shadow-sm hover:bg-[#fff0cc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#000080] focus-visible:ring-offset-2"
        >
          <Lightbulb className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          <span className="max-w-[5.5rem] text-left text-xs font-bold leading-tight sm:max-w-none sm:text-sm">Tips</span>
        </button>
      </div>
      {open ? (
        <div
          id={panelId}
          role="region"
          className="relative rounded-xl border-2 border-black bg-white p-4 pr-28 shadow-md sm:pr-32"
        >
          <TipCloseButton label={`Close help: ${contextLabel}`} onClose={() => setOpenTipId(null)} />
          <div className="text-base leading-relaxed text-black">
            {panelBody}
            {showSettingsFinder ? <SettingsFinderHelp /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
