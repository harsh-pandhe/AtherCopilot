<div align="center">
  <img src="public/banner.png" alt="Aether Co-Pilot Banner" width="100%">
  
  # Aether Co-Pilot
  
  **Empowering Productivity with Generative AI**
  
  [![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge&logo=vercel)](https://ather-copilot.vercel.app/)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-orange?style=for-the-badge)](CONTRIBUTING.md)

  An AI-powered productivity workspace built with Next.js, Firebase, and Google's Genkit AI framework.
</div>

<hr />

## 📖 Table of Contents
- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

## ✨ Features

### 🤖 AI Chat
- **Intelligent Conversations**: Context-aware AI with persistent memory.
- **Organization**: Star, archive, and search through chat sessions.
- **Modes**: Multiple specialized conversation modes (General, Coding, Memory, Knowledge, Tasks).

### 💻 Code Generator (Quantum CodeForge™)
- **Voice-to-Code**: Seamless generation using the Web Speech API.
- **Templates**: Quick-start patterns for common development cycles.
- **Output**: Full-syntax highlighted and ready-to-use code blocks.

### 📚 Knowledge Navigator™
- **Smart Analysis**: Paste content and request instant summaries or deep dives.
- **Templates**: Preset actions for common learning tasks.

### ⚡ Task Automation
- **Natural Language**: Describe what you need automated in plain English.
- **Scripts**: Receive executable automation scripts with detailed logic explanations.

## 📸 Screenshots

<div align="center">
  <br />
  <img src="public/screenshots/landing.png" width="48%" alt="Landing Page">
  <img src="public/screenshots/chat.png" width="48%" alt="AI Chat">
  <br />
  <img src="public/screenshots/dashboard.png" width="48%" alt="Dashboard">
  <img src="public/screenshots/code.png" width="48%" alt="Code Generator">
</div>

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **AI Layer** | [Google Genkit](https://github.com/google/genkit) + Gemini 2.5 Flash |
| **Database** | [Firebase Firestore](https://firebase.google.com/products/firestore) |
| **Auth** | [Clerk](https://clerk.com/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- [Clerk Account](https://dashboard.clerk.com/)
- [Firebase Project](https://console.firebase.google.com/)
- [Google AI API Key](https://aistudio.google.com/app/apikey)

### Environment Setup
Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (Server)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google AI
GOOGLE_GENAI_API_KEY=...
```

### Installation & Run
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 📁 Project Structure

```text
src/
├── ai/                    # Genkit AI flows & configuration
├── app/                   # Next.js App Router (Pages & API)
├── components/            # React components (including shadcn/ui)
├── firebase/              # Firebase Client/Admin SDK setup
├── hooks/                 # Custom React hooks
└── lib/                   # Shared utilities & helpers
```

## 🤝 Contributing
Contributions make the open-source community an amazing place to learn, inspire, and create. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## 📝 License
Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---
<div align="center">
  Built with ❤️ by [Harsh Pandhe](https://github.com/harsh-pandhe)
</div>
