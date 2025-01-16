import React from "react";

interface TodoFormProps {
  newTodo: string;
  setNewTodo: (value: string) => void;
  addTodo: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ newTodo, setNewTodo, addTodo }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        onClick={addTodo}
        className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition"
      >
        Add
      </button>
    </div>
  );
};

export default TodoForm;
