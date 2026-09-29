import { getOrCreateSessionId } from "@/lib/session";
import { getData } from "@/lib/db";

/**
 * Resolves the EMAIL of whoever is currently signed in on this browser,
 * or null if nobody is signed in.
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const sessionId = await getOrCreateSessionId();
  const raw = getData(sessionId, "auth");
  if (!raw) return null;
  try {
    const auth = JSON.parse(raw) as { email?: string };
    return typeof auth.email === "string" ? auth.email.toLowerCase().trim() : null;
  } catch {
    return null;
  }
}

export interface CurrentUserContext {
  email: string;
  /**
   * The identifier to use when saving/loading PLATFORM-SPECIFIC data
   * (training progress, quiz answers) — as opposed to the profile
   * itself, which is one record per account regardless of platform.
   *
   * - If the account has chosen Android or iOS in their profile, this
   *   becomes "email::android" or "email::ios" — two completely
   *   separate storage buckets, so switching platforms shows that
   *   platform's own progress, not the other one's.
   * - If no platform has been chosen yet (onboarding was skipped),
   *   this falls back to plain "email", so existing accounts keep
   *   working exactly as before until they pick a platform.
   */
  dataKey: string;
}

/**
 * Looks up who is signed in, then reads their saved profile to find out
 * which platform (Android/iOS) they've chosen, and builds the correct
 * storage key for platform-specific data. Returns null if nobody is
 * signed in.
 */
export async function getCurrentUserContext(): Promise<CurrentUserContext | null> {
  const email = await getCurrentUserEmail();
  if (!email) return null;

  let devicePlatform: string | null = null;
  const rawProfile = getData(email, "profile");
  if (rawProfile) {
    try {
      const parsed = JSON.parse(rawProfile) as { profile?: { devicePlatform?: string | null } };
      const p = parsed?.profile?.devicePlatform;
      devicePlatform = p === "android" || p === "ios" ? p : null;
    } catch {
      devicePlatform = null;
    }
  }

  const dataKey = devicePlatform ? `${email}::${devicePlatform}` : email;
  return { email, dataKey };
}
