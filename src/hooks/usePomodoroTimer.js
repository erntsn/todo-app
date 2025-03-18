import { useState, useEffect, useRef, useCallback } from 'react';

export default function usePomodoroTimer(initialSettings = {}) {
    // Default settings
    const defaultSettings = {
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        cyclesBeforeLongBreak: 4
    };

    // Merge defaults with provided settings
    const [settings, setSettings] = useState({
        ...defaultSettings,
        ...initialSettings
    });

    const [minutes, setMinutes] = useState(settings.workTime);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
    const [cycles, setCycles] = useState(0);

    const timerRef = useRef(null);

    // Load settings from localStorage if available
    useEffect(() => {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (e) {
                console.error('Failed to parse saved settings:', e);
            }
        }
    }, []);

    // Save settings to localStorage when they change
    useEffect(() => {
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }, [settings]);

    // Handle timer
    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(timerRef.current);
                        // Play sound
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                        audio.play();
                        handleTimerComplete();
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isActive, minutes, seconds]);

    // Handle timer completion
    const handleTimerComplete = useCallback(() => {
        setIsActive(false);

        if (mode === 'work') {
            const newCycles = cycles + 1;
            setCycles(newCycles);

            if (newCycles % settings.cyclesBeforeLongBreak === 0) {
                // Time for a long break
                setMode('longBreak');
                setMinutes(settings.longBreakTime);
            } else {
                // Time for a short break
                setMode('shortBreak');
                setMinutes(settings.shortBreakTime);
            }
        } else {
            // Break is over, back to work
            setMode('work');
            setMinutes(settings.workTime);
        }

        setSeconds(0);
    }, [mode, cycles, settings]);

    // Start or pause timer
    const toggleTimer = useCallback(() => {
        setIsActive(prev => !prev);
    }, []);

    // Reset timer
    const resetTimer = useCallback(() => {
        setIsActive(false);

        if (mode === 'work') {
            setMinutes(settings.workTime);
        } else if (mode === 'shortBreak') {
            setMinutes(settings.shortBreakTime);
        } else {
            setMinutes(settings.longBreakTime);
        }

        setSeconds(0);
    }, [mode, settings]);

    // Switch between modes
    const switchMode = useCallback((newMode) => {
        setIsActive(false);
        setMode(newMode);

        if (newMode === 'work') {
            setMinutes(settings.workTime);
        } else if (newMode === 'shortBreak') {
            setMinutes(settings.shortBreakTime);
        } else {
            setMinutes(settings.longBreakTime);
        }

        setSeconds(0);
    }, [settings]);

    // Update settings
    const updateSettings = useCallback((newSettings) => {
        setSettings(prev => ({
            ...prev,
            ...newSettings
        }));

        // Reset timer with new settings
        resetTimer();
    }, [resetTimer]);

    return {
        minutes,
        seconds,
        isActive,
        mode,
        cycles,
        settings,
        toggleTimer,
        resetTimer,
        switchMode,
        updateSettings
    };
}