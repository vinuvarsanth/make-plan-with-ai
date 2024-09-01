// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7-m368aydI2mrbgQV36fEXj5bCrhEMXk",
  authDomain: "make-plan-with-ai.firebaseapp.com",
  projectId: "make-plan-with-ai",
  storageBucket: "make-plan-with-ai.appspot.com",
  messagingSenderId: "571356090299",
  appId: "1:571356090299:web:e60820a4a927cc15f9fe9e",
  measurementId: "G-YJRJRNL9PJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);