<div align="center">
  <img src="public/banner.png" alt="Ather Co-Pilot" width="100%" />

  <h1>🚀 Ather Co-Pilot</h1>

  <p><strong>Your AI-powered productivity workspace</strong></p>
  <p>One unified platform for intelligent chat, code generation, knowledge analysis, and task automation.</p>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-ather--copilot.vercel.app-brightgreen?style=flat-square&logo=vercel)](https://ather-copilot.vercel.app/)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange?style=flat-square)](CONTRIBUTING.md)
</div>

---

## ✨ Overview

Ather Co-Pilot is a full-stack AI workspace that integrates cutting-edge AI capabilities with a modern, intuitive interface. Built with **Next.js 15**, **Google Gemini 2.5 Flash**, **Firebase Firestore**, and **Clerk Auth**, it provides four powerful AI-driven features in one cohesive platform.

### Core Features

| Feature | Description | Use Case |
|---------|-------------|----------|
| 🧠 **Cognitive Memory Core** | Context-aware AI chat with persistent memory across sessions | Research, brainstorming, learning |
| ⚡ **Quantum CodeForge** | Generate, optimize, and refactor code from natural language or voice commands | Development, prototyping, code review |
| 📚 **Knowledge Navigator** | Summarize and analyze text, PDFs, and web content with AI insights | Document analysis, research synthesis |
| 🤖 **Task Automation** | Convert workflow descriptions into runnable, executable scripts | Automation, repetitive task elimination |

---

## 📸 Screenshots

<div align="center">
  <img src="public/screenshots/landing.png" width="32%" alt="Landing" />
  <img src="public/screenshots/chat.png" width="32%" alt="AI Chat" />
  <img src="public/screenshots/code.png" width="32%" alt="Code Generator" />
  <br /><br />
  <img src="public/screenshots/knowledge.png" width="32%" alt="Knowledge Navigator" />
  <img src="public/screenshots/task.png" width="32%" alt="Task Automation" />
  <img src="public/screenshots/settings.png" width="32%" alt="Settings" />
</div>

---

## 🛠️ Tech Stack

A modern, production-ready stack optimized for AI applications:

| Layer | Technology | Details |
|-------|-----------|---------|
| **Framework** | Next.js 15 | App Router, Server Components, TypeScript |
| **AI Engine** | Google Gemini 2.5 Flash | Via Genkit 1.20 with streaming support |
| **Authentication** | Clerk | Multi-factor auth, social login, session management |
| **Database** | Firebase Firestore | Real-time database, cloud functions ready |
| **Styling** | Tailwind CSS + Radix UI | Accessible, responsive design system |
| **Components** | shadcn/ui | Pre-built, customizable UI components |
| **Hosting** | Vercel | Automatic deployments, edge functions |
| **Language** | TypeScript | Full type safety throughout |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** — JavaScript runtime
- **Clerk account** — [Create free account](https://dashboard.clerk.com/)
- **Firebase project** — [Create in Firebase Console](https://console.firebase.google.com/)
- **Google AI API key** — [Get API key](https://aistudio.google.com/app/apikey)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/harsh-pandhe/AtherCopilot.git
cd AtherCopilot

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# ===== Clerk Authentication =====
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ===== Firebase Client (Public) =====
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# ===== Firebase Admin (Private — from service account) =====
FIREBASE_PROJECT_ID=your-project
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"

# ===== Google AI =====
GOOGLE_GENAI_API_KEY=AIzaSyD...
```

#### Getting Credentials

**Clerk:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create an application
3. Copy the API keys

**Firebase:**
1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database (start in test mode)
3. For client config: Go to **Project Settings** → **General** tab
4. For admin config: Go to **Project Settings** → **Service Accounts** tab → Generate new private key

**Google AI:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **Get API Key** → **Create API key in new project**

> **Important:** The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes with literal `\n` for newlines.

### Step 3: Run Locally

```bash
# Start development server (http://localhost:3000)
npm run dev

# (Optional) Start Genkit UI for AI flow testing (http://localhost:4000)
npm run genkit:dev
```

Visit `http://localhost:3000` to access the application.

---

## 📁 Project Structure

```
src/
├── ai/                                    # AI engine & flows
│   ├── genkit.ts                          # Genkit + Gemini configuration
│   └── flows/
│       ├── intelligent-chat-memory.ts     # Cognitive Memory Core
│       ├── voice-activated-code-generation.ts
│       ├── ai-based-study-support.ts      # Knowledge Navigator
│       └── task-automation.ts             # Task Automation
├── app/
│   ├── api/
│   │   ├── firebase-token/route.ts        # Clerk → Firebase token bridge
│   │   ├── fetch-url/route.ts             # Web scraping endpoint
│   │   └── parse-pdf/route.ts             # PDF text extraction
│   ├── chat/                              # Cognitive Memory Core UI
│   ├── code-generator/                    # Quantum CodeForge UI
│   ├── study-support/                     # Knowledge Navigator UI
│   ├── task-automation/                   # Task Automation UI
│   ├── dashboard/
│   ├── settings/
│   └── login/
├── components/
│   ├── ui/                                # shadcn/ui component library
│   ├── FirebaseErrorListener.tsx
│   ├── user-nav.tsx
│   └── page-header.tsx
├── firebase/                              # Firebase setup & auth
│   ├── client-provider.tsx
│   ├── auth.ts
│   ├── config.ts
│   └── firestore/hooks
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
└── lib/
    ├── utils.ts
    └── placeholder-images.ts
```

---

## 📚 Configuration

### Firebase Setup

1. **Enable Firestore:**
   - Go to Firebase Console → Firestore Database
   - Create database in test mode (or follow security best practices)

2. **Deploy Security Rules:**
   ```bash
   firebase login
   firebase deploy --only firestore:rules
   ```
   - Rules are defined in `firestore.rules`

3. **Sync Clerk with Firebase:**
   - The app automatically creates custom Firebase tokens from Clerk credentials
   - See [clerk-firebase-sync.tsx](src/firebase/clerk-firebase-sync.tsx)

### Customization

- **UI Theme:** Modify [tailwind.config.ts](tailwind.config.ts)
- **AI Behavior:** Adjust Gemini model settings in [ai/genkit.ts](src/ai/genkit.ts)
- **API Timeouts:** Edit [vercel.json](vercel.json) for function timeouts

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Add all environment variables in **Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js configuration

**Vercel Configuration:**
- Automatically uses `vercel.json` for function timeouts:
  - PDF parsing: 30s
  - URL fetching: 15s
  - Firebase token: 10s

### Deploy to Other Platforms

The app works on any platform that supports Node.js 18+ and Next.js. Common options:
- **Railway, Render, Fly.io** — Simple deployment with environment variables
- **Docker** — Build custom container (compatible with any cloud provider)
- **Self-hosted** — Use `npm run build && npm start`

---

## 🔧 Troubleshooting

### Common Issues

| **Port 3000 already in use** | Change port: `npm run dev -- -p 3001` |
| **Google API key error** | Verify key in `.env.local`, regenerate if needed |
| **Firebase authentication failed** | Check `FIREBASE_PRIVATE_KEY` formatting (must have literal `\n`) |
| **Clerk token not found** | Clear cookies and localhost storage, re-login |
| **PDF parsing timeout on Vercel** | Increase timeout in `vercel.json` |
| **Firestore permission denied** | Ensure service account has Editor role in Firebase project |

### Debug Flag

Enable debug logging by adding to `.env.local`:
```env
DEBUG=* npm run dev
```

---

## 🎯 Use Cases

**For Students:**
- Intelligent tutoring with context-aware AI chat
- Code learning with voice-activated examples
- Document summarization for research

**For Developers:**
- Rapid prototyping with AI code generation
- Code review and optimization assistance
- Workflow automation for repetitive tasks

**For Researchers:**
- Knowledge synthesis from papers and articles
- Multi-source analysis and comparison
- Persistent research chat with memory

**For Teams:**
- Centralized AI-powered productivity workspace
- Shareable knowledge base
- Automated task pipelines

---

## 📖 Documentation

- [Installation Guide](docs/INSTALL.md) — Detailed setup walkthrough
- [Contributing Guidelines](CONTRIBUTING.md) — How to contribute
- [Code of Conduct](CODE_OF_CONDUCT.md) — Community standards
- [Genkit Documentation](https://github.com/GoogleCloudPlatform/genkit)
- [Firebase Docs](https://firebase.google.com/docs)
- [Clerk Docs](https://clerk.com/docs)

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick contribution steps:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add your feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## ⭐ Support

If you find this project helpful, please give it a star! For bugs or feature requests, open an [issue on GitHub](https://github.com/harsh-pandhe/AtherCopilot/issues).

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <h3>Made with ❤️ by Harsh Pandhe</h3>
  
  <p>
    <a href="#">GitHub Repository</a>
  </p>
</div>
