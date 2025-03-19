import React, { useState } from 'react';
import SubtaskList from './SubtaskList';
import TagsInput from './TagsInput';
import CategorySelector from './CategorySelector';

const TaskDetailModal = ({ todo, onClose, onUpdate, onDelete, language, translations }) => {
    const [editedTodo, setEditedTodo] = useState({
        ...todo,
        notes: todo.notes || '',
        subtasks: todo.subtasks || [],
        tags: todo.tags || [],
        category: todo.category || 'other',
        recurring: todo.recurring || null
    });

    // Recurring task options
    const [isRecurring, setIsRecurring] = useState(!!todo.recurring);
    const [recurrenceType, setRecurrenceType] = useState(todo.recurring?.type || 'daily');
    const [recurrenceValue, setRecurrenceValue] = useState(todo.recurring?.value || 1);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTodo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubtasksUpdate = (subtasks) => {
        setEditedTodo(prev => ({ ...prev, subtasks }));
    };

    const handleTagsUpdate = (tags) => {
        setEditedTodo(prev => ({ ...prev, tags }));
    };

    const handleSave = async () => {
        // Clear any previous error
        setErrorMessage('');

        try {
            setIsSaving(true);

            // Validate the todo has the required fields
            if (!editedTodo.text || editedTodo.text.trim() === '') {
                throw new Error(language === 'tr' ? 'Görev metni boş olamaz' : 'Task text cannot be empty');
            }

            // Update recurring settings
            const updatedTodo = {
                ...editedTodo,
                id: todo.id, // Ensure ID is included
                recurring: isRecurring ? {
                    type: recurrenceType,
                    value: parseInt(recurrenceValue, 10) || 1,
                    nextDate: editedTodo.date,
                } : null
            };

            console.log("Saving updated todo:", updatedTodo);
            await onUpdate(updatedTodo);
            onClose();
        } catch (error) {
            console.error("Error saving todo:", error);
            setErrorMessage(language === 'tr'
                ? 'Kaydetme hatası oluştu: ' + error.message
                : 'Error saving changes: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        // Clear any previous error
        setErrorMessage('');

        const confirmMessage = language === 'tr'
            ? 'Bu görevi silmek istediğinize emin misiniz?'
            : 'Are you sure you want to delete this task?';

        if (window.confirm(confirmMessage)) {
            try {
                setIsDeleting(true);

                if (!todo.id) {
                    throw new Error(language === 'tr' ? 'Geçersiz görev ID' : 'Invalid task ID');
                }

                console.log("Deleting todo with ID:", todo.id);
                await onDelete(todo.id);
                onClose();
            } catch (error) {
                console.error("Error deleting todo:", error);
                setErrorMessage(language === 'tr'
                    ? 'Silme hatası oluştu: ' + error.message
                    : 'Error deleting task: ' + error.message);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleToggleComplete = () => {
        setEditedTodo(prev => ({
            ...prev,
            completed: !prev.completed,
            completedAt: !prev.completed ? new Date().toISOString() : null
        }));
    };

    const t = {
        tr: {
            title: 'Görev Detayları',
            delete: 'Sil',
            deleteConfirm: 'Bu görevi silmek istediğinize emin misiniz?',
            cancel: 'İptal',
            save: 'Kaydet',
            saving: 'Kaydediliyor...',
            deleting: 'Siliniyor...',
            notes: 'Notlar',
            date: 'Tarih',
            priority: {
                label: 'Öncelik',
                high: 'Yüksek',
                medium: 'Orta',
                low: 'Düşük'
            },
            notesPlaceholder: 'Notlarınızı buraya yazın...',
            confirmDelete: 'Bu görevi silmek istediğinize emin misiniz?',
            recurring: 'Tekrarlayan Görev',
            every: 'Her'
        },
        en: {
            title: 'Task Details',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this task?',
            cancel: 'Cancel',
            save: 'Save',
            saving: 'Saving...',
            deleting: 'Deleting...',
            notes: 'Notes',
            date: 'Date',
            priority: {
                label: 'Priority',
                high: 'High',
                medium: 'Medium',
                low: 'Low'
            },
            notesPlaceholder: 'Write your notes here...',
            confirmDelete: 'Are you sure you want to delete this task?',
            recurring: 'Recurring Task',
            every: 'Every'
        }
    }[language];

    // Get priority options from translations
    const priorityOptions = translations[language].priority;
    const recurrenceOptions = translations[language].recurrence;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="relative max-w-2xl w-full mx-auto rounded-lg shadow-lg bg-gray-800 text-white">
                {/* Header with close button */}
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    {/* Empty div for balance */}
                    <div className="w-6"></div>

                    {/* Title - centered */}
                    <h2 className="text-xl font-bold text-center text-white">
                        {t.title}
                    </h2>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 text-white"
                        aria-label="Close"
                    >
                        <span className="text-xl font-bold">×</span>
                    </button>
                </div>

                {/* Error message display if present */}
                {errorMessage && (
                    <div className="mx-6 mt-4 p-3 bg-red-800 text-white rounded-md">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errorMessage}
                        </div>
                    </div>
                )}

                {/* Main content */}
                <div className="p-6">
                    {/* Task checkbox and title */}
                    <div className="flex items-center gap-3 mb-4">
                        <input
                            type="checkbox"
                            checked={editedTodo.completed}
                            onChange={handleToggleComplete}
                            className="h-5 w-5 accent-blue-500"
                        />
                        <input
                            type="text"
                            name="text"
                            value={editedTodo.text}
                            onChange={handleChange}
                            className="text-xl font-bold w-full p-2 rounded bg-gray-700 text-white border-0 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Priority and Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-300">
                                {t.priority.label}
                            </label>
                            <select
                                name="priority"
                                value={editedTodo.priority}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500 border text-sm block appearance-none"
                            >
                                <option value="high">{priorityOptions.high}</option>
                                <option value="medium">{priorityOptions.medium}</option>
                                <option value="low">{priorityOptions.low}</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-300">
                                {t.date}
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={editedTodo.date || ''}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500 border text-sm block"
                            />
                        </div>
                    </div>

                    {/* Category selector */}
                    <div className="mb-4">
                        <CategorySelector
                            category={editedTodo.category || 'other'}
                            onChange={(category) => setEditedTodo(prev => ({ ...prev, category }))}
                            language={language}
                            darkMode={true}
                        />
                    </div>

                    {/* Tags input */}
                    <div className="mb-4">
                        <TagsInput
                            tags={editedTodo.tags || []}
                            onChange={handleTagsUpdate}
                            language={language}
                            darkMode={true}
                        />
                    </div>

                    {/* Recurring task options */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="detailIsRecurring"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className="h-4 w-4"
                            />
                            <label htmlFor="detailIsRecurring" className="text-sm">
                                {t.recurring}
                            </label>
                        </div>

                        {isRecurring && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <select
                                    value={recurrenceType}
                                    onChange={(e) => setRecurrenceType(e.target.value)}
                                    className="px-3 py-2 rounded bg-gray-700 text-white"
                                >
                                    <option value="daily">{recurrenceOptions.daily}</option>
                                    <option value="weekly">{recurrenceOptions.weekly}</option>
                                    <option value="monthly">{recurrenceOptions.monthly}</option>
                                    <option value="yearly">{recurrenceOptions.yearly}</option>
                                </select>

                                <div className="flex">
                                  <span className="px-3 py-2 rounded-l bg-gray-600 text-white">
                                    {t.every}
                                  </span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={recurrenceValue}
                                        onChange={(e) => setRecurrenceValue(parseInt(e.target.value) || 1)}
                                        className="w-16 px-3 py-2 rounded-r bg-gray-700 text-white"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                            {t.notes}
                        </label>
                        <textarea
                            name="notes"
                            value={editedTodo.notes}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2.5 rounded resize-none bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500 border text-sm block"
                            placeholder={t.notesPlaceholder}
                        />
                    </div>

                    {/* Subtasks */}
                    <SubtaskList
                        subtasks={editedTodo.subtasks}
                        onUpdate={handleSubtasksUpdate}
                        darkMode={true}
                        language={language}
                    />

                    {/* Action buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? t.deleting : t.delete}
                        </button>

                        <div className="space-x-2">
                            {/* Cancel button */}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? t.saving : t.save}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;