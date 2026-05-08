import React, { useEffect, useState } from "react";
import TaskDetailModal from "./TaskDetailModal";

const TrelloBoard = ({
    todos,
    onToggle,
    onRemove,
    onUpdate,
    onUpdateStatus,
    onTagClick,
    language,
    translations
}) => {
    const [localColumns, setLocalColumns] = useState({
        backlog: [],
        todo: [],
        inProgress: [],
        done: []
    });

    const [draggedTodo, setDraggedTodo] = useState(null);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const t = translations[language];

    const columnTitles = {
        backlog: language === "tr" ? "Backlog" : "Backlog",
        todo: language === "tr" ? "Yapilacak" : "To Do",
        inProgress: language === "tr" ? "Devam Eden" : "In Progress",
        done: language === "tr" ? "Tamamlandı" : "Done"
    };

    useEffect(() => {
        if (!todos) {
            return;
        }

        const nextColumns = {
            backlog: [],
            todo: [],
            inProgress: [],
            done: []
        };

        todos.forEach((todo) => {
            const status = todo.status || (todo.completed ? "done" : "todo");
            if (nextColumns[status]) {
                nextColumns[status].push(todo);
            } else {
                nextColumns.todo.push(todo);
            }
        });

        setLocalColumns(nextColumns);
    }, [todos]);

    const handleDeleteTodo = async (id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const confirmMessage = language === "tr"
            ? "Bu görevi silmek istediğinize emin misiniz?"
            : "Are you sure you want to delete this task?";

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            setIsDeleting(true);
            await onRemove(id);

            if (selectedTodo?.id === id) {
                setSelectedTodo(null);
            }
        } catch (error) {
            alert(language === "tr" ? `Silme islemi basarisiz oldu: ${error.message}` : `Delete failed: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateTodo = async (updatedTodo) => {
        try {
            setIsUpdating(true);
            await onUpdate(updatedTodo);
            setSelectedTodo(null);
        } catch (error) {
            alert(language === "tr" ? `Güncelleme islemi basarisiz oldu: ${error.message}` : `Update failed: ${error.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDragStart = (e, todo) => {
        setDraggedTodo(todo);
        e.dataTransfer.setData("text/plain", todo.id);

        setTimeout(() => {
            if (e.target && !e.target.classList.contains("dragging")) {
                e.target.classList.add("dragging");
            }
        }, 0);
    };

    const handleDragEnd = (e) => {
        if (e.target && e.target.classList.contains("dragging")) {
            e.target.classList.remove("dragging");
        }

        setTimeout(() => {
            setDraggedTodo(null);
        }, 30);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (e.currentTarget && !e.currentTarget.classList.contains("drag-over")) {
            e.currentTarget.classList.add("drag-over");
        }
    };

    const handleDragLeave = (e) => {
        if (e.currentTarget && e.currentTarget.classList.contains("drag-over")) {
            e.currentTarget.classList.remove("drag-over");
        }
    };

    const handleDrop = async (e, targetColumn) => {
        e.preventDefault();
        if (e.currentTarget && e.currentTarget.classList.contains("drag-over")) {
            e.currentTarget.classList.remove("drag-over");
        }

        if (!draggedTodo?.id) {
            return;
        }

        const sourceColumn = draggedTodo.status || (draggedTodo.completed ? "done" : "todo");
        if (sourceColumn === targetColumn) {
            setDraggedTodo(null);
            return;
        }

        const optimisticColumns = { ...localColumns };
        optimisticColumns[sourceColumn] = optimisticColumns[sourceColumn].filter((todo) => todo.id !== draggedTodo.id);

        const updatedTodo = {
            ...draggedTodo,
            status: targetColumn,
            completed: targetColumn === "done",
            completedAt: targetColumn === "done" ? new Date().toISOString() : null
        };

        optimisticColumns[targetColumn].push(updatedTodo);
        setLocalColumns(optimisticColumns);

        if (!onUpdateStatus) {
            setDraggedTodo(null);
            return;
        }

        try {
            setIsUpdating(true);
            await onUpdateStatus(draggedTodo.id, targetColumn);
        } catch (error) {
            alert(language === "tr" ? `Durum güncellenemedi: ${error.message}` : `Status update failed: ${error.message}`);
        } finally {
            setIsUpdating(false);
            setDraggedTodo(null);
        }
    };

    const renderCard = (todo) => {
        const categoryDotClasses = {
            work: "bg-blue-300",
            personal: "bg-purple-300",
            health: "bg-emerald-300",
            shopping: "bg-pink-300",
            finance: "bg-amber-300",
            education: "bg-indigo-300",
            other: "bg-slate-300"
        };

        return (
            <div
                key={todo.id}
                className="drag-item cursor-pointer"
                draggable
                onDragStart={(e) => handleDragStart(e, todo)}
                onDragEnd={handleDragEnd}
                onClick={() => {
                    if (!draggedTodo) {
                        setSelectedTodo(todo);
                    }
                }}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold truncate ${todo.completed ? "line-through text-slate-400" : "text-white"}`}>
                            {todo.text}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                            {todo.date && (
                                <span className="px-2 py-0.5 rounded-full border border-slate-600/60 bg-slate-900/45">
                                    {todo.date}
                                </span>
                            )}

                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                                todo.priority === "high"
                                    ? "bg-rose-500/20 border-rose-300/35 text-rose-100"
                                    : todo.priority === "medium"
                                        ? "bg-amber-500/20 border-amber-300/35 text-amber-100"
                                        : "bg-emerald-500/20 border-emerald-300/35 text-emerald-100"
                            }`}>
                                {t.priority[todo.priority] || t.priority.medium}
                            </span>

                            {todo.category && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-600/60 bg-slate-900/45 text-slate-200">
                                    <span className={`w-1.5 h-1.5 rounded-full ${categoryDotClasses[todo.category] || categoryDotClasses.other}`}></span>
                                    {t.categories[todo.category] || t.categories.other}
                                </span>
                            )}
                        </div>

                        {todo.tags && todo.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {todo.tags.slice(0, 3).map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTagClick(tag);
                                        }}
                                        className="px-2 py-0.5 rounded-full border border-sky-300/35 bg-sky-500/20 text-[11px] text-sky-100 hover:bg-sky-500/30"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                                {todo.tags.length > 3 && (
                                    <span className="text-[11px] text-slate-400 self-center">+{todo.tags.length - 3}</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggle(todo.id);
                            }}
                            className="btn-ghost !p-0 h-7 w-7 flex items-center justify-center"
                            disabled={isUpdating}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={(e) => handleDeleteTodo(todo.id, e)}
                            className="btn-danger !p-0 h-7 w-7 flex items-center justify-center"
                            disabled={isDeleting}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderColumn = (columnName) => (
        <div
            key={columnName}
            className="surface-panel column-drop-area p-3 min-w-[260px] w-full md:w-1/3 flex-1 flex flex-col"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, columnName)}
        >
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-bold tracking-wide text-slate-100">{columnTitles[columnName]}</h2>
                <span className="h-6 min-w-6 px-2 rounded-full bg-sky-400 text-slate-900 text-xs font-bold inline-flex items-center justify-center">
                    {localColumns[columnName]?.length || 0}
                </span>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1">
                {localColumns[columnName]?.length > 0 ? (
                    localColumns[columnName].map((todo) => renderCard(todo))
                ) : (
                    <div className="h-full min-h-24 flex items-center justify-center rounded-lg border border-dashed border-slate-600/70 text-sm text-slate-400">
                        {language === "tr" ? "Görev yok" : "No tasks"}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <style>
                {`
                .column-drop-area {
                  transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
                }

                .column-drop-area.drag-over {
                  border-color: rgba(103, 208, 250, 0.74);
                  background: linear-gradient(145deg, rgba(30, 47, 66, 0.9), rgba(20, 33, 47, 0.96));
                  box-shadow: 0 0 0 2px rgba(67, 191, 243, 0.2);
                }

                .drag-item {
                  transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease, opacity 0.16s ease;
                  background: linear-gradient(145deg, rgba(27, 41, 58, 0.9), rgba(18, 29, 44, 0.95));
                  border: 1px solid rgba(134, 163, 190, 0.24);
                  border-radius: 0.75rem;
                  padding: 0.72rem;
                  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
                }

                .drag-item:hover {
                  transform: translateY(-1px);
                  border-color: rgba(96, 195, 241, 0.48);
                  box-shadow: 0 13px 22px rgba(0, 0, 0, 0.26);
                }

                .drag-item.dragging {
                  opacity: 0.6;
                  transform: scale(1.02);
                }
                `}
            </style>

            <div className="flex flex-col md:flex-row gap-4 h-full overflow-x-auto pb-3">
                {Object.keys(localColumns).map((columnName) => renderColumn(columnName))}
            </div>

            {selectedTodo && (
                <TaskDetailModal
                    todo={selectedTodo}
                    onClose={() => setSelectedTodo(null)}
                    onUpdate={handleUpdateTodo}
                    onDelete={handleDeleteTodo}
                    language={language}
                    translations={translations}
                />
            )}
        </>
    );
};

export default TrelloBoard;

