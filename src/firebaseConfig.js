import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Authentication'ı ekledik

const firebaseConfig = {
    apiKey: "AIzaSyDjS-71UtYApurLSt9MWrUXwBwHKC2Hcrg",
    authDomain: "todo-app-5c318.firebaseapp.com",
    projectId: "todo-app-5c318",
    storageBucket: "todo-app-5c318.firebasestorage.app",
    messagingSenderId: "931494713999",
    appId: "1:931494713999:web:dab7e342f5e58450372efa"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Authentication için dışa aktardık
