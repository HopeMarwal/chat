// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHQNfJ8jkzvYgcpmxg2Bm03shcI1ixWVs",
  authDomain: "chat-firebase-415f5.firebaseapp.com",
  projectId: "chat-firebase-415f5",
  storageBucket: "chat-firebase-415f5.appspot.com",
  messagingSenderId: "100362243524",
  appId: "1:100362243524:web:6b7487bf6ad94f06506891"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();