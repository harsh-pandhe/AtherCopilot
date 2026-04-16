<div align="center">
  <img src="public/banner.png" alt="Aether Co-Pilot" width="100%" />

  <h1>Aether Co-Pilot</h1>

  <p>An AI-powered productivity workspace — chat, code generation, knowledge analysis, and task automation in one place.</p>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-ather--copilot.vercel.app-brightgreen?style=flat-square&logo=vercel)](https://ather-copilot.vercel.app/)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange?style=flat-square)](CONTRIBUTING.md)
</div>

---

## What is this?

Aether Co-Pilot is a full-stack AI workspace built on **Next.js 15**, **Google Genkit (Gemini 2.5 Flash)**, **Firebase Firestore**, and **Clerk Auth**. It bundles four AI tools into a single authenticated app:

- **Cognitive Memory Core** — context-aware AI chat with persistent sessions
- **Quantum CodeForge** — code generation from natural language or voice
- **Knowledge Navigator** — summarize and analyze text, PDFs, and URLs
- **Task Automation** — describe a workflow, get a runnable script

---

## Screenshots

<div align="center">
  <img src="public/screenshots/landing.png" width="49%" alt="Landing" />
  <img src="public/screenshots/chat.png" width="49%" alt="AI Chat" />
  <br /><br />
  <img src="public/screenshots/code.png" width="49%" alt="Code Generator" />
  <img src="public/screenshots/knowledge.png" width="49%" alt="Knowledge Navigator" />
  <br /><br />
  <img src="public/screenshots/task.png" width="49%" alt="Task Automation" />
  <img src="public/screenshots/settings.png" width="49%" alt="Settings" />
</div>

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| AI | Google Genkit 1.20 · Gemini 2.5 Flash |
| Auth | Clerk |
| Database | Firebase Firestore + Firebase Admin |
| UI | Tailwind CSS · Radix UI · shadcn/ui |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Clerk account](https://dashboard.clerk.com/) — for auth
- [Firebase project](https://console.firebase.google.com/) — Firestore + service account key
- [Google AI Studio API key](https://aistudio.google.com/app/apikey) — for Gemini

### 1. Clone and install

```bash
git clone https://github.com/harsh-pandhe/AtherCopilot.git
cd AtherCopilot
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (server — from service account JSON)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google AI
GOOGLE_GENAI_API_KEY=...
```

> **Note:** The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes with `\n` for newlines.

### 3. Run

```bash
npm run dev        # app on http://localhost:9003
npm run genkit:dev # Genkit UI for testing AI flows (optional)
```

---

## Project Structure

```
src/
├── ai/
│   ├── genkit.ts                          # Genkit + Gemini config
│   └── flows/
│       ├── intelligent-chat-memory.ts     # Chat AI flow
│       ├── voice-activated-code-generation.ts
│       ├── ai-based-study-support.ts
│       └── task-automation.ts
├── app/
│   ├── api/
│   │   ├── firebase-token/route.ts        # Clerk → Firebase custom token
│   │   ├── fetch-url/route.ts             # URL content fetcher
│   │   └── parse-pdf/route.ts             # PDF text extractor
│   ├── chat/                              # Cognitive Memory Core
│   ├── code-generator/                    # Quantum CodeForge
│   ├── study-support/                     # Knowledge Navigator
│   ├── task-automation/
│   ├── dashboard/
│   ├── settings/
│   └── login/
├── components/ui/                         # shadcn/ui components
├── firebase/                              # Firebase client + admin setup
├── hooks/
└── lib/
```

---

## Deploying to Vercel

1. Import the repo on [vercel.com](https://vercel.com/)
2. Add all environment variables from `.env.example` in **Settings → Environment Variables**
3. Deploy — Vercel will auto-detect Next.js and use the `vercel.json` config

The `vercel.json` in this repo sets appropriate function timeouts for PDF parsing (30s), URL fetching (15s), and Firebase token generation (10s).

---

## Firebase Setup Notes

- Enable **Firestore** in your Firebase project
- Create a **service account** and download the JSON key (used for `FIREBASE_*` server env vars)
- Deploy Firestore security rules from `firestore.rules`:
  ```bash
  firebase deploy --only firestore:rules
  ```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
  Built by <a href="https://github.com/harsh-pandhe">Harsh Pandhe</a>
</div>
