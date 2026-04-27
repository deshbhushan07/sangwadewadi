// src/firebase.js
// Replace these values with your actual Firebase project config
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
 apiKey: "AIzaSyB1iPANFawt-BKk9U_tVggEBj3QN9loW30",
  authDomain: "sangwadewadi-village.firebaseapp.com",
  projectId: "sangwadewadi-village",
  storageBucket: "sangwadewadi-village.firebasestorage.app",
  messagingSenderId: "1043139728457",
  appId: "1:1043139728457:web:d90c296af5cb0323e01b98",
  measurementId: "G-YV6WZHY3C3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
