import { useState } from "react";
import WorkspaceControls from "./WorkspaceControls";
import MainView from "./MainView";
import SettingsModal from "./SettingsModal";
import AddTaskSheet from "../AddTaskSheet";
import AppBackground from "../AppBackground";

const AuthenticatedApp = ({ state, translations }) => {
    const {
        user,
        language,
        todos,
        filteredTodos,
        filter,
        setFilter,
        viewMode,
        setView,
        settingsOpen,
        searchQuery,
        setSearchQuery,
        toggleSettings,
        handleAddTodo,
        handleToggleTodo,
        handleRemoveTodo,
        handleUpdateTodo,
        handleUpdateTodoStatus,
        handleLogout,
        setLanguage
    } = state;

    const [addOpen, setAddOpen] = useState(false);
    const t = translations[language];

    return (
        <div className="app-shell h-[100dvh] w-screen flex flex-col text-white overflow-hidden">
            <AppBackground />

            {/* Header */}
            <header className="content-wrap flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)] bg-[rgba(12,11,20,0.8)] backdrop-blur-xl">
                {/* Logo + title */}
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow shadow-violet-500/30">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h1 className="text-base font-bold text-[var(--text-main)]">{t.title}</h1>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                    {/* View toggle */}
                    <div className="flex items-center gap-0.5 p-1 rounded-xl bg-[rgba(26,25,40,0.8)] border border-[var(--border-soft)]">
                        <button
                            onClick={() => setView("list")}
                            title={t.listView}
                            className={`w-8 h-7 flex items-center justify-center rounded-lg transition-all ${
                                viewMode === "list"
                                    ? "bg-[rgba(139,92,246,0.25)] text-violet-300"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setView("board")}
                            title={t.boardView}
                            className={`w-8 h-7 flex items-center justify-center rounded-lg transition-all ${
                                viewMode === "board"
                                    ? "bg-[rgba(139,92,246,0.25)] text-violet-300"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} />
                                <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} />
                                <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} />
                                <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} />
                            </svg>
                        </button>
                    </div>

                    {/* User avatar (desktop) */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(139,92,246,0.08)] border border-[var(--border-soft)]">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-[var(--text-secondary)] max-w-[140px] truncate">{user?.email}</span>
                    </div>

                    {/* Settings */}
                    <button
                        onClick={toggleSettings}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-[rgba(139,92,246,0.08)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[var(--border)] transition-all"
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main content */}
            <div className={`content-wrap flex-1 overflow-hidden flex flex-col ${
                viewMode === "list" ? "max-w-2xl w-full mx-auto px-3 sm:px-4 pt-4" : "px-3 sm:px-4 pt-4"
            }`}>
                <WorkspaceControls
                    language={language}
                    translations={translations}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filter={filter}
                    setFilter={setFilter}
                    todos={todos}
                    viewMode={viewMode}
                />

                <div className={`flex-1 overflow-hidden ${viewMode === "list" ? "overflow-y-auto pb-24" : ""}`}>
                    <MainView
                        language={language}
                        translations={translations}
                        filteredTodos={filteredTodos}
                        todos={todos}
                        viewMode={viewMode}
                        handleToggleTodo={handleToggleTodo}
                        handleRemoveTodo={handleRemoveTodo}
                        handleUpdateTodo={handleUpdateTodo}
                        handleUpdateTodoStatus={handleUpdateTodoStatus}
                    />
                </div>
            </div>

            {/* FAB */}
            <button
                onClick={() => setAddOpen(true)}
                className="fixed bottom-6 right-5 sm:right-8 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-500/35 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                aria-label={language === "tr" ? "Görev ekle" : "Add task"}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            <AddTaskSheet
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onAdd={handleAddTodo}
                language={language}
                translations={translations}
            />

            <SettingsModal
                settingsOpen={settingsOpen}
                language={language}
                setLanguage={setLanguage}
                translations={translations}
                toggleSettings={toggleSettings}
                handleLogout={handleLogout}
            />
        </div>
    );
};

export default AuthenticatedApp;
