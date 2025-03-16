class TodoService {
    constructor(storage) {
        this.storage = storage;
        this.key = 'todos';
    }

    getTodos() {
        return JSON.parse(this.storage.getItem(this.key)) || [];
    }

    saveTodos(todos) {
        this.storage.setItem(this.key, JSON.stringify(todos));
        return todos;
    }

    addTodo(todo) {
        const todos = this.getTodos();
        // Ensure all required fields exist
        const newTodo = {
            ...todo,
            inProgress: false,
            notes: todo.notes || '',
            subtasks: todo.subtasks || []
        };
        todos.push(newTodo);
        this.saveTodos(todos);
        return todos;
    }

    removeTodo(id) {
        const todos = this.getTodos().filter(todo => todo.id !== id);
        this.saveTodos(todos);
        return todos;
    }

    toggleTodoCompletion(id) {
        const todos = this.getTodos().map(todo => {
            if (todo.id === id) {
                return {
                    ...todo,
                    completed: !todo.completed,
                    // If marking as complete, set inProgress to false
                    ...(todo.completed ? {} : { inProgress: false })
                };
            }
            return todo;
        });
        this.saveTodos(todos);
        return todos;
    }

    updateTodoStatus(id, status) {
        const todos = this.getTodos().map(todo => {
            if (todo.id === id) {
                return {
                    ...todo,
                    inProgress: status === 'inProgress',
                    completed: status === 'completed'
                };
            }
            return todo;
        });
        this.saveTodos(todos);
        return todos;
    }

    updateTodo(id, updatedTodo) {
        const todos = this.getTodos().map(todo => {
            if (todo.id === id) {
                return {
                    ...todo,
                    ...updatedTodo,
                    // Make sure id doesn't change
                    id
                };
            }
            return todo;
        });
        this.saveTodos(todos);
        return todos;
    }

    // Get a single todo by id
    getTodoById(id) {
        const todos = this.getTodos();
        return todos.find(todo => todo.id === id) || null;
    }

    // Add a note to a todo
    addNoteToTodo(id, note) {
        const todos = this.getTodos().map(todo => {
            if (todo.id === id) {
                return {
                    ...todo,
                    notes: todo.notes || '',
                    notes: todo.notes + (todo.notes ? '\n\n' : '') + note
                };
            }
            return todo;
        });
        this.saveTodos(todos);
        return todos;
    }

    // Update subtasks for a todo
    updateSubtasks(id, subtasks) {
        const todos = this.getTodos().map(todo => {
            if (todo.id === id) {
                return { ...todo, subtasks };
            }
            return todo;
        });
        this.saveTodos(todos);
        return todos;
    }
}

export default new TodoService(localStorage);