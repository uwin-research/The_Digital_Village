import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

/**
 * Creates a random salt and a scrypt hash of the password. We never
 * store the plain password anywhere — only this hash + salt pair, which
 * cannot practically be reversed back into the original password.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return { hash, salt };
}

/**
 * Re-hashes the password the person just typed with the SAME salt that
 * was used when their account was created, and checks whether the
 * result matches what's stored. timingSafeEqual avoids leaking timing
 * information that could help guess the password.
 */
export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  try {
    const suppliedHash = scryptSync(password, storedSalt, KEY_LENGTH);
    const storedHashBuffer = Buffer.from(storedHash, "hex");
    if (suppliedHash.length !== storedHashBuffer.length) return false;
    return timingSafeEqual(suppliedHash, storedHashBuffer);
  } catch {
    return false;
  }
}
