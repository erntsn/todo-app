import React, { useState, useEffect, useRef } from 'react';
import TaskDetailModal from './TaskDetailModal';

const TrelloBoard = ({ todos, onToggle, onRemove, onUpdate, onUpdateStatus, onTagClick, language, translations }) => {
    // Yerel state ve kolonlar
    const [localColumns, setLocalColumns] = useState({
        todo: [],
        inProgress: [],
        completed: []
    });
    const [selectedTodo, setSelectedTodo] = useState(null);

    // Son güncellenen task ve sütunu izlemek için ref
    const lastUpdateRef = useRef({
        todoId: null,
        targetColumn: null,
        timestamp: 0
    });

    // Category colors mapping
    const categoryColors = {
        work: 'blue',
        personal: 'purple',
        health: 'green',
        shopping: 'pink',
        finance: 'yellow',
        education: 'indigo',
        other: 'gray'
    };

    // Group todos into columns whenever todos change
    useEffect(() => {
        if (!todos) return;

        // Şimdi
        const now = Date.now();

        // Son güncellemeden bu yana 1 saniyeden az zaman geçtiyse ve
        // son güncellenen todoId ve sütun bilgisi varsa,
        // o todoId'ye sahip itemi hemen o sütuna yerleştir
        if (lastUpdateRef.current.todoId &&
            lastUpdateRef.current.targetColumn &&
            now - lastUpdateRef.current.timestamp < 1000) {

            const todoId = lastUpdateRef.current.todoId;
            const targetColumn = lastUpdateRef.current.targetColumn;

            console.log("Optimistic update in effect - placing task in", targetColumn);

            // İlgili todo'yu bul
            const todoToMove = todos.find(t => t.id === todoId);

            if (todoToMove) {
                // Bütün todoları grupla, ancak güncellenen todoyu manuel olarak doğru sütuna koy
                const todoColumn = todos.filter(todo =>
                    todo.id !== todoId &&
                    !todo.completed &&
                    !todo.inProgress
                );

                const inProgressColumn = todos.filter(todo =>
                    todo.id !== todoId &&
                    !todo.completed &&
                    todo.inProgress
                );

                const completedColumn = todos.filter(todo =>
                    todo.id !== todoId &&
                    todo.completed
                );

                // Güncel todo'yu doğru kolona ekle
                if (targetColumn === 'completed') {
                    completedColumn.push({...todoToMove, completed: true, inProgress: false});
                } else if (targetColumn === 'inProgress') {
                    inProgressColumn.push({...todoToMove, completed: false, inProgress: true});
                } else if (targetColumn === 'todo') {
                    todoColumn.push({...todoToMove, completed: false, inProgress: false});
                }

                setLocalColumns({
                    todo: todoColumn,
                    inProgress: inProgressColumn,
                    completed: completedColumn
                });

                // Referansı temizle, işlem tamamlandı
                lastUpdateRef.current = { todoId: null, targetColumn: null, timestamp: 0 };
                return;
            }
        }

        // Normal güncelleme (ya da optimistik güncelleme sonrası)
        const todoColumn = todos.filter(todo => !todo.completed && !todo.inProgress);
        const inProgressColumn = todos.filter(todo => !todo.completed && todo.inProgress);
        const completedColumn = todos.filter(todo => todo.completed);

        setLocalColumns({
            todo: todoColumn,
            inProgress: inProgressColumn,
            completed: completedColumn
        });

    }, [todos]);

    // Column titles based on language
    const columnTitles = {
        todo: language === 'tr' ? 'Yapılacak' : 'To Do',
        inProgress: language === 'tr' ? 'Devam Ediyor' : 'In Progress',
        completed: language === 'tr' ? 'Tamamlandı' : 'Completed'
    };

    // DRAG AND DROP HANDLERS
    const handleDragStart = (e, todo, sourceColumn) => {
        // Çekme işlemini kaydet
        try {
            console.log("Drag başladı:", todo.id, "kaynağı:", sourceColumn);

            // dataTransfer'e task bilgilerini ekle
            e.dataTransfer.setData('application/json', JSON.stringify({
                id: todo.id,
                sourceColumn: sourceColumn
            }));

            // Taşınan öğeyi görsel olarak yarı saydam yap
            e.currentTarget.style.opacity = '0.5';

            // dataTransfer efekt ayarı
            e.dataTransfer.effectAllowed = 'move';
        } catch (error) {
            console.error("Drag start hatası:", error);
        }
    };

    const handleDragEnd = (e) => {
        // Sürükleme bittiğinde opaklığı geri al
        try {
            console.log("Drag bitti");
            e.currentTarget.style.opacity = '1';
        } catch (error) {
            console.error("Drag end hatası:", error);
        }
    };

    const handleDragOver = (e, targetColumn) => {
        // Bırakmayı aktif etmek için preventDefault
        e.preventDefault();

        // Drop etki tipini ayarla
        e.dataTransfer.dropEffect = 'move';

        // Sürükleme sırasında görsel geri bildirim
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        // Sürükleme bırakıldığında görsel geri bildirimi temizle
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e, targetColumn) => {
        // Bırakma işlemini gerçekleştir
        e.preventDefault();

        // Görsel geri bildirimi kaldır
        e.currentTarget.classList.remove('drag-over');

        try {
            // Drop edilen veriyi al
            const data = e.dataTransfer.getData('application/json');
            if (!data) {
                console.error("Drop olayında veri bulunamadı");
                return;
            }

            const { id, sourceColumn } = JSON.parse(data);

            console.log(`Drop: ${id} kaynağı ${sourceColumn} hedefi ${targetColumn}`);

            // Aynı kolona drop edilirse işlem yapma
            if (sourceColumn === targetColumn) {
                console.log("Aynı kolona bırakıldı - işlem gerekmez");
                return;
            }

            // Optimistik güncelleme için son işlemi kaydet
            lastUpdateRef.current = {
                todoId: id,
                targetColumn: targetColumn,
                timestamp: Date.now()
            };

            // Önce lokal state'i hemen güncelle
            setLocalColumns(prev => {
                // Todo'yu kaynaktan kaldır
                const sourceTodos = prev[sourceColumn].filter(todo => todo.id !== id);

                // Todo'yu bul
                const todoToMove = prev[sourceColumn].find(todo => todo.id === id);

                if (!todoToMove) return prev;

                // Hedef sütunun kopyasını al
                const targetTodos = [...prev[targetColumn]];

                // Durumu güncelle ve hedef sütuna ekle
                let updatedTodo;

                if (targetColumn === 'completed') {
                    updatedTodo = {...todoToMove, completed: true, inProgress: false};
                } else if (targetColumn === 'inProgress') {
                    updatedTodo = {...todoToMove, completed: false, inProgress: true};
                } else {
                    updatedTodo = {...todoToMove, completed: false, inProgress: false};
                }

                targetTodos.push(updatedTodo);

                // Yeni state'i oluştur
                const newState = {...prev};
                newState[sourceColumn] = sourceTodos;
                newState[targetColumn] = targetTodos;

                return newState;
            });

            // Sonra backend'e bildir
            if (targetColumn === "completed") {
                console.log("Tamamlandı kolonuna taşınıyor");
                onUpdateStatus(id, "completed");
            } else if (targetColumn === "inProgress") {
                console.log("Devam Ediyor kolonuna taşınıyor");
                onUpdateStatus(id, "inProgress");
            } else if (targetColumn === "todo") {
                console.log("Yapılacak kolonuna taşınıyor");
                onUpdateStatus(id, "todo");
            }
        } catch (error) {
            console.error("Drop hatası:", error);
        }
    };

    // Handle card click for modal
    const handleCardClick = (todo) => {
        setSelectedTodo(todo);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedTodo(null);
    };

    // Handle remove todo
    const handleRemoveTodo = (e, id) => {
        e.stopPropagation(); // Prevent opening the modal

        if (window.confirm(language === 'tr' ? 'Bu görevi silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this task?')) {
            onRemove(id);
        }
    };

    // Update todo
    const handleUpdateTodo = (updatedTodo) => {
        onUpdate(updatedTodo);
    };

    // Render a single todo card
    const renderCard = (todo, columnName) => (
        <div
            key={todo.id}
            className="bg-gray-700 text-white rounded-lg shadow p-3 mb-2 cursor-move drag-item"
            draggable="true"
            onClick={() => handleCardClick(todo)}
            onDragStart={(e) => handleDragStart(e, todo, columnName)}
            onDragEnd={handleDragEnd}
        >
            <div className="flex justify-between items-start">
                <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.text}
                </h3>
                <button
                    type="button"
                    onClick={(e) => handleRemoveTodo(e, todo.id)}
                    className="text-white hover:text-red-300 transition font-bold text-sm rounded-full bg-red-500 hover:bg-red-700 w-6 h-6 flex items-center justify-center focus:outline-none"
                    aria-label="Delete task"
                >
                    ×
                </button>
            </div>

            <div className="text-xs mt-2 text-gray-300">
                {/* Category badge */}
                {todo.category && (
                    <span className={`inline-block px-2 py-0.5 rounded-full mb-1 bg-${categoryColors[todo.category] || 'gray'}-700 text-${categoryColors[todo.category] || 'gray'}-200`}>
                    {translations[language].categories[todo.category] || translations[language].categories.other}
                  </span>
                )}

                <div className="flex justify-between mt-1">
                    <span>🗓️ {todo.date || '-'}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        todo.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : todo.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                    }`}>
                      {todo.priority
                          ? translations[language].priority[todo.priority]
                          : translations[language].priority.medium}
                    </span>
                </div>

                {/* Additional indicators */}
                <div className="mt-1 flex flex-wrap gap-2">
                    {/* Tags */}
                    {todo.tags && todo.tags.length > 0 && (
                        <div>
                            {todo.tags.slice(0, 2).map(tag => (
                                <span
                                    key={tag}
                                    className="mr-1 cursor-pointer hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent opening the detail modal
                                        onTagClick(tag);
                                    }}
                                >
                            #{tag}
                          </span>
                            ))}
                            {todo.tags.length > 2 && <span>+{todo.tags.length - 2}</span>}
                        </div>
                    )}

                    {/* Recurring indicator */}
                    {todo.recurring && (
                        <span title={`${translations[language].recurrence[todo.recurring.type]}, ${translations[language].every} ${todo.recurring.value}`}>
                        🔄
                      </span>
                    )}

                    {todo.notes && <span>📝</span>}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                        <span>📋 {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}</span>
                    )}
                </div>
            </div>

            <div className="mt-2 flex justify-end">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                        e.stopPropagation(); // Prevent card click
                        onToggle(todo.id);
                    }}
                    className="h-4 w-4 accent-blue-500"
                />
            </div>
        </div>
    );

    // Render a column
    const renderColumn = (columnName) => (
        <div
            className="bg-gray-800 rounded-lg p-3 min-w-64 w-1/3 flex-1 flex flex-col h-full column-drop-area"
            onDragOver={(e) => handleDragOver(e, columnName)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, columnName)}
        >
            <h2 className="font-bold text-center mb-2 sticky top-0 text-white">
                {columnTitles[columnName]}
                <span className="ml-2 text-sm px-2 py-1 rounded-full bg-blue-500 text-white">
                  {localColumns[columnName]?.length || 0}
                </span>
            </h2>

            <div className="space-y-2 overflow-y-auto flex-1">
                {(!localColumns[columnName] || localColumns[columnName].length === 0) ? (
                    <div className="text-center py-4 text-gray-400">
                        {language === 'tr' ? 'Görev yok' : 'No tasks'}
                    </div>
                ) : (
                    localColumns[columnName].map(todo => renderCard(todo, columnName))
                )}
            </div>
        </div>
    );

    return (
        <>
            <style>
                {`
                .column-drop-area.drag-over {
                    border: 2px dashed #3b82f6;
                    background-color: rgba(30, 41, 59, 0.7);
                }
                .drag-item {
                    transition: opacity 0.2s ease-in-out;
                }
                `}
            </style>
            <div className="flex flex-col h-[calc(100vh-200px)]">
                {/* Board view */}
                <div className="flex gap-4 overflow-y-hidden h-full">
                    {renderColumn('todo')}
                    {renderColumn('inProgress')}
                    {renderColumn('completed')}
                </div>
            </div>

            {selectedTodo && (
                <TaskDetailModal
                    todo={selectedTodo}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateTodo}
                    onDelete={onRemove}
                    language={language}
                    translations={translations}
                    darkMode={true}
                />
            )}
        </>
    );
};

export default TrelloBoard;