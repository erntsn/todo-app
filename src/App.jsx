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
        },
        loading: "Yükleniyor...",
        error: "Hata",
        tryAgain: "Tekrar Dene",
        authError: "Kimlik doğrulama hatası"
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
        },
        loading: "Loading...",
        error: "Error",
        tryAgain: "Try Again",
        authError: "Authentication error"
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
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
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

    // Handle dark mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

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
            <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl">{translations[language].loading}</p>
                </div>
            </div>
        );
    }

    // Auth error state
    if (authError) {
        console.error("Kimlik doğrulama hatası:", authError);
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-xl font-bold mb-2">{translations[language].authError}</h2>
                    <p className="mb-4">{authError.message}</p>
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
        <div className="h-screen w-screen flex items-stretch overflow-hidden bg-gray-100 dark:bg-gray-900">
            {user ? (
                <div className={`flex flex-col w-full h-full ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
                    {/* Fixed Header */}
                    <div className={`sticky top-0 z-10 p-4 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <h1 className={`text-3xl font-bold text-center mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {translations[language].title}
                        </h1>

                        {/* Search bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder={translations[language].search}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full p-2 rounded border ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            />
                        </div>

                        {/* Only show the todo form if not in pomodoro or statistics view */}
                        {!showPomodoro && !showStatistics && (
                            <TodoForm
                                onAdd={handleAddTodo}
                                language={language}
                                translations={translations}
                                darkMode={darkMode}
                            />
                        )}

                        {/* Category filters */}
                        {!showPomodoro && !showStatistics && (
                            <div className="flex flex-wrap gap-1 my-2">
                                <button
                                    onClick={() => setCategoryFilter('all')}
                                    className={`px-2 py-1 rounded-lg text-xs ${
                                        categoryFilter === 'all'
                                            ? 'bg-blue-500 text-white'
                                            : darkMode
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {translations[language].allCategories}
                                </button>

                                {Object.keys(translations[language].categories).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        className={`px-2 py-1 rounded-lg text-xs ${
                                            categoryFilter === cat
                                                ? `bg-${categoryColors[cat]}-500 text-white`
                                                : darkMode
                                                    ? 'bg-gray-700 text-gray-300'
                                                    : `bg-${categoryColors[cat]}-100 text-${categoryColors[cat]}-800`
                                        }`}
                                    >
                                        {translations[language].categories[cat]}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tag filter indicator */}
                        {tagFilter && !showPomodoro && !showStatistics && (
                            <div className="flex items-center gap-2 my-2">
                                <span className="text-sm">{translations[language].filteringByTag}:</span>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                    darkMode
                                        ? 'bg-blue-700 text-white'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
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

                        <div className="flex justify-between items-center my-4">
                            {/* Status filter buttons - only show in list view and not in pomodoro/statistics */}
                            {viewMode === "list" && !showPomodoro && !showStatistics ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilter("all")}
                                        className={`px-4 py-1 rounded ${filter === "all" ? "bg-blue-600" : "bg-gray-700"} text-white`}
                                    >
                                        {translations[language].all}
                                    </button>
                                    <button
                                        onClick={() => setFilter("active")}
                                        className={`px-4 py-1 rounded ${filter === "active" ? "bg-blue-600" : "bg-gray-700"} text-white`}
                                    >
                                        {translations[language].active}
                                    </button>
                                    <button
                                        onClick={() => setFilter("completed")}
                                        className={`px-4 py-1 rounded ${filter === "completed" ? "bg-blue-600" : "bg-gray-700"} text-white`}
                                    >
                                        {translations[language].completed}
                                    </button>
                                </div>
                            ) : (
                                <div></div> // Empty div for spacing
                            )}

                            {/* View mode buttons */}
                            <div className="flex gap-2">
                                {/* List View */}
                                <button
                                    onClick={() => setView("list")}
                                    className={`px-3 py-1 rounded ${viewMode === "list" && !showPomodoro && !showStatistics ? "bg-blue-600" : "bg-gray-700"} text-white transition`}
                                >
                                    {translations[language].listView}
                                </button>

                                {/* Board View */}
                                <button
                                    onClick={() => setView("board")}
                                    className={`px-3 py-1 rounded ${viewMode === "board" && !showPomodoro && !showStatistics ? "bg-blue-600" : "bg-gray-700"} text-white transition`}
                                >
                                    {translations[language].boardView}
                                </button>

                                {/* Calendar View */}
                                <button
                                    onClick={() => setView("calendar")}
                                    className={`px-3 py-1 rounded ${viewMode === "calendar" && !showPomodoro && !showStatistics ? "bg-blue-600" : "bg-gray-700"} text-white transition`}
                                >
                                    {translations[language].calendarView}
                                </button>

                                {/* Statistics Button */}
                                <button
                                    onClick={toggleStatistics}
                                    className={`px-3 py-1 rounded ${showStatistics ? "bg-blue-600" : "bg-gray-700"} text-white transition`}
                                >
                                    {translations[language].statistics}
                                </button>

                                {/* Pomodoro Button */}
                                <button
                                    onClick={togglePomodoro}
                                    className={`px-3 py-1 rounded ${showPomodoro ? "bg-blue-600" : "bg-gray-700"} text-white transition`}
                                >
                                    {translations[language].pomodoro}
                                </button>

                                {/* Settings Button */}
                                <button
                                    onClick={toggleSettings}
                                    className={`px-3 py-1 rounded ${settingsOpen ? "bg-blue-600" : "bg-gray-700"} text-white transition`}
                                >
                                    {translations[language].settings}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4">
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
                                todos={todos} // Send all todos for board view, it handles its own grouping
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
                                todos={todos} // Send all todos for calendar view
                                onToggle={handleToggleTodo}
                                onRemove={handleRemoveTodo}
                                onUpdate={handleUpdateTodo}
                                language={language}
                                translations={translations}
                                darkMode={darkMode}
                            />
                        )}
                    </div>

                    {/* Settings Panel (Conditionally Rendered) */}
                    {settingsOpen && (
                        <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                            <Settings
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                                language={language}
                                setLanguage={setLanguage}
                                translations={translations}
                            />
                            <button
                                onClick={handleLogout}
                                className="w-full mt-4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                {translations[language].logout}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full flex items-center justify-center">
                    <AuthForm />
                </div>
            )}
        </div>
    );
};

export default App;