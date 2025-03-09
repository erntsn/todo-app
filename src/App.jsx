import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import AuthForm from "./components/AuthForm";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
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
        logout: "Çıkış Yap"
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
        logout: "Logout"
    }
};

const App = () => {
    const [user] = useAuthState(auth);
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [language, setLanguage] = useState("tr");

    useEffect(() => {
        setTodos(TodoService.getTodos());
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Çıkış hatası:", error);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
            {user ? (
                <div className={`max-w-xl w-full ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"} shadow-lg rounded-lg p-6 mx-auto`}>
                    <h1 className={`text-3xl font-bold text-center mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {translations[language].title}
                    </h1>
                    <TodoForm onAdd={setTodos} language={language} translations={translations} darkMode={darkMode} />
                    <div className="flex justify-center gap-2 my-4">
                        <button onClick={() => setFilter("all")} className="px-4 py-1 rounded bg-gray-700 text-white">{translations[language].all}</button>
                        <button onClick={() => setFilter("active")} className="px-4 py-1 rounded bg-gray-700 text-white">{translations[language].active}</button>
                        <button onClick={() => setFilter("completed")} className="px-4 py-1 rounded bg-gray-700 text-white">{translations[language].completed}</button>
                    </div>
                    <TodoList todos={todos} setTodos={setTodos} language={language} translations={translations} darkMode={darkMode} />
                    <Settings darkMode={darkMode} setDarkMode={setDarkMode} language={language} setLanguage={setLanguage} translations={translations} />
                    <button onClick={handleLogout} className="w-full mt-4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        {translations[language].logout}
                    </button>
                </div>
            ) : (
                <AuthForm />
            )}
        </div>
    );
};

export default App;
