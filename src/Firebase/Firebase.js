// src/Firebase/Firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDDys15D23w-5E1-pkt9P-TzYiWKYEaPWA",
  authDomain: "sport-injury-bio.firebaseapp.com",
  projectId: "sport-injury-bio",
  storageBucket: "sport-injury-bio.appspot.com",
  messagingSenderId: "946090681817",
  appId: "1:946090681817:web:97135054c4df02f615e5c8",
  measurementId: "G-JJRMYTF8HT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
