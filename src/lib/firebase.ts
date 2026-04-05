import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guard against build-time initialization without credentials.
// In production (Vercel) the NEXT_PUBLIC_FIREBASE_API_KEY env var is always set.
// During CI builds or local dev without .env, we skip initialization to avoid
// the auth/invalid-api-key error when Next.js statically analyzes server routes.
let app: FirebaseApp | null = null;
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

export const auth: Auth = app ? getAuth(app) : (null as unknown as Auth);
export const db: Firestore = app ? getFirestore(app) : (null as unknown as Firestore);
export const storage: FirebaseStorage = app ? getStorage(app) : (null as unknown as FirebaseStorage);

export default app;
