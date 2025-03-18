import React, { useState, useEffect } from 'react';
import TaskDetailModal from './TaskDetailModal';

const TrelloBoard = ({ todos, onToggle, onRemove, onUpdate, onUpdateStatus, onTagClick, language, translations, darkMode }) => {
    const [columns, setColumns] = useState({
        todo: [],
        inProgress: [],
        completed: []
    });

    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedTodo, setSelectedTodo] = useState(null);

    // Category colors mapping
    const categoryColors = {
        work: 'blue',
        personal: 'purple',
        health: 'green',
        shopping: 'pink',
        finance: 'yellow',
        education: 'indigo',
        other: 'gray'
    };

    // Group todos into columns whenever todos change
    useEffect(() => {
        console.log("Todos updated:", todos);
        if (!todos) return;

        const todoColumn = todos.filter(todo => !todo.completed && !todo.inProgress);
        const inProgressColumn = todos.filter(todo => !todo.completed && todo.inProgress);
        const completedColumn = todos.filter(todo => todo.completed);

        console.log("Grouped todos:", {
            todo: todoColumn.length,
            inProgress: inProgressColumn.length,
            completed: completedColumn.length
        });

        setColumns({
            todo: todoColumn,
            inProgress: inProgressColumn,
            completed: completedColumn
        });
    }, [todos]);

    // Handle drag start
    const onDragStart = (e, id, sourceColumn) => {
        console.log("Drag started:", id, "from column:", sourceColumn);
        e.dataTransfer.setData("id", id);
        e.dataTransfer.setData("sourceColumn", sourceColumn);
        setDraggedItem({ id, sourceColumn });

        // Set opacity on the dragged element for visual feedback
        e.currentTarget.style.opacity = "0.5";
    };

    // Handle drag end
    const onDragEnd = (e) => {
        console.log("Drag ended");
        // Reset opacity
        e.currentTarget.style.opacity = "1";
        setDraggedItem(null);
    };

    // Handle drag over
    const onDragOver = (e) => {
        e.preventDefault();
        // Add visual indicator to show this is a drop area
        e.currentTarget.classList.add("drag-over");
    };

    // Handle drag leave
    const onDragLeave = (e) => {
        // Remove visual indicator
        e.currentTarget.classList.remove("drag-over");
    };

    // Handle drop
    const onDrop = (e, targetColumn) => {
        e.preventDefault();
        e.currentTarget.classList.remove("drag-over");

        const id = e.dataTransfer.getData("id");
        const sourceColumn = e.dataTransfer.getData("sourceColumn");

        console.log("Drop:", id, "from", sourceColumn, "to", targetColumn);

        if (!id || sourceColumn === targetColumn) return;

        // Find the todo that was dragged
        const allTodos = [...columns.todo, ...columns.inProgress, ...columns.completed];
        const draggedTodo = allTodos.find(todo => todo.id === id);

        if (!draggedTodo) {
            console.error("Todo not found:", id);
            return;
        }

        console.log("Found todo:", draggedTodo);

        // Update the todo based on the target column
        if (targetColumn === "completed") {
            console.log("Moving to completed column");
            onToggle(id); // This should mark it as completed
        } else if (targetColumn === "inProgress") {
            console.log("Moving to inProgress column");
            onUpdateStatus(id, "inProgress");
        } else if (targetColumn === "todo") {
            console.log("Moving to todo column");
            onUpdateStatus(id, "todo");
        }
    };

    // Handle remove todo
    const handleRemoveTodo = (e, id) => {
        e.stopPropagation(); // Prevent opening the modal
        console.log("Removing todo:", id);

        if (window.confirm("Are you sure you want to delete this task?")) {
            onRemove(id);
        }
    };

    // Column titles based on language
    const columnTitles = {
        todo: language === 'tr' ? 'Yapılacak' : 'To Do',
        inProgress: language === 'tr' ? 'Devam Ediyor' : 'In Progress',
        completed: language === 'tr' ? 'Tamamlandı' : 'Completed'
    };

    // Handle card click for modal
    const handleCardClick = (todo) => {
        console.log("Opening detail modal for:", todo.id);
        setSelectedTodo(todo);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedTodo(null);
    };

    // Update todo
    const handleUpdateTodo = (updatedTodo) => {
        console.log("Updating todo:", updatedTodo.id);
        onUpdate(updatedTodo);
    };

    // Render a single todo card
    const renderCard = (todo, columnName) => (
        <div
            key={todo.id}
            className={`${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
            } rounded-lg shadow p-3 mb-2 cursor-move`}
            draggable={true}
            onDragStart={(e) => onDragStart(e, todo.id, columnName)}
            onDragEnd={onDragEnd}
            onClick={() => handleCardClick(todo)}
        >
            <div className="flex justify-between items-start">
                <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.text}
                </h3>
                <button
                    type="button"
                    onClick={(e) => handleRemoveTodo(e, todo.id)}
                    className="text-white hover:text-red-300 transition font-bold text-sm rounded-full bg-red-500 hover:bg-red-700 w-6 h-6 flex items-center justify-center focus:outline-none"
                    aria-label="Delete task"
                >
                    X
                </button>
            </div>

            <div className={`text-xs mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {/* Category badge */}
                {todo.category && (
                    <span className={`inline-block px-2 py-0.5 rounded-full mb-1 ${
                        darkMode
                            ? `bg-${categoryColors[todo.category] || 'gray'}-700 text-${categoryColors[todo.category] || 'gray'}-200`
                            : `bg-${categoryColors[todo.category] || 'gray'}-100 text-${categoryColors[todo.category] || 'gray'}-800`
                    }`}>
                    {translations[language].categories[todo.category] || translations[language].categories.other}
                  </span>
                )}

                <div className="flex justify-between mt-1">
                    <span>🗓️ {todo.date || '-'}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        todo.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : todo.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                    }`}>
                      {todo.priority
                          ? translations[language].priority[todo.priority]
                          : translations[language].priority.medium}
                    </span>
                </div>

                {/* Additional indicators */}
                <div className="mt-1 flex flex-wrap gap-2">
                    {/* Tags */}
                    {todo.tags && todo.tags.length > 0 && (
                        <div>
                            {todo.tags.slice(0, 2).map(tag => (
                                <span
                                    key={tag}
                                    className="mr-1 cursor-pointer hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent opening the detail modal
                                        onTagClick(tag);
                                    }}
                                >
                            #{tag}
                          </span>
                            ))}
                            {todo.tags.length > 2 && <span>+{todo.tags.length - 2}</span>}
                        </div>
                    )}

                    {/* Recurring indicator */}
                    {todo.recurring && (
                        <span title={`${translations[language].recurrence[todo.recurring.type]}, ${translations[language].every} ${todo.recurring.value}`}>
                        🔄
                      </span>
                    )}

                    {todo.notes && <span>📝</span>}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                        <span>📋 {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}</span>
                    )}
                </div>
            </div>

            <div className="mt-2 flex justify-end">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                        e.stopPropagation(); // Prevent card click
                        onToggle(todo.id);
                    }}
                    className="h-4 w-4 accent-blue-500"
                />
            </div>
        </div>
    );

    // Render a column
    const renderColumn = (columnName) => (
        <div
            className={`${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
            } rounded-lg p-3 min-w-64 flex-1 flex flex-col h-full column-drop-area`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, columnName)}
        >
            <h2 className={`font-bold text-center mb-2 sticky top-0 ${
                darkMode ? 'text-white' : 'text-gray-800'
            }`}>
                {columnTitles[columnName]}
                <span className="ml-2 text-sm px-2 py-1 rounded-full bg-blue-500 text-white">
                  {columns[columnName]?.length || 0}
                </span>
            </h2>

            <div className="space-y-2 overflow-y-auto flex-1">
                {(!columns[columnName] || columns[columnName].length === 0) ? (
                    <div className={`text-center py-4 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        {language === 'tr' ? 'Görev yok' : 'No tasks'}
                    </div>
                ) : (
                    columns[columnName].map(todo => renderCard(todo, columnName))
                )}
            </div>
        </div>
    );

    return (
        <>
            <style>
                {`
                .column-drop-area.drag-over {
                    border: 2px dashed #3b82f6;
                    background-color: ${darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(226, 232, 240, 0.7)'};
                }
                `}
            </style>
            <div className="flex flex-col h-[calc(100vh-200px)]">
                {/* Board view */}
                <div className="flex gap-4 overflow-y-hidden h-full">
                    {renderColumn('todo')}
                    {renderColumn('inProgress')}
                    {renderColumn('completed')}
                </div>
            </div>

            {selectedTodo && (
                <TaskDetailModal
                    todo={selectedTodo}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateTodo}
                    onDelete={onRemove}
                    language={language}
                    translations={translations}
                    darkMode={darkMode}
                />
            )}
        </>
    );
};

export default TrelloBoard;