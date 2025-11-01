import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDXtZFs4_KOsRy9Kq0GUf2Osh6yWaY_pdE",
  authDomain: "movie-reviewplatform.firebaseapp.com",
  projectId: "movie-reviewplatform",
  storageBucket: "movie-reviewplatform.firebasestorage.app",
  messagingSenderId: "139419016855",
  appId: "1:139419016855:web:f9d72fd1c4a687602cd3d2",
  measurementId: "G-FVW2252ZEX"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export default app;