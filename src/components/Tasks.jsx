import React, { useState, useEffect } from 'react';

function Tasks({ token, API_URL }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setError('');
      const endpoint = filter === 'all' ? `${API_URL}/tasks` : `${API_URL}/tasks?status=${filter}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setTasks(data.tasks || []);
      } else {
        setError(data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setError('');
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: input, description }),
      });

      const data = await response.json();
      if (response.ok) {
        setTasks([data.task, ...tasks]);
        setInput('');
        setDescription('');
      } else {
        setError(data.message || 'Failed to create task');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, status) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.map(t => (t._id === id ? data.task : t)));
      } else {
        setError(data.message || 'Failed to update task');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setTasks(tasks.filter(t => t._id !== id));
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={addTask} className="mb-6 space-y-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Task title..."
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded capitalize ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No tasks yet!</p>
        ) : (
          tasks.map(task => (
            <div
              key={task._id}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded border border-gray-200"
            >
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => updateTask(task._id, task.status === 'completed' ? 'pending' : 'completed')}
                className="w-5 h-5 mt-1 cursor-pointer accent-blue-500"
              />
              <div className="flex-1">
                <p className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => deleteTask(task._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
