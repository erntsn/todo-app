import React from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Settings from "./components/Settings";

const TodoApp = () => {
    return (
        <div className="max-w-xl w-full bg-gray-100 text-gray-900 shadow-lg rounded-lg p-6 mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Todo Uygulaması ⚡️</h1>
            <TodoForm />
            <TodoList />
            <Settings />
        </div>
    );
};

export default TodoApp;
