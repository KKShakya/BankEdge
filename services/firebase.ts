
import { initializeApp, FirebaseApp } from "firebase/app";

// Helper to safely access env variables without crashing if import.meta.env is undefined
const getEnv = (key: string): string | undefined => {
  try {
    // Vite usually injects import.meta.env, but safety check prevents runtime crashes
    // We cast to any to avoid TypeScript indexing issues if types aren't perfect
    const meta = import.meta as any;
    if (meta && meta.env) {
      return meta.env[key];
    }
  } catch (e) {
    // Safe fallback
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
};

let app: FirebaseApp | undefined;

// Robust initialization that doesn't crash the app if keys are missing
// This allows the app to run in "Guest/Demo Mode" even without a full Firebase setup
try {
  // Check if at least the API Key is present before attempting initialization
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig as any);
  } else {
    console.warn("Firebase configuration missing. App will run in Demo/Guest mode.");
  }
} catch (error) {
  console.warn("Error initializing Firebase:", error);
  console.warn("App will run in Demo/Guest mode.");
}

export { app };
