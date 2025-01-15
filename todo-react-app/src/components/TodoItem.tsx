
import React from "react";

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    createdAt: string;
    completedAt: string | null;
  };
  deleteTodo: (id: string) => void;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not completed yet";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, deleteTodo }) => {
  const { title, createdAt, completedAt } = todo;

  return (
    <li
      className={`p-4 mb-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center ${
        completedAt ? "bg-green-100" : "bg-gray-50"
      }`}
    >
      {/* Task Information */}
      <div className="flex-1">
        <h3
          className={`text-lg font-medium ${
            completedAt ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-semibold">Created: </span>
          {formatDate(createdAt)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Completed: </span>
          {formatDate(completedAt)}
        </p>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => deleteTodo(todo.id)}
        className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
