# The Digital Village

**Your Phone, Your Privacy, Your Peace of Mind.**

The Digital Village is a senior-friendly phone safety training site built around large text, high-contrast styling, simple navigation, and step-by-step learning modules.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build (uses webpack, same as dev)
npm run start   # run production server after build
npm run lint    # ESLint
```

## What the app includes

- **Home**: full-screen responsive hero and entry into training
- **Sign in**: lightweight email sign-in that gates training content
- **Training dashboard**: eight guided modules with progress tracking and completion badges
- **Module pages**: large-type lessons with scenarios, steps, images, videos, and tailored layouts (for example, Module 2 split columns for text and media; printable slide flow where configured)
- **Glossary**: plain-language definitions for security terms
- **Help**: getting-started guidance and troubleshooting tips
- **Resources**: quick-reference safety reminders

## Training modules (dashboard)

These are the modules learners see on `/training`, in order:

1. Getting Comfortable with Your Device  
2. Your First Line of Defence  
3. Two-Factor Authentication (2FA)  
4. App Permissions & Safety  
5. Software Updates & Habits  
6. Recognising Scams & Phishing  
7. Public Wi-Fi & Safe Browsing  
8. Caches, Cookies & Digital Clutter  

Lesson titles, copy, and media paths are defined in `lib/modules.ts`. Slugs on `/training/[slug]` match each module’s `slug` field there.

## Accessibility and design goals

- High-contrast white, black, and navy styling  
- Large default text sizing for readability  
- Simple layouts with generous spacing  
- Strong focus states for keyboard users  
- Large tap targets and clear button states  
- Responsive layouts for desktop, tablet, and mobile  

## Tech stack

- **Next.js** 16 (App Router), **React** 19  
- **Tailwind CSS** v4  
- **lucide-react** for icons  
- **better-sqlite3** for a local SQLite database (session, auth, and training progress)  

## Project notes

- Dev and production builds use **webpack** (`next dev --webpack` / `next build --webpack`) as configured in `package.json`.
- The local database file is created as **`golden-shield.db`** in the project root when the app runs (ignored by git).

## Main routes

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/signin` | Sign in |
| `/training` | Training dashboard |
| `/training/[slug]` | Module lesson pages |
| `/glossary` | Glossary |
| `/help` | Help |
| `/resources` | Resources |
