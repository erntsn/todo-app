import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import AuthForm from "./components/AuthForm";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TrelloBoard from "./components/TrelloBoard";
import CalendarView from "./components/CalendarView";
import PomodoroTimer from "./components/PomodoroTimer";
import StatisticsDashboard from "./components/StatisticsDashboard";
import Settings from "./components/Settings";
import TodoService from "./services/TodoService";

// Translations object
const translations = {
    tr: {
        title: "Todo Uygulaması ⚡️",
        addButton: "Ekle",
        all: "Hepsi",
        active: "Yapılacak",
        completed: "Tamamlandı",
        settings: "Ayarlar ⚙️",
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
        cancel: "İptal",
        recurrence: {
            daily: "Günlük",
            weekly: "Haftalık",
            monthly: "Aylık",
            yearly: "Yıllık"
        },
        allCategories: "Tüm Kategoriler",
        filteringByTag: "Etiket Filtresi",
        categories: {
            label: "Kategoriler",
            work: 'İş',
            personal: 'Kişisel',
            health: 'Sağlık',
            shopping: 'Alışveriş',
            finance: 'Finans',
            education: 'Eğitim',
            other: 'Diğer'
        },
        loading: "Yükleniyor...",
        error: "Hata",
        tryAgain: "Tekrar Dene",
        authError: "Kimlik doğrulama hatası",
        date: "Tarih",
        category: "Kategori"
    },
    en: {
        title: "Todo App ⚡️",
        addButton: "Add",
        all: "All",
        active: "Active",
        completed: "Completed",
        settings: "Settings ⚙️",
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
        cancel: "Cancel",
        recurrence: {
            daily: "Daily",
            weekly: "Weekly",
            monthly: "Monthly",
            yearly: "Yearly"
        },
        allCategories: "All Categories",
        filteringByTag: "Filtering by tag",
        categories: {
            label: "Categories",
            work: 'Work',
            personal: 'Personal',
            health: 'Health',
            shopping: 'Shopping',
            finance: 'Finance',
            education: 'Education',
            other: 'Other'
        },
        loading: "Loading...",
        error: "Error",
        tryAgain: "Try Again",
        authError: "Authentication error",
        date: "Date",
        category: "Category"
    }
};

// Category colors
const categoryColors = {
    work: 'blue',
    personal: 'purple',
    health: 'green',
    shopping: 'pink',
    finance: 'yellow',
    education: 'indigo',
    other: 'gray'
};

