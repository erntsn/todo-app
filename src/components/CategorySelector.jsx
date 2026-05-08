const CategorySelector = ({ category, onChange, language }) => {
    const translations = {
        tr: {
            category: "Kategori",
            categories: {
                work: "\u0130\u015f",
                personal: "Ki\u015fisel",
                health: "Sa\u011fl\u0131k",
                shopping: "Al\u0131\u015fveri\u015f",
                finance: "Finans",
                education: "E\u011fitim",
                other: "Di\u011fer"
            }
        },
        en: {
            category: "Category",
            categories: {
                work: "Work",
                personal: "Personal",
                health: "Health",
                shopping: "Shopping",
                finance: "Finance",
                education: "Education",
                other: "Other"
            }
        }
    };

    const t = translations[language] || translations.tr;
    const categoryOptions = Object.keys(t.categories);

    const selectedClassByCategory = {
        work: "bg-blue-500/35 border-blue-300/45 text-blue-100",
        personal: "bg-purple-500/35 border-purple-300/45 text-purple-100",
        health: "bg-emerald-500/35 border-emerald-300/45 text-emerald-100",
        shopping: "bg-pink-500/35 border-pink-300/45 text-pink-100",
        finance: "bg-amber-500/35 border-amber-300/45 text-amber-100",
        education: "bg-indigo-500/35 border-indigo-300/45 text-indigo-100",
        other: "bg-slate-500/35 border-slate-300/45 text-slate-100"
    };

    const dotClassByCategory = {
        work: "bg-blue-300",
        personal: "bg-purple-300",
        health: "bg-emerald-300",
        shopping: "bg-pink-300",
        finance: "bg-amber-300",
        education: "bg-indigo-300",
        other: "bg-slate-300"
    };

    return (
        <div className="w-full">
            <p className="section-title mb-2.5">{t.category}</p>

            <div className="flex flex-wrap gap-2">
                {categoryOptions.map((cat) => {
                    const isActive = category === cat;

                    return (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => onChange(cat)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition ${
                                isActive
                                    ? selectedClassByCategory[cat] || selectedClassByCategory.other
                                    : "bg-slate-900/45 text-slate-200 border-slate-700/60 hover:border-slate-500/70 hover:bg-slate-800/70"
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${dotClassByCategory[cat] || dotClassByCategory.other}`}></span>
                            {t.categories[cat]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySelector;

