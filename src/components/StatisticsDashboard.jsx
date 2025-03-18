// src/components/StatisticsDashboard.jsx
import React from 'react';

const StatisticsDashboard = ({ todos = [], language }) => {
    const translations = {
        tr: {
            title: 'İstatistikler',
            completed: 'Tamamlanan',
            pending: 'Bekleyen',
            overdue: 'Gecikmiş',
            inProgress: 'Devam Eden',
            byPriority: 'Önceliğe Göre',
            byStatus: 'Duruma Göre',
            weeklyCompletion: 'Haftalık Tamamlama',
            noData: 'Henüz veri yok'
        },
        en: {
            title: 'Statistics',
            completed: 'Completed',
            pending: 'Pending',
            overdue: 'Overdue',
            inProgress: 'In Progress',
            byPriority: 'By Priority',
            byStatus: 'By Status',
            weeklyCompletion: 'Weekly Completion',
            noData: 'No data yet'
        }
    };

    const t = translations[language || 'en'];

    // Check if there's data to display
    const hasData = todos && todos.length > 0;

    if (!hasData) {
        return (
            <div className="w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                <h2 className="text-xl font-bold mb-4">{t.title}</h2>
                <p className="text-gray-500 dark:text-gray-400">{t.noData}</p>
            </div>
        );
    }

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-bold text-center mb-6">{t.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-center">{t.byStatus}</h3>
                    <div className="h-40 flex items-center justify-center">
                        <p>Pie chart will be displayed here</p>
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-center">{t.byPriority}</h3>
                    <div className="h-40 flex items-center justify-center">
                        <p>Pie chart will be displayed here</p>
                    </div>
                </div>

                {/* Weekly Completion */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2 text-center">{t.weeklyCompletion}</h3>
                    <div className="h-40 flex items-center justify-center">
                        <p>Bar chart will be displayed here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsDashboard;