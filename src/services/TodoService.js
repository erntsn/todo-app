// src/services/TodoService.js
import { doc, collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

class TodoService {
    // Get todos from Firestore
    async getTodos() {
        console.log("TodoService.getTodos called");

        try {
            if (!auth.currentUser) {
                console.log("User not logged in, returning empty array");
                return [];
            }

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

            console.log(`Found ${todos.length} todos for user ${auth.currentUser.uid}`);
            return todos;
        } catch (error) {
            console.error("Error fetching todos:", error);
            throw new Error("Görevler yüklenirken hata oluştu.");
        }
    }

    // Add a new todo
    async addTodo(newTodo) {
        console.log("TodoService.addTodo called");

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            // Prepare the todo object
            const todoData = {
                ...newTodo,
                userId: auth.currentUser.uid,
                createdAt: new Date().toISOString()
            };

            // Add the document to Firestore
            await addDoc(collection(db, "todos"), todoData);
            console.log("Todo added successfully");

            // Return updated list
            return this.getTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
            throw new Error("Görev eklenirken hata oluştu.");
        }
    }

    // Toggle todo completion
    async toggleTodoCompletion(id) {
        console.log(`TodoService.toggleTodoCompletion called for id: ${id}`);

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            // Get current todo
            const todoRef = doc(db, "todos", id);
            const todoSnap = await getDoc(todoRef);

            if (!todoSnap.exists()) {
                throw new Error("Todo bulunamadı");
            }

            const todoData = todoSnap.data();

            // Only update if this todo belongs to the current user
            if (todoData.userId !== auth.currentUser.uid) {
                throw new Error("Bu görev size ait değil");
            }

            const completed = !todoData.completed;

            // Update the todo
            await updateDoc(todoRef, {
                completed,
                completedAt: completed ? new Date().toISOString() : null
            });

            console.log(`Todo ${id} completion status toggled to ${completed}`);

            // Return updated list
            return this.getTodos();
        } catch (error) {
            console.error("Error toggling todo completion:", error);
            throw new Error("Görev durumu değiştirilirken hata oluştu.");
        }
    }

    // Update todo status
    async updateTodoStatus(id, status) {
        console.log(`TodoService.updateTodoStatus called for id: ${id}, status: ${status}`);

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            // Prepare status data
            const statusData = {};

            if (status === 'completed' || status === 'done') {
                statusData.status = status;
                statusData.completed = true;
                statusData.completedAt = new Date().toISOString();
            } else {
                statusData.status = status;
                statusData.completed = false;
                statusData.completedAt = null;
            }

            // Update the todo directly
            const todoRef = doc(db, "todos", id);
            await updateDoc(todoRef, {
                ...statusData,
                updatedAt: new Date().toISOString()
            });

            console.log(`Todo ${id} status updated to ${status}`);

            // Return updated list
            return this.getTodos();
        } catch (error) {
            console.error("Error updating todo status:", error);
            throw new Error("Görev durumu güncellenirken hata oluştu.");
        }
    }

    // Remove todo
    async removeTodo(id) {
        console.log(`TodoService.removeTodo called for id: ${id}`);

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            // Delete directly without additional checks to simplify
            await deleteDoc(doc(db, "todos", id));
            console.log(`Todo ${id} deleted successfully`);

            // Return updated list
            return this.getTodos();
        } catch (error) {
            console.error("Error removing todo:", error.message, error.stack);
            throw new Error("Görev silinirken hata oluştu.");
        }
    }

    // Update todo
    async updateTodo(id, updatedTodo) {
        console.log(`TodoService.updateTodo called for id: ${id}`);

        try {
            if (!auth.currentUser) {
                throw new Error("Kullanıcı giriş yapmamış");
            }

            // Remove id from data to update if it exists
            const { id: _, ...dataToUpdate } = updatedTodo;

            // Update directly
            await updateDoc(doc(db, "todos", id), {
                ...dataToUpdate,
                updatedAt: new Date().toISOString()
            });

            console.log(`Todo ${id} updated successfully`);

            // Return updated list
            return this.getTodos();
        } catch (error) {
            console.error("Error updating todo:", error.message, error.stack);
            throw new Error("Görev güncellenirken hata oluştu.");
        }
    }
}

export default new TodoService();