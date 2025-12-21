
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from "firebase/auth";
import { app } from "./firebase";

let auth: Auth | undefined;

if (app) {
  auth = getAuth(app);
}

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!auth) {
    console.warn("Firebase Auth not initialized. Using Mock Login.");
    // Return a mock promise for demo mode
    return Promise.resolve({
       user: {
         uid: "guest-123",
         displayName: "Guest User",
         email: "guest@bankedge.ai",
         photoURL: null
       }
    });
  }
  return signInWithPopup(auth, provider);
};

export const logout = async () => {
  if (!auth) {
    return Promise.resolve();
  }
  return signOut(auth);
};

export { auth };
