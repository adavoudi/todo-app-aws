import React from "react";
import TodoItem from "./TodoItem";

interface Todo {
  id: string;
  title: string;
  createdAt: string;
  completedAt: string | null;
}

interface TodoListProps {
  todos: Todo[];
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, deleteTodo, toggleComplete }) => {
  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleComplete={toggleComplete}
        />
      ))}
    </ul>
  );
};

export default TodoList;