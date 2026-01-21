import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK (only once)
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key needs newlines to be properly parsed
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
    return NextResponse.json(
      { error: 'Failed to generate Firebase token' },
      { status: 500 }
    );
  }
}
