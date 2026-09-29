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
    /*
      Requirement 5 (Responsive Design) - large screens:
      widened from a fixed max-w-3xl to also step up at 2xl (very large
      monitors), and the heading now has a third size step (2xl:text-5xl)
      so it doesn't stay a fixed physical size once the screen has a lot
      more room to work with.
    */
    <div className="mx-auto max-w-3xl px-6 py-12 2xl:max-w-4xl">
      <section className="mb-16 text-center">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-[var(--heading)] md:text-4xl 2xl:text-5xl">
          Your phone holds your life. Let&apos;s protect it—step by step.
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-[var(--foreground)] leading-relaxed">
          In about 15 minutes, you&apos;ll strengthen your screen lock, check permissions, update
          your phone, and learn how to spot suspicious messages.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/signin?next=/training"
            className="inline-flex items-center rounded-lg px-8 py-4 text-lg font-semibold no-underline focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)", textDecoration: "none" }}
          >
            Start the Training
          </Link>
        </div>
      </section>

      <section aria-labelledby="promise-heading" className="mb-16">
        <h2 id="promise-heading" className="mb-8 text-2xl font-bold text-[var(--heading)]">
          What you&apos;ll learn
        </h2>
        <ul className="space-y-4">
          {PROMISE_ITEMS.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-lg text-[var(--foreground)]">
              <span className="mt-0.5 flex shrink-0 flex-col items-center gap-0.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--heading)] text-white">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-center text-[10px] font-bold uppercase leading-none tracking-wide text-[var(--heading)]">
                  Yes
                </span>
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-center text-base text-[var(--foreground)]">
        Take your time. Need help?{" "}
        <Link href="/help" className="font-semibold text-[var(--link)] underline">
          Visit our help page
        </Link>
        .
      </p>
    </div>
  );
}
