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
      { id: "5", text: "Medical ID: Add emergency health details and trusted contacts that helpers can see without your passcode." },
      { id: "6", text: "Emergency SOS: Set up the fast-call shortcut so your phone can call for help quickly." },
      { id: "7", text: "How to Use Your Plan: Practice how to open Medical ID and trigger Emergency SOS before a real emergency." },
      { id: "8", text: "The Safety Nap (Auto-Lock): Set Auto-Lock to 30 Seconds or 1 Minute so your phone protects itself when you forget." },
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
              src: "/module-2-screen-lock-comparison.png",
              alt: "A comparison between a physical door lock and a phone screen lock, with Elena using her phone in the center.",
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
        title: "Section 5: Medical ID: Your Emergency Lifeline",
        blocks: [
          {
            type: "text",
            text: "Just like carrying a medical alert bracelet, your iPhone can store a Medical ID. This is a special profile that paramedics can see without needing your secret passcode.",
          },
          {
            type: "text",
            text: "Task: Creating Your Medical ID",
          },
          {
            type: "text",
            text: "Find the Heart: Open the Health app (it has a white icon with a small red heart).",
          },
          {
            type: "text",
            text: "Open Your Profile: Tap your picture or initials in the top-right corner.",
          },
          {
            type: "text",
            text: "Medical ID: Tap Medical ID, then tap Edit or Get Started.",
          },
          {
            type: "text",
            text: "Fill in the Blanks: Enter your allergies, medications, and blood type.",
          },
          {
            type: "text",
            text: "The Lifeline: Scroll to Emergency Contacts. Tap the plus sign (+) and select your daughter or a trusted friend.",
          },
          {
            type: "text",
            text: "The Secret Switch: Make sure Show When Locked is turned On (Green). This is what allows help to find your info in an emergency.",
          },
          {
            type: "text",
            text: "Save: Tap Done.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "Video guide showing how to set up Medical ID on an iPhone.",
              label: "Video Guide: Set Up Medical ID",
              alt: "Video guide showing the Medical ID setup steps on an iPhone.",
              src: "/module-2-medical-id-guide.mp4",
            },
          },
        ],
      },
      {
        title: "Section 6: Emergency SOS: The Fast-Call Button",
        blocks: [
          {
            type: "text",
            text: "If Elena is in trouble and cannot dial 911 manually, she can use Emergency SOS to call for help and text her daughter her exact location automatically.",
          },
          {
            type: "text",
            text: "Task: Setting Up Your SOS Shortcut",
          },
          {
            type: "text",
            text: "Go to Settings: Tap Settings > Emergency SOS.",
          },
          {
            type: "text",
            text: "Choose Your Move:",
          },
          {
            type: "text",
            text: "The Squeeze: Turn on Call with Hold and Release. You just squeeze the side and volume buttons together.",
          },
          {
            type: "text",
            text: "The 5-Tap: Turn on Call with 5 Button Presses. You rapidly click the side button five times.",
          },
          {
            type: "text",
            text: "Automatic Alerts: Ensure your Emergency Contacts are listed here. After the 911 call ends, your phone will automatically text them your location.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "Video guide showing how to set up Emergency SOS on an iPhone.",
              label: "Video Guide: Set Up Emergency SOS",
              alt: "Video guide showing the Emergency SOS setup steps on an iPhone.",
              src: "/module-2-sos-guide.mp4",
            },
          },
        ],
      },
      {
        title: "Section 7: How to Use Your Plan (The What If Drill)",
        blocks: [
          {
            type: "text",
            text: "It is important to know how to find this information before a real emergency happens.",
          },
          {
            type: "text",
            text: "To See Medical Info: If the phone is locked, swipe as if to unlock it. Tap Emergency at the bottom left, then tap Medical ID.",
          },
          {
            type: "text",
            text: "To Call for Help: Use the Squeeze or 5-Tap method you chose in the settings above. A loud siren will sound, and a countdown will begin before calling for help.",
          },
        ],
      },
      {
        title: "Section 8: The Safety Nap (Auto-Lock)",
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
    estimatedMinutes: 18,
    steps: [
      { id: "1", text: "What is 2FA?: Learn the Two-Key Rule: something you know and something you have." },
      { id: "2", text: "Task: Turning on 2FA for your Apple ID: Turn on two-factor authentication and confirm your phone number for security codes." },
      { id: "3", text: "How to Use 2FA in Daily Life: Practice allowing a real login request and typing the 6-digit code." },
      { id: "4", text: "What If I Can't Get My 2FA Code?: Learn the safe backup options Apple offers if Sam cannot see a code on his iPhone." },
      { id: "5", text: "Pre-emptive Solutions: Sam's Spare Key Plan: Add a trusted backup number now so Sam has another way to receive codes." },
      { id: "6", text: "Generating Codes Without the Internet: Learn how to get a verification code directly from iPhone settings while offline." },
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
              description: "A Two-Key diagram. One key is labeled Passphrase, and the other is a smartphone icon labeled Text Code. Both are needed to open a large digital treasure chest.",
              label: "Two-Key Diagram",
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
            text: "Open Settings: Tap the Grey Gear icon.",
          },
          {
            type: "text",
            text: "Your Profile: Tap your Apple ID name at the very top of the list.",
          },
          {
            type: "text",
            text: "Sign-In Settings: Select Sign-In & Security.",
          },
          {
            type: "text",
            text: "The Safety Switch: Tap Turn On Two-Factor Authentication.",
          },
          {
            type: "text",
            text: "Confirm: Tap Continue.",
          },
          {
            type: "text",
            text: "Your Phone Number: Enter the phone number where you want to receive your codes. Choose Text Message (this is usually easiest for Sam).",
          },
          {
            type: "text",
            text: "Final Check: Tap Next and enter the 6-digit code Apple just sent to your phone to finish the setup.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "A slow-paced screen recording of an iPhone. A finger taps the name at the top, selects Sign-In & Security, and toggles Two-Factor Authentication to On. A 1.5-second pause shows the 6-digit code arriving as a notification.",
              label: "Video Guide: Turn On 2FA for Apple ID",
            },
          },
        ],
      },
      {
        title: "Section 3: How to Use 2FA in Daily Life",
        blocks: [
          {
            type: "text",
            text: "Sam needs to know what to do when that Second Lock pops up.",
          },
          {
            type: "text",
            text: "The Request: When Sam logs into his email on a new computer, a message will pop up on his iPhone: Apple ID Sign-In Requested.",
          },
          {
            type: "text",
            text: "The Approval: He taps Allow.",
          },
          {
            type: "text",
            text: "The Code: A large, 6-digit code appears on his iPhone screen.",
          },
          {
            type: "text",
            text: "The Entry: Sam simply types those 6 numbers into the computer screen.",
          },
          {
            type: "text",
            text: "Safety Rule: If Sam gets a code when he is not trying to log in, he should tap Don't Allow. This means a stranger tried to use his password, but the Second Lock stopped them.",
          },
        ],
      },
      {
        title: "Section 4: What If I Can't Get My 2FA Code?",
        blocks: [
          {
            type: "text",
            text: "Sam might worry, What if my phone battery is dead or I leave it at home? Apple provides several back doors to help you get back into your account safely.",
          },
          {
            type: "text",
            text: "Option 1: Use Your Other Apple Devices. If Sam also owns an iPad or a Mac computer, the 6-digit code will automatically pop up on those screens at the same time it appears on his iPhone.",
          },
          {
            type: "text",
            text: "Option 2: The Phone Call Trick. If Sam cannot see his text messages, he can ask Apple to call him instead.",
          },
          {
            type: "text",
            text: "Didn't Get a Code?: When the screen asks for a code, tap Didn't Get a Code?.",
          },
          {
            type: "text",
            text: "Choose the Call Option: Choose the option to receive a phone call.",
          },
          {
            type: "text",
            text: "Listen for the Code: Sam's phone (or landline) will ring, and a friendly automated voice will read the numbers out loud for him to write down.",
          },
          {
            type: "text",
            text: "Option 3: Account Recovery (The Last Resort). If Sam has no devices and no phone, he can go to iforgot.apple.com on any computer.",
          },
          {
            type: "text",
            text: "Note: This process is very secure and can take several days because Apple needs to verify it's really Sam and not a hacker.",
          },
        ],
      },
      {
        title: "Section 5: Pre-emptive Solutions: Sam's Spare Key Plan",
        blocks: [
          {
            type: "text",
            text: "To prevent ever needing the Last Resort, Sam should set up a backup plan today.",
          },
          {
            type: "text",
            text: "Task: Add a Trusted Backup Number",
          },
          {
            type: "text",
            text: "Sam can add a second phone number, like a landline or a trusted family member's phone, to his account.",
          },
          {
            type: "text",
            text: "Go to Settings > [Your Name] > Sign-In & Security.",
          },
          {
            type: "text",
            text: "Tap Edit (next to Trusted Phone Number).",
          },
          {
            type: "text",
            text: "Tap Add a Trusted Phone Number.",
          },
          {
            type: "text",
            text: "Enter the number of a family member you trust.",
          },
          {
            type: "text",
            text: "Now, if Sam loses his phone, he can choose to send the 2FA code to his daughter's phone to help him log in.",
          },
          {
            type: "media",
            slot: {
              type: "video",
              description: "A screen recording showing the path to add a second trusted number. It highlights the Add a Trusted Phone Number button in blue. A 2-second pause shows a list with two numbers: Primary and Back-up (Daughter).",
              label: "Video Guide: Add a Trusted Phone Number",
            },
          },
        ],
      },
      {
        title: "Section 6: Generating Codes Without the Internet",
        blocks: [
          {
            type: "text",
            text: "If Sam is traveling and does not have a cell signal, he can still get a code directly from his iPhone settings.",
          },
          {
            type: "text",
            text: "Go to Settings > [Your Name].",
          },
          {
            type: "text",
            text: "Tap Sign-In & Security.",
          },
          {
            type: "text",
            text: "Tap Get Verification Code.",
          },
          {
            type: "text",
            text: "A code will appear instantly, even if the phone is offline.",
          },
        ],
      },
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
