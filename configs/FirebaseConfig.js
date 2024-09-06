// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7-m368aydI2mrbgQV36fEXj5bCrhEMXk",
  authDomain: "make-plan-with-ai.firebaseapp.com",
  projectId: "make-plan-with-ai",
  storageBucket: "make-plan-with-ai.appspot.com", // Ensure your storage bucket is configured here
  messagingSenderId: "571356090299",
  appId: "1:571356090299:web:e60820a4a927cc15f9fe9e",
  measurementId: "G-YJRJRNL9PJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Initialize Firebase Storage
