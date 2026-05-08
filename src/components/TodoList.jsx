import React, { useState, useCallback } from "react";
import TaskDetailModal from "./TaskDetailModal";

const badgeClass = { high: "badge-high", medium: "badge-medium", low: "badge-low" };

const EmptyState = ({ allEmpty, language }) => {
    if (allEmpty) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center app-fade-up select-none">
                {/* Illustration */}
                <div className="relative mb-6 empty-float">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[rgba(139,92,246,0.18)] to-[rgba(99,102,241,0.1)] border border-[rgba(139,92,246,0.2)] flex items-center justify-center shadow-[0_8px_32px_rgba(139,92,246,0.15)]">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            {/* clipboard body */}
                            <rect x="10" y="10" width="28" height="34" rx="4" stroke="rgba(167,139,250,0.6)" strokeWidth="1.8" fill="rgba(139,92,246,0.08)" />
                            {/* clip */}
                            <rect x="18" y="7" width="12" height="6" rx="3" stroke="rgba(167,139,250,0.6)" strokeWidth="1.6" fill="rgba(30,24,60,0.9)" />
                            {/* lines */}
                            <line x1="16" y1="22" x2="32" y2="22" stroke="rgba(167,139,250,0.35)" strokeWidth="1.6" strokeLinecap="round" />
                            <line x1="16" y1="28" x2="28" y2="28" stroke="rgba(167,139,250,0.25)" strokeWidth="1.6" strokeLinecap="round" />
                            <line x1="16" y1="34" x2="24" y2="34" stroke="rgba(167,139,250,0.18)" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </div>
                    {/* sparkles */}
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-400 opacity-60 blur-[1px]" />
                    <span className="absolute bottom-1 -left-2 w-2 h-2 rounded-full bg-indigo-400 opacity-40 blur-[1px]" />
                </div>

                <p className="text-base font-semibold text-[var(--text-main)] mb-1.5">
                    {language === "tr" ? "Henüz görev yok" : "No tasks yet"}
                </p>
                <p className="text-sm text-[var(--text-muted)] max-w-[200px] leading-relaxed">
                    {language === "tr"
                        ? "Sağ alttaki + butonuna dokun ve ilk görevini ekle"
                        : "Tap the + button to add your first task"}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-16 text-center app-fade-up select-none">
            {/* Illustration */}
            <div className="relative mb-6 empty-float">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[rgba(139,92,246,0.12)] to-[rgba(99,102,241,0.07)] border border-[rgba(139,92,246,0.15)] flex items-center justify-center shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        {/* magnifier */}
                        <circle cx="21" cy="21" r="11" stroke="rgba(167,139,250,0.5)" strokeWidth="1.8" fill="rgba(139,92,246,0.07)" />
                        <line x1="29" y1="29" x2="38" y2="38" stroke="rgba(167,139,250,0.5)" strokeWidth="2.2" strokeLinecap="round" />
                        {/* X inside */}
                        <line x1="17" y1="17" x2="25" y2="25" stroke="rgba(167,139,250,0.4)" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="25" y1="17" x2="17" y2="25" stroke="rgba(167,139,250,0.4)" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-400 opacity-50 blur-[1px]" />
                <span className="absolute bottom-0 -left-2 w-2 h-2 rounded-full bg-indigo-400 opacity-35 blur-[1px]" />
            </div>

            <p className="text-base font-semibold text-[var(--text-main)] mb-1.5">
                {language === "tr" ? "Sonuç bulunamadı" : "No results found"}
            </p>
            <p className="text-sm text-[var(--text-muted)] max-w-[200px] leading-relaxed">
                {language === "tr"
                    ? "Farklı bir filtre veya arama terimi dene"
                    : "Try a different filter or search term"}
            </p>
        </div>
    );
};

const TodoList = ({ todos = [], allEmpty = false, onToggle, onRemove, onUpdate, language, translations }) => {
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [poppingIds, setPoppingIds] = useState(new Set());
    const t = translations[language];

    const handleToggle = useCallback((id) => {
        setPoppingIds(prev => new Set(prev).add(id));
        onToggle(id);
        setTimeout(() => setPoppingIds(prev => { const next = new Set(prev); next.delete(id); return next; }), 380);
    }, [onToggle]);

    const handleUpdate = async (updated) => {
        await onUpdate(updated);
        setSelectedTodo(null);
    };

    if (todos.length === 0) {
        return <EmptyState allEmpty={allEmpty} language={language} />;
    }

    return (
        <div className="space-y-2">
            {todos.map((todo, index) => {
                const p = todo.priority === "high" ? "priority-high" : todo.priority === "low" ? "priority-low" : "priority-medium";
                const subtasksDone = (todo.subtasks || []).filter(s => s.completed).length;
                const subtasksTotal = (todo.subtasks || []).length;
                const isPopping = poppingIds.has(todo.id);

                return (
                    <div
                        key={todo.id}
                        className={`todo-card ${p} ${todo.completed ? "completed-card" : ""} ${isPopping ? "card-pop" : "card-enter"} px-4 py-3.5 cursor-pointer`}
                        style={{ animationDelay: isPopping ? "0ms" : `${index * 40}ms` }}
                        onClick={() => setSelectedTodo(todo)}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 pt-0.5">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={(e) => { e.stopPropagation(); handleToggle(todo.id); }}
                                    className="custom-checkbox"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`text-[0.95rem] font-medium leading-snug ${
                                    todo.completed ? "line-through text-[var(--text-muted)]" : "text-[var(--text-main)]"
                                }`}>
                                    {todo.text}
                                </p>

                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                    <span className={`px-2 py-0.5 rounded-full text-[0.7rem] font-medium ${badgeClass[todo.priority] || badgeClass.medium}`}>
                                        {t.priority[todo.priority] || t.priority.medium}
                                    </span>

                                    {todo.date && (
                                        <span className="inline-flex items-center gap-1 text-[0.7rem] text-[var(--text-muted)]">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {todo.date}
                                        </span>
                                    )}

                                    {subtasksTotal > 0 && (
                                        <span className="inline-flex items-center gap-1 text-[0.7rem] text-[var(--text-muted)]">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            {subtasksDone}/{subtasksTotal}
                                        </span>
                                    )}

                                    {todo.notes && (
                                        <svg className="w-3 h-3 text-[var(--text-muted)] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            <button
                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(todo.id);
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                );
            })}

            {selectedTodo && (
                <TaskDetailModal
                    todo={selectedTodo}
                    onClose={() => setSelectedTodo(null)}
                    onUpdate={handleUpdate}
                    onDelete={onRemove}
                    language={language}
                    translations={translations}
                />
            )}
        </div>
    );
};

export default TodoList;
