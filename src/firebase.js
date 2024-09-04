// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";  // Import Firestore
import { getStorage } from 'firebase/storage';

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


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firestore functions
export { db, doc, getDoc, setDoc, storage };