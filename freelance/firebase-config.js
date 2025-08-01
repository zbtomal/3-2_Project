// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnuedaZrRn7Zpx1SrDFs53jMYvxzfNOyo",
  authDomain: "freelance-f5e40.firebaseapp.com",
  projectId: "freelance-f5e40",
  storageBucket: "freelance-f5e40.firebasestorage.app",
  messagingSenderId: "1048409804135",
  appId: "1:1048409804135:web:38beba66fdab0f4beef3c2",
  measurementId: "G-S9934VZEY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
window.auth = auth;
window.db = db;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.doc = doc;
window.getDoc = getDoc;
window.updateDoc = updateDoc;
window.query = query;
window.where = where;
window.orderBy = orderBy; 