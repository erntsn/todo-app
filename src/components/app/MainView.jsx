import TodoList from "../TodoList";
import TrelloBoard from "../TrelloBoard";

const MainView = ({
    language,
    translations,
    todos,
    filteredTodos,
    viewMode,
    handleToggleTodo,
    handleRemoveTodo,
    handleUpdateTodo,
    handleUpdateTodoStatus,
}) => {
    if (viewMode === "board") {
        return (
            <TrelloBoard
                todos={todos}
                onToggle={handleToggleTodo}
                onRemove={handleRemoveTodo}
                onUpdate={handleUpdateTodo}
                onUpdateStatus={handleUpdateTodoStatus}
                language={language}
                translations={translations}
            />
        );
    }

    return (
        <TodoList
            todos={filteredTodos}
            allEmpty={todos.length === 0}
            onToggle={handleToggleTodo}
            onRemove={handleRemoveTodo}
            onUpdate={handleUpdateTodo}
            language={language}
            translations={translations}
        />
    );
};

export default MainView;
