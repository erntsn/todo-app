import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TodoForm = ({ onAdd, language, translations }) => {
    const [text, setText] = useState("");
    const [priority, setPriority] = useState("medium");
    const [date, setDate] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd({
            id: uuidv4(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            priority,
            date: date || null,
            tags: [],
            category: "other",
        });
        setText("");
        setPriority("medium");
        setDate("");
        setIsExpanded(false);
    };

    const t = translations[language];

    const priorities = [
        { key: "low",    label: t.priority.low,    classes: "text-emerald-400 border-emerald-500/40", activeClasses: "bg-emerald-500/20 border-emerald-400/60 text-emerald-300" },
        { key: "medium", label: t.priority.medium, classes: "text-amber-400 border-amber-500/40",   activeClasses: "bg-amber-500/20 border-amber-400/60 text-amber-300" },
        { key: "high",   label: t.priority.high,   classes: "text-red-400 border-red-500/40",       activeClasses: "bg-red-500/20 border-red-400/60 text-red-300" },
    ];

    return (
        <div className="rounded-xl border border-[var(--border-soft)] bg-[rgba(26,25,40,0.7)] overflow-hidden">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[rgba(139,92,246,0.3)] flex-shrink-0" />
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t.newTodo}
                        onFocus={() => setIsExpanded(true)}
                        className="flex-1 bg-transparent border-none outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] text-[0.95rem] font-medium"
                    />
                    {text && (
                        <button
                            type="submit"
                            className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow shadow-violet-500/30 transition-shadow hover:shadow-violet-500/50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    )}
                </div>

                {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-[var(--border-soft)] space-y-3">
                        <div className="flex gap-2">
                            {priorities.map(({ key, label, classes, activeClasses }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setPriority(key)}
                                    className={`flex-1 px-2 py-2 rounded-lg border text-xs font-semibold transition-all ${
                                        priority === key ? activeClasses : classes
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="input-elevated !py-2 text-sm"
                        />

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => { setIsExpanded(false); setText(""); }}
                                className="btn-ghost flex-1 py-2.5 text-sm"
                            >
                                {t.cancel || "İptal"}
                            </button>
                            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
                                {t.addButton}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default TodoForm;
