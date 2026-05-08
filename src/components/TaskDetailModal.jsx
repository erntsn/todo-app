import React, { useState } from "react";
import { createPortal } from "react-dom";
import SubtaskList from "./SubtaskList";
import { getGoogleCalendarUrl, downloadTodoAsIcs } from "../utils/calendarExport";

const LABELS = {
    tr: {
        title: "Görev Detayı",
        save: "Kaydet",
        saving: "Kaydediliyor...",
        cancel: "İptal",
        delete: "Sil",
        deleting: "Siliniyor...",
        notes: "Notlar",
        notesPlaceholder: "Notlar...",
        date: "Tarih",
        priority: { label: "Öncelik", high: "Yüksek", medium: "Orta", low: "Düşük" },
        confirmDelete: "Bu görevi silmek istediğinize emin misiniz?",
        completed: "Tamamlandı",
        active: "Aktif",
    },
    en: {
        title: "Task Detail",
        save: "Save",
        saving: "Saving...",
        cancel: "Cancel",
        delete: "Delete",
        deleting: "Deleting...",
        notes: "Notes",
        notesPlaceholder: "Add notes...",
        date: "Date",
        priority: { label: "Priority", high: "High", medium: "Medium", low: "Low" },
        confirmDelete: "Delete this task?",
        completed: "Completed",
        active: "Active",
    },
};

const TaskDetailModal = ({ todo, onClose, onUpdate, onDelete, language }) => {
    const t = LABELS[language] || LABELS.tr;

    const [text, setText] = useState(todo.text || "");
    const [priority, setPriority] = useState(todo.priority || "medium");
    const [date, setDate] = useState(todo.date || "");
    const [notes, setNotes] = useState(todo.notes || "");
    const [subtasks, setSubtasks] = useState(todo.subtasks || []);
    const [completed, setCompleted] = useState(todo.completed || false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState("");
    const [calError, setCalError] = useState("");

    const handleSave = async () => {
        if (!text.trim()) { setError("Görev boş olamaz"); return; }
        setSaving(true);
        try {
            await onUpdate({
                ...todo,
                text: text.trim(),
                priority,
                date: date || null,
                notes,
                subtasks,
                completed,
                completedAt: completed && !todo.completed ? new Date().toISOString() : todo.completedAt || null,
            });
            onClose();
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(todo.id);
            onClose();
        } catch (e) {
            setError(e.message);
            setDeleting(false);
        }
    };

    const priorities = [
        { key: "low",    label: t.priority.low,    active: "bg-emerald-500/20 border-emerald-400/60 text-emerald-300", base: "border-[var(--border-soft)] text-[var(--text-muted)]" },
        { key: "medium", label: t.priority.medium, active: "bg-amber-500/20 border-amber-400/60 text-amber-300",       base: "border-[var(--border-soft)] text-[var(--text-muted)]" },
        { key: "high",   label: t.priority.high,   active: "bg-red-500/20 border-red-400/60 text-red-300",             base: "border-[var(--border-soft)] text-[var(--text-muted)]" },
    ];

    const modal = (
        <div className="fixed inset-0 bg-[rgba(6,5,12,0.82)] backdrop-blur-md z-[9999] flex items-end sm:items-center justify-center sm:p-4">
            <div className="modal-panel w-full sm:max-w-lg max-h-[92dvh] overflow-hidden app-fade-up flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-soft)] flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => setCompleted(v => !v)}
                            className="custom-checkbox"
                        />
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                            completed
                                ? "bg-emerald-500/15 border-emerald-400/25 text-emerald-300"
                                : "bg-violet-500/15 border-violet-400/25 text-violet-300"
                        }`}>
                            {completed ? t.completed : t.active}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
                    {error && (
                        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
                    )}

                    {/* Title */}
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={`w-full bg-transparent border-none outline-none text-lg font-semibold placeholder:text-[var(--text-muted)] ${
                            completed ? "line-through text-[var(--text-muted)]" : "text-[var(--text-main)]"
                        }`}
                        placeholder="Görev..."
                    />

                    {/* Priority */}
                    <div>
                        <p className="section-title mb-2">{t.priority.label}</p>
                        <div className="flex gap-2">
                            {priorities.map(({ key, label, active, base }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setPriority(key)}
                                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${
                                        priority === key ? active : base
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date + calendar export */}
                    <div>
                        <p className="section-title mb-2">{t.date}</p>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setCalError(""); }}
                            className="input-elevated !py-2.5 text-sm"
                        />

                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                disabled={!date}
                                onClick={() => {
                                    setCalError("");
                                    const url = getGoogleCalendarUrl({ ...todo, text, date, notes, priority }, language);
                                    if (url) window.open(url, "_blank", "noopener,noreferrer");
                                    else setCalError(language === "tr" ? "Tarih gerekli" : "Date required");
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all
                                    border-[var(--border-soft)] text-[var(--text-secondary)]
                                    hover:border-[rgba(66,133,244,0.5)] hover:text-[#93bbfd] hover:bg-[rgba(66,133,244,0.08)]
                                    disabled:opacity-35 disabled:cursor-not-allowed"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google Takvim
                            </button>

                            <button
                                type="button"
                                disabled={!date}
                                onClick={() => {
                                    setCalError("");
                                    const ok = downloadTodoAsIcs({ ...todo, text, date, notes, priority }, language);
                                    if (!ok) setCalError(language === "tr" ? "Tarih gerekli" : "Date required");
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all
                                    border-[var(--border-soft)] text-[var(--text-secondary)]
                                    hover:border-[rgba(139,92,246,0.4)] hover:text-[var(--accent-light)] hover:bg-[rgba(139,92,246,0.08)]
                                    disabled:opacity-35 disabled:cursor-not-allowed"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {language === "tr" ? "Telefon Takvimi" : "Phone Calendar"}
                            </button>
                        </div>

                        {calError && (
                            <p className="text-xs text-amber-400 mt-1.5">{calError}</p>
                        )}
                    </div>

                    {/* Subtasks */}
                    <SubtaskList
                        subtasks={subtasks}
                        onUpdate={setSubtasks}
                        language={language}
                    />

                    {/* Notes */}
                    <div>
                        <p className="section-title mb-2">{t.notes}</p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder={t.notesPlaceholder}
                            className="input-elevated resize-none text-sm"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-[var(--border-soft)] flex-shrink-0">
                    {confirmDelete ? (
                        <div className="flex items-center gap-2 w-full app-fade-up">
                            <span className="flex-1 text-sm text-[var(--text-secondary)]">
                                {language === "tr" ? "Silinsin mi?" : "Delete this task?"}
                            </span>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="btn-ghost px-3 py-2 text-sm"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="btn-danger px-4 py-2 text-sm disabled:opacity-60"
                            >
                                {deleting ? t.deleting : t.delete}
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="btn-danger px-4 py-2.5 text-sm"
                            >
                                {t.delete}
                            </button>
                            <div className="flex gap-2">
                                <button onClick={onClose} className="btn-ghost px-4 py-2.5 text-sm">{t.cancel}</button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60"
                                >
                                    {saving ? t.saving : t.save}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default TaskDetailModal;
