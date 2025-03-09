const TodoItem = ({ todo, onToggle, onRemove }) => (
    <div className="flex items-center justify-between bg-gray-700 rounded p-3 my-2 shadow">
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="accent-blue-500"
            />
            <div>
                <div className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    {todo.text}
                </div>
                <div className="text-xs text-gray-300">
                    🗓️ {todo.date || 'Tarih yok'} • ⚠️ {todo.priority || 'Orta'}
                </div>
            </div>
        </div>
        <button
            className="text-red-400 hover:text-red-600 transition font-bold"
            onClick={() => onRemove(todo.id)}
        >
            Sil
        </button>
    </div>
);

export default TodoItem;
