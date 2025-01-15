import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import TopMenuBar from "./components/TopMenuBar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { API_ENDPOINT } from "./Constants"

interface Todo {
  id: string;
  title: string;
  createdAt: string;
  completedAt: string | null;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      callApi(auth.user.access_token);
    }
  }, [auth.isAuthenticated, auth.user?.access_token]);

  const callApi = async (accessToken: string) => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Your session has expired. Please log in again.");
          auth.signinRedirect();
          return;
        }
        throw new Error("Failed to call API");
      }

      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const accessToken = auth.user?.access_token;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title: newTodo }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const newTask: Todo = await response.json();
      setTodos([newTask, ...todos]);
      setNewTodo("");
    } catch (error) {
      console.error("Add todo error:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    const accessToken = auth.user?.access_token;

    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Delete todo error:", error);
    }
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Menu Bar */}
      <TopMenuBar />

      {/* Main Content */}
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">My Modern Todo App</h1>
        </header>
        {auth.isAuthenticated ? (
          <>
            <TodoForm newTodo={newTodo} setNewTodo={setNewTodo} addTodo={addTodo} />
            <TodoList todos={todos} deleteTodo={deleteTodo} />
          </>
        ) : (
          <div className="text-center text-gray-600">
            <p>Please log in to manage your tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;