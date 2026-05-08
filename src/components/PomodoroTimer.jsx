// src/components/PomodoroTimer.jsx
import React, { useState, useEffect, useRef } from "react";

const PomodoroTimer = ({ language }) => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState("work");

    const translations = {
        tr: {
            work: "Çalışma",
            shortBreak: "Kısa Mola",
            longBreak: "Uzun Mola",
            start: "Başlat",
            pause: "Duraklat",
            reset: "Sıfırla"
        },
        en: {
            work: "Work",
            shortBreak: "Short Break",
            longBreak: "Long Break",
            start: "Start",
            pause: "Pause",
            reset: "Reset"
        }
    };

    const t = translations[language || "tr"];
    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(timerRef.current);
                        setIsActive(false);

                        const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3");
                        audio.play().catch(e => console.log("Audio play error:", e));

                        if (mode === "work") {
                            setMode("shortBreak");
                            setMinutes(5);
                        } else {
                            setMode("work");
                            setMinutes(25);
                        }
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
    }, [isActive, minutes, seconds, mode]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === "work") setMinutes(25);
        else if (mode === "shortBreak") setMinutes(5);
        else setMinutes(15);
        setSeconds(0);
    };

    const changeMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);

        if (newMode === "work") setMinutes(25);
        else if (newMode === "shortBreak") setMinutes(5);
        else setMinutes(15);
        setSeconds(0);
    };

    return (
        <div className="glass-panel w-full max-w-lg mx-auto p-6 text-white app-fade-up">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold mb-5">Pomodoro Timer</h2>

                <div className="flex justify-center flex-wrap gap-2 mb-7">
                    <button onClick={() => changeMode("work")} className={`px-4 py-2 rounded-xl font-semibold ${mode === "work" ? "btn-primary" : "btn-ghost"}`}>{t.work}</button>
                    <button onClick={() => changeMode("shortBreak")} className={`px-4 py-2 rounded-xl font-semibold ${mode === "shortBreak" ? "btn-primary" : "btn-ghost"}`}>{t.shortBreak}</button>
                    <button onClick={() => changeMode("longBreak")} className={`px-4 py-2 rounded-xl font-semibold ${mode === "longBreak" ? "btn-primary" : "btn-ghost"}`}>{t.longBreak}</button>
                </div>

                <div className="text-7xl font-bold mb-7 tracking-tight text-sky-100">
                    {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </div>

                <div className="flex justify-center gap-2 mb-2">
                    <button onClick={toggleTimer} className="btn-primary px-6 py-2.5 font-semibold">
                        {isActive ? t.pause : t.start}
                    </button>
                    <button onClick={resetTimer} className="btn-secondary px-6 py-2.5 font-semibold">
                        {t.reset}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;
