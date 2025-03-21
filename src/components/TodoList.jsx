﻿import React, { useState } from 'react';
import TaskDetailModal from './TaskDetailModal';

const TodoList = ({ todos = [], onToggle, onRemove, onUpdate, onTagClick, language, translations }) => {
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

    const handleCardClick = (todo) => {
        setSelectedTodo(todo);
    };

    const handleCloseModal = () => {
        setSelectedTodo(null);
    };

    const handleDeleteTodo = (id, e) => {
        e.stopPropagation(); // Prevent card click
        console.log("Deleting todo with ID:", id);

        if (window.confirm(language === 'tr' ? 'Bu görevi silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this task?')) {
            try {
                onRemove(id);
            } catch (error) {
                console.error("Error in handleDeleteTodo:", error);
                alert(language === 'tr' ? 'Silme işlemi başarısız oldu.' : 'Delete operation failed.');
            }
        }
    };

    const handleUpdateTodo = async (updatedTodo) => {
        console.log("TodoList updating todo:", updatedTodo);
        try {
            await onUpdate(updatedTodo);
            handleCloseModal();
        } catch (error) {
            console.error("Error in handleUpdateTodo:", error);
            alert(language === 'tr' ? 'Güncelleme işlemi başarısız oldu.' : 'Update operation failed.');
        }
    };

    return (
        <div>
            {todos.length > 0 ? (
                todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="flex items-center justify-between rounded p-3 my-2 shadow cursor-pointer bg-gray-700 text-white"
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
                                <div className="text-xs text-gray-300">
                                    {/* Category badge */}
                                    {todo.category && (
                                        <span className={`inline-block px-2 py-0.5 rounded-full mr-2 bg-${categoryColors[todo.category] || 'gray'}-700 text-${categoryColors[todo.category] || 'gray'}-200`}>
                                        {translations[language].categories[todo.category] || translations[language].categories.other}
                                      </span>
                                    )}

                                    {/* Date and priority */}
                                    🗓️ {todo.date || '-'} • ⚠️ {translations[language].priority[todo.priority] || translations[language].priority.medium}

                                    {/* Tags */}
                                    {todo.tags && todo.tags.length > 0 && (
                                        <span className="ml-2">
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
                                      </span>
                                    )}

                                    {/* Recurring indicator */}
                                    {todo.recurring && (
                                        <span className="ml-2" title={`${translations[language].recurrence[todo.recurring.type]}, ${translations[language].every} ${todo.recurring.value}`}>
                                        🔄
                                      </span>
                                    )}

                                    {/* Notes and subtasks indicators */}
                                    {todo.notes && <span className="ml-2">📝</span>}
                                    {todo.subtasks && todo.subtasks.length > 0 && (
                                        <span className="ml-2">📋 {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                            onClick={(e) => handleDeleteTodo(todo.id, e)}
                        >
                            {language === 'tr' ? 'Sil' : 'Delete'}
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-400">
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
                    darkMode={true}
                />
            )}
        </div>
    );
};

export default TodoList;