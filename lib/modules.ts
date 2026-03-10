export interface ModuleStep {
  id: string;
  text: string;
}

export interface MediaSlotSlide {
  title: string;
  text: string;
}

export interface MediaSlot {
  type: "image" | "video" | "slideshow" | "infographic" | "animation";
  description: string;
  label?: string;
  src?: string;
  alt?: string;
  slides?: MediaSlotSlide[];
}

export interface ContentBlock {
  type: "text";
  text: string;
}

export interface MediaBlock {
  type: "media";
  slot: MediaSlot;
}

export type SectionBlock = ContentBlock | MediaBlock;

export interface ModuleSection {
  title: string;
  blocks: SectionBlock[];
  keyInfo?: string[];
}

export interface ModuleData {
  slug: string;
  title: string;
  scenario?: string;
  steps: ModuleStep[];
  sections?: ModuleSection[];
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
    slug: "getting-comfortable",
    title: "Getting Comfortable with Your Device",
    scenario: "Learn to make your device work for you—from reading text clearly to fixing mistakes without fear.",
    estimatedMinutes: 15,
    steps: [
      { id: "1", text: "Making the Screen Work for You: Adjust font size, dark mode, and brightness." },
      { id: "2", text: "Navigating Without Fear: Practice tap, swipe, and long-press gestures." },
      { id: "3", text: "What Happens If I Make a Mistake?: Use Back, Home, or restart." },
      { id: "4", text: "Arthur's Aha! Moment: Read comfortably with large text and Dark Mode." },
    ],
    sections: [
      {
        title: "Section 1: Making the Screen Work for You",
        blocks: [
          {
            type: "text",
            text: "Just like getting a new pair of glasses, your device can be adjusted to fit your vision perfectly. Let's look at how Arthur made his tablet readable again.",
          },
          {
            type: "text",
            text: "To change your text size, go to Settings > Display > Text Size. Use the slider at the bottom to find your comfort zone.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "",
              label: "Arthur's Tablet Text Size Walkthrough",
              alt: "Arthur's tablet text size walkthrough video.",
              src: "/arthur-tablet-text-solution.mp4",
            },
          },
        ],
      },
      {
        title: "Section 2: Navigating Without Fear",
        blocks: [
          {
            type: "text",
            text: "Your screen responds to your touch. There are three 'magic moves' you need to know to move around confidently.",
          },
          {
            type: "media",
            slot: {
              type: "slideshow",
              description: "Slideshow / Carousel",
              slides: [
                { title: "The Tap", text: "An illustration of a finger tapping an icon once. To open an app." },
                { title: "The Swipe", text: "An arrow showing a finger sliding across the glass. To turn the page." },
                { title: "The Long-Press", text: "A finger holding down until a menu pops up. For extra options." },
              ],
            },
          },
          {
            type: "text",
            text: "Don't be afraid to touch the screen! It is designed to be sturdy. Try swiping left and right on your home screen now.",
          },
        ],
      },
      {
        title: "Section 3: What Happens If I Make a Mistake?",
        blocks: [
          {
            type: "text",
            text: "The biggest secret in technology? Everyone makes mistakes. Here is your 'Escape Plan' for when you get stuck.",
          },
          {
            type: "media",
            slot: {
              type: "infographic",
              description: "A 'Safety Toolkit' graphic showing three icons: 1. The Back Arrow (<), 2. The Home Button/Bar, 3. The Power Button.",
            },
          },
          {
            type: "text",
            text: "If you click a link by accident or a weird window pops up, simply tap the Back Button or the Home Bar to return to safety. If the screen freezes, a simple 'Restart' is like a quick nap for your phone—it wakes up refreshed and ready to work.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "Live-action video of a hand demonstrating how to hold the side buttons to trigger the 'Power Off' slider.",
            },
          },
        ],
      },
      {
        title: "Section 4: Arthur's \"Aha!\" Moment",
        blocks: [
          {
            type: "text",
            text: "Arthur can now read his grandson's messages without a magnifying glass. By turning on Dark Mode and increasing the font, the tablet is no longer an enemy—it's a bridge to his family.",
          },
          {
            type: "media",
            slot: {
              type: "image",
              description: "A warm, high-quality photo of a senior smiling while looking at a tablet, clearly showing large, readable text on the screen.",
            },
          },
        ],
      },
    ],
    tip: "Take your time. You can always change settings back if something doesn't feel right.",
  },
  {
    slug: "first-line-of-defence",
    title: "Your First Line of Defence",
    scenario: "Elena, an active grandmother, once left her phone at a park while chasing her grandson. She was terrified that someone could see her private photos or access her banking. In this module, we turn Elena's phone into a digital vault so she can enjoy her day with peace of mind.",
    estimatedMinutes: 20,
    steps: [
      { id: "1", text: "Why Screen Lock is Your Best Friend: Learn how a screen lock protects your banking apps, private messages, and personal photos." },
      { id: "2", text: "Choosing Your Key: Compare PIN, Pattern, and Password lock types for security and convenience." },
      { id: "3", text: "Task: Setting Up Your Passcode (iPhone): Turn on a 6-digit passcode and avoid weak codes like 123456 or your birth year." },
      { id: "4", text: "Biometrics: The Magic Touch: Set up Face ID so your phone can recognize your face quickly and safely." },
      { id: "5", text: "Find My: The Emergency Plan: Turn on Find My so you can ring, lock, or erase your phone if it goes missing." },
      { id: "6", text: "The Safety Nap (Auto-Lock): Set Auto-Lock to 30 Seconds or 1 Minute so your phone protects itself when you forget." },
    ],
    sections: [
      {
        title: "Section 1: Why Screen Lock is Your Best Friend",
        blocks: [
          {
            type: "text",
            text: "A screen lock is the primary barrier between your private life and a stranger.",
          },
          {
            type: "text",
            text: "What is a screen lock?: A security feature that requires proof of identity before the device opens.",
          },
          {
            type: "text",
            text: "The house analogy: leaving a phone without a lock is like leaving your front door wide open.",
          },
          {
            type: "text",
            text: "What it protects: your banking apps, private messages, and personal photos.",
          },
          {
            type: "media",
            slot: {
              type: "animation",
              description: "A 10-second loop of a smartphone morphing into a heavy iron safe. A large padlock clicks shut on the screen. Text: 'Your Data is Locked.'",
              label: "Your Data is Locked",
            },
          },
        ],
      },
      {
        title: "Section 2: Choosing Your Key (Screen Lock Types)",
        blocks: [
          {
            type: "text",
            text: "Different locks offer different levels of security and convenience.",
          },
          {
            type: "text",
            text: "PIN: A secret 4 or 6-digit number.",
          },
          {
            type: "text",
            text: "Pattern: Connecting dots in a specific shape.",
          },
          {
            type: "text",
            text: "Password: A mix of letters and numbers.",
          },
        ],
      },
      {
        title: "Section 3: Task: Setting Up Your Passcode (iPhone)",
        blocks: [
          {
            type: "text",
            text: "Follow these steps to install your Digital Deadbolt.",
          },
          {
            type: "text",
            text: "Open Settings",
          },
          {
            type: "text",
            text: "Tap Face ID & Passcode / Touch ID & Passcode",
          },
          {
            type: "text",
            text: "Tap Turn Passcode On",
          },
          {
            type: "text",
            text: "Choose a 6-digit passcode",
          },
          {
            type: "text",
            text: "Tip: Avoid easy ones like 000000, 123456, or your birth year.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "Slow-motion screen recording of setting a Passcode on iPhone.",
              label: "Video Guide: Set Your Passcode",
            },
          },
        ],
      },
      {
        title: "Section 4: Biometrics: The Magic Touch",
        blocks: [
          {
            type: "text",
            text: "Biometrics use your unique body features, like your face or fingerprint, to unlock the phone instantly.",
          },
          {
            type: "text",
            text: "Open Settings",
          },
          {
            type: "text",
            text: "Tap Face ID & Passcode",
          },
          {
            type: "text",
            text: "Tap Reset Face ID > Set up",
          },
          {
            type: "text",
            text: "Follow the on-screen scan",
          },
          {
            type: "media",
            slot: {
              type: "animation",
              description: "Animation of the Face ID circle movement used during setup.",
              label: "Video Guide: Face ID Circle Movement",
            },
          },
        ],
      },
      {
        title: "Section 5: Find My: The Emergency Plan",
        blocks: [
          {
            type: "text",
            text: "If your phone is lost, you can find it using another computer or a friend's device.",
          },
          {
            type: "text",
            text: "Remote Lock: Locks your phone from a distance so no one can use it.",
          },
          {
            type: "text",
            text: "Remote Wipe: Deletes everything on the phone if it is stolen.",
          },
          {
            type: "text",
            text: "Play Sound: Makes the phone ring loudly, even if it's on silent.",
          },
          {
            type: "text",
            text: "Task: Activating Find My. Tap your Name at the top of Settings.",
          },
          {
            type: "text",
            text: "Tap Find My (the green radar icon).",
          },
          {
            type: "text",
            text: "Toggle Find My iPhone to On (Green).",
          },
          {
            type: "text",
            text: "Turn on Send Last Location.",
          },
          {
            type: "media",
            slot: {
              type: "image",
              description: "A large, clear illustration of a phone's location on a map with Lock and Erase buttons.",
              label: "Find My Map",
            },
          },
        ],
      },
      {
        title: "Section 6: The Safety Nap (Auto-Lock)",
        blocks: [
          {
            type: "text",
            text: "Ensure your phone locks itself if you forget to.",
          },
          {
            type: "text",
            text: "Go to Settings > Display & Brightness.",
          },
          {
            type: "text",
            text: "Tap Auto-Lock.",
          },
          {
            type: "text",
            text: "Select 30 Seconds or 1 Minute.",
          },
        ],
      },
    ],
    tip: "Set up screen lock today. It takes minutes and protects everything on your phone.",
  },
  {
    slug: "passwords-logging-in",
    title: "Passwords & Logging in Safely",
    scenario: "Sam is a retired teacher who loves researching history online. He uses the same password, his dog's name and 123, for everything: his email, his bank, and his library card. One day, Sam heard that if a hacker gets that one password, they can get into everything. Sam felt worried. 'How am I supposed to remember fifty different complicated passwords?' he asked.",
    estimatedMinutes: 18,
    steps: [
      { id: "1", text: "Weak vs. Strong Passwords: Learn what makes a password easy or hard for a stranger to guess." },
      { id: "2", text: "The Passphrase Method: Build a long, memorable password from a few picture words." },
      { id: "3", text: "Email: The Master Key to Your Castle: Protect your email first because password resets go there." },
      { id: "4", text: "Password Managers: Use a digital notebook to store and fill passwords for you." },
      { id: "5", text: "Task: Checking Your Password Strength: Test one of your current passwords and upgrade it into a passphrase." },
    ],
    sections: [
      {
        title: "Section 1: Weak vs. Strong Passwords",
        blocks: [
          {
            type: "text",
            text: "Think of a password like a physical lock on your door. A weak password is like a cheap lock that can be picked with a paperclip. A strong password is like a heavy-duty deadbolt.",
          },
          {
            type: "text",
            text: "What makes a password weak?: Using common words, your name, your pet's name, or simple sequences like 12345.",
          },
          {
            type: "text",
            text: "What makes a password strong?: Length is more important than complexity. A long sentence is harder for a computer to guess than a short, complicated word.",
          },
        ],
      },
      {
        title: "Section 2: The Passphrase Method: Sam's Secret Weapon",
        blocks: [
          {
            type: "text",
            text: "Instead of trying to remember S@m#1954!, Sam can use the Passphrase Method. This uses a string of random, memorable words.",
          },
          {
            type: "text",
            text: "How to build one: Pick 3 or 4 random words that paint a picture in your mind.",
          },
          {
            type: "text",
            text: "Example: Bicycle-Apple-Garden-26",
          },
          {
            type: "text",
            text: "Why it works: It's very long, which computers hate, but it's a story you can visualize, which humans love.",
          },
          {
            type: "media",
            slot: {
              type: "animation",
              description: "An animation of Sam thinking. Four bubbles appear over his head: a Bicycle, an Apple, a Garden, and the number 26. These icons merge together to form a long, strong password. Text overlay: 'Think in Pictures, Not Codes.'",
              label: "Think in Pictures, Not Codes",
            },
          },
        ],
      },
      {
        title: "Section 3: Email: The Master Key to Your Castle",
        blocks: [
          {
            type: "text",
            text: "Sam needs to understand that his email is his most important account.",
          },
          {
            type: "text",
            text: "Why?: If you forget a password for any other site, like Facebook or your bank, they send a reset link to your email.",
          },
          {
            type: "text",
            text: "The Risk: If a stranger gets into Sam's email, they can use those reset links to take over all his other accounts.",
          },
          {
            type: "text",
            text: "The Lesson: Sam's email password should be his strongest and most unique password of all.",
          },
          {
            type: "media",
            slot: {
              type: "image",
              description: "A master key diagram showing email as the key that unlocks many other accounts.",
              label: "Master Key Diagram",
            },
          },
        ],
      },
      {
        title: "Section 4: Password Managers: Your Digital Notebook",
        blocks: [
          {
            type: "text",
            text: "Sam asked, How do I keep track of all these? The answer is a Password Manager.",
          },
          {
            type: "text",
            text: "Definition: A secure, encrypted vault on your phone or computer that stores all your passwords for you.",
          },
          {
            type: "text",
            text: "How it helps: It remembers every password so Sam does not have to.",
          },
          {
            type: "text",
            text: "How it helps: It types them in for him automatically.",
          },
          {
            type: "text",
            text: "How it helps: Sam only has to remember one Master Password to open the vault.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "A 2-minute safe story video of Sam successfully using a Password Manager to log into his library account.",
              label: "Safe Story: Sam Uses a Password Manager",
            },
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "A video showing Sam's perspective. He goes to a login page. A small box pops up asking Use saved password? He taps Yes, and the long, complicated password fills in automatically. Sam smiles and taps Sign In.",
              label: "Video Walkthrough: Use Saved Password",
            },
          },
        ],
      },
      {
        title: "Section 5: Task: Checking Your Password Strength",
        blocks: [
          {
            type: "text",
            text: "The Test: Write down a password you currently use, but do not show anyone.",
          },
          {
            type: "text",
            text: "The Evaluation: Does it have at least 12 characters? Does it avoid your name or birth year?",
          },
          {
            type: "text",
            text: "The Upgrade: Practice turning that password into a passphrase using Sam's method above.",
          },
        ],
      },
    ],
    tip: "Never share passwords with anyone—not even someone who says they're from tech support.",
  },
  {
    slug: "two-factor-auth",
    title: "Two-Factor Authentication (2FA)",
    scenario: "Add a second lock to your accounts. A password is the key; 2FA is the deadbolt.",
    estimatedMinutes: 15,
    steps: [
      { id: "1", text: "What 2FA Is: When you log in, you need your password AND a code sent to your phone. It's like a double lock—a key plus a deadbolt." },
      { id: "2", text: "Types of 2FA: You can receive a code by text, use an app, or check email. Text is common; swipe down to read the code without leaving your app." },
      { id: "3", text: "Setting Up 2FA on Email: Open your email security settings. Click '2-Step Verification' and choose 'Text Message' as your backup." },
      { id: "4", text: "What To Do If Locked Out: Save backup codes when you set up 2FA. Print them and store them in a safe place—like a drawer at home." },
    ],
    reassurance: "Backup codes are your safety net. Keep them somewhere safe and you won't get locked out.",
  },
  {
    slug: "app-permissions",
    title: "App Permissions & Safety",
    scenario: "Not every app needs access to everything. Learn when to say Yes—and when to say No.",
    estimatedMinutes: 18,
    steps: [
      { id: "1", text: "What App Permissions Are: Apps ask for access to your camera, location, contacts. A flashlight app asking for your location? That's suspicious." },
      { id: "2", text: "The Six Key Permissions: Camera, Microphone, Location, Contacts, Photos, Notifications. A Map app needs Location? Yes. A game app needs Contacts? Usually no." },
      { id: "3", text: "The Rule of Least Access: Only give what's needed. Choose 'Only This Time' when possible—it keeps your privacy." },
      { id: "4", text: "App Store Red Flags: Look for verified apps (blue checkmark, millions of reviews). Avoid apps with no reviews, blurry icons, or comments like 'This is a scam!'" },
    ],
    examples: "If a flashlight app asks for your microphone, that's unusual.",
    safetyCallout: "You can turn permissions back on later if something stops working.",
  },
  {
    slug: "software-updates",
    title: "Software Updates & Habits",
    scenario: "Updates fix security holes—like fixing a broken window latch. A simple monthly routine keeps you safe.",
    estimatedMinutes: 12,
    steps: [
      { id: "1", text: "Why Updates Matter: Updates patch holes in your phone's code. They fix security problems and keep your device running smoothly." },
      { id: "2", text: "Checking for Updates: Open Settings > Software Update. Tap 'Check for Update.' If one is available, install when on Wi-Fi and charging." },
      { id: "3", text: "Enabling Automatic Updates: Turn on 'Install Automatically' so updates happen overnight. Your phone will update while you sleep." },
      { id: "4", text: "The Monthly Safety Checklist: Once a month: check for updates, delete one unused app, confirm your cloud backup worked." },
    ],
    afterCheckQuestion: "Did you check for updates and install any that were available?",
    tip: "Updates are free and important. Don't skip them.",
  },
  {
    slug: "scams-phishing",
    title: "Recognising Scams & Phishing",
    estimatedMinutes: 15,
    steps: [],
    hasInteractiveMessage: true,
  },
  {
    slug: "public-wifi-browsing",
    title: "Public Wi-Fi & Safe Browsing",
    scenario: "Public Wi-Fi is convenient but not always safe. Learn when to browse and when to wait.",
    estimatedMinutes: 12,
    steps: [
      { id: "1", text: "Public Wi-Fi Risks: In a library or café, Wi-Fi is 'open'—others could see what you do. Browsing news? Safe. Logging into your bank? Wait until you're home." },
      { id: "2", text: "Recognising Secure Websites: Look at the address bar. 'https://' and a padlock icon mean the site is secure. No padlock? Don't enter passwords." },
      { id: "3", text: "What a VPN Is: A VPN creates a private tunnel through public Wi-Fi. In a VPN app, tap Connect—the shield turns from grey to blue when active." },
    ],
    tip: "When in doubt, wait until you're on your home network.",
  },
  {
    slug: "caches-cookies-clutter",
    title: "Caches, Cookies & Digital Clutter",
    scenario: "Clear the digital clutter. Your cache is like a pantry—sometimes it needs a clean-out.",
    estimatedMinutes: 10,
    steps: [
      { id: "1", text: "What Is a Cache?: The cache stores things you use often so the phone loads faster. Over time it can slow things down. Clearing it helps." },
      { id: "2", text: "Cookies & History: Clear your browsing data to remove digital footprints. In your browser settings, select 'Cookies' and 'History' to delete." },
      { id: "3", text: "Private Browsing Mode: Incognito or Private mode means the browser won't remember where you went. But your internet provider still knows—use it for privacy from others on your device." },
    ],
    tip: "Clearing cache and cookies occasionally keeps your device running smoothly.",
  },
];

export function getModuleBySlug(slug: string): ModuleData | undefined {
  return MODULES.find((m) => m.slug === slug);
}
