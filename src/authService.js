import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// User Registration Function
export const registerUser = async (email, password, displayName = "") => {
    try {
        // Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // If a display name was provided, update the user profile
        if (displayName) {
            await updateProfile(user, {
                displayName: displayName
            });
        }

        // Create a user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: displayName || "",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
        });

        console.log("User registered successfully:", user.uid);
        return user;
    } catch (error) {
        console.error("Registration error:", error.message);
        throw error;
    }
};

// User Login Function
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update last login timestamp in Firestore
        try {
            await setDoc(doc(db, "users", user.uid), {
                lastLogin: new Date().toISOString()
            }, { merge: true });
        } catch (updateError) {
            console.error("Error updating last login:", updateError);
            // Don't throw this error as login was successful
        }

        console.log("User logged in successfully:", user.uid);
        return user;
    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
};

// User Logout Function
export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully");

        // Clear user-specific data from localStorage
        const userKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('todos_')) {
                userKeys.push(key);
            }
        }

        // Remove all user-specific localStorage items
        userKeys.forEach(key => localStorage.removeItem(key));

    } catch (error) {
        console.error("Logout error:", error.message);
        throw error;
    }
};

// Password Reset Function
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent");
        return true;
    } catch (error) {
        console.error("Password reset error:", error.message);
        throw error;
    }
};

// Get Current User
export const getCurrentUser = () => {
    return auth.currentUser;
};