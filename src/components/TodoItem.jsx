const TodoItem = ({ todo, onToggle, onRemove, onTagClick, language, translations, onOpen }) => {
    const t = translations[language];

    const priorityClass = todo.priority === "high" ? "priority-high" : todo.priority === "low" ? "priority-low" : "priority-medium";

    const catClass = {
        work: "cat-work",
        personal: "cat-personal",
        health: "cat-health",
        shopping: "cat-shopping",
        finance: "cat-finance",
        education: "cat-education",
        other: "cat-other",
    };

    const badgeClass = {
        high: "badge-high",
        medium: "badge-medium",
        low: "badge-low",
    };

    return (
        <div
            className={`todo-card ${priorityClass} ${todo.completed ? "completed-card" : ""} px-4 py-3.5 cursor-pointer`}
            onClick={() => onOpen?.(todo)}
        >
            <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-0.5">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggle(todo.id);
                        }}
                        className="custom-checkbox"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className={`text-[0.95rem] font-medium leading-snug mb-1.5 ${
                        todo.completed
                            ? "line-through text-[var(--text-muted)]"
                            : "text-[var(--text-main)]"
                    }`}>
                        {todo.text}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {todo.category && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.72rem] font-medium ${catClass[todo.category] || catClass.other}`}>
                                {t.categories[todo.category] || t.categories.other}
                            </span>
                        )}

                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.72rem] font-medium ${badgeClass[todo.priority] || badgeClass.medium}`}>
                            {t.priority[todo.priority] || t.priority.medium}
                        </span>

                        {todo.date && (
                            <span className="inline-flex items-center gap-1 text-[0.72rem] text-[var(--text-muted)]">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {todo.date}
                            </span>
                        )}

                        {todo.subtasks && todo.subtasks.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[0.72rem] text-[var(--text-muted)]">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}
                            </span>
                        )}

                        {todo.recurring && (
                            <span className="text-[var(--accent-light)] opacity-70">
                                <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </span>
                        )}

                        {todo.notes && (
                            <span className="text-[var(--text-muted)] opacity-60">
                                <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                        )}

                        {todo.tags && todo.tags.length > 0 &&
                            todo.tags.slice(0, 2).map(tag => (
                                <span
                                    key={tag}
                                    className="tag-chip"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTagClick(tag);
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))
                        }
                        {todo.tags && todo.tags.length > 2 && (
                            <span className="text-[0.72rem] text-[var(--text-muted)]">+{todo.tags.length - 2}</span>
                        )}
                    </div>
                </div>

                {/* Delete */}
                <button
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all ml-1"
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
};

export default TodoItem;
