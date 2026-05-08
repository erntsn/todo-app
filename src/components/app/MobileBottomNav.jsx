const MobileBottomNav = ({
    language,
    translations,
    viewMode,
    showPomodoro,
    showStatistics,
    setView,
    toggleStatistics,
    togglePomodoro
}) => {
    const t = translations[language];

    const itemClass = (isActive) => `mobile-dock-btn flex flex-col items-center justify-center ${isActive ? "active" : ""}`;

    return (
        <div className="mobile-dock md:hidden fixed bottom-0 left-0 right-0 z-20 app-fade-up">
            <div className="flex items-center justify-around px-1.5 py-1">
                <button onClick={() => setView("list")} className={itemClass(viewMode === "list" && !showPomodoro && !showStatistics)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="text-[11px] mt-1">{t.listView.split(" ")[0]}</span>
                </button>

                <button onClick={() => setView("board")} className={itemClass(viewMode === "board" && !showPomodoro && !showStatistics)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="text-[11px] mt-1">{t.boardView.split(" ")[0]}</span>
                </button>

                <button onClick={() => setView("calendar")} className={itemClass(viewMode === "calendar" && !showPomodoro && !showStatistics)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[11px] mt-1">{t.calendarView.split(" ")[0]}</span>
                </button>

                <button onClick={toggleStatistics} className={itemClass(showStatistics)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-[11px] mt-1">{t.statistics.split(" ")[0]}</span>
                </button>

                <button onClick={togglePomodoro} className={itemClass(showPomodoro)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[11px] mt-1">{t.pomodoro.split(" ")[0]}</span>
                </button>
            </div>
        </div>
    );
};

export default MobileBottomNav;
