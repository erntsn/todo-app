// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjS-71UtYApurLSt9MWrUXwBwHKC2Hcrg",
    authDomain: "todo-app-5c318.firebaseapp.com",
    projectId: "todo-app-5c318",
    storageBucket: "todo-app-5c318.appspot.com", // Fixed this line
    messagingSenderId: "931494713999",
    appId: "1:931494713999:web:dab7e342f5e58450372efa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;