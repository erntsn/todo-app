// src/components/CalendarView.jsx
import React, { useState } from 'react';

const CalendarView = ({ todos = [], onToggle, onRemove, onUpdate, language, translations }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Format the month and year
    const formatMonthYear = () => {
        return currentDate.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
            month: 'long',
            year: 'numeric',
        });
    };

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    // Get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: '', isEmpty: true });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ day, isEmpty: false });
        }

        return days;
    };

    const dayNames = language === 'tr'
        ? ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get todos for a specific day
    const getTodosForDay = (day) => {
        if (!day) return [];

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];

        return todos.filter(todo => todo.date === dateString);
    };

    return (
        <div className="h-full flex flex-col text-white">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={goToPreviousMonth}
                    className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                    &lt;
                </button>
                <h2 className="text-xl font-bold">{formatMonthYear()}</h2>
                <button
                    onClick={goToNextMonth}
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

                {/* Calendar Days */}
                {generateCalendarDays().map((dayObj, index) => (
                    <div
                        key={`day-${index}`}
                        className={`border rounded p-1 h-24 overflow-y-auto ${
                            dayObj.isEmpty
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-gray-700 border-gray-600'
                        }`}
                    >
                        {dayObj.day && (
                            <>
                                <div className="text-right mb-1">{dayObj.day}</div>
                                <div className="space-y-1">
                                    {getTodosForDay(dayObj.day).map(todo => (
                                        <div
                                            key={todo.id}
                                            className={`p-1 text-xs rounded ${
                                                todo.completed
                                                    ? 'bg-green-200 text-green-800'
                                                    : todo.priority === 'high'
                                                        ? 'bg-red-200 text-red-800'
                                                        : todo.priority === 'medium'
                                                            ? 'bg-yellow-200 text-yellow-800'
                                                            : 'bg-blue-200 text-blue-800'
                                            }`}
                                        >
                                            {todo.text}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;