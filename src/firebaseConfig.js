// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDo6lDfgY_5UcTngtPATqOrDpvIjqeHhvs",
  authDomain: "blog-app-6b300.firebaseapp.com",
  projectId: "blog-app-6b300",
  storageBucket: "blog-app-6b300.firebasestorage.app",
  messagingSenderId: "869999191982",
  appId: "1:869999191982:web:ea12e11090761d9d5c0a3f",
  measurementId: "G-GLS0Z31PEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
