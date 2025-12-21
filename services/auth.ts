import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { app } from "./firebase";

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  // Return the promise from signInWithPopup
  return signInWithPopup(auth, provider);
};

export const logout = () => {
  // Return the promise from signOut
  return signOut(auth);
};
