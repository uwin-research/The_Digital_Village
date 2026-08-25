"use client";

import { useAccessibility } from "@/context/AccessibilityContext";
import { useAuth } from "@/context/AuthContext";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const { signIn, user } = useAuth();
  const { profile, hydrated } = useAccessibility();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/training";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * THIS IS THE FIX for onboarding not appearing: previously nothing
   * ever redirected a signed-in user to /onboarding. We wait for
   * `hydrated` (the profile has finished loading from the database)
   * before deciding where to send the person, so we don't accidentally
   * send an already-onboarded user back to onboarding, or a brand new
   * user straight past it, before we actually know their status.
   */
  useEffect(() => {
    if (!user || !hydrated) return;
    if (!profile.onboarded) {
      router.replace("/onboarding");
    } else {
      router.replace(next);
    }
  }, [user, hydrated, profile.onboarded, next, router]);

  if (user) {
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
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    // The useEffect above handles where to go next once `user` updates.
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 md:max-w-lg lg:max-w-xl md:py-16 2xl:max-w-2xl">
      <div className="rounded-2xl border-2 p-6 md:p-8 lg:p-10 shadow-md" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
        <div className="mb-6 flex items-start gap-3">
          <div className="flex shrink-0 flex-col items-center gap-1">
            <Shield className="h-10 w-10" style={{ color: "var(--heading)" }} aria-hidden />
            <span className="max-w-[4.5rem] text-center text-[10px] font-bold uppercase leading-tight tracking-wide" style={{ color: "var(--heading)" }}>
              Secure sign-in
            </span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--heading)" }}>
            Sign in to The Digital Village
          </h1>
        </div>
        <p className="mb-6 text-base" style={{ color: "var(--foreground)" }}>
          Sign in to access the training. Take your time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-800"
              role="alert"
            >
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 px-4 py-3 text-base focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)" }}
              placeholder="At least 6 characters"
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <Link
              href="/help"
              className="text-center text-base underline focus:outline-none focus:ring-2 rounded"
              style={{ color: "var(--link)" }}
            >
              Forgot password?
            </Link>
            <Link
              href="/signup"
              className="text-center text-base underline focus:outline-none focus:ring-2 rounded"
              style={{ color: "var(--link)" }}
            >
              Don&apos;t have an account? Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
