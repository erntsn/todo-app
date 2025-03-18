// src/components/CalendarView.jsx
import React, { useState } from 'react';

const CalendarView = ({ todos = [], onToggle, onRemove, onUpdate, language, translations, darkMode }) => {
    const [currentDate] = useState(new Date());

    // Format the month and year
    const formatMonthYear = () => {
        return currentDate.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
            month: 'long',
            year: 'numeric',
        });
    };

    const dayNames = language === 'tr'
        ? ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className={`h-full flex flex-col ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                    &lt;
                </button>
                <h2 className="text-xl font-bold">{formatMonthYear()}</h2>
                <button
                    className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                    &gt;
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {dayNames.map((day, index) => (
                    <div
                        key={`header-${index}`}
                        className="text-center font-semibold p-1"
                    >
                        {day}
                    </div>
                ))}

                {/* Placeholder for calendar days */}
                {Array(35).fill(0).map((_, index) => (
                    <div
                        key={`day-${index}`}
                        className={`border rounded p-1 h-24 overflow-y-auto ${
                            darkMode
                                ? 'bg-gray-700 border-gray-600'
                                : 'bg-white border-gray-300'
                        }`}
                    >
                        <div className="text-right mb-1">{(index % 31) + 1}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;