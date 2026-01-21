import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

/**
 * Validates that all required Firebase Admin environment variables are present.
 * Returns an error message if any are missing, or null if all are present.
 */
function validateFirebaseEnvVars(): string | null {
  const missing: string[] = [];
  
  if (!process.env.FIREBASE_PROJECT_ID) {
    missing.push('FIREBASE_PROJECT_ID');
  }
  if (!process.env.FIREBASE_CLIENT_EMAIL) {
    missing.push('FIREBASE_CLIENT_EMAIL');
  }
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    missing.push('FIREBASE_PRIVATE_KEY');
  }
  
  if (missing.length > 0) {
    return `Missing Firebase Admin environment variables: ${missing.join(', ')}. Please add them in your Vercel project settings or .env.local file.`;
  }
  
  return null;
}

/**
 * Formats the private key to handle various storage formats.
 * Vercel and different environments may store the key differently.
 */
function formatPrivateKey(key: string): string {
  // If the key is wrapped in quotes, remove them
  let formatted = key.trim();
  if ((formatted.startsWith('"') && formatted.endsWith('"')) ||
      (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1);
  }
  
  // Replace literal \n with actual newlines
  formatted = formatted.replace(/\\n/g, '\n');
  
  return formatted;
}

// Initialize Firebase Admin SDK (only once)
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY!;
    const formattedPrivateKey = formatPrivateKey(privateKey);

    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: formattedPrivateKey,
    };

    initializeApp({
      credential: cert(serviceAccount),
    });
  }
  return getAdminAuth();
}

/**
 * API Route: POST /api/firebase-token
 * 
 * Generates a Firebase custom token for the authenticated Clerk user.
 * This allows the client to sign into Firebase Authentication using
 * the Clerk user's ID, enabling Firestore security rules to work properly.
 */
export async function POST(request: NextRequest) {
  try {
    // Validate environment variables first
    const envError = validateFirebaseEnvVars();
    if (envError) {
      console.error('Firebase Admin configuration error:', envError);
      return NextResponse.json(
        { error: 'Server configuration error', details: envError },
        { status: 500 }
      );
    }

    // Verify Clerk authentication
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - No Clerk session found' },
        { status: 401 }
      );
    }

    // Get Firebase Admin Auth and create a custom token
    const adminAuth = getFirebaseAdmin();
    
    // Create a custom token using the Clerk user ID
    // This will be the `request.auth.uid` in Firestore rules
    const firebaseToken = await adminAuth.createCustomToken(userId);

    return NextResponse.json({ firebaseToken });
  } catch (error) {
    console.error('Error generating Firebase token:', error);
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to generate Firebase token',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
