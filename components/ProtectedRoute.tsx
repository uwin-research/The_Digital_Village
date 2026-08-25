"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PROTECTED_PATHS = ["/training"];
const SIGNIN_PATH = "/signin";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (!isReady) return;
    if (!isProtected) return;
    if (user) return;
    const next = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    router.replace(`${SIGNIN_PATH}?next=${encodeURIComponent(next)}`);
  }, [isReady, user, isProtected, pathname, router, searchParams]);

  if (!isReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" aria-live="polite">
        <p className="text-xl">Loading…</p>
      </div>
    );
  }

  if (isProtected && !user) {
    return null;
  }

  return <>{children}</>;
}
