import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import TopMenuBar from "./components/TopMenuBar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { API_ENDPOINT } from "./Constants";

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

  // Function to clear authorization-related URL parameters
  const clearAuthorizationParams = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    // List of parameters to remove
    const paramsToRemove = ["code", "state", "session_state", "id_token", "access_token"];

    paramsToRemove.forEach(param => params.delete(param));

    // Update the URL without reloading the page
    window.history.replaceState({}, document.title, url.pathname);
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id_token) {
      callApi(auth.user.id_token);
      clearAuthorizationParams(); // Clear authorization params after authentication
    }
  }, [auth.isAuthenticated, auth.user?.id_token]);

  const callApi = async (idToken: string) => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
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

    const idToken = auth.user?.id_token;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
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
    const idToken = auth.user?.id_token;

    try {
      const response = await fetch(`${API_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
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

  const toggleComplete = async (id: string) => {
    const idToken = auth.user?.id_token;

    try {
      const response = await fetch(`${API_ENDPOINT}/${id}/toggle`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle todo completion");
      }

      const updatedTodo: Todo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Toggle complete error:", error);
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
          <h1 className="text-2xl font-bold text-gray-800 text-center">My Todo App</h1>
        </header>
        {auth.isAuthenticated ? (
          <>
            <TodoForm newTodo={newTodo} setNewTodo={setNewTodo} addTodo={addTodo} />
            <TodoList todos={todos} deleteTodo={deleteTodo} toggleComplete={toggleComplete} />
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