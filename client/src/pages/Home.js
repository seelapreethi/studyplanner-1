import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
      fetchUserDetails();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTasks(data.slice(0, 3)); // show top 3
      const completed = data.filter(task => task.status === 'completed').length;
      setProgress({ completed, total: data.length });
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserName(data.name || 'User');
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  return (
    <div className="home-container">
      <h1>📘 Study Planner</h1>
      <p>Plan. Track. Succeed.</p>

      {isLoggedIn ? (
        <div className="home-loggedin">
          <h2>Welcome back, {userName} 👋</h2>

          {progress.total > 0 && (
            <p className="progress-bar">
              ✅ Progress: {progress.completed} / {progress.total} tasks completed
            </p>
          )}

          <div className="task-preview">
            <h3>📅 Upcoming Tasks</h3>
            {tasks.length === 0 ? (
              <p>No upcoming tasks found.</p>
            ) : (
              <ul>
                {tasks.map(task => (
                  <li key={task._id}>
                    <strong>{task.subject}</strong> — Due: {task.deadline?.substring(0, 10)}
                  </li>
                ))}
              </ul>
            )}
            <Link to="/dashboard" className="btn">Go to Dashboard</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="benefits">
            <h3>✨ Why Use Study Planner?</h3>
            <ul>
              <li>✅ Organize your study schedule</li>
              <li>📊 Track pending & completed tasks</li>
              <li>🔔 Stay on top of your deadlines</li>
            </ul>
          </div>

          {/* <blockquote className="quote">
            “The secret of getting ahead is getting started.”<br />
            — Mark Twain
          </blockquote> */}

          <div className="btn-group">
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
