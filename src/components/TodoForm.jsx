import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TodoForm = ({ onAdd, language, translations, darkMode }) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('medium');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            const newTodo = {
                id: uuidv4(),
                text: text.trim(),
                completed: false,
                createdAt: new Date().toISOString(),
                priority,
                date: date || null,
                tags: [],
                category: 'other',
            };

            onAdd(newTodo);
            setText('');
            setPriority('medium');
            setDate('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex flex-col md:flex-row gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={translations[language].newTodo}
                    className={`flex-grow p-2 rounded ${
                        darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                    }`}
                    required
                />

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`p-2 rounded ${
                        darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                    }`}
                >
                    <option value="high">{translations[language].priority.high}</option>
                    <option value="medium">{translations[language].priority.medium}</option>
                    <option value="low">{translations[language].priority.low}</option>
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`p-2 rounded ${
                        darkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                    }`}
                />

                <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    {translations[language].addButton}
                </button>
            </div>
        </form>
    );
};

export default TodoForm;