import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";

const AddTaskSheet = ({ open, onClose, onAdd, language, translations }) => {
    const [text, setText] = useState("");
    const [priority, setPriority] = useState("medium");
    const [date, setDate] = useState("");
    const inputRef = useRef(null);

    const t = translations[language];

    useEffect(() => {
        if (open) {
            setText("");
            setPriority("medium");
            setDate("");
            setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [open]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

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
        onClose();
    };

    const priorities = [
        { key: "low",    label: t.priority.low,    active: "bg-emerald-500/20 border-emerald-400/60 text-emerald-300", base: "border-[var(--border-soft)] text-[var(--text-muted)]" },
        { key: "medium", label: t.priority.medium, active: "bg-amber-500/20 border-amber-400/60 text-amber-300",       base: "border-[var(--border-soft)] text-[var(--text-muted)]" },
        { key: "high",   label: t.priority.high,   active: "bg-red-500/20 border-red-400/60 text-red-300",             base: "border-[var(--border-soft)] text-[var(--text-muted)]" },
    ];

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[rgba(6,5,12,0.75)] backdrop-blur-md" onClick={onClose} />

            {/* Sheet */}
            <div className="relative w-full sm:max-w-md modal-panel app-fade-up rounded-t-[22px] sm:rounded-[22px]">
                {/* Pull handle (mobile) */}
                <div className="sm:hidden flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-[var(--border-medium)]" />
                </div>

                <form onSubmit={handleSubmit} className="px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-[var(--text-main)]">
                            {language === "tr" ? "Yeni Görev" : "New Task"}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Title input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t.newTodo}
                        className="w-full bg-[rgba(26,25,40,0.8)] border border-[var(--border-soft)] rounded-xl px-4 py-3.5 text-[var(--text-main)] placeholder:text-[var(--text-muted)] text-base font-medium outline-none focus:border-[rgba(139,92,246,0.5)] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all"
                    />

                    {/* Priority */}
                    <div>
                        <p className="section-title mb-2">{t.priority?.label || "Öncelik"}</p>
                        <div className="flex gap-2">
                            {priorities.map(({ key, label, active, base }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setPriority(key)}
                                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                                        priority === key ? active : base
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <p className="section-title mb-2">{language === "tr" ? "Tarih" : "Date"}</p>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="input-elevated !py-3 text-sm"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="btn-primary w-full py-3.5 text-[0.95rem] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {language === "tr" ? "Ekle" : "Add Task"}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddTaskSheet;
