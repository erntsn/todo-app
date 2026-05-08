import React, { useEffect, useState, useRef } from "react";
import TaskDetailModal from "./TaskDetailModal";

/* ── Defaults & Constants ── */
const DEFAULT_COLUMNS = [
    { id: "backlog",    title: "Backlog",     color: "#64748b" },
    { id: "todo",       title: "Yapılacak",   color: "#a78bfa" },
    { id: "inProgress", title: "Devam Eden",  color: "#fbbf24" },
    { id: "done",       title: "Tamamlandı",  color: "#34d399" },
];

const PRESET_COLORS = [
    "#a78bfa", "#818cf8", "#60a5fa", "#22d3ee",
    "#34d399", "#a3e635", "#fbbf24", "#fb923c",
    "#f87171", "#f472b6", "#64748b", "#c084fc",
];

const BADGE = { high: "badge-high", medium: "badge-medium", low: "badge-low" };
const PRIORITY_BORDER = { high: "#f87171", medium: "#fbbf24", low: "#34d399" };

const hex2rgba = (hex, a) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
};

const loadColumns = () => {
    try {
        const s = localStorage.getItem("board_columns");
        if (s) return JSON.parse(s);
    } catch {}
    return DEFAULT_COLUMNS;
};

const saveColumns = (cols) => {
    localStorage.setItem("board_columns", JSON.stringify(cols));
};

/* ── Color Picker Popover ── */
const ColorPicker = ({ value, onChange, onClose }) => (
    <div className="absolute z-50 top-full left-0 mt-1 p-2 rounded-xl border border-[var(--border)] bg-[rgba(40,32,78,0.98)] shadow-xl"
        onClick={e => e.stopPropagation()}>
        <div className="grid grid-cols-6 gap-1.5">
            {PRESET_COLORS.map(c => (
                <button
                    key={c}
                    onClick={() => { onChange(c); onClose(); }}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none"
                    style={{
                        background: c,
                        boxShadow: value === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
                        transform: value === c ? "scale(1.15)" : undefined,
                    }}
                />
            ))}
        </div>
    </div>
);

