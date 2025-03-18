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

// Category colors mapping
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
    const [user] = useAuthState(auth);
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("language") || "tr";
    });
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem("viewMode") || "list";
    });
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tagFilter, setTagFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showPomodoro, setShowPomodoro] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);

    // Load todos when user logs in
    useEffect(() => {
        const loadTodos = async () => {
            if (user) {
                try {
                    const todosData = await TodoService.getTodos();
                    console.log("Loaded todos:", todosData);
                    setTodos(todosData);
                } catch (error) {
                    console.error("Error loading todos:", error);
                }
            }
        };

        loadTodos();
    }, [user]);

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

    // Add todo
    const handleAddTodo = async (newTodo) => {
        try {
            console.log("Adding new todo:", newTodo);
            const updatedTodos = await TodoService.addTodo(newTodo);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    // Toggle todo completion
    const handleToggleTodo = async (id) => {
        try {
            console.log("Toggling todo completion:", id);
            const updatedTodos = await TodoService.toggleTodoCompletion(id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error toggling todo completion:", error);
        }
    };

    // Update todo status (for board view)
    const handleUpdateTodoStatus = async (id, status) => {
        try {
            console.log(`Updating todo ${id} status to ${status}`);

            // First update our local state immediately for better UI responsiveness
            setTodos(prevTodos => prevTodos.map(todo => {
                if (todo.id === id) {
                    return {
                        ...todo,
                        inProgress: status === 'inProgress',
                        completed: status === 'completed',
                        completedAt: status === 'completed' ? new Date().toISOString() : null
                    };
                }
                return todo;
            }));

            // Then update in the service
            const updatedTodos = await TodoService.updateTodoStatus(id, status);

            // If the service returns updated todos, use them
            if (updatedTodos) {
                setTodos(updatedTodos);
            }
        } catch (error) {
            console.error("Error updating todo status:", error);
            // Revert to original todos if there's an error
            const originalTodos = await TodoService.getTodos();
            setTodos(originalTodos);
        }
    };

    // Remove todo
    const handleRemoveTodo = async (id) => {
        try {
            console.log("Removing todo:", id);
            const updatedTodos = await TodoService.removeTodo(id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error removing todo:", error);
        }
    };

    // Update todo
    const handleUpdateTodo = async (updatedTodo) => {
        try {
            console.log("Updating todo:", updatedTodo);
            const updatedTodos = await TodoService.updateTodo(updatedTodo.id, updatedTodo);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    // Get filtered todos
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

    // Set view mode
    const setView = (mode) => {
        setViewMode(mode);
        setShowPomodoro(false);
        setShowStatistics(false);
    };

    // Toggle settings
    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
    };

    // Toggle pomodoro
    const togglePomodoro = () => {
        setShowPomodoro(!showPomodoro);
        if (!showPomodoro) {
            setShowStatistics(false);
        }
    };

    // Toggle statistics
    const toggleStatistics = () => {
        setShowStatistics(!showStatistics);
        if (!showStatistics) {
            setShowPomodoro(false);
        }
    };

    // Handle tag click
    const handleTagClick = (tag) => {
        setTagFilter(tag);
    };

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