import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAktd3wPXGkI5pdkd5uOQUfYR-3dVNvb-0",
    authDomain: "team12-dashboard.firebaseapp.com",
    projectId: "team12-dashboard",
    storageBucket: "team12-dashboard.firebasestorage.app",
    messagingSenderId: "469189304400",
    appId: "1:469189304400:web:b99e8dfd86f17b96bc7155"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { signInWithEmailAndPassword, createUserWithEmailAndPassword };

console.log("Firebase API Key from .env:", process.env.REACT_APP_FIREBASE_API_KEY);

