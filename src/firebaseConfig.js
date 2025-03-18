// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
    apiKey: "AIzaSyDjS-71UtYApurLSt9MWrUXwBwHKC2Hcrg",
    authDomain: "todo-app-5c318.firebaseapp.com",
    projectId: "todo-app-5c318",
    storageBucket: "todo-app-5c318.appspot.com",
    messagingSenderId: "931494713999",
    appId: "1:931494713999:web:dab7e342f5e58450372efa"
};

console.log("Firebase yükleniyor...");

// Firebase başlatma
let app, auth, db;

try {
    // Firebase uygulamasını başlat
    app = initializeApp(firebaseConfig);
    console.log("Firebase başarıyla başlatıldı");

    // Auth ve Firestore hizmetlerini başlat
    auth = getAuth(app);
    db = getFirestore(app);

    console.log("Firebase servisleri hazır");
} catch (error) {
    console.error("Firebase başlatma hatası:", error);
    throw error;
}

// Servisleri dışa aktar (try/catch bloğunun dışında)
export { auth, db };
export default app;