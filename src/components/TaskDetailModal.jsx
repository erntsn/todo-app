import React, { useState } from 'react';
import SubtaskList from './SubtaskList';

const TaskDetailModal = ({ todo, onClose, onUpdate, onDelete, language, translations, darkMode }) => {
    const [editedTodo, setEditedTodo] = useState({
        ...todo,
        notes: todo.notes || '',
        subtasks: todo.subtasks || []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTodo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubtasksUpdate = (subtasks) => {
        setEditedTodo(prev => ({ ...prev, subtasks }));
    };

    const handleSave = () => {
        onUpdate(editedTodo);
        onClose();
    };

    const handleToggleComplete = () => {
        setEditedTodo(prev => ({ ...prev, completed: !prev.completed }));
    };

    const t = {
        tr: {
            title: 'Görev Detayları',
            delete: 'Sil',
            cancel: 'İptal',
            save: 'Kaydet',
            notes: 'Notlar',
            date: 'Tarih',
            priority: {
                label: 'Öncelik',
                high: 'Yüksek',
                medium: 'Orta',
                low: 'Düşük'
            },
            notesPlaceholder: 'Notlarınızı buraya yazın...',
            confirmDelete: 'Bu görevi silmek istediğinize emin misiniz?'
        },
        en: {
            title: 'Task Details',
            delete: 'Delete',
            cancel: 'Cancel',
            save: 'Save',
            notes: 'Notes',
            date: 'Date',
            priority: {
                label: 'Priority',
                high: 'High',
                medium: 'Medium',
                low: 'Low'
            },
            notesPlaceholder: 'Write your notes here...',
            confirmDelete: 'Are you sure you want to delete this task?'
        }
    }[language];

    // Öncelik değerlerini çevirileri alıyoruz
    const priorityOptions = translations[language].priority;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div
                className={`relative max-w-2xl w-full mx-auto rounded-lg shadow-lg ${
                    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
            >
                {/* Header with close button */}
                <div className="flex justify-between items-center p-4 border-b">
                    {/* Empty div for balance */}
                    <div className="w-6"></div>

                    {/* Title - Now centered */}
                    <h2 className={`text-xl font-bold text-center ${
                        darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        {t.title}
                    </h2>

                    {/* Close button - Now with clear X that will be visible in all modes */}
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800"
                        aria-label="Close"
                    >
                        <span className="text-xl font-bold">X</span>
                    </button>
                </div>

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
                            className={`text-xl font-bold w-full p-2 rounded ${
                                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                            } border-0 focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    {/* Priority and Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="w-full">
                            <label className={`block mb-2 text-sm font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                {t.priority.label}
                            </label>
                            <select
                                name="priority"
                                value={editedTodo.priority}
                                onChange={handleChange}
                                className={`w-full p-2.5 rounded ${
                                    darkMode
                                        ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                                        : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                } border text-sm block appearance-none`}
                            >
                                <option value="high">{priorityOptions.high}</option>
                                <option value="medium">{priorityOptions.medium}</option>
                                <option value="low">{priorityOptions.low}</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <label className={`block mb-2 text-sm font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                {t.date}
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={editedTodo.date || ''}
                                onChange={handleChange}
                                className={`w-full p-2.5 rounded ${
                                    darkMode
                                        ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                                        : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                } border text-sm block`}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                        <label className={`block mb-2 text-sm font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            {t.notes}
                        </label>
                        <textarea
                            name="notes"
                            value={editedTodo.notes}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full p-2.5 rounded resize-none ${
                                darkMode
                                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                                    : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            } border text-sm block`}
                            placeholder={t.notesPlaceholder}
                        />
                    </div>

                    {/* Subtasks */}
                    <SubtaskList
                        subtasks={editedTodo.subtasks}
                        onUpdate={handleSubtasksUpdate}
                        darkMode={darkMode}
                        language={language}
                    />

                    {/* Action buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => {
                                if (window.confirm(t.confirmDelete)) {
                                    onDelete(todo.id);
                                    onClose();
                                }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            {t.delete}
                        </button>

                        <div className="space-x-2">
                            {/* Cancel button - Fixed for all modes */}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {t.save}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;