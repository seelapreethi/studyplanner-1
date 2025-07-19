import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/TaskDashboard.css';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    deadline: '',
    notes: '',
    status: 'pending'
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch tasks
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
      if (err.response?.status === 401) navigate('/login');
    }
  };

  // Create new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      await axios.post('http://localhost:5000/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ subject: '', deadline: '', notes: '', status: 'pending' });
      fetchTasks();
    } catch (err) {
      console.error("Error creating task:", err.response?.data || err.message);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dashboard-container">
      <h2>📚 Study Planner</h2>
      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          required
        />
        <textarea
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 && <p>No tasks found.</p>}
        {tasks.map((task) => (
          <div className="task-card" key={task._id}>
            <h3>{task.subject}</h3>
            <p><strong>Deadline:</strong> {task.deadline?.substring(0, 10)}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p>{task.notes}</p>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDashboard;
