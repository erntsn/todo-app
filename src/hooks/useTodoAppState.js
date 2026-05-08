import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import TodoService from "../services/TodoService";

export default function useTodoAppState() {
    const [user, loading, authError] = useAuthState(auth);

    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState("all");
    const [language, setLanguage] = useState(() => localStorage.getItem("language") || "tr");
    const [viewMode, setViewMode] = useState(() => localStorage.getItem("viewMode") || "list");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [tagFilter, setTagFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showPomodoro, setShowPomodoro] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);

    const darkMode = true;

    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem("viewMode", viewMode);
    }, [viewMode]);

    useEffect(() => {
        let isMounted = true;

        const loadTodos = async () => {
            if (user) {
                try {
                    const todosData = await TodoService.getTodos();
                    if (isMounted) {
                        setTodos(todosData);
                    }
                } catch (error) {
                    console.error("Todo yükleme hatası:", error);
                }
            } else if (!loading && isMounted) {
                setTodos([]);
            }
        };

        loadTodos();

        return () => {
            isMounted = false;
        };
    }, [user, loading]);

    const handleAddTodo = useCallback(async (newTodo) => {
        try {
            const updatedTodos = await TodoService.addTodo(newTodo);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error adding todo:", error);
            alert(language === "tr" ? "Görev eklenirken bir hata oluştu." : "Error adding task.");
        }
    }, [language]);

    const handleToggleTodo = useCallback(async (id) => {
        if (!id) {
            console.error("Invalid ID provided to handleToggleTodo");
            return;
        }

        try {
            const updatedTodos = await TodoService.toggleTodoCompletion(id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error toggling todo completion:", error);
            alert(language === "tr" ? "Görev durumu değiştirilirken bir hata oluştu." : "Error toggling task status.");
        }
    }, [language]);

    const handleUpdateTodoStatus = useCallback(async (id, status) => {
        if (!id) {
            console.error("Invalid ID provided to handleUpdateTodoStatus");
            return;
        }

        try {
            const updatedTodos = await TodoService.updateTodoStatus(id, status);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Todo durumu güncellenirken hata:", error);
            alert(language === "tr" ? "Görev durumu güncellenirken bir hata oluştu." : "Error updating task status.");
        }
    }, [language]);

    const handleRemoveTodo = useCallback(async (id) => {
        if (!id) {
            console.error("Invalid ID provided to handleRemoveTodo");
            return;
        }

        try {
            const updatedTodos = await TodoService.removeTodo(id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error removing todo:", error);
            alert(language === "tr" ? "Görev silinirken bir hata oluştu." : "Error removing task.");
        }
    }, [language]);

    const handleUpdateTodo = useCallback(async (updatedTodo) => {
        if (!updatedTodo || !updatedTodo.id) {
            console.error("Invalid todo or missing ID in handleUpdateTodo", updatedTodo);
            return;
        }

        try {
            const updatedTodos = await TodoService.updateTodo(updatedTodo.id, updatedTodo);
            setTodos(updatedTodos);
        } catch (error) {
            console.error("Error updating todo:", error);
            alert(language === "tr" ? "Görev güncellenirken bir hata oluştu." : "Error updating task.");
        }
    }, [language]);

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Çıkış hatası:", error);
        }
    }, []);

    const setView = useCallback((mode) => {
        setViewMode(mode);
        setShowPomodoro(false);
        setShowStatistics(false);
    }, []);

    const toggleSettings = useCallback(() => {
        setSettingsOpen(prev => !prev);
    }, []);

    const togglePomodoro = useCallback(() => {
        setShowPomodoro(prev => {
            const next = !prev;
            if (next) {
                setShowStatistics(false);
            }
            return next;
        });
    }, []);

    const toggleStatistics = useCallback(() => {
        setShowStatistics(prev => {
            const next = !prev;
            if (next) {
                setShowPomodoro(false);
            }
            return next;
        });
    }, []);

    const handleTagClick = useCallback((tag) => {
        setTagFilter(tag);
    }, []);

    const filteredTodos = useMemo(() => {
        let filtered = [...todos];

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

        if (categoryFilter !== "all") {
            filtered = filtered.filter(todo => todo.category === categoryFilter);
        }

        if (tagFilter) {
            filtered = filtered.filter(todo => todo.tags && todo.tags.includes(tagFilter));
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(todo =>
                todo.text.toLowerCase().includes(query) ||
                (todo.notes && todo.notes.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [todos, filter, categoryFilter, tagFilter, searchQuery]);

    return {
        user,
        loading,
        authError,
        darkMode,
        todos,
        filteredTodos,
        filter,
        setFilter,
        language,
        setLanguage,
        viewMode,
        settingsOpen,
        searchQuery,
        setSearchQuery,
        tagFilter,
        setTagFilter,
        categoryFilter,
        setCategoryFilter,
        showPomodoro,
        showStatistics,
        setView,
        toggleSettings,
        togglePomodoro,
        toggleStatistics,
        handleTagClick,
        handleAddTodo,
        handleToggleTodo,
        handleUpdateTodoStatus,
        handleRemoveTodo,
        handleUpdateTodo,
        handleLogout
    };
}
