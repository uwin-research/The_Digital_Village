export interface ModuleStep {
  id: string;
  text: string;
}

export interface ModuleData {
  slug: string;
  title: string;
  scenario?: string;
  steps: ModuleStep[];
  tip?: string;
  reassurance?: string;
  safetyCallout?: string;
  examples?: string;
  estimatedMinutes: number;
  afterCheckQuestion?: string;
  hasInteractiveMessage?: boolean;
}

export const MODULES: ModuleData[] = [
  {
    slug: "screen-lock",
    title: "Screen Lock Check",
    scenario: "Imagine your phone is misplaced in public.",
    estimatedMinutes: 3,
    steps: [
      { id: "1", text: "Turn the screen off." },
      { id: "2", text: "Turn it on again." },
      { id: "3", text: "Do you see a request for a PIN/passcode or biometric (fingerprint/face)?" },
      { id: "4", text: "If screen lock is OFF: Turn it ON and set a PIN/passcode." },
      { id: "5", text: "If screen lock is already ON: Find where to change your PIN/passcode (or strengthen it)." },
    ],
    tip: "Choose a PIN you can remember but others can't guess. Avoid 0000, 1234, or your birthday.",
  },
  {
    slug: "biometrics",
    title: "Biometrics Setup",
    estimatedMinutes: 4,
    steps: [
      { id: "1", text: "Open your phone's security settings." },
      { id: "2", text: "Turn on Fingerprint or Face recognition." },
      { id: "3", text: "If you already use it: add another fingerprint OR reset/re-set face data." },
      { id: "4", text: "Confirm your PIN/passcode stays enabled as a backup." },
    ],
    reassurance: "Biometrics are convenient, but your PIN is still important.",
  },
  {
    slug: "app-permissions",
    title: "App Permissions Check (Non-banking app)",
    estimatedMinutes: 4,
    steps: [
      { id: "1", text: "Pick one common app you use often (not a banking app)." },
      { id: "2", text: "Open the app's permissions." },
      { id: "3", text: "Review what it can access (example: location, microphone, camera)." },
      { id: "4", text: "Turn OFF one permission you don't need." },
    ],
    examples: "If a flashlight app asks for your microphone, that's unusual.",
    safetyCallout: "You can turn permissions back on later if something stops working.",
  },
  {
    slug: "updates",
    title: "Software Update Check",
    estimatedMinutes: 5,
    steps: [
      { id: "1", text: "Open Software Update / System Update." },
      { id: "2", text: "Check if your phone is up to date." },
      { id: "3", text: "If an update is available: install it when you are on Wi-Fi and charging." },
    ],
    afterCheckQuestion: "Did you update your phone after checking?",
  },
  {
    slug: "security-apps",
    title: "Locate Security Apps (Don't Install)",
    estimatedMinutes: 4,
    steps: [
      { id: "1", text: "Open the app store on your phone (App Store / Play Store)." },
      { id: "2", text: "Search for 'mobile security' or 'phone security' and open ONE result (do not install)." },
      { id: "3", text: "Then search for 'password manager' and open ONE result (do not install)." },
      { id: "4", text: "Check: star rating, number of reviews, developer name, and privacy policy link." },
    ],
    tip: "Today you are only locating apps, not installing. If you want help choosing later, ask a trusted person.",
  },
  {
    slug: "suspicious-messages",
    title: "Suspicious Message Recognition",
    estimatedMinutes: 5,
    steps: [],
    hasInteractiveMessage: true,
  },
];

export function getModuleBySlug(slug: string): ModuleData | undefined {
  return MODULES.find((m) => m.slug === slug);
}
