import React, { useState, useEffect } from "react";

const TrelloBoard = ({
                         todos,
                         onToggle,
                         onRemove,
                         onUpdate,
                         onUpdateStatus,
                         onTagClick,
                         language,
                         translations,
                         darkMode
                     }) => {
    // Define column structure based on todo statuses
    const [localColumns, setLocalColumns] = useState({
        backlog: [],
        todo: [],
        inProgress: [],
        done: []
    });

    // Dragging state
    const [draggedTodo, setDraggedTodo] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    // Translate column titles
    const columnTitles = {
        backlog: language === 'tr' ? 'Backlog' : 'Backlog',
        todo: language === 'tr' ? 'Yapılacak' : 'To Do',
        inProgress: language === 'tr' ? 'Devam Ediyor' : 'In Progress',
        done: language === 'tr' ? 'Tamamlandı' : 'Done'
    };

    // Update columns when todos change
    useEffect(() => {
        if (!todos) return;

        const newColumns = {
            backlog: [],
            todo: [],
            inProgress: [],
            done: []
        };

        todos.forEach(todo => {
            const status = todo.status || (todo.completed ? 'done' : 'todo');
            if (newColumns[status]) {
                newColumns[status].push(todo);
            } else {
                newColumns.todo.push(todo);
            }
        });

        setLocalColumns(newColumns);
    }, [todos]);

    // Drag start handler
    const handleDragStart = (e, todo) => {
        setDraggedTodo(todo);
        e.dataTransfer.setData('text/plain', todo.id);

        // Add dragging class after a short delay to allow the browser to capture the initial state
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    };

    // Drag end handler
    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
        setDragOverColumn(null);
    };

    // Drag over handler
    const handleDragOver = (e, columnName) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
        setDragOverColumn(columnName);
    };

    // Drag leave handler
    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    // Drop handler
    const handleDrop = (e, columnName) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        setDragOverColumn(null);

        if (!draggedTodo) return;

        // Don't do anything if dropped in the same column
        const currentStatus = draggedTodo.status || (draggedTodo.completed ? 'done' : 'todo');
        if (currentStatus === columnName) return;

        // Update the todo status
        if (onUpdateStatus) {
            onUpdateStatus(draggedTodo.id, columnName);

            // Also update completed status if appropriate
            if (columnName === 'done' && !draggedTodo.completed) {
                onToggle(draggedTodo.id);
            } else if (columnName !== 'done' && draggedTodo.completed) {
                onToggle(draggedTodo.id);
            }
        }

        // Optimistically update local state
        const updatedColumns = { ...localColumns };

        // Remove from old column
        const sourceColumn = draggedTodo.status || (draggedTodo.completed ? 'done' : 'todo');
        updatedColumns[sourceColumn] = updatedColumns[sourceColumn].filter(t => t.id !== draggedTodo.id);

        // Add to new column
        const updatedTodo = { ...draggedTodo, status: columnName };
        if (columnName === 'done') {
            updatedTodo.completed = true;
        } else {
            updatedTodo.completed = false;
        }

        updatedColumns[columnName].push(updatedTodo);
        setLocalColumns(updatedColumns);

        setDraggedTodo(null);
    };

    // Render a single card
    const renderCard = (todo, columnName) => {
        const priorityColors = {
            high: 'bg-red-500',
            medium: 'bg-yellow-500',
            low: 'bg-green-500'
        };

        const priorityColor = priorityColors[todo.priority] || 'bg-gray-500';

        const categoryColors = {
            work: 'blue',
            personal: 'purple',
            health: 'green',
            shopping: 'pink',
            finance: 'yellow',
            education: 'indigo',
            other: 'gray'
        };

        const categoryColor = todo.category ? `bg-${categoryColors[todo.category]}-500` : 'bg-gray-500';

        return (
            <div
                key={todo.id}
                className="drag-item cursor-pointer"
                draggable
                onDragStart={(e) => handleDragStart(e, todo)}
                onDragEnd={handleDragEnd}
            >
                <div className="flex items-start">
                    <div className={`${priorityColor} w-1 h-full rounded-full mr-2`}></div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <div
                                className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}
                            >
                                {todo.text}
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggle(todo.id);
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    {todo.completed ? (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(todo.id);
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {todo.dueDate && (
                            <div className="flex items-center text-xs text-gray-400 mb-1">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(todo.dueDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                            </div>
                        )}

                        {todo.category && (
                            <div className="flex items-center mb-1">
                                <span
                                    className={`inline-block w-2 h-2 rounded-full bg-${categoryColors[todo.category]}-500 mr-1`}
                                ></span>
                                <span className="text-xs text-gray-400">
                                    {translations[language].categories[todo.category]}
                                </span>
                            </div>
                        )}

                        {todo.tags && todo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {todo.tags.map(tag => (
                                    <span
                                        key={tag}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTagClick(tag);
                                        }}
                                        className="px-2 py-0.5 bg-blue-600 bg-opacity-30 text-xs rounded-full text-blue-300 cursor-pointer hover:bg-opacity-50"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Render column
    const renderColumn = (columnName) => (
        <div
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 min-w-64 w-full md:w-1/3 flex-1 flex flex-col h-full column-drop-area shadow-lg border border-gray-700"
            onDragOver={(e) => handleDragOver(e, columnName)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, columnName)}
        >
            <h2 className="column-header flex items-center justify-between mb-4">
                <div className="flex-1"></div>
                {columnTitles[columnName]}
                <div className="ml-2 h-6 w-6 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                    {localColumns[columnName]?.length || 0}
                </div>
            </h2>

            <div className="space-y-2 overflow-y-auto flex-1">
                {(!localColumns[columnName] || localColumns[columnName].length === 0) ? (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
                        {language === 'tr' ? 'Görev yok' : 'No tasks'}
                    </div>
                ) : (
                    localColumns[columnName].map(todo => renderCard(todo, columnName))
                )}
            </div>
        </div>
    );

    return (
        <>
            <style>
                {`
                .column-drop-area {
                  transition: all 0.2s ease;
                  background: linear-gradient(to bottom, #1f2937, #1a202c);
                  border: 1px solid #374151;
                  border-radius: 0.75rem;
                }
                
                .column-drop-area.drag-over {
                  border: 2px dashed #3b82f6;
                  background: linear-gradient(to bottom, rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.8));
                  transform: scale(1.01);
                  box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
                }
                
                .drag-item {
                  transition: all 0.2s ease;
                  background: linear-gradient(to right, #374151, #2d3748);
                  border: 1px solid #4b5563;
                  border-radius: 0.5rem;
                  margin-bottom: 0.75rem;
                  padding: 0.75rem;
                }
                
                .drag-item:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                  border-color: #6b7280;
                }
                
                .drag-item.dragging {
                  opacity: 0.5;
                  transform: scale(1.05);
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                
                .column-header {
                  font-weight: bold;
                  text-align: center;
                  margin-bottom: 1rem;
                  padding: 0.5rem;
                  position: sticky;
                  top: 0;
                  background: linear-gradient(to right, #1f2937, #111827);
                  border-bottom: 1px solid #4b5563;
                  border-radius: 0.5rem;
                }
                `}
            </style>

            <div className="flex flex-col md:flex-row gap-4 h-full overflow-x-auto pb-4">
                {renderColumn('backlog')}
                {renderColumn('todo')}
                {renderColumn('inProgress')}
                {renderColumn('done')}
            </div>
        </>
    );
};

export default TrelloBoard;