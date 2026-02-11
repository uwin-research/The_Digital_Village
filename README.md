# The Golden Shield

**Your Phone, Your Privacy, Your Peace of Mind.**

A senior-friendly training website that teaches phone security through step-by-step tasks and a short quiz.

## Run the site

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Home** — Hero, 6 module cards, Start Training / Print My Plan
- **Sign in** — Email + password (client-side only). Training and My Plan are gated; redirects to sign-in with `?next=` and back after login
- **Training** — List of 6 modules with progress bar; each module has a detail page with checklist and tips
- **My Plan** — Printable checklist synced with progress (localStorage)
- **Quiz** — Pre- and post-quiz (same 6 questions), score comparison
- **Help** — Getting started and common issues
- **Resources** — Quick reference cards (no product endorsements)
- **Contact** — Simple form (front-end only; shows thank-you message)

## Accessibility

- Skip-to-content link, text size (A- / A / A+), high-contrast toggle
- Large buttons, plain language, WCAG-friendly focus states
- Progress saved in localStorage

## Tech

- Next.js (App Router), Tailwind CSS, lucide-react. No database; auth and progress are client-side (localStorage).
