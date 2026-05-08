const DesktopSidebar = ({
    user,
    language,
    translations,
    viewMode,
    showPomodoro,
    showStatistics,
    categoryFilter,
    setView,
    toggleStatistics,
    togglePomodoro,
    setCategoryFilter,
    categoryStyles,
    toggleSettings,
    handleLogout
}) => {
    const t = translations[language];
    const categoryKeys = Object.keys(t.categories).filter(cat => cat !== "label");

    const navClass = (isActive) => `nav-pill ${isActive ? "nav-pill-active" : ""}`;

    const catDotColors = {
        work: "bg-blue-400",
        personal: "bg-violet-400",
        health: "bg-emerald-400",
        shopping: "bg-pink-400",
        finance: "bg-amber-400",
        education: "bg-indigo-400",
        other: "bg-slate-400",
    };

    return (
        <div className="content-wrap hidden md:flex w-64 flex-shrink-0 flex-col p-4 app-fade-up">
            <div className="glass-panel h-full p-5 flex flex-col">

                {/* Logo */}
                <div className="flex items-center gap-2.5 mb-7">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h1 className="text-lg font-bold text-[var(--text-main)]">
                        {t.title}
                    </h1>
                </div>

                {/* User */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(139,92,246,0.08)] border border-[var(--border)] mb-6">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow shadow-violet-500/25">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-main)] truncate">{user.email}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{user.displayName || "Kullanıcı"}</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="space-y-1 mb-6 stagger-in">
                    <button onClick={() => setView("list")} className={navClass(viewMode === "list" && !showPomodoro && !showStatistics)}>
                        <svg className="w-[18px] h-[18px] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {t.listView}
                    </button>
                    <button onClick={() => setView("board")} className={navClass(viewMode === "board" && !showPomodoro && !showStatistics)}>
                        <svg className="w-[18px] h-[18px] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} />
                            <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} />
                            <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} />
                            <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} />
                        </svg>
                        {t.boardView}
                    </button>
                    <button onClick={() => setView("calendar")} className={navClass(viewMode === "calendar" && !showPomodoro && !showStatistics)}>
                        <svg className="w-[18px] h-[18px] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {t.calendarView}
                    </button>
                    <button onClick={toggleStatistics} className={navClass(showStatistics)}>
                        <svg className="w-[18px] h-[18px] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {t.statistics}
                    </button>
                    <button onClick={togglePomodoro} className={navClass(showPomodoro)}>
                        <svg className="w-[18px] h-[18px] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" strokeWidth={2} />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
                        </svg>
                        {t.pomodoro}
                    </button>
                </nav>

                {/* Categories */}
                <div className="mb-6">
                    <p className="section-title mb-3 px-1">{t.categories.label || "Kategoriler"}</p>
                    <div className="space-y-1">
                        <button onClick={() => setCategoryFilter("all")} className={navClass(categoryFilter === "all")}>
                            <span className="w-2 h-2 rounded-full mr-2.5 bg-[var(--text-muted)]"></span>
                            {t.allCategories}
                        </button>
                        {categoryKeys.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={navClass(categoryFilter === cat)}
                            >
                                <span className={`w-2 h-2 rounded-full mr-2.5 ${catDotColors[cat] || "bg-slate-400"}`}></span>
                                {t.categories[cat]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-[var(--border-soft)] space-y-1">
                    <button onClick={toggleSettings} className="nav-pill">
                        <svg className="w-[18px] h-[18px] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {t.settings}
                    </button>
                    <button onClick={handleLogout} className="nav-pill !text-red-400 hover:!text-red-300 hover:!bg-red-500/10 hover:!border-red-500/20">
                        <svg className="w-[18px] h-[18px] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {t.logout}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DesktopSidebar;
