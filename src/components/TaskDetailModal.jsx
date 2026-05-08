import React, { useState } from "react";
import { createPortal } from "react-dom";
import SubtaskList from "./SubtaskList";
import TagsInput from "./TagsInput";
import CategorySelector from "./CategorySelector";
import { downloadTodoAsIcs, getGoogleCalendarUrl } from "../utils/calendarExport";

const TaskDetailModal = ({ todo, onClose, onUpdate, onDelete, language, translations }) => {
    const [editedTodo, setEditedTodo] = useState({
        ...todo,
        notes: todo.notes || "",
        subtasks: todo.subtasks || [],
        tags: todo.tags || [],
        category: todo.category || "other",
        recurring: todo.recurring || null
    });

    const [isRecurring, setIsRecurring] = useState(Boolean(todo.recurring));
    const [recurrenceType, setRecurrenceType] = useState(todo.recurring?.type || "daily");
    const [recurrenceValue, setRecurrenceValue] = useState(todo.recurring?.value || 1);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const localT = {
        tr: {
            title: "Görev Detayları",
            delete: "Sil",
            cancel: "İptal",
            save: "Kaydet",
            saving: "Kaydediliyor...",
            deleting: "Siliniyor...",
            notes: "Notlar",
            date: "Tarih",
            priority: {
                label: "Öncelik",
                high: "Yüksek",
                medium: "Orta",
                low: "Düşük"
            },
            notesPlaceholder: "Görevle ilgili notları yazın",
            confirmDelete: "Bu görevi silmek istediğinize emin misiniz?",
            recurring: "Tekrarlayan Görev",
            every: "Her",
            completed: "Tamamlandı",
            active: "Aktif",
            textRequired: "Görev metni boş olamaz",
            invalidId: "Geçersiz görev kimliği",
            saveError: "Kaydetme hatası",
            deleteError: "Silme hatası",
            calendarTitle: "Takvime Ekle",
            addGoogle: "Google Takvim",
            addPhoneCalendar: "Telefon/Apple/Outlook (.ics)",
            calendarHint: "Tarih girildiğinde görevi takvime etkinlik olarak ekleyebilirsiniz.",
            dateRequiredForCalendar: "Takvime eklemek için görev tarihi gerekli"
        },
        en: {
            title: "Task Details",
            delete: "Delete",
            cancel: "Cancel",
            save: "Save",
            saving: "Saving...",
            deleting: "Deleting...",
            notes: "Notes",
            date: "Date",
            priority: {
                label: "Priority",
                high: "High",
                medium: "Medium",
                low: "Low"
            },
            notesPlaceholder: "Write notes about this task",
            confirmDelete: "Are you sure you want to delete this task?",
            recurring: "Recurring Task",
            every: "Every",
            completed: "Completed",
            active: "Active",
            textRequired: "Task text cannot be empty",
            invalidId: "Invalid task ID",
            saveError: "Error saving changes",
            deleteError: "Error deleting task",
            calendarTitle: "Add To Calendar",
            addGoogle: "Google Calendar",
            addPhoneCalendar: "Phone/Apple/Outlook (.ics)",
            calendarHint: "Once a date is set, you can add this task as a calendar event.",
            dateRequiredForCalendar: "Task date is required for calendar export"
        }
    };

    const t = localT[language] || localT.tr;

    const translationSet = translations?.[language] || {};
    const priorityOptions = translationSet.priority || t.priority;
    const recurrenceOptions = translationSet.recurrence || {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly"
    };

    const statusLabel = editedTodo.completed ? t.completed : t.active;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTodo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubtasksUpdate = (subtasks) => {
        setEditedTodo((prev) => ({ ...prev, subtasks }));
    };

    const handleTagsUpdate = (tags) => {
        setEditedTodo((prev) => ({ ...prev, tags }));
    };

    const handleToggleComplete = () => {
        setEditedTodo((prev) => ({
            ...prev,
            completed: !prev.completed,
            completedAt: !prev.completed ? new Date().toISOString() : null
        }));
    };

    const handleAddGoogleCalendar = () => {
        setErrorMessage("");

        const url = getGoogleCalendarUrl(editedTodo, language);
        if (!url) {
            setErrorMessage(t.dateRequiredForCalendar);
            return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handleDownloadIcs = () => {
        setErrorMessage("");

        const exported = downloadTodoAsIcs(editedTodo, language);
        if (!exported) {
            setErrorMessage(t.dateRequiredForCalendar);
        }
    };

    const handleSave = async () => {
        setErrorMessage("");

        try {
            setIsSaving(true);

            if (!editedTodo.text || editedTodo.text.trim() === "") {
                throw new Error(t.textRequired);
            }

            const updatedTodo = {
                ...editedTodo,
                id: todo.id,
                recurring: isRecurring
                    ? {
                          type: recurrenceType,
                          value: Number.parseInt(recurrenceValue, 10) || 1,
                          nextDate: editedTodo.date
                      }
                    : null
            };

            await onUpdate(updatedTodo);
            onClose();
        } catch (error) {
            setErrorMessage(`${t.saveError}: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setErrorMessage("");

        if (!window.confirm(t.confirmDelete)) {
            return;
        }

        try {
            setIsDeleting(true);

            if (!todo.id) {
                throw new Error(t.invalidId);
            }

            await onDelete(todo.id);
            onClose();
        } catch (error) {
            setErrorMessage(`${t.deleteError}: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };
    const modalContent = (
        <div className="fixed inset-0 bg-black/82 backdrop-blur-md z-[9999] flex items-center justify-center p-2 md:p-6">
            <div className="glass-panel w-full max-w-[920px] max-h-[94vh] overflow-hidden app-fade-up border border-slate-500/40 shadow-[0_28px_80px_rgba(0,0,0,0.62)]">
                <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-600/70 bg-slate-950/55">
                    <div className="min-w-0">
                        <h2 className="text-xl md:text-2xl font-bold truncate">{t.title}</h2>
                        <span
                            className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs border ${
                                editedTodo.completed
                                    ? "bg-emerald-500/25 border-emerald-300/40 text-emerald-100"
                                    : "bg-sky-500/25 border-sky-300/40 text-sky-100"
                            }`}
                        >
                            {statusLabel}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="btn-ghost h-10 w-10 !p-0 flex items-center justify-center"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(94vh-176px)] p-4 md:p-5 space-y-4">
                    {errorMessage && (
                        <div className="rounded-xl border border-rose-300/35 bg-rose-500/20 text-rose-100 px-3 py-2 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <div className="surface-panel p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={editedTodo.completed}
                                onChange={handleToggleComplete}
                                className="accent-sky-400 h-5 w-5 mt-1"
                            />
                            <input
                                type="text"
                                name="text"
                                value={editedTodo.text}
                                onChange={handleChange}
                                className="input-elevated !py-2.5 text-lg font-semibold"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <p className="section-title mb-2.5">{t.priority.label}</p>
                                <select
                                    name="priority"
                                    value={editedTodo.priority}
                                    onChange={handleChange}
                                    className="input-elevated !py-2.5"
                                >
                                    <option value="high">{priorityOptions.high}</option>
                                    <option value="medium">{priorityOptions.medium}</option>
                                    <option value="low">{priorityOptions.low}</option>
                                </select>
                            </div>

                            <div>
                                <p className="section-title mb-2.5">{t.date}</p>
                                <input
                                    type="date"
                                    name="date"
                                    value={editedTodo.date || ""}
                                    onChange={handleChange}
                                    className="input-elevated !py-2.5"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="surface-panel p-4">
                        <p className="section-title mb-2.5">{t.calendarTitle}</p>
                        <p className="text-xs text-slate-400 mb-3">{t.calendarHint}</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button type="button" onClick={handleAddGoogleCalendar} className="btn-primary px-4 py-2.5 text-sm">
                                {t.addGoogle}
                            </button>
                            <button type="button" onClick={handleDownloadIcs} className="btn-secondary px-4 py-2.5 text-sm">
                                {t.addPhoneCalendar}
                            </button>
                        </div>
                    </div>

                    <div className="surface-panel p-4 space-y-4">
                        <CategorySelector
                            category={editedTodo.category || "other"}
                            onChange={(nextCategory) => setEditedTodo((prev) => ({ ...prev, category: nextCategory }))}
                            language={language}
                        />

                        <TagsInput tags={editedTodo.tags || []} onChange={handleTagsUpdate} language={language} />
                    </div>

                    <div className="surface-panel p-4">
                        <label className="inline-flex items-center gap-2 mb-3 text-sm text-slate-100">
                            <input
                                type="checkbox"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className="accent-sky-400 h-4 w-4"
                            />
                            {t.recurring}
                        </label>

                        {isRecurring && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <select
                                    value={recurrenceType}
                                    onChange={(e) => setRecurrenceType(e.target.value)}
                                    className="input-elevated !py-2.5"
                                >
                                    <option value="daily">{recurrenceOptions.daily}</option>
                                    <option value="weekly">{recurrenceOptions.weekly}</option>
                                    <option value="monthly">{recurrenceOptions.monthly}</option>
                                    <option value="yearly">{recurrenceOptions.yearly}</option>
                                </select>

                                <label className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2.5 text-sm">
                                    <span className="text-slate-300">{t.every}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={recurrenceValue}
                                        onChange={(e) => setRecurrenceValue(Number.parseInt(e.target.value, 10) || 1)}
                                        className="w-20 rounded-lg border border-slate-600/70 bg-slate-800/80 px-2 py-1.5 text-slate-100"
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="surface-panel p-4">
                        <p className="section-title mb-2.5">{t.notes}</p>
                        <textarea
                            name="notes"
                            value={editedTodo.notes}
                            onChange={handleChange}
                            rows="4"
                            className="input-elevated resize-none"
                            placeholder={t.notesPlaceholder}
                        />
                    </div>

                    <SubtaskList subtasks={editedTodo.subtasks} onUpdate={handleSubtasksUpdate} language={language} />
                </div>

                <div className="p-4 border-t border-slate-600/70 bg-slate-950/55 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="btn-danger px-4 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? t.deleting : t.delete}
                    </button>

                    <div className="flex gap-2 sm:justify-end">
                        <button onClick={onClose} className="btn-secondary px-4 py-2.5 text-sm">
                            {t.cancel}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary px-4 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSaving ? t.saving : t.save}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default TaskDetailModal;

