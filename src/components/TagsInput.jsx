import React, { useState } from "react";

const TagsInput = ({ tags = [], onChange, language }) => {
    const [inputValue, setInputValue] = useState("");

    const translations = {
        tr: {
            label: "Etiketler",
            placeholder: "Etiket ekle",
            helper: "Enter veya virgül ile ekle",
            example: "Örnek: iş, acil, ev"
        },
        en: {
            label: "Tags",
            placeholder: "Add tag",
            helper: "Press Enter or comma",
            example: "Example: work, urgent, home"
        }
    };

    const t = translations[language] || translations.tr;

    const normalizeTag = (value) => value.trim().replace(/^#+/, "").toLowerCase();

    const addTag = () => {
        const normalized = normalizeTag(inputValue);
        if (!normalized) {
            setInputValue("");
            return;
        }

        if (!tags.includes(normalized)) {
            onChange([...tags, normalized]);
        }

        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="w-full">
            <p className="section-title mb-2.5">{t.label}</p>

            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-sky-300/30 bg-sky-500/20 text-sky-100"
                    >
                        #{tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-sky-100/80 hover:text-white hover:bg-sky-500/35"
                            aria-label={`Remove ${tag}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.placeholder}
                    className="input-elevated pr-28"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                    {t.helper}
                </span>
            </div>

            <p className="mt-1.5 text-xs text-slate-400">{t.example}</p>
        </div>
    );
};

export default TagsInput;

