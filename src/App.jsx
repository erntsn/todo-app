import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import AuthForm from "./components/AuthForm";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TrelloBoard from "./components/TrelloBoard";
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
        boardView: "Pano Görünümü"
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
        boardView: "Board View"
    }
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

    // Load todos when user logs in
    useEffect(() => {
        if (user) {
            setTodos(TodoService.getTodos());
        }
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
    const handleAddTodo = (newTodo) => {
        TodoService.addTodo(newTodo);
        setTodos(TodoService.getTodos());
    };

    // Toggle todo completion
    const handleToggleTodo = (id) => {
        TodoService.toggleTodoCompletion(id);
        setTodos(TodoService.getTodos());
    };

    // Update todo status
    const handleUpdateTodoStatus = (id, status) => {
        const updatedTodos = TodoService.updateTodoStatus(id, status);
        setTodos(updatedTodos);
    };

    // Remove todo
    const handleRemoveTodo = (id) => {
        TodoService.removeTodo(id);
        setTodos(TodoService.getTodos());
    };

    // Update todo
    const handleUpdateTodo = (updatedTodo) => {
        const updatedTodos = TodoService.updateTodo(updatedTodo.id, updatedTodo);
        setTodos(updatedTodos);
    };

    // Get filtered todos
    const getFilteredTodos = () => {
        switch (filter) {
            case "active":
                return todos.filter(todo => !todo.completed);
            case "completed":
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Çıkış hatası:", error);
        }
    };

    // Toggle view mode
    const toggleViewMode = () => {
        setViewMode(viewMode === "list" ? "board" : "list");
    };

    // Toggle settings
    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
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
                        <TodoForm onAdd={handleAddTodo} language={language} translations={translations} darkMode={darkMode} />

                        <div className="flex justify-between items-center my-4">
                            {/* Filtre butonları sadece liste görünümünde gösterilir */}
                            {viewMode === "list" ? (
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
                                <div></div> // Pano görünümünde buraya boş bir div koyarak düzeni koruyoruz
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={toggleViewMode}
                                    className={`px-4 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition`}
                                >
                                    {viewMode === "list" ? translations[language].boardView : translations[language].listView}
                                </button>
                                <button
                                    onClick={toggleSettings}
                                    className={`px-4 py-1 rounded ${settingsOpen ? "bg-blue-600" : "bg-gray-700"} text-white transition`}
                                >
                                    {translations[language].settings}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {viewMode === "list" ? (
                            <TodoList
                                todos={getFilteredTodos()}
                                onToggle={handleToggleTodo}
                                onRemove={handleRemoveTodo}
                                onUpdate={handleUpdateTodo}
                                language={language}
                                translations={translations}
                                darkMode={darkMode}
                            />
                        ) : (
                            <TrelloBoard
                                todos={todos} // Pano görünümünde tüm görevleri gönderiyoruz, filtreleme yapmadan
                                onToggle={handleToggleTodo}
                                onRemove={handleRemoveTodo}
                                onUpdate={handleUpdateTodo}
                                onUpdateStatus={handleUpdateTodoStatus}
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
                            <button onClick={handleLogout} className="w-full mt-4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
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