import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace this with your Firebase configuration
// Get this from Firebase Console > Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: "AIzaSyA3EyeT4Pchpgzig2amX6zNW_G-LCt3zag",
  authDomain: "daily-119aa.firebaseapp.com",
  projectId: "daily-119aa",
  storageBucket: "daily-119aa.firebasestorage.app",
  messagingSenderId: "363216765954",
  appId: "1:363216765954:web:f84739e9b610bd93f1131b",
  measurementId: "G-L7W9PQ439N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 