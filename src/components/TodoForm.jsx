import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TagsInput from './TagsInput';
import CategorySelector from './CategorySelector';

const TodoForm = ({ onAdd, language, translations, darkMode }) => {
    // Basic task info
    const [text, setText] = useState('');
    const [date, setDate] = useState('');
    const [priority, setPriority] = useState('medium');

    // Enhanced features
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState('other');

    // Recurring task options
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceType, setRecurrenceType] = useState('daily');
    const [recurrenceValue, setRecurrenceValue] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            const newTodo = {
                id: uuidv4(),
                text: text.trim(),
                completed: false,
                date,
                priority,
                category,
                tags,
                recurring: isRecurring ? {
                    type: recurrenceType,
                    value: recurrenceValue,
                    nextDate: date, // Start with the selected date
                } : null,
                createdAt: new Date().toISOString()
            };

            console.log("Adding new todo:", newTodo);
            onAdd(newTodo);

            // Reset form
            setText('');
            setDate('');
            setPriority('medium');
            setTags([]);
            setCategory('other');
            setIsRecurring(false);
            setRecurrenceType('daily');
            setRecurrenceValue(1);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {/* Task title input */}
            <input
                className={`w-full border px-4 py-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-400 text-gray-900'}`}
                placeholder={translations[language].newTodo}
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
            />

            <div className="flex gap-2">
                {/* Date picker */}
                <input
                    type="date"
                    className={`flex-1 border px-4 py-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-400 text-gray-900'}`}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                {/* Priority selector */}
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

            {/* Category selector */}
            <CategorySelector
                category={category}
                onChange={setCategory}
                language={language}
                darkMode={darkMode}
            />

            {/* Tags input */}
            <TagsInput
                tags={tags}
                onChange={setTags}
                language={language}
                darkMode={darkMode}
            />

            {/* Recurring task options */}
            <div className="mt-2">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isRecurring"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="h-4 w-4"
                    />
                    <label htmlFor="isRecurring" className="text-sm">
                        {translations[language].recurring}
                    </label>
                </div>

                {isRecurring && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <select
                            value={recurrenceType}
                            onChange={(e) => setRecurrenceType(e.target.value)}
                            className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                        >
                            <option value="daily">{translations[language].recurrence.daily}</option>
                            <option value="weekly">{translations[language].recurrence.weekly}</option>
                            <option value="monthly">{translations[language].recurrence.monthly}</option>
                            <option value="yearly">{translations[language].recurrence.yearly}</option>
                        </select>

                        <div className="flex">
                            <span className={`px-2 py-1 rounded-l ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {translations[language].every}
                            </span>
                            <input
                                type="number"
                                min="1"
                                value={recurrenceValue}
                                onChange={(e) => setRecurrenceValue(parseInt(e.target.value || 1))}
                                className={`w-16 px-2 py-1 rounded-r ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className={`w-full py-2 rounded transition ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                {translations[language].addButton}
            </button>
        </form>
    );
};

export default TodoForm;