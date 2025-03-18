// src/services/TodoService.js
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { v4 as uuidv4 } from 'uuid';

class TodoService {
    // Get todos from Firestore
    async getTodos() {
        console.log("TodoService.getTodos çağrıldı");

        try {
            if (!auth.currentUser) {
                console.log("Kullanıcı giriş yapmamış, boş dizi döndürülüyor");
                return [];
            }

            console.log("Firestore'dan kullanıcının todolarını alıyor:", auth.currentUser.uid);
            const todosRef = collection(db, "todos");
            const q = query(todosRef, where("userId", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);

            const todos = [];
            querySnapshot.forEach((doc) => {
                todos.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            console.log("Bulunan todo sayısı:", todos.length);
            return todos;
        } catch (error) {
            console.error("Todos alınırken hata:", error);
            throw error;
        }
    }

    // Add a new todo
    async addTodo(newTodo) {
        console.log("TodoService.addTodo çağrıldı");

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            const todoWithId = {
                ...newTodo,
                userId: auth.currentUser.uid,
                createdAt: new Date().toISOString()
            };

            console.log("Firebase'e todo ekleniyor:", todoWithId);
            const docRef = await addDoc(collection(db, "todos"), todoWithId);
            console.log("Todo eklendi, ID:", docRef.id);

            // Refresh todos from Firestore
            return await this.getTodos();
        } catch (error) {
            console.error("Todo eklerken hata:", error);
            throw error;
        }
    }

    // Toggle todo completion
    async toggleTodoCompletion(id) {
        console.log("TodoService.toggleTodoCompletion çağrıldı");

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            // Get current todos
            const todos = await this.getTodos();
            const todoToUpdate = todos.find(todo => todo.id === id);

            if (!todoToUpdate) {
                throw new Error("Todo bulunamadı");
            }

            const completed = !todoToUpdate.completed;

            console.log("Todo durumu güncelleniyor:", id, "tamamlandı =", completed);
            await updateDoc(doc(db, "todos", id), {
                completed,
                completedAt: completed ? new Date().toISOString() : null
            });

            // Refresh todos from Firestore
            return await this.getTodos();
        } catch (error) {
            console.error("Todo durumu güncellenirken hata:", error);
            throw error;
        }
    }

    // Update todo status
    async updateTodoStatus(id, status) {
        console.log("TodoService.updateTodoStatus çağrıldı");

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            console.log("Todo durumu güncelleniyor:", id, "yeni durum =", status);
            await updateDoc(doc(db, "todos", id), {
                inProgress: status === 'inProgress',
                completed: status === 'completed',
                completedAt: status === 'completed' ? new Date().toISOString() : null
            });

            // Refresh todos from Firestore
            return await this.getTodos();
        } catch (error) {
            console.error("Todo durumu güncellenirken hata:", error);
            throw error;
        }
    }

    // Remove todo
    async removeTodo(id) {
        console.log("TodoService.removeTodo çağrıldı");

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            console.log("Todo siliniyor:", id);
            await deleteDoc(doc(db, "todos", id));

            // Refresh todos from Firestore
            return await this.getTodos();
        } catch (error) {
            console.error("Todo silinirken hata:", error);
            throw error;
        }
    }

    // Update todo
    async updateTodo(id, updatedTodo) {
        console.log("TodoService.updateTodo çağrıldı");

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            console.log("Todo güncelleniyor:", id);
            const { id: todoId, ...dataToUpdate } = updatedTodo;

            await updateDoc(doc(db, "todos", id), {
                ...dataToUpdate,
                updatedAt: new Date().toISOString()
            });

            // Refresh todos from Firestore
            return await this.getTodos();
        } catch (error) {
            console.error("Todo güncellenirken hata:", error);
            throw error;
        }
    }
}

export default new TodoService();