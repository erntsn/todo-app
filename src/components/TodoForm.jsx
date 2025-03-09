import React, { useState } from 'react';
import generateId from '../utils/idGenerator';

const TodoForm = ({ onAdd, language, translations, darkMode }) => {
    const [text, setText] = useState('');
    const [date, setDate] = useState('');
    const [priority, setPriority] = useState('medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd({ id: generateId(), text, completed: false, date, priority });
            setText('');
            setDate('');
            setPriority('medium');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input
                className={`w-full border px-4 py-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-400 text-gray-900'}`}
                placeholder={translations[language].newTodo}
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
            />

            <div className="flex gap-2">
                <input
                    type="date"
                    className={`flex-1 border px-4 py-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-400 text-gray-900'}`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <select
                    className={`flex-1 border px-4 py-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-400 text-gray-900'}`}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="high">{translations[language].priority.high}</option>
                    <option value="medium">{translations[language].priority.medium}</option>
                    <option value="low">{translations[language].priority.low}</option>
                </select>
            </div>

            <button type="submit" className={`w-full py-2 rounded transition ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                {translations[language].addButton}
            </button>
        </form>
    );
};

export default TodoForm;

