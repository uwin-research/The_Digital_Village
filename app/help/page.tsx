import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#000080]">Getting started</h1>
      <p className="mb-8 text-lg text-black">
        Take your time. This training is here when you&apos;re ready.
      </p>

      <section className="mb-8" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="mb-4 text-xl font-bold text-[#000080]">
          How it works
        </h2>
        <ul className="list-inside list-disc space-y-2 text-base text-black">
          <li>Sign in to access the training.</li>
          <li>Work through each module on your phone or with a trusted person beside you.</li>
          <li>Use the checkboxes to track your progress. Your progress is saved in this browser.</li>
        </ul>
      </section>

      <section className="mb-8" aria-labelledby="common-issues">
        <h2 id="common-issues" className="mb-4 text-xl font-bold text-[#000080]">
          Common issues
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-2 border-black bg-white p-4">
            <h3 className="font-semibold text-[#000080]">I can&apos;t find Settings on my phone</h3>
            <p className="mt-1 text-base text-black">
              On every training module page there is a &quot;Can&apos;t find Settings?&quot; section with step-by-step help for iPhone and Android. Open it and follow the steps.
            </p>
          </div>
          <div className="rounded-xl border border-2 border-black bg-white p-4">
            <h3 className="font-semibold text-[#000080]">My progress disappeared</h3>
            <p className="mt-1 text-base text-black">
              Progress is saved in this browser on this device. If you clear browser data or use a different browser or device, you&apos;ll start fresh. You can always redo the training.
            </p>
          </div>
          <div className="rounded-xl border border-2 border-black bg-white p-4">
            <h3 className="font-semibold text-[#000080]">I&apos;m not sure if I did a step correctly</h3>
            <p className="mt-1 text-base text-black">
              That&apos;s okay. Mark it done when you&apos;ve tried. If something doesn&apos;t work on your phone, ask a trusted person to help. You can turn permissions or settings back later if needed.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8" aria-labelledby="need-more">
        <h2 id="need-more" className="mb-4 text-xl font-bold text-[#000080]">
          Need more help?
        </h2>
        <p className="text-base text-black">
          Contact your phone provider or a trusted family member or friend. This site is educational only. If you think you&apos;re at risk, get help from someone you know in person or by a phone number you already trust.
        </p>
        <p className="mt-4">
          <Link
            href="/contact"
            className="font-medium text-[#0047ab] underline hover:text-[#000080] focus:outline-none focus:ring-2 focus:ring-[#000080] rounded"
          >
            Send us a message
          </Link>
          {" "}(we can&apos;t give personal advice, but we read feedback).
        </p>
      </section>
    </div>
  );
}
