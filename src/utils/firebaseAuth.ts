import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('openid');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');

export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('Error signing in with Google redirect:', error);
    throw error;
  }
};

export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (error) {
    console.error('Error getting redirect result:', error);
    throw error;
  }
};

export const logoutGoogle = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out from Google:', error);
  }
};
