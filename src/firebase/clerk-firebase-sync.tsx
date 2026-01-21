'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser as useClerkUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { signInWithCustomToken, signOut, Auth } from 'firebase/auth';

interface UseClerkFirebaseSyncOptions {
  auth: Auth;
}

interface ClerkFirebaseSyncState {
  isLoading: boolean;
  error: Error | null;
  isSynced: boolean;
}

/**
 * Hook that synchronizes Clerk authentication state with Firebase Authentication.
 * 
 * When a user signs in via Clerk, this hook:
 * 1. Fetches a Firebase custom token from the API
 * 2. Signs the user into Firebase using that token
 * 
 * When a user signs out of Clerk, this hook signs them out of Firebase.
 * 
 * This enables Firestore security rules to work with `request.auth.uid`
 * matching the Clerk user ID.
 */
export function useClerkFirebaseSync({ auth }: UseClerkFirebaseSyncOptions): ClerkFirebaseSyncState {
  const { isLoaded: isClerkLoaded, isSignedIn, user: clerkUser } = useClerkUser();
  const { getToken } = useClerkAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  
  // Track the last synced user ID to avoid unnecessary re-syncs
  const lastSyncedUserId = useRef<string | null>(null);

  useEffect(() => {
    async function syncAuth() {
      // Wait for Clerk to load
      if (!isClerkLoaded) {
        return;
      }

      // If not signed into Clerk, sign out of Firebase
      if (!isSignedIn || !clerkUser) {
        if (auth.currentUser) {
          try {
            await signOut(auth);
          } catch (err) {
            console.error('Error signing out of Firebase:', err);
          }
        }
        lastSyncedUserId.current = null;
        setIsLoading(false);
        setIsSynced(true);
        return;
      }

      // Skip if already synced for this user
      if (lastSyncedUserId.current === clerkUser.id && auth.currentUser?.uid === clerkUser.id) {
        setIsLoading(false);
        setIsSynced(true);
        return;
      }

      // Sign into Firebase with the Clerk user
      setIsLoading(true);
      setError(null);

      try {
        // Get Clerk token for API authentication
        const clerkToken = await getToken();
        
        // Fetch Firebase custom token from our API
        const response = await fetch('/api/firebase-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clerkToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get Firebase token');
        }

        const { firebaseToken } = await response.json();

        // Sign into Firebase with the custom token
        await signInWithCustomToken(auth, firebaseToken);
        
        lastSyncedUserId.current = clerkUser.id;
        setIsSynced(true);
      } catch (err) {
        console.error('Error syncing Clerk to Firebase:', err);
        setError(err instanceof Error ? err : new Error('Unknown error during auth sync'));
        setIsSynced(false);
      } finally {
        setIsLoading(false);
      }
    }

    syncAuth();
  }, [isClerkLoaded, isSignedIn, clerkUser, auth, getToken]);

  return { isLoading, error, isSynced };
}
