const WorkspaceControls = ({
    language,
    translations,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    todos,
    viewMode,
}) => {
    const t = translations[language];
    const active = todos.filter(td => !td.completed).length;
    const completed = todos.filter(td => td.completed).length;

    return (
        <div className="flex-shrink-0 space-y-2.5 mb-3">
            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-elevated pl-10 pr-10 text-sm"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Filter + count — only in list view */}
            {viewMode === "list" && (
                <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <button onClick={() => setFilter("all")} className={`status-chip ${filter === "all" ? "active" : ""}`}>{t.all}</button>
                        <button onClick={() => setFilter("active")} className={`status-chip ${filter === "active" ? "active" : ""}`}>{t.active}</button>
                        <button onClick={() => setFilter("completed")} className={`status-chip ${filter === "completed" ? "active" : ""}`}>{t.completed}</button>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                        {active} {language === "tr" ? "aktif" : "left"}
                        {completed > 0 && ` · ${completed} ${language === "tr" ? "biten" : "done"}`}
                    </span>
                </div>
            )}
        </div>
    );
};

export default WorkspaceControls;
