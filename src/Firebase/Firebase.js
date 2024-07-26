// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);