/* ── Column Header ── */
const ColumnHeader = ({ col, onRename, onDelete, onColorChange, cardCount, language }) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(col.title);
    const [pickerOpen, setPickerOpen] = useState(false);
    const inputRef = useRef(null);

    const commitRename = () => {
        if (draft.trim()) onRename(col.id, draft.trim());
        else setDraft(col.title);
        setEditing(false);
    };

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    // close picker on outside click
    useEffect(() => {
        if (!pickerOpen) return;
        const handler = () => setPickerOpen(false);
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, [pickerOpen]);

    return (
        <div className="column-header group flex items-center gap-2 mb-3 px-1 py-1.5 rounded-xl relative">
            {/* Color dot + picker */}
            <div className="relative flex-shrink-0" onClick={e => { e.stopPropagation(); setPickerOpen(v => !v); }}>
                <button
                    className="w-3 h-3 rounded-full transition-transform hover:scale-125 focus:outline-none"
                    style={{ background: col.color, boxShadow: `0 0 8px ${col.color}80` }}
                    title={language === "tr" ? "Rengi değiştir" : "Change color"}
                />
                {pickerOpen && (
                    <ColorPicker value={col.color} onChange={c => onColorChange(col.id, c)} onClose={() => setPickerOpen(false)} />
                )}
            </div>

            {/* Title */}
            {editing ? (
                <input
                    ref={inputRef}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") { setDraft(col.title); setEditing(false); } }}
                    className="flex-1 bg-transparent border-b border-[var(--accent)] outline-none text-sm font-bold text-[var(--text-main)] pb-0.5"
                />
            ) : (
                <h3
                    className="flex-1 text-sm font-bold cursor-text truncate"
                    style={{ color: col.color }}
                    onDoubleClick={() => { setDraft(col.title); setEditing(true); }}
                    title={language === "tr" ? "Çift tıkla düzenle" : "Double-click to edit"}
                >
                    {col.title}
                </h3>
            )}

            {/* Count */}
            <span
                key={cardCount}
                className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 count-pop"
                style={{ background: hex2rgba(col.color, 0.15), color: col.color, border: `1px solid ${hex2rgba(col.color, 0.3)}` }}
            >
                {cardCount}
            </span>

            {/* Delete */}
            <button
                onClick={() => onDelete(col.id)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/15 transition-all flex-shrink-0"
                title={language === "tr" ? "Sütunu sil" : "Delete column"}
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

/* ── Add Column Panel ── */
const AddColumnPanel = ({ onAdd, language }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#a78bfa");
    const [pickerOpen, setPickerOpen] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

    useEffect(() => {
        if (!pickerOpen) return;
        const handler = () => setPickerOpen(false);
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, [pickerOpen]);

    const submit = () => {
        if (!title.trim()) return;
        onAdd({ id: `col_${Date.now()}`, title: title.trim(), color });
        setTitle("");
        setColor("#a78bfa");
        setOpen(false);
    };

    if (!open) {
        return (
            <div className="flex-shrink-0 self-start" style={{ width: 220 }}>
                <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-medium)] hover:bg-[rgba(139,92,246,0.08)] transition-all text-sm font-medium"
                >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {language === "tr" ? "Sütun ekle" : "Add column"}
                </button>
            </div>
        );
    }

    return (
        <div className="flex-shrink-0 self-start rounded-xl border border-[var(--border-medium)] bg-[rgba(44,36,82,0.7)] p-3 space-y-3 overflow-hidden" style={{ width: 220 }}>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                {language === "tr" ? "Yeni Sütun" : "New Column"}
            </p>

            <div className="flex items-center gap-2 min-w-0">
                <div className="relative flex-shrink-0" onClick={e => { e.stopPropagation(); setPickerOpen(v => !v); }}>
                    <button
                        className="w-7 h-7 rounded-lg border border-white/10 transition-transform hover:scale-110"
                        style={{ background: color, boxShadow: `0 0 10px ${color}60` }}
                    />
                    {pickerOpen && (
                        <ColorPicker value={color} onChange={setColor} onClose={() => setPickerOpen(false)} />
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") setOpen(false); }}
                    placeholder={language === "tr" ? "Sütun adı..." : "Column name..."}
                    className="min-w-0 w-full bg-transparent border-b border-[var(--border)] outline-none text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] pb-1 focus:border-[var(--accent-light)]"
                />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setOpen(false)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                >
                    {language === "tr" ? "İptal" : "Cancel"}
                </button>
                <button
                    onClick={submit}
                    disabled={!title.trim()}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold btn-primary disabled:opacity-40"
                >
                    {language === "tr" ? "Ekle" : "Add"}
                </button>
            </div>
        </div>
    );
};

/* ── Main TrelloBoard ── */
const TrelloBoard = ({ todos, onToggle, onRemove, onUpdate, onUpdateStatus, language, translations }) => {
    const [columnDefs, setColumnDefs] = useState(loadColumns);
    const [cardMap, setCardMap] = useState({});
    const [dragged, setDragged] = useState(null);
    const [dragOver, setDragOver] = useState(null);
    const [selected, setSelected] = useState(null);
    const [confirmingId, setConfirmingId] = useState(null);
    const confirmTimerRef = React.useRef(null);

    const t = translations[language];

    /* sync todos → cardMap */
    useEffect(() => {
        if (!todos) return;
        const map = {};
        columnDefs.forEach(c => { map[c.id] = []; });
        todos.forEach(todo => {
            const s = todo.status || (todo.completed ? "done" : columnDefs[0]?.id || "todo");
            if (map[s]) map[s].push(todo);
            else if (map[columnDefs[0]?.id]) map[columnDefs[0].id].push(todo);
        });
        setCardMap(map);
    }, [todos, columnDefs]);

    /* ── Column management ── */
    const updateCols = (next) => { setColumnDefs(next); saveColumns(next); };

    const handleAddColumn = (col) => updateCols([...columnDefs, col]);

    const handleRenameColumn = (id, title) => updateCols(columnDefs.map(c => c.id === id ? { ...c, title } : c));

    const handleColorChange = (id, color) => updateCols(columnDefs.map(c => c.id === id ? { ...c, color } : c));

    const handleDeleteColumn = (id) => {
        const cards = cardMap[id] || [];
        const fallback = columnDefs.find(c => c.id !== id);
        if (cards.length > 0) {
            const label = fallback ? `"${fallback.title}"` : (language === "tr" ? "başka bir sütun" : "another column");
            const msg = language === "tr"
                ? `Bu sütunda ${cards.length} görev var. ${label} sütununa taşınacak. Devam et?`
                : `This column has ${cards.length} tasks. They will be moved to ${label}. Continue?`;
            if (!window.confirm(msg)) return;
            if (fallback) {
                cards.forEach(todo => onUpdateStatus(todo.id, fallback.id).catch(() => {}));
            }
        }
        updateCols(columnDefs.filter(c => c.id !== id));
    };

    /* ── Drag & drop ── */
    const onDragStart = (e, todo) => {
        setDragged(todo);
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => { if (e.target) e.target.style.opacity = "0.4"; }, 0);
    };
    const onDragEnd = (e) => {
        if (e.target) e.target.style.opacity = "";
        setDragOver(null);
        setTimeout(() => setDragged(null), 50);
    };
    const onDragOver = (e, colId) => { e.preventDefault(); setDragOver(colId); };
    const onDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null); };
    const onDrop = async (e, colId) => {
        e.preventDefault();
        setDragOver(null);
        if (!dragged) return;
        const src = dragged.status || (dragged.completed ? "done" : columnDefs[0]?.id);
        if (src === colId) { setDragged(null); return; }
        const optimistic = { ...cardMap };
        optimistic[src] = (optimistic[src] || []).filter(c => c.id !== dragged.id);
        optimistic[colId] = [...(optimistic[colId] || []), {
            ...dragged, status: colId,
            completed: colId === "done",
            completedAt: colId === "done" ? new Date().toISOString() : null,
        }];
        setCardMap(optimistic);
        setDragged(null);
        try { await onUpdateStatus(dragged.id, colId); } catch (err) { console.error(err); }
    };

    const handleUpdate = async (updated) => { await onUpdate(updated); setSelected(null); };
    const handleDelete = async (id) => {
        await onRemove(id);
        if (selected?.id === id) setSelected(null);
        setConfirmingId(null);
    };
    const requestDelete = (e, id) => {
        e.stopPropagation();
        if (confirmingId === id) {
            clearTimeout(confirmTimerRef.current);
            handleDelete(id);
        } else {
            setConfirmingId(id);
            clearTimeout(confirmTimerRef.current);
            confirmTimerRef.current = setTimeout(() => setConfirmingId(null), 3000);
        }
    };

    /* ── Card render ── */
    const renderCard = (todo) => {
        const subtasksDone = (todo.subtasks || []).filter(s => s.completed).length;
        const subtasksTotal = (todo.subtasks || []).length;
        const pct = subtasksTotal > 0 ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;

        return (
            <div
                key={todo.id}
                draggable
                onDragStart={(e) => onDragStart(e, todo)}
                onDragEnd={onDragEnd}
                onClick={() => !dragged && setSelected(todo)}
                className="board-card"
                style={{ borderLeft: `3px solid ${PRIORITY_BORDER[todo.priority] || PRIORITY_BORDER.medium}` }}
            >
                <div className="flex items-start gap-2">
                    <div className="drag-handle mt-0.5 flex-shrink-0 text-[var(--text-muted)] opacity-30 hover:opacity-60 transition-opacity">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="5" cy="4" r="1.2"/><circle cx="11" cy="4" r="1.2"/>
                            <circle cx="5" cy="8" r="1.2"/><circle cx="11" cy="8" r="1.2"/>
                            <circle cx="5" cy="12" r="1.2"/><circle cx="11" cy="12" r="1.2"/>
                        </svg>
                    </div>
                    <p className={`flex-1 text-sm font-semibold leading-snug ${
                        todo.completed ? "line-through text-[var(--text-muted)]" : "text-[var(--text-main)]"
                    }`}>
                        {todo.text}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-2 ml-5">
                    <span className={`px-2 py-0.5 rounded-full text-[0.68rem] font-medium ${BADGE[todo.priority] || BADGE.medium}`}>
                        {t.priority[todo.priority] || t.priority.medium}
                    </span>
                    {todo.date && (
                        <span className="inline-flex items-center gap-1 text-[0.68rem] text-[var(--text-muted)]">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {todo.date}
                        </span>
                    )}
                    {todo.notes && (
                        <svg className="w-3 h-3 text-[var(--text-muted)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    )}
                </div>

                {subtasksTotal > 0 && (
                    <div className="mt-2.5 ml-5">
                        <div className="flex justify-between mb-1">
                            <span className="text-[0.65rem] text-[var(--text-muted)]">{subtasksDone}/{subtasksTotal}</span>
                            <span className="text-[0.65rem] text-[var(--text-muted)]">{pct}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, background: pct === 100 ? "#34d399" : "rgba(139,92,246,0.8)" }} />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle(todo.id); }}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[0.7rem] font-medium transition-all ${
                            todo.completed
                                ? "text-[var(--text-muted)] hover:text-amber-300 hover:bg-amber-500/10"
                                : "text-[var(--text-muted)] hover:text-emerald-300 hover:bg-emerald-500/10"
                        }`}
                    >
                        {todo.completed ? (
                            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>{language === "tr" ? "Geri al" : "Undo"}</>
                        ) : (
                            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{language === "tr" ? "Tamamla" : "Done"}</>
                        )}
                    </button>
                    {confirmingId === todo.id ? (
                        <div className="flex items-center gap-1.5 app-fade-up">
                            <span className="text-[0.68rem] text-red-300">{language === "tr" ? "Emin misin?" : "Sure?"}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); setConfirmingId(null); }}
                                className="px-2 py-0.5 rounded-md text-[0.68rem] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-soft)] transition-all"
                            >
                                {language === "tr" ? "Hayır" : "No"}
                            </button>
                            <button
                                onClick={(e) => requestDelete(e, todo.id)}
                                className="px-2 py-0.5 rounded-md text-[0.68rem] text-red-300 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 transition-all"
                            >
                                {language === "tr" ? "Sil" : "Yes"}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => requestDelete(e, todo.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    /* ── Column render ── */
    const renderColumn = (col) => {
        const cards = cardMap[col.id] || [];
        const isOver = dragOver === col.id;

        return (
            <div key={col.id} className="board-column flex-shrink-0 flex flex-col" style={{ width: 280 }}>
                <ColumnHeader
                    col={col}
                    cardCount={cards.length}
                    language={language}
                    onRename={handleRenameColumn}
                    onDelete={handleDeleteColumn}
                    onColorChange={handleColorChange}
                />

                <div
                    className="flex-1 rounded-xl p-2 space-y-2 overflow-y-auto"
                    style={{
                        background: isOver ? hex2rgba(col.color, 0.12) : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isOver ? col.color + "60" : hex2rgba(col.color, 0.2)}`,
                        boxShadow: isOver ? `inset 0 0 0 1px ${col.color}40` : "none",
                        minHeight: 160,
                        transition: "all 150ms ease",
                    }}
                    onDragOver={(e) => onDragOver(e, col.id)}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, col.id)}
                >
                    {cards.length > 0 ? cards.map(renderCard) : (
                        <div className="flex flex-col items-center justify-center h-20 gap-2 rounded-lg border border-dashed"
                            style={{ borderColor: hex2rgba(col.color, 0.25) }}>
                            <span className="text-[0.7rem] text-[var(--text-muted)]">
                                {language === "tr" ? "Buraya sürükle" : "Drop here"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <style>{`
                .board-card {
                    background: linear-gradient(145deg, rgba(44,36,82,0.85), rgba(34,28,66,0.9));
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    padding: 12px 12px 10px;
                    cursor: pointer;
                    transition: transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease;
                    user-select: none;
                }
                .board-card:hover {
                    transform: translateY(-2px);
                    border-color: rgba(167,139,250,0.3);
                    box-shadow: 0 10px 24px rgba(0,0,0,0.35);
                }
                .drag-handle { cursor: grab; }
                .drag-handle:active { cursor: grabbing; }
                .column-header { transition: background 150ms ease; }
            `}</style>

            <div className="h-full overflow-x-auto overflow-y-hidden">
                <div className="flex gap-3 h-full py-1 px-0.5" style={{ paddingBottom: 88, minWidth: "max-content" }}>
                    {columnDefs.map(renderColumn)}
                    <AddColumnPanel onAdd={handleAddColumn} language={language} />
                </div>
            </div>

            {selected && (
                <TaskDetailModal
                    todo={selected}
                    onClose={() => setSelected(null)}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    language={language}
                    translations={translations}
                />
            )}
        </>
    );
};

export default TrelloBoard;
