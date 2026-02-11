"use client";

import { useAuth } from "@/context/AuthContext";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/training";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in, redirect
  if (user) {
    router.replace(next);
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
    router.push(next);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center gap-3">
          <Shield className="h-10 w-10 text-amber-600" aria-hidden />
          <h1 className="text-2xl font-bold text-amber-950">Sign in to Golden Shield</h1>
        </div>
        <p className="mb-6 text-base text-amber-900">
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
            <label htmlFor="email" className="mb-1 block text-base font-medium text-amber-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-amber-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="you@example.com"
              disabled={loading}
              aria-invalid={!!error}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-base font-medium text-amber-900">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-amber-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="At least 6 characters"
              disabled={loading}
              aria-invalid={!!error}
            />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-500 px-6 py-4 text-lg font-semibold text-amber-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <Link
              href="/help"
              className="text-center text-base text-amber-700 underline hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
            >
              Forgot password?
            </Link>
            <Link
              href="/help"
              className="text-center text-base text-amber-700 underline hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
