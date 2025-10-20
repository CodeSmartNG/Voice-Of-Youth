// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArxehE_nnXIxh6lvl0uFAHK9YOUsn_YLE",
  authDomain: "voice-of-youth-25c13.firebaseapp.com",
  projectId: "voice-of-youth-25c13",
  storageBucket: "voice-of-youth-25c13.firebasestorage.app",
  messagingSenderId: "52010364401",
  appId: "1:52010364401:web:dbb5dfe4e74730a2d16850",
  measurementId: "G-V4CF9GPF4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);