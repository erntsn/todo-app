// src/services/TodoService.js
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { v4 as uuidv4 } from 'uuid';

class TodoService {
    constructor() {
        this.localStorageKey = 'todos';
        this.pendingOperations = [];
        this.isOnline = navigator.onLine;

        // Load any pending operations from localStorage
        try {
            this.pendingOperations = JSON.parse(localStorage.getItem('pendingOperations') || '[]');
        } catch (e) {
            console.error("Error loading pending operations:", e);
            this.pendingOperations = [];
        }

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
            // Create a new array to track failed operations
            const failedOps = [];

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
                    failedOps.push(op);
                }
            }

            // Update pending operations with only the failed ones
            this.pendingOperations = failedOps;
            localStorage.setItem('pendingOperations', JSON.stringify(failedOps));
        }, 100);
    }

    // Get user-specific localStorage key
    getUserStorageKey() {
        const uid = auth.currentUser?.uid || 'anonymous';
        return `${this.localStorageKey}_${uid}`;
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

    // Get todos from localStorage (user-specific)
    getLocalTodos() {
        const storageKey = this.getUserStorageKey();
        try {
            return JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch (error) {
            console.error("Error getting local todos:", error);
            return [];
        }
    }

    // Save todos to localStorage (user-specific)
    saveLocalTodos(todos) {
        const storageKey = this.getUserStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(todos));
        return todos;
    }

    // Add todo - update local first, then queue Firebase update
    async addTodo(newTodo) {
        // Update localStorage immediately
        const existingTodos = this.getLocalTodos();
        const todoWithId = {
            ...newTodo,
            id: newTodo.id || uuidv4(),
            userId: auth.currentUser?.uid || 'anonymous',
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
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) return todos;

        const todoToUpdate = todos[todoIndex];

        // Verify the todo belongs to the current user
        if (auth.currentUser && todoToUpdate.userId !== auth.currentUser.uid) {
            console.error("Cannot update todo that doesn't belong to current user");
            return todos;
        }

        const completed = !todoToUpdate.completed;
        const updatedTodo = {
            ...todoToUpdate,
            completed,
            completedAt: completed ? new Date().toISOString() : null
        };

        const updatedTodos = [...todos];
        updatedTodos[todoIndex] = updatedTodo;

        this.saveLocalTodos(updatedTodos);

        // Queue Firebase update if online
        if (this.isOnline && auth.currentUser) {
            this.queueOperation({
                type: 'update',
                id,
                data: {
                    completed: updatedTodo.completed,
                    completedAt: updatedTodo.completedAt
                }
            });

            this.syncUpdateToFirebase(id, {
                completed: updatedTodo.completed,
                completedAt: updatedTodo.completedAt
            }).catch(error => {
                console.error("Background Firebase toggle failed:", error);
            });
        }

        return updatedTodos;
    }

    // Update todo status
    async updateTodoStatus(id, status) {
        // Update in localStorage immediately
        const todos = this.getLocalTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) return todos;

        const todoToUpdate = todos[todoIndex];

        // Verify the todo belongs to the current user
        if (auth.currentUser && todoToUpdate.userId !== auth.currentUser.uid) {
            console.error("Cannot update todo that doesn't belong to current user");
            return todos;
        }

        const updatedTodo = {
            ...todoToUpdate,
            inProgress: status === 'inProgress',
            completed: status === 'completed',
            completedAt: status === 'completed' ? new Date().toISOString() : null
        };

        const updatedTodos = [...todos];
        updatedTodos[todoIndex] = updatedTodo;

        this.saveLocalTodos(updatedTodos);

        // Queue Firebase update if online
        if (this.isOnline && auth.currentUser) {
            this.queueOperation({
                type: 'update',
                id,
                data: {
                    inProgress: updatedTodo.inProgress,
                    completed: updatedTodo.completed,
                    completedAt: updatedTodo.completedAt
                }
            });

            this.syncUpdateToFirebase(id, {
                inProgress: updatedTodo.inProgress,
                completed: updatedTodo.completed,
                completedAt: updatedTodo.completedAt
            }).catch(error => {
                console.error("Background Firebase status update failed:", error);
            });
        }

        return updatedTodos;
    }

    // Sync update to Firebase (non-blocking)
    async syncUpdateToFirebase(id, data) {
        if (!this.isOnline || !auth.currentUser) return;

        try {
            // First check if this document belongs to the current user
            const todoRef = doc(db, "todos", id);
            const todoSnap = await getDoc(todoRef);

            if (!todoSnap.exists()) {
                throw new Error("Todo not found");
            }

            const todoData = todoSnap.data();
            if (todoData.userId !== auth.currentUser.uid) {
                throw new Error("Cannot update todo that doesn't belong to current user");
            }

            // Proceed with update
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
        const todoToDelete = todos.find(todo => todo.id === id);

        if (!todoToDelete) return todos;

        // Verify the todo belongs to the current user
        if (auth.currentUser && todoToDelete.userId !== auth.currentUser.uid) {
            console.error("Cannot delete todo that doesn't belong to current user");
            return todos;
        }

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
            // First check if this document belongs to the current user
            const todoRef = doc(db, "todos", id);
            const todoSnap = await getDoc(todoRef);

            if (!todoSnap.exists()) {
                throw new Error("Todo not found");
            }

            const todoData = todoSnap.data();
            if (todoData.userId !== auth.currentUser.uid) {
                throw new Error("Cannot delete todo that doesn't belong to current user");
            }

            // Proceed with delete
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
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) return todos;

        const existingTodo = todos[todoIndex];

        // Verify the todo belongs to the current user
        if (auth.currentUser && existingTodo.userId !== auth.currentUser.uid) {
            console.error("Cannot update todo that doesn't belong to current user");
            return todos;
        }

        // Preserve the userId and id fields
        const mergedTodo = {
            ...existingTodo,
            ...updatedTodo,
            id: existingTodo.id,
            userId: existingTodo.userId
        };

        const updatedTodos = [...todos];
        updatedTodos[todoIndex] = mergedTodo;

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