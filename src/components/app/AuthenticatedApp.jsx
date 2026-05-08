import DesktopSidebar from "./DesktopSidebar";
import MobileBottomNav from "./MobileBottomNav";
import WorkspaceControls from "./WorkspaceControls";
import MainView from "./MainView";
import SettingsModal from "./SettingsModal";

const AuthenticatedApp = ({
    state,
    translations,
    categoryStyles
}) => {
    const {
        user,
        language,
        darkMode,
        todos,
        filteredTodos,
        filter,
        setFilter,
        viewMode,
        settingsOpen,
        searchQuery,
        setSearchQuery,
        tagFilter,
        setTagFilter,
        categoryFilter,
        setCategoryFilter,
        showPomodoro,
        showStatistics,
        setView,
        toggleSettings,
        togglePomodoro,
        toggleStatistics,
        handleTagClick,
        handleAddTodo,
        handleToggleTodo,
        handleUpdateTodoStatus,
        handleRemoveTodo,
        handleUpdateTodo,
        handleLogout,
        setLanguage
    } = state;

    return (
        <div className="app-shell h-screen w-screen flex flex-col md:flex-row text-white">
            <div className="app-backdrop">
                <span className="app-orb app-orb-a"></span>
                <span className="app-orb app-orb-b"></span>
                <span className="app-orb app-orb-c"></span>
            </div>

            <DesktopSidebar
                user={user}
                language={language}
                translations={translations}
                viewMode={viewMode}
                showPomodoro={showPomodoro}
                showStatistics={showStatistics}
                categoryFilter={categoryFilter}
                setView={setView}
                toggleStatistics={toggleStatistics}
                togglePomodoro={togglePomodoro}
                setCategoryFilter={setCategoryFilter}
                categoryStyles={categoryStyles}
                toggleSettings={toggleSettings}
                handleLogout={handleLogout}
            />

            <MobileBottomNav
                language={language}
                translations={translations}
                viewMode={viewMode}
                showPomodoro={showPomodoro}
                showStatistics={showStatistics}
                setView={setView}
                toggleStatistics={toggleStatistics}
                togglePomodoro={togglePomodoro}
            />

            <div className="content-wrap flex-1 flex flex-col overflow-hidden p-2 md:p-4 md:pl-3">
                <div className="workspace-shell flex-1 flex flex-col overflow-hidden app-fade-up">
                    <WorkspaceControls
                        language={language}
                        translations={translations}
                        toggleSettings={toggleSettings}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        showPomodoro={showPomodoro}
                        showStatistics={showStatistics}
                        handleAddTodo={handleAddTodo}
                        darkMode={darkMode}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        categoryStyles={categoryStyles}
                        tagFilter={tagFilter}
                        setTagFilter={setTagFilter}
                        viewMode={viewMode}
                        filter={filter}
                        setFilter={setFilter}
                    />

                    <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-5">
                        <MainView
                            showPomodoro={showPomodoro}
                            showStatistics={showStatistics}
                            viewMode={viewMode}
                            darkMode={darkMode}
                            language={language}
                            translations={translations}
                            todos={todos}
                            filteredTodos={filteredTodos}
                            handleToggleTodo={handleToggleTodo}
                            handleRemoveTodo={handleRemoveTodo}
                            handleUpdateTodo={handleUpdateTodo}
                            handleUpdateTodoStatus={handleUpdateTodoStatus}
                            handleTagClick={handleTagClick}
                        />
                    </div>
                </div>
            </div>

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
