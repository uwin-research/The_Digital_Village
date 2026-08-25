"use client";

import { useAuth } from "@/context/AuthContext";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const { createAccount, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    // Already signed in — a brand new account always needs onboarding.
    router.replace("/onboarding");
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-xl">Redirecting…</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await createAccount(email, password, confirmPassword);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/onboarding");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 md:max-w-lg lg:max-w-xl md:py-16 2xl:max-w-2xl">
      <div className="rounded-2xl border-2 p-6 md:p-8 lg:p-10 shadow-md" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
        <div className="mb-6 flex items-start gap-3">
          <div className="flex shrink-0 flex-col items-center gap-1">
            <Shield className="h-10 w-10" style={{ color: "var(--heading)" }} aria-hidden />
            <span
              className="max-w-[4.5rem] text-center text-[10px] font-bold uppercase leading-tight tracking-wide"
              style={{ color: "var(--heading)" }}
            >
              Create account
            </span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--heading)" }}>
            Create your account
          </h1>
        </div>
        <p className="mb-6 text-base" style={{ color: "var(--foreground)" }}>
          Let&apos;s set up your account first. Once it&apos;s created, you&apos;ll be signed in right away.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-800" role="alert">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-base font-medium" style={{ color: "var(--foreground)" }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-2 px-4 py-3 text-base focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)" }}
              placeholder="you@example.com"
              disabled={loading}
              aria-invalid={!!error}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-base font-medium" style={{ color: "var(--foreground)" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 px-4 py-3 text-base focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)" }}
              placeholder="At least 6 characters"
              disabled={loading}
              aria-invalid={!!error}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-base font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border-2 px-4 py-3 text-base focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)" }}
              placeholder="Type your password again"
              disabled={loading}
              aria-invalid={!!error}
            />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl px-6 py-4 text-lg font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70"
              style={{ backgroundColor: "var(--button-bg)", color: "var(--button-text)", borderColor: "var(--border)" }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
            <Link
              href="/signin"
              className="text-center text-base underline focus:outline-none focus:ring-2 rounded"
              style={{ color: "var(--link)" }}
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
