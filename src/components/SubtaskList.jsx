import React, { useState } from 'react';

const SubtaskList = ({ subtasks = [], onUpdate, darkMode, language = 'tr' }) => {
    const [newSubtask, setNewSubtask] = useState('');

    const translations = {
        tr: {
            addSubtask: 'Yeni alt görev ekle',
            addButton: 'Ekle',
            noSubtasks: 'Henüz alt görev yok',
            subtasks: 'Alt Görevler'
        },
        en: {
            addSubtask: 'Add new subtask',
            addButton: 'Add',
            noSubtasks: 'No subtasks yet',
            subtasks: 'Subtasks'
        }
    };

    const t = translations[language];

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (newSubtask.trim()) {
            onUpdate([
                ...subtasks,
                { id: Date.now().toString(), text: newSubtask, completed: false }
            ]);
            setNewSubtask('');
        }
    };

    const toggleSubtask = (id) => {
        const updatedSubtasks = subtasks.map(subtask =>
            subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
        );
        onUpdate(updatedSubtasks);
    };

    const removeSubtask = (id) => {
        const updatedSubtasks = subtasks.filter(subtask => subtask.id !== id);
        onUpdate(updatedSubtasks);
    };

    return (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t.subtasks}
            </h4>

            <form onSubmit={handleAddSubtask} className="flex mb-3">
                <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder={t.addSubtask}
                    className={`flex-grow px-3 py-2 text-sm rounded-l border-r-0 ${
                        darkMode
                            ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                            : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } border`}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r text-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {t.addButton}
                </button>
            </form>

            <ul className="space-y-2">
                {subtasks.map(subtask => (
                    <li
                        key={subtask.id}
                        className={`flex items-center justify-between p-2 rounded ${
                            darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => toggleSubtask(subtask.id)}
                                className="mr-2 h-4 w-4 accent-blue-500"
                            />
                            <span className={`text-sm ${
                                subtask.completed
                                    ? 'line-through text-gray-400'
                                    : darkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                {subtask.text}
              </span>
                        </div>
                        <button
                            onClick={() => removeSubtask(subtask.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Delete subtask"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </li>
                ))}
                {subtasks.length === 0 && (
                    <li className={`text-sm py-2 px-3 ${
                        darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'
                    } rounded`}>
                        {t.noSubtasks}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default SubtaskList;