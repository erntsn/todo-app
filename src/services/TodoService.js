// src/services/TodoService.js
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { v4 as uuidv4 } from 'uuid';

class TodoService {
    constructor() {
        this.localStorageKey = 'todos';
        this.pendingOperations = [];
        this.isOnline = navigator.onLine;

        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processPendingOperations();
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Queue operations for later processing when back online
    queueOperation(operation) {
        this.pendingOperations.push(operation);
        localStorage.setItem('pendingOperations', JSON.stringify(this.pendingOperations));
    }

    // Process any pending operations when coming back online
    async processPendingOperations() {
        const pendingOps = JSON.parse(localStorage.getItem('pendingOperations') || '[]');

        if (pendingOps.length === 0) return;

        // Process in background, don't block UI
        setTimeout(async () => {
            for (const op of pendingOps) {
                try {
                    if (op.type === 'add') {
                        await this.syncAddToFirebase(op.todo);
                    } else if (op.type === 'update') {
                        await this.syncUpdateToFirebase(op.id, op.data);
                    } else if (op.type === 'delete') {
                        await this.syncDeleteFromFirebase(op.id);
                    }
                } catch (error) {
                    console.error("Error processing pending operation:", error);
                    // Keep failed operations for retry
                    continue;
                }
            }

            // Clear processed operations
            localStorage.setItem('pendingOperations', '[]');
            this.pendingOperations = [];
        }, 100);
    }

    // Get todos - prioritize localStorage for speed
    async getTodos() {
        const localTodos = this.getLocalTodos();

        // Return local immediately for UI responsiveness
        if (!this.isOnline || !auth.currentUser) {
            return localTodos;
        }

        // Try to sync with Firebase in background if online
        setTimeout(async () => {
            try {
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

                // Update localStorage with Firebase data
                this.saveLocalTodos(todos);
            } catch (error) {
                console.error("Background Firebase sync failed:", error);
            }
        }, 100);

        return localTodos;
    }

    // Get todos from localStorage
    getLocalTodos() {
        try {
            return JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
        } catch (error) {
            console.error("Error getting local todos:", error);
            return [];
        }
    }

    // Save todos to localStorage
    saveLocalTodos(todos) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(todos));
        return todos;
    }

    // Add todo - update local first, then queue Firebase update
    async addTodo(newTodo) {
        // Update localStorage immediately
        const existingTodos = this.getLocalTodos();
        const todoWithId = {
            ...newTodo,
            id: newTodo.id || uuidv4(),
            userId: auth.currentUser?.uid || 'local-user',
            createdAt: new Date().toISOString()
        };

        const updatedTodos = [...existingTodos, todoWithId];
        this.saveLocalTodos(updatedTodos);

        // Queue Firebase update if online
        if (this.isOnline && auth.currentUser) {
            this.queueOperation({ type: 'add', todo: todoWithId });
            this.syncAddToFirebase(todoWithId).catch(error => {
                console.error("Background Firebase add failed:", error);
            });
        }

        return updatedTodos;
    }

    // Sync add to Firebase (non-blocking)
    async syncAddToFirebase(todo) {
        if (!this.isOnline || !auth.currentUser) return;

        try {
            const todosRef = collection(db, "todos");
            await addDoc(todosRef, {
                ...todo,
                userId: auth.currentUser.uid
            });
        } catch (error) {
            console.error("Firebase add failed:", error);
            throw error;
        }
    }

    // Toggle todo completion
    async toggleTodoCompletion(id) {
        // Update in localStorage immediately
        const todos = this.getLocalTodos();
        const updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                const completed = !todo.completed;
                return {
                    ...todo,
                    completed,
                    completedAt: completed ? new Date().toISOString() : null
                };
            }
            return todo;
        });

        this.saveLocalTodos(updatedTodos);

        // Queue Firebase update if online
        if (this.isOnline && auth.currentUser) {
            const todoToUpdate = updatedTodos.find(t => t.id === id);
            if (todoToUpdate) {
                this.queueOperation({
                    type: 'update',
                    id,
                    data: {
                        completed: todoToUpdate.completed,
                        completedAt: todoToUpdate.completedAt
                    }
                });

                this.syncUpdateToFirebase(id, {
                    completed: todoToUpdate.completed,
                    completedAt: todoToUpdate.completedAt
                }).catch(error => {
                    console.error("Background Firebase toggle failed:", error);
                });
            }
        }

        return updatedTodos;
    }

    // Update todo status
    async updateTodoStatus(id, status) {
        // Update in localStorage immediately
        const todos = this.getLocalTodos();
        const updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                return {
                    ...todo,
                    inProgress: status === 'inProgress',
                    completed: status === 'completed',
                    completedAt: status === 'completed' ? new Date().toISOString() : null
                };
            }
            return todo;
        });

        this.saveLocalTodos(updatedTodos);

        // Queue Firebase update if online
        if (this.isOnline && auth.currentUser) {
            const todoToUpdate = updatedTodos.find(t => t.id === id);
            if (todoToUpdate) {
                this.queueOperation({
                    type: 'update',
                    id,
                    data: {
                        inProgress: todoToUpdate.inProgress,
                        completed: todoToUpdate.completed,
                        completedAt: todoToUpdate.completedAt
                    }
                });

                this.syncUpdateToFirebase(id, {
                    inProgress: todoToUpdate.inProgress,
                    completed: todoToUpdate.completed,
                    completedAt: todoToUpdate.completedAt
                }).catch(error => {
                    console.error("Background Firebase status update failed:", error);
                });
            }
        }

        return updatedTodos;
    }

    // Sync update to Firebase (non-blocking)
    async syncUpdateToFirebase(id, data) {
        if (!this.isOnline || !auth.currentUser) return;

        try {
            const todoRef = doc(db, "todos", id);
            await updateDoc(todoRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Firebase update failed:", error);
            throw error;
        }
    }

    // Remove todo
    async removeTodo(id) {
        // Remove from localStorage immediately
        const todos = this.getLocalTodos();
        const updatedTodos = todos.filter(todo => todo.id !== id);
        this.saveLocalTodos(updatedTodos);

        // Queue Firebase delete if online
        if (this.isOnline && auth.currentUser) {
            this.queueOperation({ type: 'delete', id });
            this.syncDeleteFromFirebase(id).catch(error => {
                console.error("Background Firebase delete failed:", error);
            });
        }

        return updatedTodos;
    }

    // Sync delete to Firebase (non-blocking)
    async syncDeleteFromFirebase(id) {
        if (!this.isOnline || !auth.currentUser) return;

        try {
            const todoRef = doc(db, "todos", id);
            await deleteDoc(todoRef);
        } catch (error) {
            console.error("Firebase delete failed:", error);
            throw error;
        }
    }

    // Update todo
    async updateTodo(id, updatedTodo) {
        // Update in localStorage immediately
        const todos = this.getLocalTodos();
        const updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                return {
                    ...todo,
                    ...updatedTodo,
                    id // Make sure id doesn't change
                };
            }
            return todo;
        });

        this.saveLocalTodos(updatedTodos);

        // Queue Firebase update if online
        if (this.isOnline && auth.currentUser) {
            const { id: todoId, ...dataToUpdate } = updatedTodo;

            this.queueOperation({
                type: 'update',
                id,
                data: dataToUpdate
            });

            this.syncUpdateToFirebase(id, dataToUpdate).catch(error => {
                console.error("Background Firebase update failed:", error);
            });
        }

        return updatedTodos;
    }
}

export default new TodoService();