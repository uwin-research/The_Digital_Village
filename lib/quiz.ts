export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  moduleSlug: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "1",
    moduleSlug: "first-line-of-defence",
    question: "Why is a screen lock important?",
    options: [
      "So no one else can open your phone if it's lost or stolen.",
      "So the battery lasts longer.",
      "So you get fewer notifications.",
    ],
    correctIndex: 0,
  },
  {
    id: "2",
    moduleSlug: "first-line-of-defence",
    question: "What should you always keep as a backup to fingerprint or face unlock?",
    options: [
      "Your PIN or passcode.",
      "Your email password.",
      "You don't need a backup.",
    ],
    correctIndex: 0,
  },
  {
    id: "3",
    moduleSlug: "app-permissions",
    question: "If a flashlight app asks for your microphone, what should you think?",
    options: [
      "That's unusual; I might turn that permission off.",
      "All apps need the microphone.",
      "I must say yes.",
    ],
    correctIndex: 0,
  },
  {
    id: "4",
    moduleSlug: "software-updates",
    question: "When is a good time to install a phone software update?",
    options: [
      "When you're on Wi-Fi and charging.",
      "Only at night.",
      "You don't need to update.",
    ],
    correctIndex: 0,
  },
  {
    id: "5",
    moduleSlug: "passwords-logging-in",
    question: "Before installing a security app, what should you check?",
    options: [
      "Star rating, reviews, and developer name.",
      "Only the app name.",
      "Nothing; all apps are safe.",
    ],
    correctIndex: 0,
  },
  {
    id: "6",
    moduleSlug: "scams-phishing",
    question: "A message says 'Click here within 24 hours or your account will be closed.' What is a safe step?",
    options: [
      "Don't click. Verify using the official website or phone number you trust.",
      "Click the link right away.",
      "Forward the message to everyone.",
    ],
    correctIndex: 0,
  },
];
