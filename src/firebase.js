// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH0NRFaAquvwNqTpFSI3W1MohnqWGWgq8",
  authDomain: "wattwise-cd2b2.firebaseapp.com",
  projectId: "wattwise-cd2b2",
  storageBucket: "wattwise-cd2b2.firebasestorage.app",
  messagingSenderId: "938310204710",
  appId: "1:938310204710:web:ab6cbd86fe931cace355e7",
  measurementId: "G-VSLSWRTSEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);