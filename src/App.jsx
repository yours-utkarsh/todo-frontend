import React, { useState, useEffect } from 'react';
import './index.css';
import Auth from './components/Auth';
import Tasks from './components/Tasks';

const API_URL = "https://vercel.com/utkarshs-projects-46c28f85/todo-backend-y55l"

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Auth setToken={setToken} API_URL={API_URL} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <Tasks token={token} API_URL={API_URL} />
        </div>
      </div>
    </div>
  );
}

export default App;
