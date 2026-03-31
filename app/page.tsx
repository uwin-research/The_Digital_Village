import { Check } from "lucide-react";
import Link from "next/link";

const PROMISE_ITEMS = [
  "Lock your phone so strangers can't open it",
  "Check which apps can access your camera/microphone/location",
  "Make sure your phone has the latest security updates",
  "Learn how to safely handle suspicious messages",
  "Track your progress as you complete each training module",
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <section className="mb-16 text-center">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-[#000080] md:text-4xl">
          Your phone holds your life. Let&apos;s protect it—step by step.
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-black leading-relaxed">
          In about 15 minutes, you&apos;ll strengthen your screen lock, check permissions, update
          your phone, and learn how to spot suspicious messages.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/signin?next=/training"
            className="inline-flex items-center rounded-lg bg-[#FFD700] px-8 py-4 text-lg font-semibold text-black no-underline hover:bg-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
            style={{ textDecoration: "none" }}
          >
            Start the Training
          </Link>
        </div>
      </section>

      <section aria-labelledby="promise-heading" className="mb-16">
        <h2 id="promise-heading" className="mb-8 text-2xl font-bold text-[#000080]">
          What you&apos;ll learn
        </h2>
        <ul className="space-y-4">
          {PROMISE_ITEMS.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-lg text-black">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#000080] text-white" aria-hidden>
                <Check className="h-4 w-4" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-center text-base text-black">
        Take your time. Need help?{" "}
        <Link href="/help" className="font-semibold text-[#0047ab] underline">
          Visit our help page
        </Link>
        .
      </p>
    </div>
  );
}
