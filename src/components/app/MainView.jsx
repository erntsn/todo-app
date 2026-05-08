import TodoList from "../TodoList";
import TrelloBoard from "../TrelloBoard";
import CalendarView from "../CalendarView";
import PomodoroTimer from "../PomodoroTimer";
import StatisticsDashboard from "../StatisticsDashboard";

const MainView = ({
    showPomodoro,
    showStatistics,
    viewMode,
    darkMode,
    language,
    translations,
    todos,
    filteredTodos,
    handleToggleTodo,
    handleRemoveTodo,
    handleUpdateTodo,
    handleUpdateTodoStatus,
    handleTagClick
}) => {
    if (showPomodoro) {
        return <PomodoroTimer language={language} darkMode={darkMode} />;
    }

    if (showStatistics) {
        return <StatisticsDashboard todos={todos} language={language} />;
    }

    if (viewMode === "list") {
        return (
            <TodoList
                todos={filteredTodos}
                onToggle={handleToggleTodo}
                onRemove={handleRemoveTodo}
                onUpdate={handleUpdateTodo}
                onTagClick={handleTagClick}
                language={language}
                translations={translations}
                darkMode={darkMode}
            />
        );
    }

    if (viewMode === "board") {
        return (
            <TrelloBoard
                todos={todos}
                onToggle={handleToggleTodo}
                onRemove={handleRemoveTodo}
                onUpdate={handleUpdateTodo}
                onUpdateStatus={handleUpdateTodoStatus}
                onTagClick={handleTagClick}
                language={language}
                translations={translations}
                darkMode={darkMode}
            />
        );
    }

    return (
        <CalendarView
            todos={todos}
            onToggle={handleToggleTodo}
            onRemove={handleRemoveTodo}
            onUpdate={handleUpdateTodo}
            language={language}
            translations={translations}
            darkMode={darkMode}
        />
    );
};

export default MainView;
