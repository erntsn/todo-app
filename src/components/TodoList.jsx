import React, { useMemo, useState } from "react";
import TaskDetailModal from "./TaskDetailModal";

const TodoList = ({ todos = [], onToggle, onRemove, onUpdate, onTagClick, language, translations }) => {
    const [selectedTodo, setSelectedTodo] = useState(null);

    const categoryBadgeClasses = {
        work: "bg-blue-500/25 text-blue-100 border-blue-300/30",
        personal: "bg-purple-500/25 text-purple-100 border-purple-300/30",
        health: "bg-green-500/25 text-green-100 border-green-300/30",
        shopping: "bg-pink-500/25 text-pink-100 border-pink-300/30",
        finance: "bg-yellow-500/25 text-yellow-100 border-yellow-300/30",
        education: "bg-indigo-500/25 text-indigo-100 border-indigo-300/30",
        other: "bg-slate-500/25 text-slate-100 border-slate-300/30"
    };

    const t = translations[language];

    const stats = useMemo(() => {
        const total = todos.length;
        const completed = todos.filter((todo) => todo.completed).length;
        const active = total - completed;
        return { total, completed, active };
    }, [todos]);

    const labels = language === "tr"
        ? { total: "Toplam", active: "Aktif", completed: "Biten" }
        : { total: "Total", active: "Active", completed: "Done" };

    const handleDeleteTodo = (id, e) => {
        e.stopPropagation();

        const confirmMessage = language === "tr"
            ? "Bu görevi silmek istediğinize emin misiniz?"
            : "Are you sure you want to delete this task?";

        if (window.confirm(confirmMessage)) {
            onRemove(id);
        }
    };

    const handleUpdateTodo = async (updatedTodo) => {
        await onUpdate(updatedTodo);
        setSelectedTodo(null);
    };

    return (
        <div className="space-y-3 app-fade-up">
            <div className="grid grid-cols-3 gap-2">
                <div className="surface-panel p-3 text-center">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{labels.total}</p>
                    <p className="text-xl font-bold text-slate-100">{stats.total}</p>
                </div>
                <div className="surface-panel p-3 text-center">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{labels.active}</p>
                    <p className="text-xl font-bold text-sky-200">{stats.active}</p>
                </div>
                <div className="surface-panel p-3 text-center">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{labels.completed}</p>
                    <p className="text-xl font-bold text-emerald-200">{stats.completed}</p>
                </div>
            </div>

            {todos.length > 0 ? (
                todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="todo-card p-3.5 cursor-pointer"
                        onClick={() => setSelectedTodo(todo)}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        onToggle(todo.id);
                                    }}
                                    className="accent-sky-400 h-5 w-5 mt-0.5"
                                />

                                <div className="min-w-0">
                                    <p className={`font-semibold truncate ${todo.completed ? "line-through text-slate-400" : "text-white"}`}>
                                        {todo.text}
                                    </p>

                                    <div className="mt-1.5 text-xs text-slate-200 flex flex-wrap items-center gap-1.5">
                                        {todo.category && (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${categoryBadgeClasses[todo.category] || categoryBadgeClasses.other}`}>
                                                {t.categories[todo.category] || t.categories.other}
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-600/70 bg-slate-900/40">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {todo.date || "-"}
                                        </span>

                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${
                                            todo.priority === "high"
                                                ? "bg-rose-500/20 border-rose-300/30 text-rose-100"
                                                : todo.priority === "medium"
                                                    ? "bg-amber-500/20 border-amber-300/30 text-amber-100"
                                                    : "bg-emerald-500/20 border-emerald-300/30 text-emerald-100"
                                        }`}>
                                            {t.priority[todo.priority] || t.priority.medium}
                                        </span>

                                        {todo.tags && todo.tags.length > 0 && (
                                            <span className="inline-flex items-center gap-1">
                                                {todo.tags.slice(0, 2).map((tag) => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        className="text-sky-200 hover:text-sky-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onTagClick(tag);
                                                        }}
                                                    >
                                                        #{tag}
                                                    </button>
                                                ))}
                                                {todo.tags.length > 2 && <span className="text-slate-400">+{todo.tags.length - 2}</span>}
                                            </span>
                                        )}

                                        {todo.recurring && (
                                            <span className="inline-flex items-center gap-1 text-violet-200" title={`${t.recurrence[todo.recurring.type]}, ${t.every} ${todo.recurring.value}`}>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </span>
                                        )}

                                        {todo.subtasks && todo.subtasks.length > 0 && (
                                            <span className="inline-flex items-center gap-1 text-slate-300">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                {todo.subtasks.filter((subtask) => subtask.completed).length}/{todo.subtasks.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button className="btn-danger px-3 py-1.5 text-sm" onClick={(e) => handleDeleteTodo(todo.id, e)}>
                                {language === "tr" ? "Sil" : "Delete"}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="surface-panel text-center py-8 px-4 text-slate-300">{t.noTodo}</div>
            )}

            {selectedTodo && (
                <TaskDetailModal
                    todo={selectedTodo}
                    onClose={() => setSelectedTodo(null)}
                    onUpdate={handleUpdateTodo}
                    onDelete={onRemove}
                    language={language}
                    translations={translations}
                />
            )}
        </div>
    );
};

export default TodoList;

