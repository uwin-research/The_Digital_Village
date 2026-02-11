import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-amber-200 bg-amber-50/80 text-amber-900" role="contentinfo">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <p className="text-base leading-relaxed">
          This site is educational. If you think you&apos;re at risk, contact your phone provider or
          a trusted family member.
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-amber-700">
          <Shield className="h-4 w-4" aria-hidden />
          The Golden Shield: Your Phone, Your Privacy, Your Peace of Mind.
        </p>
      </div>
    </footer>
  );
}
