# The Digital Village

**Your Phone, Your Privacy, Your Peace of Mind.**

The Digital Village is a senior-friendly phone safety training site built around large text, high-contrast styling, simple navigation, and step-by-step learning modules.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What the app includes

- **Home**: a full-screen responsive hero and a simple entry point into training
- **Sign in**: lightweight email sign-in that gates training content
- **Training dashboard**: 9 guided modules with progress tracking and completion badges
- **Module pages**: large-type lesson pages with scenarios, step lists, media slots, videos, and custom layouts for key modules
- **My Plan**: a printable checklist view of module progress
- **Glossary**: plain-language definitions for security terms
- **Help**: getting-started guidance and common troubleshooting tips
- **Resources**: quick-reference safety reminders

## Training modules

1. Getting Comfortable with Your Device
2. Your First Line of Defence
3. Passwords & Logging in Safely
4. Two-Factor Authentication (2FA)
5. App Permissions & Safety
6. Software Updates & Habits
7. Recognising Scams & Phishing
8. Public Wi-Fi & Safe Browsing
9. Caches, Cookies & Digital Clutter

## Accessibility and design goals

- high-contrast white, black, and navy styling
- large default text sizing for readability
- simple layouts with generous spacing
- strong focus states for keyboard users
- large tap targets and clear button states
- responsive media for desktop, tablet, and mobile

## Project notes

- The app uses the Next.js App Router.
- Styling is built with Tailwind CSS and global CSS overrides.
- Icons come from `lucide-react`.
- Session data, auth state, and training progress are stored in a local SQLite database via `better-sqlite3`.
- The local database file is created as `golden-shield.db` in the project root when the app runs.

## Main paths

- `/` - home
- `/signin` - sign in
- `/training` - training dashboard
- `/training/[slug]` - module detail pages
- `/plan` - printable plan
- `/glossary` - glossary
- `/help` - help
- `/resources` - resources
