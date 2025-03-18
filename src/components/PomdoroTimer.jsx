﻿// src/components/PomodoroTimer.jsx
import React, { useState, useEffect, useRef } from 'react';

const PomodoroTimer = ({ language, darkMode }) => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'

    const translations = {
        tr: {
            work: 'Çalışma',
            shortBreak: 'Kısa Mola',
            longBreak: 'Uzun Mola',
            start: 'Başlat',
            pause: 'Duraklat',
            reset: 'Sıfırla'
        },
        en: {
            work: 'Work',
            shortBreak: 'Short Break',
            longBreak: 'Long Break',
            start: 'Start',
            pause: 'Pause',
            reset: 'Reset'
        }
    };

    const t = translations[language || 'tr'];

    return (
        <div className={`w-full max-w-md mx-auto p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-4">Pomodoro Timer</h2>

                {/* Mode buttons */}
                <div className="flex justify-center gap-2 mb-6">
                    <button
                        className={`px-4 py-2 rounded-lg ${
                            mode === 'work'
                                ? 'bg-red-600 text-white'
                                : darkMode
                                    ? 'bg-gray-700 text-gray-300'
                                    : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        {t.work}
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${
                            mode === 'shortBreak'
                                ? 'bg-green-600 text-white'
                                : darkMode
                                    ? 'bg-gray-700 text-gray-300'
                                    : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        {t.shortBreak}
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${
                            mode === 'longBreak'
                                ? 'bg-blue-600 text-white'
                                : darkMode
                                    ? 'bg-gray-700 text-gray-300'
                                    : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        {t.longBreak}
                    </button>
                </div>

                {/* Timer display */}
                <div className="text-7xl font-bold mb-6">
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>

                {/* Timer controls */}
                <div className="flex justify-center gap-2 mb-6">
                    <button
                        className={`px-6 py-2 rounded-lg ${
                            darkMode
                                ? isActive ? 'bg-yellow-600' : 'bg-green-600'
                                : isActive ? 'bg-yellow-500' : 'bg-green-500'
                        } text-white font-medium`}
                    >
                        {isActive ? t.pause : t.start}
                    </button>
                    <button
                        className={`px-6 py-2 rounded-lg ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        } font-medium`}
                    >
                        {t.reset}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;