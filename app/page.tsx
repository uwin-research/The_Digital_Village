import { Check } from "lucide-react";
import Link from "next/link";

const PROMISE_ITEMS = [
  "Lock your phone so strangers can't open it",
  "Check which apps can access your camera/microphone/location",
  "Make sure your phone has the latest security updates",
  "Learn how to safely handle suspicious messages",
  "Leave with a printable safety plan",
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold leading-tight text-amber-950 md:text-4xl">
          Your phone holds your life. Let&apos;s protect it—step by step.
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-amber-900">
          In about 15 minutes, you&apos;ll strengthen your screen lock, check permissions, update
          your phone, and learn how to spot suspicious messages.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/signin?next=/training"
            className="inline-flex items-center rounded-xl bg-amber-500 px-8 py-4 text-lg font-semibold text-amber-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
          >
            Start the Training
          </Link>
        </div>
      </section>

      <section aria-labelledby="promise-heading" className="mb-12">
        <h2 id="promise-heading" className="mb-6 text-2xl font-bold text-amber-950">
          What you'll learn
        </h2>
        <ul className="space-y-3">
          {PROMISE_ITEMS.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-lg text-amber-900">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-900" aria-hidden>
                <Check className="h-4 w-4" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-center text-base text-amber-700">
        Take your time. Need help?{" "}
        <Link href="/help" className="font-medium underline hover:text-amber-900">
          Visit our help page
        </Link>
        .
      </p>
    </div>
  );
}
