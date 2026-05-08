import React, { useMemo, useState } from "react";

const CalendarView = ({ todos = [], onToggle, onRemove, language }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());

    const t = {
        tr: {
            monthTasks: "Bu ay görevler",
            selectedDay: "Seçili Gün",
            noTasksForDay: "Bu gün için görev yok",
            delete: "Sil",
            confirmDelete: "Bu görevi silmek istediğinize emin misiniz?"
        },
        en: {
            monthTasks: "Tasks this month",
            selectedDay: "Selected Day",
            noTasksForDay: "No tasks for this day",
            delete: "Delete",
            confirmDelete: "Are you sure you want to delete this task?"
        }
    }[language] || {
        monthTasks: "Tasks this month",
        selectedDay: "Selected Day",
        noTasksForDay: "No tasks for this day",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete this task?"
    };

    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const parseStoredDate = (value) => {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const monthLabel = currentDate.toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", {
        month: "long",
        year: "numeric"
    });

    const goToPreviousMonth = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
        setSelectedDay(1);
    };

    const goToNextMonth = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
        setSelectedDay(1);
    };

    const dayNames = language === "tr"
        ? ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return new Date(year, month + 1, 0).getDate();
    }, [currentDate]);

    const calendarCells = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();

        const cells = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push({ day: null, isEmpty: true });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            cells.push({ day, isEmpty: false });
        }

        return cells;
    }, [currentDate, daysInMonth]);

    const todosByDate = useMemo(() => {
        const grouped = new Map();

        todos.forEach((todo) => {
            if (!todo.date) {
                return;
            }

            const existing = grouped.get(todo.date) || [];
            existing.push(todo);
            grouped.set(todo.date, existing);
        });

        return grouped;
    }, [todos]);

    const selectedDateString = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return formatLocalDate(new Date(year, month, selectedDay));
    }, [currentDate, selectedDay]);

    const selectedDayTodos = todosByDate.get(selectedDateString) || [];

    const monthTaskCount = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        return todos.filter((todo) => {
            if (!todo.date) {
                return false;
            }

            const parsed = parseStoredDate(todo.date);
            return parsed.getFullYear() === year && parsed.getMonth() === month;
        }).length;
    }, [currentDate, todos]);

    const today = new Date();
    const isSameMonthAsToday = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

    return (
        <div className="h-full flex flex-col gap-4 text-white app-fade-up">
            <div className="surface-panel p-3.5 flex items-center justify-between">
                <button onClick={goToPreviousMonth} className="btn-ghost px-3 py-1.5">&lt;</button>
                <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold capitalize">{monthLabel}</h2>
                    <p className="text-xs text-slate-400">{t.monthTasks}: {monthTaskCount}</p>
                </div>
                <button onClick={goToNextMonth} className="btn-ghost px-3 py-1.5">&gt;</button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-4 flex-1 min-h-0">
                <div className="surface-panel p-3 min-h-0 flex flex-col">
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {dayNames.map((dayName) => (
                            <div key={dayName} className="text-center text-xs md:text-sm font-semibold p-2 text-slate-300">
                                {dayName}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 flex-1">
                        {calendarCells.map((cell, index) => {
                            if (cell.isEmpty) {
                                return <div key={`empty-${index}`} className="rounded-lg border border-transparent"></div>;
                            }

                            const cellDateString = formatLocalDate(
                                new Date(currentDate.getFullYear(), currentDate.getMonth(), cell.day)
                            );

                            const dayTodos = todosByDate.get(cellDateString) || [];
                            const isSelected = selectedDay === cell.day;
                            const isToday = isSameMonthAsToday && today.getDate() === cell.day;

                            return (
                                <button
                                    key={`day-${cell.day}`}
                                    type="button"
                                    onClick={() => setSelectedDay(cell.day)}
                                    className={`text-left rounded-lg border p-1.5 md:p-2 min-h-[82px] md:min-h-[94px] transition ${
                                        isSelected
                                            ? "border-sky-300/65 bg-sky-500/20"
                                            : "border-slate-700/70 bg-slate-900/45 hover:border-slate-500/70"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs md:text-sm font-semibold ${isToday ? "text-amber-200" : "text-slate-200"}`}>
                                            {cell.day}
                                        </span>
                                        {dayTodos.length > 0 && (
                                            <span className="h-5 min-w-5 px-1 rounded-full text-[10px] bg-sky-400 text-slate-900 font-bold inline-flex items-center justify-center">
                                                {dayTodos.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        {dayTodos.slice(0, 2).map((todo) => (
                                            <div
                                                key={todo.id}
                                                className={`text-[10px] md:text-[11px] leading-tight px-1.5 py-1 rounded border truncate ${
                                                    todo.completed
                                                        ? "bg-emerald-500/20 border-emerald-300/30 text-emerald-100"
                                                        : todo.priority === "high"
                                                            ? "bg-rose-500/20 border-rose-300/30 text-rose-100"
                                                            : todo.priority === "medium"
                                                                ? "bg-amber-500/20 border-amber-300/30 text-amber-100"
                                                                : "bg-sky-500/20 border-sky-300/30 text-sky-100"
                                                }`}
                                            >
                                                {todo.text}
                                            </div>
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="surface-panel p-4 min-h-0 flex flex-col">
                    <h3 className="text-lg font-semibold mb-1">{t.selectedDay}</h3>
                    <p className="text-xs text-slate-400 mb-3">{selectedDateString}</p>

                    <div className="space-y-2 overflow-y-auto flex-1">
                        {selectedDayTodos.length === 0 ? (
                            <div className="h-full min-h-24 rounded-lg border border-dashed border-slate-600/70 flex items-center justify-center text-sm text-slate-400">
                                {t.noTasksForDay}
                            </div>
                        ) : (
                            selectedDayTodos.map((todo) => (
                                <div key={todo.id} className="rounded-lg border border-slate-700/70 bg-slate-900/45 p-2.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <label className="flex items-start gap-2 min-w-0 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={todo.completed}
                                                onChange={() => onToggle(todo.id)}
                                                className="accent-sky-400 h-4 w-4 mt-1"
                                            />
                                            <span className={`text-sm truncate ${todo.completed ? "line-through text-slate-400" : "text-slate-100"}`}>
                                                {todo.text}
                                            </span>
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm(t.confirmDelete)) {
                                                    onRemove(todo.id);
                                                }
                                            }}
                                            className="btn-danger !text-xs px-2.5 py-1"
                                        >
                                            {t.delete}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;

