import TodoForm from "../TodoForm";

const WorkspaceControls = ({
    language,
    translations,
    toggleSettings,
    searchQuery,
    setSearchQuery,
    showPomodoro,
    showStatistics,
    handleAddTodo,
    darkMode,
    categoryFilter,
    setCategoryFilter,
    categoryStyles,
    tagFilter,
    setTagFilter,
    viewMode,
    filter,
    setFilter
}) => {
    const t = translations[language];
    const categoryKeys = Object.keys(t.categories).filter(cat => cat !== "label");

    return (
        <>
            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-600/70 bg-slate-950/60 backdrop-blur-xl">
                <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-amber-200">
                    {t.title}
                </h1>

                <button onClick={toggleSettings} className="btn-ghost h-10 w-10 flex items-center justify-center !p-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            <div className="px-4 pt-4 pb-3 border-b border-slate-600/65 bg-slate-950/38 backdrop-blur-xl">
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder={t.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-elevated pl-10 pr-11"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-300 hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {!showPomodoro && !showStatistics && (
                    <TodoForm
                        onAdd={handleAddTodo}
                        language={language}
                        translations={translations}
                        darkMode={darkMode}
                    />
                )}

                {!showPomodoro && !showStatistics && (
                    <div className="md:hidden flex flex-wrap gap-2 mt-4">
                        <button
                            onClick={() => setCategoryFilter("all")}
                            className={`status-chip ${categoryFilter === "all" ? "active" : ""}`}
                        >
                            {t.allCategories}
                        </button>

                        {categoryKeys.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`status-chip ${
                                    categoryFilter === cat
                                        ? (categoryStyles[cat]?.mobile || categoryStyles.other.mobile)
                                        : ""
                                }`}
                            >
                                {t.categories[cat]}
                            </button>
                        ))}
                    </div>
                )}

                {tagFilter && !showPomodoro && !showStatistics && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-300">
                        <span>{t.filteringByTag}:</span>
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-sky-500/25 border border-sky-300/30 text-sky-100">
                            <span>#{tagFilter}</span>
                            <button onClick={() => setTagFilter(null)} className="hover:text-red-200">×</button>
                        </div>
                    </div>
                )}
            </div>

            {viewMode === "list" && !showPomodoro && !showStatistics && (
                <div className="px-4 py-3 border-b border-slate-600/60 bg-slate-950/34">
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setFilter("all")} className={`status-chip ${filter === "all" ? "active" : ""}`}>{t.all}</button>
                        <button onClick={() => setFilter("active")} className={`status-chip ${filter === "active" ? "active" : ""}`}>{t.active}</button>
                        <button onClick={() => setFilter("completed")} className={`status-chip ${filter === "completed" ? "active" : ""}`}>{t.completed}</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default WorkspaceControls;
