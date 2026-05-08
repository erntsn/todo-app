import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TodoForm = ({ onAdd, language, translations }) => {
    const [text, setText] = useState("");
    const [priority, setPriority] = useState("medium");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("other");
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            const newTodo = {
                id: uuidv4(),
                text: text.trim(),
                completed: false,
                createdAt: new Date().toISOString(),
                priority,
                date: date || null,
                tags: [],
                category,
            };

            onAdd(newTodo);
            setText("");
            setPriority("medium");
            setDate("");
            setCategory("other");
            setIsExpanded(false);
        }
    };

    const priorityClass = (level) => {
        const active = priority === level;
        if (active && level === "low") return "bg-emerald-500/80 text-slate-950";
        if (active && level === "medium") return "bg-amber-400/90 text-slate-950";
        if (active && level === "high") return "bg-rose-400/90 text-slate-950";
        return "bg-slate-800 text-slate-300 hover:bg-slate-700";
    };

    return (
        <div className="surface-panel mb-2 overflow-hidden app-fade-up border border-slate-600/65">
            <form onSubmit={handleSubmit}>
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-slate-500"></div>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={translations[language].newTodo}
                            className="input-elevated !py-2 text-base md:text-lg"
                            required
                            onFocus={() => setIsExpanded(true)}
                        />
                    </div>
                </div>

                {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-700/70 bg-slate-900/30">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">{translations[language].priority.label || "Priority"}</label>
                                <div className="flex rounded-xl overflow-hidden border border-slate-700/70">
                                    <button type="button" onClick={() => setPriority("low")} className={`flex-1 px-2 py-2 text-xs font-bold transition ${priorityClass("low")}`}>
                                        {translations[language].priority.low}
                                    </button>
                                    <button type="button" onClick={() => setPriority("medium")} className={`flex-1 px-2 py-2 text-xs font-bold transition ${priorityClass("medium")}`}>
                                        {translations[language].priority.medium}
                                    </button>
                                    <button type="button" onClick={() => setPriority("high")} className={`flex-1 px-2 py-2 text-xs font-bold transition ${priorityClass("high")}`}>
                                        {translations[language].priority.high}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">{translations[language].date || "Date"}</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-elevated !py-2" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">{translations[language].category || "Category"}</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-elevated !py-2">
                                    {Object.keys(translations[language].categories)
                                        .filter(cat => cat !== "label")
                                        .map(cat => (
                                            <option key={cat} value={cat}>{translations[language].categories[cat]}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`p-4 border-t border-slate-700/70 bg-slate-900/35 flex justify-end ${!isExpanded ? "hidden" : ""}`}>
                    <button type="button" onClick={() => setIsExpanded(false)} className="btn-ghost px-4 py-2 text-sm mr-2">
                        {translations[language].cancel || "Cancel"}
                    </button>
                    <button type="submit" className="btn-primary px-4 py-2 text-sm">
                        {translations[language].addButton}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TodoForm;
