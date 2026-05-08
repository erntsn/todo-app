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

    const navItems = [
        {
            id: "list",
            label: t.listView.split(" ")[0],
            isActive: viewMode === "list" && !showPomodoro && !showStatistics,
            onClick: () => setView("list"),
            icon: (
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            )
        },
        {
            id: "board",
            label: t.boardView.split(" ")[0],
            isActive: viewMode === "board" && !showPomodoro && !showStatistics,
            onClick: () => setView("board"),
            icon: (
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} />
                    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} />
                    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} />
                    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} />
                </svg>
            )
        },
        {
            id: "calendar",
            label: t.calendarView.split(" ")[0],
            isActive: viewMode === "calendar" && !showPomodoro && !showStatistics,
            onClick: () => setView("calendar"),
            icon: (
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: "stats",
            label: (t.statistics || "Stats").split(" ")[0],
            isActive: showStatistics,
            onClick: toggleStatistics,
            icon: (
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            id: "pomodoro",
            label: t.pomodoro.split(" ")[0],
            isActive: showPomodoro,
            onClick: togglePomodoro,
            icon: (
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 3" />
                </svg>
            )
        }
    ];

    return (
        <div className="mobile-dock md:hidden fixed bottom-0 left-0 right-0 z-20">
            <div className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={item.onClick}
                        className={`mobile-dock-btn flex flex-col items-center justify-center gap-1 min-w-[52px] ${item.isActive ? "active" : ""}`}
                    >
                        <div className={`flex items-center justify-center w-10 h-7 rounded-lg transition-all duration-150 ${
                            item.isActive
                                ? "bg-violet-500/20"
                                : ""
                        }`}>
                            {item.icon}
                        </div>
                        <span className={`text-[10px] font-medium leading-none transition-colors duration-150 ${
                            item.isActive ? "text-violet-300" : "text-[var(--text-muted)]"
                        }`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileBottomNav;