const App = () => {
    console.log("App bileşeni render ediliyor");

    // Auth state
    const [user, loading, authError] = useAuthState(auth);

    // App state
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState("all");
    // Always use dark mode
    const darkMode = true;
    const [language, setLanguage] = useState(() => localStorage.getItem("language") || "tr");
    const [viewMode, setViewMode] = useState(() => localStorage.getItem("viewMode") || "list");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tagFilter, setTagFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showPomodoro, setShowPomodoro] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);

    console.log("Auth durumu:", {
        user: user?.uid,
        loading,
        error: authError?.message
    });

    // Handle dark mode - always set to true
    useEffect(() => {
        // Always add dark class
        document.documentElement.classList.add("dark");
    }, []);

    // Handle language
    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    // Handle view mode
    useEffect(() => {
        localStorage.setItem("viewMode", viewMode);
    }, [viewMode]);

    // Load todos when user changes
    useEffect(() => {
        const loadTodos = async () => {
            console.log("useEffect çalışıyor, user:", user?.uid);

            if (user) {
                try {
                    console.log("Todo yüklemesi başlıyor...");
                    const todosData = await TodoService.getTodos();
                    console.log("Yüklenen todo sayısı:", todosData.length);
                    setTodos(todosData);
                } catch (error) {
                    console.error("Todo yükleme hatası:", error);
                }
            } else if (!loading) {
                console.log("Kullanıcı giriş yapmamış, todo listesi temizleniyor");
                setTodos([]);
            }
        };

        loadTodos();
    }, [user, loading]);

    // Function handlers
    const handleAddTodo = async (newTodo) => {
        try {
            console.log("Adding new todo");
            const updatedTodos = await TodoService.addTodo(newTodo);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const handleToggleTodo = async (id) => {
        try {
            console.log("Toggling todo completion:", id);
            const updatedTodos = await TodoService.toggleTodoCompletion(id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error toggling todo completion:", error);
        }
    };

    const handleUpdateTodoStatus = async (id, status) => {
        try {
            console.log(`Todo durumu güncelleniyor: ${id}, hedef durum: ${status}`);

            // Backend güncellemesini başlat, ancak sonucunu bekletme
            try {
                // TodoService çağrısı (async)
                TodoService.updateTodoStatus(id, status)
                    .then(updatedTodos => {
                        // Başarılı istek sonrası bir şey yapmak gerekiyorsa
                        console.log("Backend güncelleme başarılı");
                    })
                    .catch(error => {
                        console.error("Backend güncellemede hata:", error);
                    });
            } catch (error) {
                console.error("Todo durumu güncellenirken hata:", error);
            }
        } catch (error) {
            console.error("Durum güncelleme hatası:", error);
        }
    };

    const handleRemoveTodo = async (id) => {
        try {
            console.log("Removing todo:", id);
            const updatedTodos = await TodoService.removeTodo(id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error removing todo:", error);
        }
    };

    const handleUpdateTodo = async (updatedTodo) => {
        try {
            console.log("Updating todo:", updatedTodo.id);
            const updatedTodos = await TodoService.updateTodo(updatedTodo.id, updatedTodo);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const getFilteredTodos = () => {
        let filtered = [...todos];

        // Filter by status
        switch (filter) {
            case "active":
                filtered = filtered.filter(todo => !todo.completed);
                break;
            case "completed":
                filtered = filtered.filter(todo => todo.completed);
                break;
            default:
                break;
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

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Çıkış hatası:", error);
        }
    };

    const setView = (mode) => {
        setViewMode(mode);
        setShowPomodoro(false);
        setShowStatistics(false);
    };

    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
    };

    const togglePomodoro = () => {
        setShowPomodoro(!showPomodoro);
        if (!showPomodoro) {
            setShowStatistics(false);
        }
    };

    const toggleStatistics = () => {
        setShowStatistics(!showStatistics);
        if (!showStatistics) {
            setShowPomodoro(false);
        }
    };

    const handleTagClick = (tag) => {
        setTagFilter(tag);
    };

    // Loading state
    if (loading) {
        console.log("Kimlik doğrulama yükleniyor...");
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-white">{translations[language].loading}</p>
                </div>
            </div>
        );
    }

    // Auth error state
    if (authError) {
        console.error("Kimlik doğrulama hatası:", authError);
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
                <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-xl font-bold mb-2 text-white">{translations[language].authError}</h2>
                    <p className="mb-4 text-white">{authError.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        {translations[language].tryAgain}
                    </button>
                </div>
            </div>
        );
    }

    console.log("User durumu:", user ? "Giriş yapılmış" : "Giriş yapılmamış");

    // Main content
    return (
        <div className="h-screen w-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 to-gray-950 text-white">
            {user ? (
                <>
                    {/* Yan menü - Tablet ve üstü cihazlarda görünür */}
                    <div className="hidden md:flex w-64 flex-shrink-0 bg-gray-800 flex-col p-4 border-r border-gray-700">
                        <div className="flex items-center justify-center mb-8">
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                {translations[language].title}
                            </h1>
                        </div>

                        {/* Kullanıcı bilgileri */}
                        <div className="flex items-center space-x-3 p-3 mb-6 bg-gray-700 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                <p className="text-xs text-gray-400">{user.displayName || 'Kullanıcı'}</p>
                            </div>
                        </div>

                        {/* Ana navigasyon */}
                        <nav className="space-y-1 mb-6">
                            <button
                                onClick={() => setView("list")}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                                    viewMode === "list" && !showPomodoro && !showStatistics ?
                                        "bg-blue-600 text-white" :
                                        "text-gray-300 hover:bg-gray-700"
                                } transition-colors`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                {translations[language].listView}
                            </button>

                            <button
                                onClick={() => setView("board")}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                                    viewMode === "board" && !showPomodoro && !showStatistics ?
                                        "bg-blue-600 text-white" :
                                        "text-gray-300 hover:bg-gray-700"
                                } transition-colors`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                {translations[language].boardView}
                            </button>

                            <button
                                onClick={() => setView("calendar")}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                                    viewMode === "calendar" && !showPomodoro && !showStatistics ?
                                        "bg-blue-600 text-white" :
                                        "text-gray-300 hover:bg-gray-700"
                                } transition-colors`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {translations[language].calendarView}
                            </button>

                            <button
                                onClick={toggleStatistics}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                                    showStatistics ?
                                        "bg-blue-600 text-white" :
                                        "text-gray-300 hover:bg-gray-700"
                                } transition-colors`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                {translations[language].statistics}
                            </button>

                            <button
                                onClick={togglePomodoro}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                                    showPomodoro ?
                                        "bg-blue-600 text-white" :
                                        "text-gray-300 hover:bg-gray-700"
                                } transition-colors`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {translations[language].pomodoro}
                            </button>
                        </nav>

                        {/* Kategori filtreleri */}
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                                {translations[language].categories.label || 'Categories'}
                            </h3>

                            <div className="space-y-1">
                                <button
                                    onClick={() => setCategoryFilter('all')}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                                        categoryFilter === 'all' ?
                                            "bg-blue-600 text-white" :
                                            "text-gray-300 hover:bg-gray-700"
                                    } transition-colors`}
                                >
                                    {translations[language].allCategories}
                                </button>

                                {Object.keys(translations[language].categories)
                                    .filter(cat => cat !== 'label')
                                    .map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategoryFilter(cat)}
                                            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                                                categoryFilter === cat ?
                                                    `bg-${categoryColors[cat]}-700 text-white` :
                                                    "text-gray-300 hover:bg-gray-700"
                                            } transition-colors`}
                                        >
                                            <span className={`w-2 h-2 rounded-full bg-${categoryColors[cat]}-500 mr-2`}></span>
                                            {translations[language].categories[cat]}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        {/* Ayarlar ve Çıkış */}
                        <div className="mt-auto pt-6 border-t border-gray-700">
                            <button
                                onClick={toggleSettings}
                                className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors mb-2"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {translations[language].settings}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900 hover:bg-opacity-30 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {translations[language].logout}
                            </button>
                        </div>
                    </div>

                    {/* Mobil alt navigasyon menüsü */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-10">
                        <div className="flex items-center justify-around">
                            <button
                                onClick={() => setView("list")}
                                className={`flex flex-col items-center justify-center py-2 px-4 ${
                                    viewMode === "list" && !showPomodoro && !showStatistics ?
                                        "text-blue-500" : "text-gray-400"
                                }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                <span className="text-xs mt-1">
                                    {translations[language].listView.split(' ')[0]}
                                </span>
                            </button>

                            <button
                                onClick={() => setView("board")}
                                className={`flex flex-col items-center justify-center py-2 px-4 ${
                                    viewMode === "board" && !showPomodoro && !showStatistics ?
                                        "text-blue-500" : "text-gray-400"
                                }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                <span className="text-xs mt-1">
                                    {translations[language].boardView.split(' ')[0]}
                                </span>
                            </button>

                            <button
                                onClick={() => setView("calendar")}
                                className={`flex flex-col items-center justify-center py-2 px-4 ${
                                    viewMode === "calendar" && !showPomodoro && !showStatistics ?
                                        "text-blue-500" : "text-gray-400"
                                }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs mt-1">
                                    {translations[language].calendarView.split(' ')[0]}
                                </span>
                            </button>

                            <button
                                onClick={toggleStatistics}
                                className={`flex flex-col items-center justify-center py-2 px-4 ${
                                    showStatistics ? "text-blue-500" : "text-gray-400"
                                }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="text-xs mt-1">
                                    {translations[language].statistics.split(' ')[0]}
                                </span>
                            </button>

                            <button
                                onClick={togglePomodoro}
                                className={`flex flex-col items-center justify-center py-2 px-4 ${
                                    showPomodoro ? "text-blue-500" : "text-gray-400"
                                }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs mt-1">
                                    {translations[language].pomodoro.split(' ')[0]}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Ana içerik alanı */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Üst başlık alanı - Mobilde görünür, masaüstünde gizli */}
                        <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                {translations[language].title}
                            </h1>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={toggleSettings}
                                    className="p-2 text-gray-400 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Arama ve filtreleme alanı */}
                        <div className="p-4 bg-gray-800 border-b border-gray-700">
                            {/* Arama kutusu */}
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder={translations[language].search}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Todo form - sadece liste viewde ve pomodoro/statistics inactive ise görünür */}
                            {!showPomodoro && !showStatistics && (
                                <TodoForm
                                    onAdd={handleAddTodo}
                                    language={language}
                                    translations={translations}
                                    darkMode={darkMode}
                                />
                            )}

                            {/* Kategori filtreleri - mobil görünüm */}
                            {!showPomodoro && !showStatistics && (
                                <div className="md:hidden flex flex-wrap gap-1 mt-4">
                                    <button
                                        onClick={() => setCategoryFilter('all')}
                                        className={`px-2 py-1 rounded-lg text-xs ${
                                            categoryFilter === 'all'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        {translations[language].allCategories}
                                    </button>

                                    {Object.keys(translations[language].categories)
                                        .filter(cat => cat !== 'label')
                                        .map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategoryFilter(cat)}
                                                className={`px-2 py-1 rounded-lg text-xs ${
                                                    categoryFilter === cat
                                                        ? `bg-${categoryColors[cat]}-500 text-white`
                                                        : `bg-gray-700 text-gray-300`
                                                }`}
                                            >
                                                {translations[language].categories[cat]}
                                            </button>
                                        ))}
                                </div>
                            )}

                            {/* Etiket filtreleme gösterici */}
                            {tagFilter && !showPomodoro && !showStatistics && (
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-sm text-gray-400">{translations[language].filteringByTag}:</span>
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-700 text-white">
                                        <span>#{tagFilter}</span>
                                        <button
                                            onClick={() => setTagFilter(null)}
                                            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Durum filtreleri - sadece liste viewde ve pomodoro/statistics inactive ise görünür */}
                        {viewMode === "list" && !showPomodoro && !showStatistics && (
                            <div className="p-4 border-b border-gray-700 bg-gray-750">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilter("all")}
                                        className={`px-4 py-1 rounded ${filter === "all" ? "bg-blue-600" : "bg-gray-700"} text-white transition-colors`}
                                    >
                                        {translations[language].all}
                                    </button>
                                    <button
                                        onClick={() => setFilter("active")}
                                        className={`px-4 py-1 rounded ${filter === "active" ? "bg-blue-600" : "bg-gray-700"} text-white transition-colors`}
                                    >
                                        {translations[language].active}
                                    </button>
                                    <button
                                        onClick={() => setFilter("completed")}
                                        className={`px-4 py-1 rounded ${filter === "completed" ? "bg-blue-600" : "bg-gray-700"} text-white transition-colors`}
                                    >
                                        {translations[language].completed}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Ana içerik kaydırılabilir alan */}
                        <div className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
                            {showPomodoro ? (
                                <PomodoroTimer
                                    language={language}
                                    darkMode={darkMode}
                                />
                            ) : showStatistics ? (
                                <StatisticsDashboard
                                    todos={todos}
                                    language={language}
                                />
                            ) : viewMode === "list" ? (
                                <TodoList
                                    todos={getFilteredTodos()}
                                    onToggle={handleToggleTodo}
                                    onRemove={handleRemoveTodo}
                                    onUpdate={handleUpdateTodo}
                                    onTagClick={handleTagClick}
                                    language={language}
                                    translations={translations}
                                    darkMode={darkMode}
                                />
                            ) : viewMode === "board" ? (
                                <TrelloBoard
                                    todos={todos}
                                    onToggle={handleToggleTodo}
                                    onRemove={handleRemoveTodo}
                                    onUpdate={handleUpdateTodo}
                                    onUpdateStatus={handleUpdateTodoStatus}
                                    onTagClick={handleTagClick}
                                    language={language}
                                    translations={translations}
                                    darkMode={darkMode}
                                />
                            ) : (
                                <CalendarView
                                    todos={todos}
                                    onToggle={handleToggleTodo}
                                    onRemove={handleRemoveTodo}
                                    onUpdate={handleUpdateTodo}
                                    language={language}
                                    translations={translations}
                                    darkMode={darkMode}
                                />
                            )}
                        </div>
                    </div>

                    {/* Ayarlar Panel (Koşullu olarak gösteriliyor) */}
                    {settingsOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">{translations[language].settings}</h2>
                                    <button
                                        onClick={toggleSettings}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <Settings
                                    language={language}
                                    setLanguage={setLanguage}
                                    translations={translations}
                                />

                                <button
                                    onClick={handleLogout}
                                    className="w-full mt-6 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    {translations[language].logout}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full flex items-center justify-center">
                    <AuthForm />
                </div>
            )}
        </div>
    );
};

export default App;