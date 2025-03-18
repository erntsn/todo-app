import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { v4 as uuidv4 } from 'uuid';
import { getNextOccurrence } from "../utils/dateUtils";

class TodoService {
    constructor() {
        this.db = getFirestore();
        this.todosCollection = collection(this.db, "todos");
        this.localStorageKey = 'todos';
    }

    // Get todos from Firestore, fallback to localStorage if offline
    async getTodos() {
        try {
            const user = auth.currentUser;
            if (!user) return this.getLocalTodos();

            const q = query(this.todosCollection, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            const todos = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Check and create recurring tasks
            const updatedTodos = this.checkAndCreateRecurringTasks(todos);

            // Update localStorage for offline access
            this.saveLocalTodos(updatedTodos);

            return updatedTodos;
        } catch (error) {
            console.error("Error getting todos from Firestore:", error);
            return this.getLocalTodos();
        }
    }

    // Get todos from localStorage (offline mode)
    getLocalTodos() {
        try {
            const todos = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
            return this.checkAndCreateRecurringTasks(todos);
        } catch (error) {
            console.error("Error getting todos from localStorage:", error);
            return [];
        }
    }

    // Save todos to localStorage
    saveLocalTodos(todos) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(todos));
        return todos;
    }

    // Add a new todo
    async addTodo(todo) {
        try {
            const user = auth.currentUser;
            if (!user) {
                const todos = this.getLocalTodos();
                const newTodo = {
                    ...todo,
                    id: uuidv4(),
                    inProgress: false,
                    notes: todo.notes || '',
                    subtasks: todo.subtasks || [],
                    tags: todo.tags || [],
                    category: todo.category || 'other',
                    createdAt: new Date().toISOString()
                };
                todos.push(newTodo);
                return this.saveLocalTodos(todos);
            }

            // Add to Firestore
            await addDoc(this.todosCollection, {
                ...todo,
                userId: user.uid,
                inProgress: false,
                notes: todo.notes || '',
                subtasks: todo.subtasks || [],
                tags: todo.tags || [],
                category: todo.category || 'other',
                createdAt: new Date().toISOString()
            });

            // Refetch todos to make sure we have the latest data
            return this.getTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
            throw error;
        }
    }

    // Remove a todo
    async removeTodo(id) {
        try {
            const user = auth.currentUser;
            if (!user) {
                const todos = this.getLocalTodos().filter(todo => todo.id !== id);
                return this.saveLocalTodos(todos);
            }

            // Delete from Firestore
            await deleteDoc(doc(this.db, "todos", id));

            // Refetch todos
            return this.getTodos();
        } catch (error) {
            console.error("Error removing todo:", error);
            throw error;
        }
    }

    // Toggle todo completion status
    async toggleTodoCompletion(id) {
        try {
            const user = auth.currentUser;
            if (!user) {
                const todos = this.getLocalTodos().map(todo => {
                    if (todo.id === id) {
                        return {
                            ...todo,
                            completed: !todo.completed,
                            completedAt: !todo.completed ? new Date().toISOString() : null,
                            inProgress: !todo.completed ? false : todo.inProgress
                        };
                    }
                    return todo;
                });
                return this.saveLocalTodos(todos);
            }

            // Get current todo from Firestore
            const todoRef = doc(this.db, "todos", id);
            const todos = await this.getTodos();
            const todo = todos.find(t => t.id === id);

            if (!todo) {
                throw new Error(`Todo with id ${id} not found`);
            }

            // Update in Firestore
            await updateDoc(todoRef, {
                completed: !todo.completed,
                completedAt: !todo.completed ? new Date().toISOString() : null,
                inProgress: !todo.completed ? false : todo.inProgress
            });

            // Refetch todos
            return this.getTodos();
        } catch (error) {
            console.error("Error toggling todo completion:", error);
            throw error;
        }
    }

    // Update todo status (for board view)
    async updateTodoStatus(id, status) {
        try {
            const user = auth.currentUser;
            if (!user) {
                const todos = this.getLocalTodos().map(todo => {
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
                return this.saveLocalTodos(todos);
            }

            // Update in Firestore
            const todoRef = doc(this.db, "todos", id);
            await updateDoc(todoRef, {
                inProgress: status === 'inProgress',
                completed: status === 'completed',
                completedAt: status === 'completed' ? new Date().toISOString() : null
            });

            // Refetch todos
            return this.getTodos();
        } catch (error) {
            console.error("Error updating todo status:", error);
            throw error;
        }
    }

    // Update todo
    async updateTodo(id, updatedTodo) {
        try {
            const user = auth.currentUser;
            if (!user) {
                const todos = this.getLocalTodos().map(todo => {
                    if (todo.id === id) {
                        return {
                            ...todo,
                            ...updatedTodo,
                            id // Make sure id doesn't change
                        };
                    }
                    return todo;
                });
                return this.saveLocalTodos(todos);
            }

            // Update in Firestore
            const todoRef = doc(this.db, "todos", id);
            await updateDoc(todoRef, {
                ...updatedTodo,
                updatedAt: new Date().toISOString()
            });

            // Refetch todos
            return this.getTodos();
        } catch (error) {
            console.error("Error updating todo:", error);
            throw error;
        }
    }

    // Check and create recurring task instances
    checkAndCreateRecurringTasks(todos) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let hasNewTasks = false;
        let newTodos = [...todos];

        // Check each todo for recurring tasks that need new instances
        todos.forEach(todo => {
            if (todo.recurring && todo.recurring.nextDate) {
                const nextDate = new Date(todo.recurring.nextDate);

                // If next date is today or earlier, create a new instance
                if (nextDate <= today && !todo.completed) {
                    // Calculate the next occurrence
                    const newNextDate = getNextOccurrence(
                        todo.recurring.nextDate,
                        todo.recurring.type,
                        todo.recurring.value
                    );

                    // Update the existing task with new next date
                    const updatedTodo = {
                        ...todo,
                        recurring: {
                            ...todo.recurring,
                            nextDate: newNextDate
                        }
                    };

                    // Update the todo in the array
                    newTodos = newTodos.map(t => t.id === todo.id ? updatedTodo : t);

                    // Create a new task instance
                    const newTask = {
                        id: uuidv4(),
                        text: todo.text,
                        completed: false,
                        date: todo.date,
                        priority: todo.priority,
                        category: todo.category,
                        tags: todo.tags || [],
                        recurring: null, // Non-recurring instance
                        isRecurringInstance: true,
                        parentTaskId: todo.id,
                        createdAt: new Date().toISOString()
                    };

                    newTodos.push(newTask);
                    hasNewTasks = true;
                }
            }
        });

        if (hasNewTasks) {
            // Update in Firestore if online
            this.syncRecurringTasks(newTodos);

            // Also update localStorage
            this.saveLocalTodos(newTodos);
        }

        return newTodos;
    }

    // Sync recurring tasks to Firestore
    async syncRecurringTasks(todos) {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // Get current todos from Firestore
            const q = query(this.todosCollection, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const existingTodos = {};

            querySnapshot.docs.forEach(doc => {
                existingTodos[doc.id] = true;
            });

            // For each todo that's not in Firestore, add it
            // For each todo that needs updating, update it
            for (const todo of todos) {
                if (!todo.id) continue; // Skip if no id

                if (existingTodos[todo.id]) {
                    // Update existing todo
                    if (todo.recurring) {
                        const todoRef = doc(this.db, "todos", todo.id);
                        await updateDoc(todoRef, {
                            recurring: todo.recurring,
                            updatedAt: new Date().toISOString()
                        });
                    }
                } else {
                    // Add new todo
                    await addDoc(this.todosCollection, {
                        ...todo,
                        userId: user.uid
                    });
                }
            }
        } catch (error) {
            console.error("Error syncing recurring tasks:", error);
        }
    }
}

export default new TodoService();