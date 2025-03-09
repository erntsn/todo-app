const TodoList = ({ todos, onToggle, onRemove, language, translations }) => (
    <div>
        {todos.length > 0 ? (
            todos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between bg-gray-700 rounded p-3 my-2 shadow">
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
                                🗓️ {todo.date || translations[language].noTodo} • ⚠️ {translations[language].priority[todo.priority]}
                            </div>
                        </div>
                    </div>
                    <button className="text-red-400 hover:text-red-600 transition font-bold" onClick={() => onRemove(todo.id)}>
                        Sil
                    </button>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-400">{translations[language].noTodo}</p>
        )}
    </div>
);

export default TodoList;
