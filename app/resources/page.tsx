import { Shield, MessageSquare, Link2, Users } from "lucide-react";

const CARDS = [
  {
    icon: Shield,
    title: "Quick Safety Rules",
    items: [
      "Use a screen lock (PIN or biometric).",
      "Keep your phone software up to date.",
      "Only give app permissions that make sense for what the app does.",
      "Don't click links in unexpected messages.",
      "When in doubt, check with a trusted person or the official website or phone number you already have.",
    ],
  },
  {
    icon: MessageSquare,
    title: "How to verify a message safely",
    items: [
      "Don't reply or click links in the message.",
      "Find the real contact details from an official source (e.g. the back of your card, the company's official website).",
      "Contact them using that number or website—not the one in the message.",
      "If it's about an account, log in by typing the website yourself, not from a link.",
    ],
  },
  {
    icon: Link2,
    title: "What to do if you think you clicked a suspicious link",
    items: [
      "Don't enter any more information.",
      "If you entered a password, change it as soon as you can (from the real website, typed in yourself).",
      "Tell a trusted person.",
      "Contact your phone provider or bank if you're worried about your account or device.",
    ],
  },
  {
    icon: Users,
    title: "Who to ask for help",
    items: [
      "A trusted family member or friend.",
      "Your phone provider (customer service).",
      "Your bank or service provider, using the number on the back of your card or their official website.",
      "Never give personal or financial details to someone who contacted you first by message or phone—unless you called them on a number you know is real.",
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#000080]">Resources</h1>
      <p className="mb-8 text-lg text-black">
        Quick reference cards. No product endorsements—just simple, general guidance.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className="rounded-2xl border border-2 border-black bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8e8e8] text-[#000080]">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-[#000080]">{card.title}</h2>
              </div>
              <ul className="list-inside list-disc space-y-2 text-base text-black">
                {card.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
