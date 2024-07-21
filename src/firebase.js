// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";  // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgAz6qqINxST5rdRfFt7eANOPJvSNhivA",
  authDomain: "motivdle.firebaseapp.com",
  projectId: "motivdle",
  storageBucket: "motivdle.appspot.com",
  messagingSenderId: "49681730987",
  appId: "1:49681730987:web:979ca8e9df23fcaf1456ee",
  measurementId: "G-6ERPZQMNM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);  // Initialize Firestore

// Export Firestore functions
export { db, doc, getDoc, setDoc };