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
    }

    addTodo(todo) {
        const todos = this.getTodos();
        todos.push(todo);
        this.saveTodos(todos);
    }

    removeTodo(id) {
        const todos = this.getTodos().filter(todo => todo.id !== id);
        this.saveTodos(todos);
    }

    toggleTodoCompletion(id) {
        const todos = this.getTodos().map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveTodos(todos);
    }

    getTodos() {
        return JSON.parse(this.storage.getItem('todos')) || [];
    }
}

export default new TodoService(localStorage);
