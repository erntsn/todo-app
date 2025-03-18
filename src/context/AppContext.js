import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import useFirestore from '../hooks/useFirestore';

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
    const [user] = useAuthState(auth);
    const { documents: todos, isLoading, error, addDocument, updateDocument, deleteDocument } = useFirestore('todos');

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'tr';
    });

    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('viewMode') || 'list';
    });

    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [tagFilter, setTagFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Handle dark mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Handle language
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Handle view mode
    useEffect(() => {
        localStorage.setItem('viewMode', viewMode);
    }, [viewMode]);

    // Translations
    const translations = {
        tr: {
            title: "Todo Uygulaması ⚡️",
            addButton: "Ekle",
            all: "Hepsi",
            active: "Yapılacak",
            completed: "Tamamlandı",
            settings: "Ayarlar ⚙️",
            darkMode: "🌙 Karanlık Mod",
            darkModeOn: "Açık",
            darkModeOff: "Kapalı",
            languageSelect: "🌐 Dil Seçimi",
            newTodo: "Yeni görev",
            priority: {
                high: "Yüksek",
                medium: "Orta",
                low: "Düşük"
            },
            noTodo: "Henüz görev yok. 🎉",
            logout: "Çıkış Yap",
            viewMode: "Görünüm Modu",
            listView: "Liste Görünümü",
            boardView: "Pano Görünümü",
            calendarView: "Takvim Görünümü",
            statistics: "İstatistikler",
            pomodoro: "Pomodoro Zamanlayıcı",
            search: "Ara...",
            recurring: "Tekrarlayan Görev",
            every: "Her",
            recurrence: {
                daily: "Günlük",
                weekly: "Haftalık",
                monthly: "Aylık",
                yearly: "Yıllık"
            },
            allCategories: "Tüm Kategoriler",
            filteringByTag: "Etiket Filtresi",
            categories: {
                work: 'İş',
                personal: 'Kişisel',
                health: 'Sağlık',
                shopping: 'Alışveriş',
                finance: 'Finans',
                education: 'Eğitim',
                other: 'Diğer'
            }
        },
        en: {
            title: "Todo App ⚡️",
            addButton: "Add",
            all: "All",
            active: "Active",
            completed: "Completed",
            settings: "Settings ⚙️",
            darkMode: "🌙 Dark Mode",
            darkModeOn: "On",
            darkModeOff: "Off",
            languageSelect: "🌐 Language Select",
            newTodo: "New task",
            priority: {
                high: "High",
                medium: "Medium",
                low: "Low"
            },
            noTodo: "No tasks yet. 🎉",
            logout: "Logout",
            viewMode: "View Mode",
            listView: "List View",
            boardView: "Board View",
            calendarView: "Calendar View",
            statistics: "Statistics",
            pomodoro: "Pomodoro Timer",
            search: "Search...",
            recurring: "Recurring Task",
            every: "Every",
            recurrence: {
                daily: "Daily",
                weekly: "Weekly",
                monthly: "Monthly",
                yearly: "Yearly"
            },
            allCategories: "All Categories",
            filteringByTag: "Filtering by tag",
            categories: {
                work: 'Work',
                personal: 'Personal',
                health: 'Health',
                shopping: 'Shopping',
                finance: 'Finance',
                education: 'Education',
                other: 'Other'
            }
        }
    };

    // Get filtered todos
    const getFilteredTodos = () => {
        if (!todos) return [];

        let filtered = [...todos];

        // Filter by status
        switch (filter) {
            case "active": filtered = filtered.filter(todo => !todo.completed); break;
            case "completed": filtered = filtered.filter(todo => todo.completed); break;
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(todo => todo.category === categoryFilter);
        }

        // Filter by tag
        if (tagFilter) {
            filtered = filtered.filter(todo =>
                todo.tags && todo.tags.includes(tagFilter)
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(todo =>
                todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (todo.notes && todo.notes.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return filtered;
    };

    // Add todo
    const handleAddTodo = async (newTodo) => {
        try {
            await addDocument(newTodo);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    // Toggle todo completion
    const handleToggleTodo = async (id) => {
        try {
            const todoToUpdate = todos.find(todo => todo.id === id);
            if (!todoToUpdate) return;

            const completed = !todoToUpdate.completed;

            await updateDocument(id, {
                completed,
                completedAt: completed ? new Date().toISOString() : null,
                // If marking as complete, set inProgress to false
                ...(completed ? { inProgress: false } : {})
            });
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    // Update todo status
    const handleUpdateTodoStatus = async (id, status) => {
        try {
            const todoToUpdate = todos.find(todo => todo.id === id);
            if (!todoToUpdate) return;

            await updateDocument(id, {
                inProgress: status === 'inProgress',
                completed: status === 'completed',
                completedAt: status === 'completed' ? new Date().toISOString() : null
            });
        } catch (error) {
            console.error("Error updating todo status:", error);
        }
    };

    // Remove todo
    const handleRemoveTodo = async (id) => {
        try {
            await deleteDocument(id);
        } catch (error) {
            console.error("Error removing todo:", error);
        }
    };

    // Update todo
    const handleUpdateTodo = async (updatedTodo) => {
        try {
            const { id, ...todoData } = updatedTodo;
            await updateDocument(id, todoData);
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    // Handle tag click
    const handleTagClick = (tag) => {
        setTagFilter(tag);
    };

    // Value to be provided to consumers
    const value = {
        user,
        todos,
        isLoading,
        error,
        darkMode,
        setDarkMode,
        language,
        setLanguage,
        viewMode,
        setViewMode,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        tagFilter,
        setTagFilter,
        categoryFilter,
        setCategoryFilter,
        translations: translations[language],
        getFilteredTodos,
        handleAddTodo,
        handleToggleTodo,
        handleUpdateTodoStatus,
        handleRemoveTodo,
        handleUpdateTodo,
        handleTagClick
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};