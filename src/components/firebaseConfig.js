// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCgAz6qqINxST5rdRFft7eANOPJvSNhivA",
    authDomain: "motivdle.firebaseapp.com",
    projectId: "motivdle",
    storageBucket: "motivdle-images.appspot.com",  // Correct bucket name
    messagingSenderId: "49681730987",
    appId: "1:49681730987:web:979ca8e9df23fcaf1456ee",
    measurementId: "G-6ERPZQMNM0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
