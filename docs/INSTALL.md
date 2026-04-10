# Installation Guide: Aether Co-Pilot

This document outlines the steps required to set up and run Aether Co-Pilot on your local development environment.

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Firebase CLI**: `npm install -g firebase-tools`
- **Genkit CLI**: `npm install -g genkit`

## 1. Clone the Repository

```bash
git clone https://github.com/harsh-pandhe/AtherCopilot.git
cd AtherCopilot
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Environment Configuration

Create a `.env.local` file in the root directory and add the following credentials:

### Clerk Authentication
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Google Gemini API
```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### Firebase Config
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 4. Firebase Setup

Initialize Firebase in your project:

```bash
firebase login
firebase init
```
Make sure to select **Firestore** and **Functions**.

## 5. Running the Application

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Genkit UI (Local AI Testing)
```bash
genkit ui
```
This allows you to test the AI flows (Chat, Code Gen, Study Support) in isolation.

## 6. Build for Production

```bash
npm run build
npm start
```

---
**Note**: For detailed security rules and database indexing, refer to the project report (Chapter 8).
