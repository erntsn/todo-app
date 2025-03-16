import React, { useState } from 'react';
import TaskDetailModal from './TaskDetailModal';

const TodoList = ({ todos = [], onToggle, onRemove, onUpdate, language, translations, darkMode }) => {
    const [selectedTodo, setSelectedTodo] = useState(null);

    const handleCardClick = (todo) => {
        setSelectedTodo(todo);
    };

    const handleCloseModal = () => {
        setSelectedTodo(null);
    };

    const handleUpdateTodo = (updatedTodo) => {
        onUpdate(updatedTodo);
    };

    return (
        <div>
            {todos.length > 0 ? (
                todos.map((todo) => (
                    <div
                        key={todo.id}
                        className={`flex items-center justify-between rounded p-3 my-2 shadow cursor-pointer ${
                            darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                        }`}
                        onClick={() => handleCardClick(todo)}
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    onToggle(todo.id);
                                }}
                                className="accent-blue-500 h-5 w-5"
                            />
                            <div>
                                <div className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                                    {todo.text}
                                </div>
                                <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    🗓️ {todo.date || '-'} • ⚠️ {translations[language].priority[todo.priority] || translations[language].priority.medium}
                                    {todo.notes && <span className="ml-2">📝</span>}
                                    {todo.subtasks && todo.subtasks.length > 0 && (
                                        <span className="ml-2">📋 {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            className="text-red-500 hover:text-red-600 transition font-bold"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                onRemove(todo.id);
                            }}
                        >
                            {language === 'tr' ? 'Sil' : 'Delete'}
                        </button>
                    </div>
                ))
            ) : (
                <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {translations[language].noTodo}
                </p>
            )}

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
        </div>
    );
};

export default TodoList;