'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { useClerkFirebaseSync } from '@/firebase/clerk-firebase-sync';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Internal component that handles Clerk-Firebase auth synchronization.
 * Must be rendered inside ClerkProvider and after Firebase is initialized.
 */
function FirebaseAuthSync({ children, auth }: { children: ReactNode; auth: ReturnType<typeof initializeFirebase>['auth'] }) {
  const { isLoading, error } = useClerkFirebaseSync({ auth });

  // Optionally show loading state while syncing auth
  // For now, we render children immediately to avoid blocking the UI
  // The useCollection hook will re-fetch once Firebase auth is ready
  if (error) {
    console.error('Firebase auth sync error:', error);
  }

  return <>{children}</>;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <FirebaseAuthSync auth={firebaseServices.auth}>
        {children}
      </FirebaseAuthSync>
    </FirebaseProvider>
  );
}