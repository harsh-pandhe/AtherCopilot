# Aether Co-Pilot

An AI-powered productivity workspace built with Next.js, Firebase, and Google's Genkit AI framework.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-11-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## ✨ Features

### 🤖 AI Chat
- Intelligent conversations with persistent memory
- Star, archive, and search chat sessions
- Multiple conversation modes (General, Coding, Memory, Knowledge, Tasks)

### 💻 Code Generator (Quantum CodeForge™)
- Voice-to-code generation using Web Speech API
- Quick start templates for common patterns
- Syntax-highlighted code output

### 📚 Study Support (Knowledge Navigator™)
- Paste any content and ask questions
- AI-powered summaries and explanations
- Quick action templates

### ⚡ Task Automation
- Describe repetitive tasks in natural language
- Get executable automation scripts
- Detailed explanations of generated code

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Authentication**: Clerk (@clerk/nextjs)
- **Database**: Firebase Firestore
- **AI**: Google Genkit with Gemini 2.5 Flash
- **Styling**: Tailwind CSS + Radix UI (shadcn/ui)
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- Clerk account
- Google AI API key

### Environment Variables

Create a `.env.local` file with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Firebase Configuration (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin SDK (Server - for Clerk integration)
# Get these from Firebase Console > Project Settings > Service Accounts > Generate new private key
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google AI
GOOGLE_GENAI_API_KEY=...
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── ai/                    # AI flows and Genkit configuration
│   ├── flows/            # Individual AI flow definitions
│   └── genkit.ts         # Genkit AI initialization
├── app/                   # Next.js App Router pages
│   ├── chat/             # AI Chat feature
│   ├── code-generator/   # Voice-to-code generator
│   ├── study-support/    # Document Q&A
│   ├── task-automation/  # Script automation
│   ├── settings/         # User settings
│   └── help/             # Help center
├── components/           # Reusable UI components
│   └── ui/              # shadcn/ui components
├── firebase/            # Firebase configuration and hooks
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Vercel

Add all variables from `.env.local` to your Vercel project settings.

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
