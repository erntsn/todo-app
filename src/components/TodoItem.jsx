// src/components/TodoItem.jsx
const TodoItem = ({ todo, onToggle, onRemove, onTagClick, language, translations }) => (
    <div
        className="flex items-center justify-between rounded-lg p-4 my-3 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-gray-800 to-gray-700 border-l-4 border-blue-500 cursor-pointer transform hover:-translate-y-1"
        onClick={() => handleCardClick(todo)}
    >
        <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                        e.stopPropagation(); // Prevent card click
                        onToggle(todo.id);
                    }}
                    className="h-5 w-5 rounded-full border-2 border-gray-400 checked:border-blue-500 checked:bg-blue-500 transition-colors"
                />
            </div>

            <div className="flex-1">
                <div className={`font-medium ${
                    todo.completed ? 'line-through text-gray-400' : 'text-white'
                }`}>
                    {todo.text}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-300">
                    {/* Category badge */}
                    {todo.category && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-${categoryColors[todo.category] || 'gray'}-700 text-${categoryColors[todo.category] || 'gray'}-200`}>
              <span className="mr-1">•</span>
                            {translations[language].categories[todo.category] || translations[language].categories.other}
            </span>
                    )}

                    {/* Date */}
                    {todo.date && (
                        <span className="inline-flex items-center text-gray-400">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
                            {todo.date}
            </span>
                    )}

                    {/* Priority */}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        todo.priority === 'high'
                            ? 'bg-red-900 text-red-200'
                            : todo.priority === 'medium'
                                ? 'bg-yellow-900 text-yellow-200'
                                : 'bg-green-900 text-green-200'
                    }`}>
            {translations[language].priority[todo.priority] || translations[language].priority.medium}
          </span>

                    {/* Tags */}
                    {todo.tags && todo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {todo.tags.slice(0, 2).map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center text-blue-300 hover:text-blue-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTagClick(tag);
                                    }}
                                >
                  #{tag}
                </span>
                            ))}
                            {todo.tags.length > 2 && <span className="text-gray-400">+{todo.tags.length - 2}</span>}
                        </div>
                    )}

                    {/* Recurring indicator */}
                    {todo.recurring && (
                        <span className="text-purple-300" title={`${translations[language].recurrence[todo.recurring.type]}, ${translations[language].every} ${todo.recurring.value}`}>
              <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
                    )}

                    {/* Notes indicator */}
                    {todo.notes && (
                        <span className="text-gray-400">
              <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
                    )}

                    {/* Subtasks indicator */}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                        <span className="text-gray-400">
              <svg className="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
                            {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}
            </span>
                    )}
                </div>
            </div>
        </div>

        <button
            className="ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 hover:text-red-500 transition-colors"
            onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onRemove(todo.id);
            }}
        >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    </div>
);

export default TodoItem;