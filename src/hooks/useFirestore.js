﻿import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot, doc, addDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { auth } from "../firebaseConfig";

export default function useFirestore(collectionName) {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const db = getFirestore();

    // Get real-time updates from Firestore
    useEffect(() => {
        setIsLoading(true);

        const user = auth.currentUser;
        if (!user) {
            setDocuments([]);
            setIsLoading(false);
            return () => {}; // Return empty cleanup function
        }

        // Create a query against the collection, filtering by userId
        const q = query(
            collection(db, collectionName),
            where("userId", "==", user.uid)
        );

        // Subscribe to the query
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const results = [];
                snapshot.forEach((doc) => {
                    results.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setDocuments(results);
                setIsLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Firestore error:", err);
                setError("Failed to load data");
                setIsLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [collectionName, db, auth.currentUser]);

    // Add a document
    const addDocument = async (data) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            return await addDoc(collection(db, collectionName), {
                ...data,
                userId: user.uid,
                createdAt: new Date().toISOString()
            });
        } catch (err) {
            console.error("Error adding document:", err);
            setError("Failed to add document");
            throw err;
        }
    };

    // Update a document
    const updateDocument = async (id, data) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            // Verify document belongs to current user before updating
            const q = query(
                collection(db, collectionName),
                where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push(doc.id);
            });

            if (!docs.includes(id)) {
                throw new Error("Document does not belong to current user");
            }

            const docRef = doc(db, collectionName, id);
            return await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error("Error updating document:", err);
            setError("Failed to update document");
            throw err;
        }
    };

    // Delete a document
    const deleteDocument = async (id) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            // Verify document belongs to current user before deleting
            const q = query(
                collection(db, collectionName),
                where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push(doc.id);
            });

            if (!docs.includes(id)) {
                throw new Error("Document does not belong to current user");
            }

            const docRef = doc(db, collectionName, id);
            return await deleteDoc(docRef);
        } catch (err) {
            console.error("Error deleting document:", err);
            setError("Failed to delete document");
            throw err;
        }
    };

    return {
        documents,
        isLoading,
        error,
        addDocument,
        updateDocument,
        deleteDocument
    };
}