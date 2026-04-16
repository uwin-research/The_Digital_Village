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
      { id: "5", text: "The Safety Nap (Auto-Lock): Set Auto-Lock to 30 Seconds or 1 Minute so your phone protects itself when you forget." },
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
              type: "image",
              description:
                "Illustration titled Digital and Physical Security: physical lock on a door, Elena using her phone in the kitchen, and digital lock with bank card and fingerprint on a smartphone.",
              src: "/module-2-digital-physical-security.jpg",
              alt: "Digital and Physical Security illustration: physical lock and keys, Elena smiling at her phone, and a phone screen showing bank security and fingerprint unlock.",
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
            text: "For Elena, setting a passcode is like locking the front door of her home. It gives her peace of mind that if her phone is lost or left behind, her private information stays protected.",
          },
          {
            type: "text",
            text: "Path: Settings → Face ID & Passcode → Turn Passcode On",
          },
          {
            type: "text",
            text: "Open Settings: Open the Settings app on your device.",
          },
          {
            type: "text",
            text: "Go to Face ID & Passcode: Scroll down and tap Face ID & Passcode.",
          },
          {
            type: "text",
            text: "Turn Passcode On: Tap on Turn Passcode On to begin setting up your passcode.",
          },
          {
            type: "text",
            text: "Create a Passcode: Enter a 6-digit passcode of your choice when prompted.",
          },
          {
            type: "text",
            text: "Tip: Avoid easy ones like 000000, 123456, or your birth year.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "",
              label: "Video Guide: Set Your Passcode",
              alt: "Video guide showing how to set up an iPhone passcode.",
              src: "/module-2-passcode-guide.mp4",
            },
          },
        ],
      },
      {
        title: "Section 4: Biometrics: The Magic Touch",
        blocks: [
          {
            type: "text",
            text: "For Elena, biometrics are the magic touch: her phone can recognize her face or fingerprint so she can unlock it quickly and safely.",
          },
          {
            type: "text",
            text: "Path: Settings → Face ID & Passcode → Reset Face ID → Set up Face ID",
          },
          {
            type: "text",
            text: "Open Settings: Open the Settings app on your device.",
          },
          {
            type: "text",
            text: "Go to Face ID & Passcode: Scroll down and tap Face ID & Passcode.",
          },
          {
            type: "text",
            text: "Reset Face ID: Tap Reset Face ID, then select Set Up Face ID.",
          },
          {
            type: "text",
            text: "Follow the On-Screen Instructions: Follow the instructions on the screen to scan your face and complete the setup.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "Video guide showing the Face ID setup steps.",
              label: "Video Guide: Face ID Circle Movement",
              alt: "Video guide showing how to set up Face ID on an iPhone.",
              src: "/module-2-face-id-guide.mp4",
            },
          },
        ],
      },
      {
        title: "Section 5: The Safety Nap (Auto-Lock)",
        blocks: [
          {
            type: "text",
            text: "For Elena, Auto-Lock is like a safety nap for her phone. Even if she forgets to lock it herself, the phone protects her private information after a short time.",
          },
          {
            type: "text",
            text: "Path: Settings → Display & Brightness → Auto-Lock",
          },
          {
            type: "text",
            text: "Open Display & Brightness Settings: Go to Settings, then tap Display & Brightness.",
          },
          {
            type: "text",
            text: "Open Auto-Lock Settings: Tap on Auto-Lock.",
          },
          {
            type: "text",
            text: "Choose Auto-Lock Time: Select 30 Seconds or 1 Minute as your preferred screen lock time.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "Video guide showing how to set Auto-Lock on an iPhone.",
              label: "Video Guide: Set Auto-Lock",
              alt: "Video guide showing the Auto-Lock settings steps on an iPhone.",
              src: "/module-2-auto-lock-guide.mp4",
            },
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
      { id: "5", text: "Adding a Password to Your Digital Vault: Manually save a website, username, and strong passphrase inside your iPhone password vault." },
      { id: "6", text: "Why This is Better for Sam: See how Autofill, security alerts, and iCloud backups make password safety easier." },
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
              type: "image",
              description: "Illustration showing Sam picturing Bicycle, Apple, Garden, and 26 to remember a passphrase.",
              label: "Think in Pictures, Not Codes",
              src: "/module-3-passphrase-visual.png",
              alt: "Sam imagining bicycle, apple, garden, and the number 26 as a memorable passphrase.",
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
        title: "Section 5: Adding a Password to Your Digital Vault",
        blocks: [
          {
            type: "text",
            text: "While your iPhone often asks to save passwords automatically, Sam can also add them manually to keep his Digital Notebook organized.",
          },
          {
            type: "text",
            text: "Open the Vault: Go to your Home Screen and tap the Settings app (the grey gear icon).",
          },
          {
            type: "text",
            text: "Enter Passwords: Scroll down and tap on Passwords.",
          },
          {
            type: "text",
            text: "Prove It's You: Use your Face ID, Touch ID, or Passcode to open the vault.",
          },
          {
            type: "text",
            text: "Add New: Look for the Plus Sign (+) in the top right corner of the screen and tap it.",
          },
          {
            type: "text",
            text: "Website: Type the name of the site (e.g., facebook.com or library.org).",
          },
          {
            type: "text",
            text: "User Name: Type the email or name you use to log in.",
          },
          {
            type: "text",
            text: "Password: Type in your new, strong Passphrase.",
          },
          {
            type: "text",
            text: "Save: Tap Done in the top right corner.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "A screen recording of a hand slowly tapping the plus icon and typing a passphrase. The video pauses for 2 seconds after Done is tapped to show the password appearing in the list.",
              label: "Video Guide: Add a Password Manually",
            },
          },
        ],
      },
      {
        title: "Section 6: Why This is Better for Sam",
        blocks: [
          {
            type: "text",
            text: "No More Forgetting: Once Sam saves a password here, his iPhone will offer to type it in for him next time he visits that website.",
          },
          {
            type: "text",
            text: "Security Alerts: If Sam reuses the same password on two different sites, the iPhone will show a small Security Recommendation warning him to change one of them to a unique passphrase.",
          },
          {
            type: "text",
            text: "Safe Backups: These passwords are saved to Sam's private iCloud, meaning if he ever gets a new phone, all his passwords will automatically move over with him.",
          },
          {
            type: "text",
            text: "Definition: Autofill: When your phone recognizes a website and offers to type your password for you so you do not have to remember it.",
          },
          {
            type: "media",
            slot: {
              type: "image",
              description: "A Before and After infographic. Left side: a messy desk with sticky notes labeled Bank Password and Email Code. Right side: Sam smiling and holding a single iPhone that says All Passwords Secured.",
              label: "Before and After: All Passwords Secured",
            },
          },
        ],
      },
    ],
    tip: "Never share passwords with anyone—not even someone who says they're from tech support.",
  },
  {
    slug: "two-factor-auth",
    title: "Two-Factor Authentication (2FA)",
    scenario: "Sam now has strong passphrases, but he still worries: What if a clever thief guesses my password anyway? We explain to Sam that 2FA is like a high-security apartment building. Even if a stranger steals your front door key (your password), they still cannot get past the security guard in the lobby (the 2FA code on your phone).",
    estimatedMinutes: 16,
    steps: [
      { id: "1", text: "What is 2FA?: Learn the Two-Key Rule: something you know and something you have." },
      { id: "2", text: "Task: Turning on 2FA for your Apple ID: Turn on two-factor authentication and confirm your phone number for security codes." },
      { id: "3", text: "Integrating 2FA into Your Daily Life: Trusted devices, staying safe on public computers, and automatic code filling from Messages." },
      { id: "4", text: "Best Practices for 2FA Management: Backup codes, MFA fatigue, and keeping authenticator apps backed up." },
    ],
    sections: [
      {
        title: "Section 1: What is 2FA? (The Two-Key Rule)",
        blocks: [
          {
            type: "text",
            text: "Two-Factor Authentication (2FA) is a safety check that requires two different pieces of evidence to prove it is really you.",
          },
          {
            type: "text",
            text: "Factor 1: Something you KNOW. This is your secret password or passphrase.",
          },
          {
            type: "text",
            text: "Factor 2: Something you HAVE. This is your physical iPhone, which receives a unique, one-time code.",
          },
          {
            type: "media",
            slot: {
              type: "image",
              description:
                "Illustration titled Two-Factor Authentication: laptop with email and password, plus phone with authenticator code, equals unlocked access with treasure chest and sign-in.",
              label: "Two-Factor Authentication",
              src: "/module-3-two-factor-authentication.jpg",
              alt: "Three steps: password on laptop, authenticator code on phone, successful sign-in with treasure chest.",
            },
          },
        ],
      },
      {
        title: "Section 2: Task: Turning on 2FA for your Apple ID",
        blocks: [
          {
            type: "text",
            text: "Since Sam's iPhone holds his family photos and banking details, securing his Apple ID is his top priority.",
          },
          {
            type: "text",
            text: "Path: Settings → [Your Name] → Sign-In & Security → Two-Factor Authentication",
          },
          {
            type: "text",
            text: "Open Settings: Go to the Settings app on your iPhone.",
          },
          {
            type: "text",
            text: "Access Your Apple Account: Tap your name at the top, then select Sign-In & Security.",
          },
          {
            type: "text",
            text: "Turn On Two-Factor Authentication: Tap Two-Factor Authentication.",
          },
          {
            type: "text",
            text: "Add a Trusted Phone Number: Enter a trusted phone number where you will receive verification codes, then tap Next.",
          },
          {
            type: "text",
            text: "Receive Verification Code: A verification code will be sent to your trusted phone number.",
          },
          {
            type: "text",
            text: "Enter the Verification Code: Enter the code on your iPhone to verify.",
          },
          {
            type: "text",
            text: "Setup Complete: Two-factor authentication is now turned on, and your iPhone is set as a trusted device.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "A slow-paced screen recording of an iPhone. A finger taps the name at the top, selects Sign-In & Security, and toggles Two-Factor Authentication to On. A 1.5-second pause shows the 6-digit code arriving as a notification.",
              label: "Video Guide: Turn On 2FA for Apple ID",
              alt: "Video guide showing how to turn on two-factor authentication for Apple ID on an iPhone.",
            },
          },
        ],
      },
      {
        title: "Section 3: Integrating 2FA into Your Daily Life",
        blocks: [
          {
            type: "text",
            text: "Sam might worry that he has to type a code every single time he looks at his email. Thankfully, your iPhone is smart enough to know when it's really you.",
          },
          {
            type: "text",
            text: "Trusted Devices: The \"I Know You\" Rule: When Sam logs into a website (like his bank) on his own home computer, the site will often ask: \"Trust this browser?\".",
          },
          {
            type: "text",
            text: "If Sam clicks \"Yes\": The website will remember his computer. He won't have to enter a 2FA code again on that specific computer for a long time.",
          },
          {
            type: "text",
            text: "Safety Tip: Sam should never click \"Trust\" on a public computer, like the ones at the library.",
          },
          {
            type: "text",
            text: "Automatic Code Filling: Sam doesn't always have to memorize the 6-digit code. His iPhone can \"read\" the code from a text message and suggest it right above the keyboard.",
          },
          {
            type: "text",
            text: "How it works: When the box for the code appears, Sam will see a button that says \"From Messages: ######\". He just taps that button, and the iPhone types the code for him.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description:
                "A screen recording of a login page asking for a 2FA code. A text message arrives at the top of the screen. Above the iPhone keyboard, a grey box appears with the code. The finger taps the box, and the numbers automatically fill into the website.",
              label: "Video Guide: Automatic 2FA Code from Messages",
              alt: "Video guide showing 2FA code suggested above the keyboard from Messages and filling the login field.",
            },
          },
        ],
      },
      {
        title: "Section 4: Best Practices for 2FA Management",
        blocks: [
          {
            type: "text",
            text: "To keep Sam's \"Second Lock\" working perfectly, he should follow these three golden rules:",
          },
          {
            type: "text",
            text: "Guard Your \"Emergency Keys\" (Backup Codes): When Sam sets up 2FA for an account, the website will often show a list of 10-digit backup codes.",
          },
          {
            type: "text",
            text: "Sam's Task: He should print these out and put them in a physical safe or a locked drawer in his desk.",
          },
          {
            type: "text",
            text: "Why?: If Sam's phone is lost or broken, these codes are the only way to get back into his accounts without a long, difficult recovery process.",
          },
          {
            type: "text",
            text: "Beware of \"MFA Fatigue\" (The Spam Trick): Sometimes, a hacker who has Sam's password will try to \"wear him down\" by sending dozens of 2FA requests to his phone in a row.",
          },
          {
            type: "text",
            text: "The Rule: If Sam's phone starts buzzing with \"Sign-In Requested\" and he is not trying to log in, he must tap \"Don't Allow\" every single time.",
          },
          {
            type: "text",
            text: "Don't get tired: Hackers hope you will get annoyed and just hit \"Allow\" to make the buzzing stop. Stay firm!",
          },
          {
            type: "text",
            text: "Backup Your \"Keymaker\" (Authenticator Apps): If Sam decides to use an app like Authy or Google Authenticator instead of text messages, he must ensure the app itself is backed up.",
          },
          {
            type: "text",
            text: "The Step: Inside the app settings, Sam should look for \"Backup Password\" or \"Cloud Sync\". This ensures that if he gets a new phone, his \"Second Keys\" move with him.",
          },
        ],
      },
    ],
    reassurance: "Backup codes are your safety net. Keep them somewhere safe and you won't get locked out.",
  },
  {
    slug: "app-permissions",
    title: "App Permissions & Safety",
    scenario:
      "Setting Boundaries for Your Digital Guests. The Elena Story: Elena downloaded a new Weather App to plan her garden. Suddenly, a box popped up asking for permission to see her Photos and Contacts. Elena thought, \"Why does a weather app need to see my grandkids' pictures?\" This module teaches Elena how to say No to nosy apps.",
    estimatedMinutes: 22,
    steps: [
      { id: "1", text: "What are App Permissions?: Your phone is like your home; apps are guests. Learn the key permissions—including Background App Refresh—and when each makes sense." },
      { id: "2", text: "The Rule of Least Access: Only give an app the bare minimum. If a request feels nosy, tap Don't Allow." },
      { id: "3", text: "Task: How to Take Back a Key (iPhone): Use Settings → Privacy & Security to review and turn off permissions app by app." },
      { id: "4", text: "App Download Safety: Check the developer, review counts, and red flags before you tap Get in the App Store." },
      { id: "5", text: "The Permission Request Checklist: Three questions to ask before you tap Allow on any new app." },
    ],
    sections: [
      {
        title: "Section 1: What are App Permissions?",
        blocks: [
          {
            type: "text",
            text: "Think of your phone as your home. Apps are like guests. Some guests only need to stay in the hallway (Notifications), while others might ask to enter your office (Files) or your backyard (Location). Permissions are the keys you give them.",
          },
          {
            type: "text",
            text: "The Key Permissions Explained",
          },
          {
            type: "text",
            text: "Location: Tells the app where you are. Essential for Maps, but a \"Calculator\" doesn't need it.",
          },
          {
            type: "text",
            text: "Camera: Lets the app take photos. Needed for video calls, but suspicious for a \"Battery Saver\" app.",
          },
          {
            type: "text",
            text: "Microphone: Lets the app hear you. Necessary for recording a memo, but shouldn't be \"on\" for a simple game.",
          },
          {
            type: "text",
            text: "Contacts: Gives the app your friends' phone numbers. Be careful—some apps use this to send spam.",
          },
          {
            type: "text",
            text: "Storage/Photos: Lets an app see your saved pictures. Only give this to apps you trust to handle your memories.",
          },
          {
            type: "text",
            text: "Notifications: Lets the app \"beep\" or \"buzz\" to get your attention. Turn this off if an app is too noisy.",
          },
          {
            type: "text",
            text: "Background App Refresh: This allows apps to check for new information (like weather updates or new emails) even when you aren't using them.",
          },
          {
            type: "media",
            slot: {
              type: "image",
              description:
                "Hand-drawn iPhone Settings screen for Weather App: Allow Weather App to Access lists Location (While Using), Siri & Search, Notifications, Background App Refresh, and Cellular Data with toggles.",
              label: "Weather App permissions in Settings",
              src: "/module-4-weather-app-permissions.png",
              alt: "Illustration of an iPhone showing Weather App permission settings including Location, Siri & Search, Notifications, Background App Refresh, and Cellular Data.",
            },
          },
        ],
      },
      {
        title: "Section 2: The Rule of Least Access",
        blocks: [
          {
            type: "text",
            text: "Elena's Golden Rule: Only give an app the bare minimum it needs to do its job.",
          },
          {
            type: "text",
            text: "Example: A Pizza app needs your Location to deliver food, but it does not need your Camera.",
          },
          {
            type: "text",
            text: "Elena's Action: If a request feels nosy, tap Don't Allow. If the app truly needs it to work, it will ask you again later with an explanation.",
          },
        ],
      },
      {
        title: "Section 3: Task: How to Take Back a \"Key\" (iPhone)",
        blocks: [
          {
            type: "text",
            text: "If Elena gave an app permission by mistake, she can evict that app from her private data at any time.",
          },
          {
            type: "text",
            text: "Path: Settings → Privacy & Security → [choose a category, e.g. Microphone or Camera]",
          },
          {
            type: "text",
            text: "Open Settings: Tap the grey Settings (gear) icon.",
          },
          {
            type: "text",
            text: "Privacy & Security: Scroll down and tap Privacy & Security (look for the blue hand icon).",
          },
          {
            type: "text",
            text: "Choose a Room: Tap on a category, like Microphone or Camera.",
          },
          {
            type: "text",
            text: "Review the List: You will see every app that has permission to use that feature.",
          },
          {
            type: "text",
            text: "Turn it Off: Slide the green switch to grey for any app that doesn't belong there.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description:
                "A slow-paced screen recording of an iPhone. It follows the path: Settings > Privacy & Security > Microphone. It shows a list of apps, and a finger toggles Off a game that was using the mic. Text overlay: You are the boss of your data.",
              label: "Video Guide: Privacy & Security Permissions",
              alt: "Video guide showing iPhone Settings, Privacy & Security, and turning off microphone access for an app.",
            },
          },
        ],
      },
      {
        title: "Section 4: App Download Safety: Judging Before Installing",
        blocks: [
          {
            type: "text",
            text: "Before Elena taps Get in the App Store, she should look for these three Green Flags:",
          },
          {
            type: "text",
            text: "The Developer: Check if the name looks professional (for example, Google LLC or Microsoft).",
          },
          {
            type: "text",
            text: "Review Counts: Look for apps with thousands of reviews. If it only has two reviews and they look like bot talk, stay away.",
          },
          {
            type: "text",
            text: "Red Flags: Watch out for misspelled names (like Face-book with a dash) or blurry, low-quality icons.",
          },
        ],
      },
      {
        title: "Section 5: The Permission Request Checklist",
        blocks: [
          {
            type: "text",
            text: "Before Elena taps Allow on any new app, she should ask these three questions:",
          },
          {
            type: "text",
            text: "Does this app NEED this to work? (For example, does a flashlight need my contacts? No.)",
          },
          {
            type: "text",
            text: "Am I okay with this company seeing this?",
          },
          {
            type: "text",
            text: "Can I choose Allow Once? (This gives the key for today only, and the door locks again tomorrow.)",
          },
        ],
      },
    ],
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
