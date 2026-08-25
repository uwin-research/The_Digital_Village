# AGENTS.md

Senior-friendly phone-safety training site. Next.js 16 (App Router) + React 19 + Tailwind v4 + `lucide-react`, with `better-sqlite3` for local persistence.

## Commands

- `npm run dev` — dev server (`next dev --webpack`)
- `npm run build` — prod build (`next build --webpack`; does NOT run lint/typecheck)
- `npm run start` — serve prod build after `build`
- `npm run lint` — ESLint (`eslint`, no args)

There is no test suite and no separate typecheck script. Always use `--webpack` (already defaulted in scripts) — do NOT drop it. Verify changes via `npm run build` and `npm run lint`.

## Architecture

Path alias: `@/*` → project root (so imports are `@/lib/...`, `@/components/...`).

- **Module data** lives in `lib/modules.ts` (exported `ModuleData`, 8 modules). `app/training/[slug]` routes render by `slug`. Lesson copy, scenarios, and media paths are authored here, not in DB.
- **Every persisted value** (session, auth, progress, quiz answers, profile) is a SQLite row in `golden-shield.db` at project root (auto-created, git-ignored; note `*.db-wal`/`*.db-shm` also ignored).
  - `lib/db.ts` owns the `data` table (keyed by `session_id` + key: `auth`, `progress`, `updates_answer`, `suspicious_answer`, `profile`) plus `accounts` table.
  - Auth/progress/quiz data is tied to the signed-in **email**, not the browser session. `lib/currentUser.ts` (`getCurrentUserEmail`) is the single source of that mapping — API routes must use it, not `session_id`, or per-account data will leak across users on one browser.
- **Session**: httpOnly cookie `golden-shield-session` (1 year). `lib/session.ts`.
- **Passwords**: scrypt hash + salt, never plain; see `lib/password.ts`. `app/api/auth/route.ts` (sign-in/out) + `app/api/auth/register/route.ts` (create account).
- **Client data paths**: `context/AuthContext.tsx` (client `useAuth`) and `lib/api.ts` (`fetchApi` wrapper that always sends `credentials: "include"`). Server-side data helpers are in `lib/progress.ts`.
- **Server-only imports**: `lib/currentUser.ts`, `lib/session.ts`, `lib/db.ts`, `lib/password.ts` use Next server APIs / node built-ins (`crypto`, `path`, `better-sqlite3`). They must not be imported into client components.
- Accessibility is a core requirement: large text, high contrast, keyboard focus states, captions on video media (partial — `captionsSrc` on `MediaSlot` may be empty pending real `.vtt` authoring).

## Gotchas

- DB is created/lived in at runtime by a singleton in `lib/db.ts` (WAL mode). Idempotent schema via `CREATE TABLE IF NOT EXISTS`; no migrations.
- Some modules complete via interactive quiz answers (`afterCheckQuestion`, `hasInteractiveMessage`) instead of step IDs — `lib/progress.ts` handles that logic; don't assume all completion is step-based.
- Tailwind is v4 (config via `@tailwindcss/postcss` + `postcss.config.mjs`), not a `tailwind.config.js`.