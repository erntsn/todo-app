import React, { useState, useEffect } from 'react';
import TaskDetailModal from './TaskDetailModal';

const TrelloBoard = ({ todos, onToggle, onRemove, onUpdate, onUpdateStatus, language, translations, darkMode }) => {
    const [columns, setColumns] = useState({
        todo: [],
        inProgress: [],
        completed: []
    });

    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedTodo, setSelectedTodo] = useState(null);

    // Group todos into columns whenever todos change
    useEffect(() => {
        const todoColumn = todos.filter(todo => !todo.completed && !todo.inProgress);
        const inProgressColumn = todos.filter(todo => !todo.completed && todo.inProgress);
        const completedColumn = todos.filter(todo => todo.completed);

        setColumns({
            todo: todoColumn,
            inProgress: inProgressColumn,
            completed: completedColumn
        });
    }, [todos]);

    // Handle drag start
    const handleDragStart = (e, todo, sourceColumn) => {
        setDraggedItem({ todo, sourceColumn });
        // Make drag image transparent
        e.dataTransfer.setDragImage(e.target, 50, 50);
    };

    // Handle drag over
    const handleDragOver = (e, columnName) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // Handle drop
    const handleDrop = (e, targetColumn) => {
        e.preventDefault();

        if (!draggedItem) return;

        const { todo, sourceColumn } = draggedItem;

        if (sourceColumn !== targetColumn) {
            // Call the appropriate method based on the target column
            if (targetColumn === 'completed') {
                // If not already completed, mark as completed
                if (!todo.completed) {
                    onToggle(todo.id);
                }
            } else if (targetColumn === 'inProgress') {
                // Update to be in progress
                onUpdateStatus(todo.id, 'inProgress');
            } else if (targetColumn === 'todo') {
                // Update to be in todo column (not in progress, not completed)
                onUpdateStatus(todo.id, 'todo');
            }
        }

        setDraggedItem(null);
    };

    // Column titles based on language
    const columnTitles = {
        todo: language === 'tr' ? 'Yapılacak' : 'To Do',
        inProgress: language === 'tr' ? 'Devam Ediyor' : 'In Progress',
        completed: language === 'tr' ? 'Tamamlandı' : 'Completed'
    };

    // Handle card click for modal
    const handleCardClick = (todo) => {
        setSelectedTodo(todo);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedTodo(null);
    };

    // Update todo
    const handleUpdateTodo = (updatedTodo) => {
        onUpdate(updatedTodo);
    };

    // Render a single todo card
    const renderCard = (todo, columnName) => (
        <div
            key={todo.id}
            className={`${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
            } rounded-lg shadow p-3 mb-2 cursor-move`}
            draggable
            onDragStart={(e) => handleDragStart(e, todo, columnName)}
            onClick={() => handleCardClick(todo)}
        >
            <div className="flex justify-between items-start">
                <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.text}
                </h3>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        onRemove(todo.id);
                    }}
                    className="text-red-500 hover:text-red-600 transition font-bold text-sm rounded-full bg-black w-6 h-6 flex items-center justify-center"
                >
                    <span className="text-xs">X</span>
                </button>
            </div>

            <div className={`text-xs mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                <div className="flex justify-between">
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

                {/* Additional indicators for notes and subtasks */}
                <div className="mt-1 flex gap-2">
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
            } rounded-lg p-3 min-w-64 flex-1 flex flex-col h-full`}
            onDragOver={(e) => handleDragOver(e, columnName)}
            onDrop={(e) => handleDrop(e, columnName)}
        >
            <h2 className={`font-bold text-center mb-2 sticky top-0 ${
                darkMode ? 'text-white' : 'text-gray-800'
            }`}>
                {columnTitles[columnName]}
                <span className="ml-2 text-sm px-2 py-1 rounded-full bg-blue-500 text-white">
          {columns[columnName].length}
        </span>
            </h2>

            <div className="space-y-2 overflow-y-auto flex-1">
                {columns[columnName].length === 0 ? (
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