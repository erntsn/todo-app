import { auth } from "../firebaseConfig";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

class StatisticsService {
    constructor() {
        this.db = getFirestore();
        this.todosCollection = collection(this.db, "todos");
    }

    // Get statistics for tasks completed by day for the last 30 days
    async getCompletionStatsByDay() {
        const user = auth.currentUser;
        if (!user) return [];

        // Get all todos for the user
        const q = query(this.todosCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const todos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Create a map of dates (last 30 days) to count of completed tasks
        const stats = {};
        const today = new Date();

        // Initialize the last 30 days with 0 completions
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            stats[dateStr] = 0;
        }

        // Count completed tasks by completion date
        todos.forEach(todo => {
            if (todo.completedAt) {
                const completedDate = new Date(todo.completedAt);
                const dateStr = completedDate.toISOString().split('T')[0];
                if (stats[dateStr] !== undefined) {
                    stats[dateStr]++;
                }
            }
        });

        // Convert to array format for charts
        return Object.entries(stats).map(([date, count]) => ({
            date,
            count
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Get priority distribution
    async getPriorityStats() {
        const user = auth.currentUser;
        if (!user) return [];

        const q = query(this.todosCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const todos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const priorityCounts = {
            high: 0,
            medium: 0,
            low: 0
        };

        todos.forEach(todo => {
            if (todo.priority && priorityCounts[todo.priority] !== undefined) {
                priorityCounts[todo.priority]++;
            } else {
                // Default to medium if not specified
                priorityCounts.medium++;
            }
        });

        return Object.entries(priorityCounts).map(([priority, count]) => ({
            priority,
            count
        }));
    }

    // Get statistics for overdue tasks
    async getOverdueStats() {
        const user = auth.currentUser;
        if (!user) return { count: 0, percentage: 0 };

        const q = query(this.todosCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const todos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const overdueCount = todos.filter(todo => {
            if (!todo.date || todo.completed) return false;
            const dueDate = new Date(todo.date);
            return dueDate < today;
        }).length;

        const totalIncompleteCount = todos.filter(todo => !todo.completed).length;

        return {
            count: overdueCount,
            percentage: totalIncompleteCount > 0
                ? Math.round((overdueCount / totalIncompleteCount) * 100)
                : 0
        };
    }

    // Get category distribution
    async getCategoryStats() {
        const user = auth.currentUser;
        if (!user) return [];

        const q = query(this.todosCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const todos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const categoryCounts = {};

        todos.forEach(todo => {
            const category = todo.category || 'other';
            if (categoryCounts[category] === undefined) {
                categoryCounts[category] = 0;
            }
            categoryCounts[category]++;
        });

        return Object.entries(categoryCounts).map(([category, count]) => ({
            category,
            count
        }));
    }
}

export default new StatisticsService();