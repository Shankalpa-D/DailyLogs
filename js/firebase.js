// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3itDVKrmlVayloMN2ayqLiKbeWRLfbrc",
  authDomain: "dailylogs-1b687.firebaseapp.com",
  projectId: "dailylogs-1b687",
  storageBucket: "dailylogs-1b687.appspot.com",
  messagingSenderId: "89866807252",
  appId: "1:89866807252:web:cecd87a9eb3d88633e5841",
  measurementId: "G-SZXXQE82HS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { 
  auth, db, storage, 
  signInWithCustomToken, onAuthStateChanged, signOut,
  collection, doc, setDoc, getDoc, getDocs, query, where, Timestamp,
  ref, uploadBytes, getDownloadURL
};