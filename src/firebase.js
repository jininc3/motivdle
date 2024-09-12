import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";  // Import Firestore
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgAz6qqINxST5rdRFft7eANOPJvSNhivA",
  authDomain: "motivdle.firebaseapp.com",
  projectId: "motivdle",
  storageBucket: "motivdle-images.appspot.com",  // Correct bucket name
  messagingSenderId: "49681730987",
  appId: "1:49681730987:web:979ca8e9df23fcaf1456ee",
  measurementId: "G-6ERPZQMNM0"
};


export const getStorageURL = async (fileName) => {
  const fileRef = storageRef(storage, `motivdle-images/${fileName}`);
  try {
      const url = await getDownloadURL(fileRef);
      return url;
  } catch (error) {
      console.error("Error getting the download URL", error);
      return null;
  }
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firestore and Storage functions
export { db, doc, getDoc, setDoc, storage };