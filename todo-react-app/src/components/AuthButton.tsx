import React from "react";

interface AuthButtonProps {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isLoggedIn, login, logout }) => {
  return (
    <div>
      {!isLoggedIn ? (
        <button
          onClick={login}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition"
        >
          Login
        </button>
      ) : (
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default AuthButton;
