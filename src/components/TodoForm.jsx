import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TodoForm = ({ onAdd, language, translations }) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('medium');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('other');
    const [isExpanded, setIsExpanded] = useState(false);

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
                category,
            };

            onAdd(newTodo);
            setText('');
            setPriority('medium');
            setDate('');
            setCategory('other');
            setIsExpanded(false);
        }
    };

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

    return (
        <div className="mb-6 bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <form onSubmit={handleSubmit}>
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-500"></div>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={translations[language].newTodo}
                            className="flex-1 bg-transparent border-none text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-0"
                            required
                            onFocus={() => setIsExpanded(true)}
                        />
                    </div>
                </div>

                {isExpanded && (
                    <div className="px-4 pb-4 pt-2 bg-gray-750 border-t border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Priority selector */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                    {translations[language].priority.label || 'Priority'}
                                </label>
                                <div className="flex rounded-md overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setPriority('low')}
                                        className={`flex-1 px-2 py-1.5 text-xs font-medium ${
                                            priority === 'low'
                                                ? 'bg-green-700 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
                                        }`}
                                    >
                                        {translations[language].priority.low}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPriority('medium')}
                                        className={`flex-1 px-2 py-1.5 text-xs font-medium ${
                                            priority === 'medium'
                                                ? 'bg-yellow-700 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
                                        }`}
                                    >
                                        {translations[language].priority.medium}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPriority('high')}
                                        className={`flex-1 px-2 py-1.5 text-xs font-medium ${
                                            priority === 'high'
                                                ? 'bg-red-700 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
                                        }`}
                                    >
                                        {translations[language].priority.high}
                                    </button>
                                </div>
                            </div>

                            {/* Date picker */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                    {translations[language].date || 'Date'}
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full py-1.5 px-3 rounded bg-gray-700 text-white border-0 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Category selector */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                    {translations[language].category || 'Category'}
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full py-1.5 px-3 rounded bg-gray-700 text-white border-0 focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.keys(translations[language].categories).map(cat => (
                                        <option key={cat} value={cat}>
                                            {translations[language].categories[cat]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`p-4 bg-gray-750 border-t border-gray-700 flex justify-end ${!isExpanded && 'hidden'}`}>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white mr-2"
                    >
                        {translations[language].cancel || 'Cancel'}
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                        {translations[language].addButton}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TodoForm;