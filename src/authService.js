import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Kullanıcı Kayıt Olma Fonksiyonu
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Kayıt hatası:", error.message);
        throw error;
    }
};

// Kullanıcı Giriş Yapma Fonksiyonu
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Giriş hatası:", error.message);
        throw error;
    }
};

// Kullanıcı Çıkış Yapma Fonksiyonu
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Çıkış hatası:", error.message);
    }
};
