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

    return (
        <div className="content-wrap hidden md:flex w-72 flex-shrink-0 flex-col p-4 pl-5 app-fade-up">
            <div className="glass-panel h-full p-4 flex flex-col">
                <div className="flex items-center justify-center mb-7">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-amber-200">
                        {t.title}
                    </h1>
                </div>

                <div className="surface-panel flex items-center space-x-3 p-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-300 to-cyan-500 flex items-center justify-center text-slate-900 font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                        <p className="text-xs text-slate-400 truncate">{user.displayName || "Kullanıcı"}</p>
                    </div>
                </div>

                <nav className="space-y-1.5 mb-6 stagger-in">
                    <button onClick={() => setView("list")} className={navClass(viewMode === "list" && !showPomodoro && !showStatistics)}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        {t.listView}
                    </button>

                    <button onClick={() => setView("board")} className={navClass(viewMode === "board" && !showPomodoro && !showStatistics)}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {t.boardView}
                    </button>

                    <button onClick={() => setView("calendar")} className={navClass(viewMode === "calendar" && !showPomodoro && !showStatistics)}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {t.calendarView}
                    </button>

                    <button onClick={toggleStatistics} className={navClass(showStatistics)}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {t.statistics}
                    </button>

                    <button onClick={togglePomodoro} className={navClass(showPomodoro)}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.pomodoro}
                    </button>
                </nav>

                <div className="mb-6">
                    <h3 className="section-title mb-2.5">{t.categories.label || "Categories"}</h3>

                    <div className="space-y-1.5">
                        <button onClick={() => setCategoryFilter("all")} className={navClass(categoryFilter === "all")}>{t.allCategories}</button>

                        {categoryKeys.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`nav-pill ${categoryFilter === cat ? (categoryStyles[cat]?.sidebar || categoryStyles.other.sidebar) : ""}`}
                            >
                                <span className={`w-2 h-2 rounded-full mr-2 ${categoryStyles[cat]?.dot || categoryStyles.other.dot}`}></span>
                                {t.categories[cat]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-5 border-t border-slate-700/80 space-y-2">
                    <button onClick={toggleSettings} className="nav-pill">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {t.settings}
                    </button>

                    <button onClick={handleLogout} className="nav-pill text-red-300 hover:text-red-100 hover:bg-red-900/30">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
