import type { ModuleSection } from "@/lib/modules";

export function stripSectionNumberPrefix(title: string): string {
  return title.replace(/^Section\s+\d+:\s*/i, "").trim() || title.trim();
}

/** Explains menu trails like "Settings → Display" */
export const PATH_NOTATION_TIP =
  "A line that starts with “Path:” is a menu trail. Tap each part in order on your phone—like following signs in a building. If a name looks a little different on your device, use search from your home screen and type the last word you recognise (often “Settings”).";

export function sectionMentionsSettingsOrPath(section: ModuleSection): boolean {
  const blob = [
    section.title,
    ...section.blocks.filter((b): b is { type: "text"; text: string } => b.type === "text").map((b) => b.text),
  ]
    .join(" ")
    .toLowerCase();
  return blob.includes("settings") || blob.includes("path:");
}

/**
 * Friendly overview for the expandable bulb beside each section title.
 * Index aligns with `module.sections` order.
 */
export const SECTION_OVERVIEW_TIPS: Partial<Record<string, string[]>> = {
  "getting-comfortable": [
    "This part is about making text and brightness comfortable so you are not straining your eyes. Small changes in Display settings can make a big difference.",
    "Here you practice simple moves—tap, swipe, and press-and-hold—so moving around the screen feels predictable, not scary.",
    "Everyone taps the wrong thing sometimes. This section is your “escape plan”: Back, Home, and restarting when the screen freezes.",
    "A short story moment with Arthur: see how larger type and Dark Mode can make reading messages from family easier.",
  ],
  "first-line-of-defence": [
    "Why a screen lock matters for photos, messages, and banking—and how it buys you time if your phone is out of your hands.",
    "PIN, pattern, password, or biometrics: a simple comparison with a house analogy so you can pick a lock style that feels right for you.",
    "A guided passcode task with clear steps. Work slowly; you can pause and come back. The video and slides repeat the same path if you need them.",
    "If your phone is missing, here is a calm checklist: who to call, what to change first, and how to protect accounts.",
    "Find My and similar tools help a trusted person help you—this section explains the idea without rushing you to turn everything on at once.",
  ],
  "passwords-logging-in": [
    "Weak versus strong passwords in everyday words—length and predictable patterns matter more than “fancy symbols” alone.",
    "The passphrase trick: a few memorable picture-words can be easier to remember than a short jumble—and harder for others to guess.",
    "Your email is the master key to resets. This section explains why its password deserves extra care.",
    "Password managers are like a locked notebook that fills in long passwords for you. This part sets expectations before any setup.",
    "A walkthrough idea for saving a site in your phone’s password vault—go at your own pace and skip anything that does not match your device.",
    "Autofill, alerts, and backups: how the phone can quietly help Sam day to day once the basics are in place.",
  ],
  "two-factor-auth": [
    "Two-factor authentication means a stranger needs more than your password—they also need something on your device or account. This section uses the “two keys” idea.",
    "A step-by-step style path for turning on 2FA for an important account. Pause the video anytime and replay a single step.",
    "Trusted devices, public computers, and filling codes from messages—practical habits so 2FA does not feel like a chore every day.",
    "Backup codes, “too many login requests,” and authenticator apps: how to stay calm and stay in control.",
  ],
  "app-permissions": [
    "Think of permissions as keys you lend to guests in your home—this section names the common ones in plain language.",
    "The “least access” idea: only give an app what it truly needs for the job you downloaded it for.",
    "Taking a permission back from Settings when you change your mind—same idea on many phones even if menus look slightly different.",
    "Before you install: green flags (good developer, lots of reviews) and red flags (odd spelling, blurry icon).",
    "Three quick questions to ask yourself before you tap Allow—no wrong answers, just slowing down on purpose.",
  ],
};

export function getSectionOverviewTip(
  slug: string,
  sectionIdx: number,
  moduleTip: string | undefined,
  section: ModuleSection
): string {
  const list = SECTION_OVERVIEW_TIPS[slug];
  const base =
    list?.[sectionIdx] ??
    `This section covers: ${section.title.replace(/^Section\s+\d+:\s*/i, "").trim()}. Go at your own pace—you can reread any paragraph.`;

  if (sectionIdx === 0 && moduleTip?.trim()) {
    return `${base}\n\nLesson tip: ${moduleTip.trim()}`;
  }
  return base;
}

/** Step-only lessons + scams: one line per “chunk” */
export const STEP_OR_ACTIVITY_TIPS: Partial<Record<string, string[]>> = {
  "software-updates": [
    "Updates patch security holes—like fixing a loose latch. They are normal and worth doing when you feel ready.",
    "Checking for updates usually lives under Software Update in Settings. Wi‑Fi and charging are gentler on the phone for big downloads.",
    "Automatic updates let the phone handle patches overnight so you do not have to remember every time.",
    "A light monthly routine: updates, one unused app removed, and a quick check that backup still ran.",
    "This quick check-in is only for reflection—no wrong answer. If you have not installed yet, try again when you are on Wi-Fi and charging.",
  ],
  "public-wifi-browsing": [
    "Public Wi‑Fi is handy for news or maps, but treat it like a busy park—fine for browsing, not ideal for banking or health portals.",
    "Https and the padlock mean your conversation with that website is encrypted—look before you type passwords.",
    "A VPN is an optional extra “tunnel” for privacy on public networks—helpful for some people, not required for everyone.",
  ],
  "caches-cookies-clutter": [
    "The cache stores bits of sites so pages load faster; clearing it occasionally can help when things feel sluggish.",
    "Cookies and history leave footprints in your browser; clearing them is a fresh start on this device (your provider still sees connection).",
    "Private or incognito mode hides history from others who use the same device—it does not make you invisible online.",
  ],
  "scams-phishing": [
    "Compare the two messages calmly. Real reminders usually sound specific; scams often rush you or hide who they really are.",
    "Look at links, names, and tone side by side. There is no prize for answering quickly—read twice if you like.",
    "After you choose, read why one message is risky and what safe next steps look like. You can change your mind and reread any time.",
  ],
};

export function getStepOrActivityTip(slug: string, index: number): string {
  const list = STEP_OR_ACTIVITY_TIPS[slug];
  return (
    list?.[index] ??
    "Take this part at your own pace. If a word sounds technical, use the light bulb next to it when you need a plain-language reminder."
  );
}
