// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQmcAAaY0Exu6QLSmsbPRPZThHXvfs-aI",
  authDomain: "house-marketplace-app-fe6c5.firebaseapp.com",
  projectId: "house-marketplace-app-fe6c5",
  storageBucket: "house-marketplace-app-fe6c5.firebasestorage.app",
  messagingSenderId: "38525278466",
  appId: "1:38525278466:web:32a7d7d794c39050614a1b",
  measurementId: "G-LYH4K0HV9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db=getFirestore(app);
export {app,db};