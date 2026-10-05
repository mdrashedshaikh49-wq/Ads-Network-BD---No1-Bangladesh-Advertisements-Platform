import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import rawConfig from '../../firebase-applet-config.json';

// Support both static bundled firebase-applet-config.json AND Vercel VITE_ environment variables
export const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || rawConfig.apiKey,
  authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || rawConfig.authDomain,
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || rawConfig.projectId,
  storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || rawConfig.storageBucket,
  messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || rawConfig.messagingSenderId,
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || rawConfig.appId,
  measurementId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID) || rawConfig.measurementId
};

// Safe singleton Firebase App initialization (prevents duplicate app initialization error)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Helper to normalize phone/username into a standard unique Firebase email format
export function formatAuthEmail(identifier: string): string {
  if (!identifier) return 'anonymous@adsnetworkbd.com';
  // Keep only digits and lowercase alphanumeric characters
  const clean = identifier.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return `user_${clean || 'member'}@adsnetworkbd.com`;
}

// Register user in Firebase Authentication
export async function registerWithFirebase(phoneOrUsername: string, password: string, displayName?: string): Promise<FirebaseUser> {
  const email = formatAuthEmail(phoneOrUsername);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName }).catch(() => {});
    }
    return userCredential.user;
  } catch (error: any) {
    if (error?.code === 'auth/email-already-in-use') {
      // If already created in Firebase Auth, sign in to verify credentials
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    }
    throw error;
  }
}

// Login user with Firebase Authentication
export async function loginWithFirebase(phoneOrUsername: string, password: string): Promise<FirebaseUser> {
  const email = formatAuthEmail(phoneOrUsername);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Logout user
export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out from Firebase:', error);
  }
}

export const onFirebaseAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Google Auth provider setup
const provider = new GoogleAuthProvider();
provider.addScope('openid');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');

export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (popupError: any) {
    console.warn('Popup sign in failed or blocked, falling back to redirect:', popupError);
    if (
      popupError?.code === 'auth/popup-blocked' ||
      popupError?.code === 'auth/popup-closed-by-user' ||
      popupError?.code === 'auth/cancelled-popup-request' ||
      popupError?.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw popupError;
  }
};

export const checkRedirectResult = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (error) {
    console.error('Error getting redirect result:', error);
    return null;
  }
};

export const logoutGoogle = logoutFirebase;
