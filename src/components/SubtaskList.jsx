import React, { useMemo, useState } from "react";

const SubtaskList = ({ subtasks = [], onUpdate, language = "tr" }) => {
    const [newSubtask, setNewSubtask] = useState("");

    const translations = {
        tr: {
            title: "Alt Görevler",
            addPlaceholder: "Yeni alt görev",
            addButton: "Ekle",
            noSubtasks: "Henüz alt görev yok"
        },
        en: {
            title: "Subtasks",
            addPlaceholder: "New subtask",
            addButton: "Add",
            noSubtasks: "No subtasks yet"
        }
    };

    const t = translations[language] || translations.tr;

    const completedCount = useMemo(
        () => subtasks.filter((subtask) => subtask.completed).length,
        [subtasks]
    );

    const handleAddSubtask = (e) => {
        e.preventDefault();
        const trimmed = newSubtask.trim();

        if (!trimmed) {
            return;
        }

        onUpdate([
            ...subtasks,
            {
                id: Date.now().toString(),
                text: trimmed,
                completed: false
            }
        ]);

        setNewSubtask("");
    };

    const toggleSubtask = (id) => {
        const updatedSubtasks = subtasks.map((subtask) =>
            subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
        );

        onUpdate(updatedSubtasks);
    };

    const removeSubtask = (id) => {
        onUpdate(subtasks.filter((subtask) => subtask.id !== id));
    };

    return (
        <div className="surface-panel p-4">
            <div className="flex items-center justify-between mb-3">
                <p className="section-title !text-slate-300">{t.title}</p>
                <span className="text-xs text-slate-400">
                    {completedCount}/{subtasks.length}
                </span>
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder={t.addPlaceholder}
                    className="input-elevated !py-2.5"
                />
                <button type="submit" className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap">
                    {t.addButton}
                </button>
            </form>

            {subtasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-600/70 px-3 py-3 text-sm text-slate-400">
                    {t.noSubtasks}
                </div>
            ) : (
                <ul className="space-y-2">
                    {subtasks.map((subtask) => (
                        <li
                            key={subtask.id}
                            className="flex items-center justify-between gap-2 rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2"
                        >
                            <label className="flex items-center gap-2.5 min-w-0">
                                <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={() => toggleSubtask(subtask.id)}
                                    className="accent-sky-400 h-4 w-4"
                                />
                                <span className={`text-sm truncate ${subtask.completed ? "line-through text-slate-400" : "text-slate-100"}`}>
                                    {subtask.text}
                                </span>
                            </label>

                            <button
                                type="button"
                                onClick={() => removeSubtask(subtask.id)}
                                className="btn-ghost !p-0 h-7 w-7 flex items-center justify-center text-slate-300 hover:text-rose-200"
                                aria-label="Delete subtask"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SubtaskList;

