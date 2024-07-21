// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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