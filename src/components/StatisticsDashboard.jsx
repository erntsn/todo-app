import React, { useMemo } from "react";

const StatisticsDashboard = ({ todos = [], language }) => {
    const t = {
        tr: {
            title: "Istatistikler",
            completed: "Tamamlanan",
            active: "Aktif",
            overdue: "Geciken",
            inProgress: "Devam Eden",
            byPriority: "Öncelik Dagilimi",
            byStatus: "Durum Dagilimi",
            weeklyCompletion: "Son 7 Gün Tamamlama",
            noData: "Henüz istatistik olusturacak görev yok",
            total: "Toplam"
        },
        en: {
            title: "Statistics",
            completed: "Completed",
            active: "Active",
            overdue: "Overdue",
            inProgress: "In Progress",
            byPriority: "Priority Distribution",
            byStatus: "Status Distribution",
            weeklyCompletion: "Last 7 Days Completion",
            noData: "No tasks yet to build statistics",
            total: "Total"
        }
    }[language] || {
        title: "Statistics",
        completed: "Completed",
        active: "Active",
        overdue: "Overdue",
        inProgress: "In Progress",
        byPriority: "Priority Distribution",
        byStatus: "Status Distribution",
        weeklyCompletion: "Last 7 Days Completion",
        noData: "No tasks yet to build statistics",
        total: "Total"
    };

    const metrics = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const parseStoredDate = (value) => {
            const [year, month, day] = value.split("-").map(Number);
            return new Date(year, month - 1, day);
        };

        const total = todos.length;
        const completed = todos.filter((todo) => todo.completed).length;
        const active = total - completed;

        const overdue = todos.filter((todo) => {
            if (todo.completed || !todo.date) {
                return false;
            }

            const due = parseStoredDate(todo.date);
            due.setHours(0, 0, 0, 0);
            return due < today;
        }).length;

        const inProgress = todos.filter((todo) => todo.status === "inProgress").length;

        const priorityCounts = {
            high: todos.filter((todo) => todo.priority === "high").length,
            medium: todos.filter((todo) => todo.priority === "medium").length,
            low: todos.filter((todo) => todo.priority === "low").length
        };

        const statusCounts = {
            backlog: todos.filter((todo) => todo.status === "backlog").length,
            todo: todos.filter((todo) => (todo.status || (!todo.completed ? "todo" : "done")) === "todo").length,
            inProgress,
            done: todos.filter((todo) => (todo.status || (todo.completed ? "done" : "todo")) === "done").length
        };

        const last7Days = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - index));

            const dateKey = date.toISOString().slice(0, 10);
            const completedCount = todos.filter((todo) => {
                if (!todo.completedAt) {
                    return false;
                }

                return todo.completedAt.slice(0, 10) === dateKey;
            }).length;

            return {
                label: date.toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", { weekday: "short" }),
                value: completedCount
            };
        });

        return {
            total,
            completed,
            active,
            overdue,
            inProgress,
            priorityCounts,
            statusCounts,
            last7Days
        };
    }, [language, todos]);

    if (todos.length === 0) {
        return (
            <div className="surface-panel w-full p-8 text-center app-fade-up">
                <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
                <p className="text-slate-300">{t.noData}</p>
            </div>
        );
    }

    const maxWeekly = Math.max(...metrics.last7Days.map((item) => item.value), 1);

    const priorityRows = [
        { key: "high", label: language === "tr" ? "Yüksek" : "High", color: "bg-rose-400" },
        { key: "medium", label: language === "tr" ? "Orta" : "Medium", color: "bg-amber-300" },
        { key: "low", label: language === "tr" ? "Düsük" : "Low", color: "bg-emerald-300" }
    ];

    const statusRows = [
        { key: "backlog", label: "Backlog", color: "bg-slate-300" },
        { key: "todo", label: language === "tr" ? "Yapilacak" : "To Do", color: "bg-sky-300" },
        { key: "inProgress", label: t.inProgress, color: "bg-indigo-300" },
        { key: "done", label: language === "tr" ? "Tamamlandı" : "Done", color: "bg-emerald-300" }
    ];

    return (
        <div className="w-full app-fade-up space-y-4">
            <h2 className="text-2xl font-bold">{t.title}</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="surface-panel p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t.total}</p>
                    <p className="text-xl font-bold text-white">{metrics.total}</p>
                </div>
                <div className="surface-panel p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t.completed}</p>
                    <p className="text-xl font-bold text-emerald-200">{metrics.completed}</p>
                </div>
                <div className="surface-panel p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t.active}</p>
                    <p className="text-xl font-bold text-sky-200">{metrics.active}</p>
                </div>
                <div className="surface-panel p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t.overdue}</p>
                    <p className="text-xl font-bold text-rose-200">{metrics.overdue}</p>
                </div>
                <div className="surface-panel p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t.inProgress}</p>
                    <p className="text-xl font-bold text-indigo-200">{metrics.inProgress}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="surface-panel p-4">
                    <h3 className="text-lg font-semibold mb-3">{t.byPriority}</h3>
                    <div className="space-y-2">
                        {priorityRows.map((row) => {
                            const value = metrics.priorityCounts[row.key];
                            const percentage = metrics.total ? Math.round((value / metrics.total) * 100) : 0;

                            return (
                                <div key={row.key}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-200">{row.label}</span>
                                        <span className="text-slate-400">{value}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                                        <div className={`${row.color} h-full`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="surface-panel p-4">
                    <h3 className="text-lg font-semibold mb-3">{t.byStatus}</h3>
                    <div className="space-y-2">
                        {statusRows.map((row) => {
                            const value = metrics.statusCounts[row.key];
                            const percentage = metrics.total ? Math.round((value / metrics.total) * 100) : 0;

                            return (
                                <div key={row.key}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-200">{row.label}</span>
                                        <span className="text-slate-400">{value}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                                        <div className={`${row.color} h-full`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="surface-panel p-4">
                <h3 className="text-lg font-semibold mb-3">{t.weeklyCompletion}</h3>
                <div className="grid grid-cols-7 gap-2 items-end min-h-[160px]">
                    {metrics.last7Days.map((item) => {
                        const barHeight = Math.max(8, Math.round((item.value / maxWeekly) * 110));

                        return (
                            <div key={item.label} className="flex flex-col items-center justify-end gap-1">
                                <span className="text-xs text-slate-400">{item.value}</span>
                                <div className="w-full max-w-[40px] rounded-md bg-sky-400/85" style={{ height: `${barHeight}px` }}></div>
                                <span className="text-[11px] text-slate-300">{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StatisticsDashboard;

