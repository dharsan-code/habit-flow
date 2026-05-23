import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

function FaviconIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect width="120" height="120" rx="26" fill="#080d1a" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#151f38" strokeWidth="8" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#6366f1" strokeWidth="8"
        strokeLinecap="round" strokeDasharray="239" strokeDashoffset="48"
        transform="rotate(-90 60 60)" />
      <circle cx="60" cy="22" r="4" fill="#c7d2fe" />
      <circle cx="98" cy="44" r="3" fill="#a5b4fc" />
      <circle cx="60" cy="60" r="26" fill="#0b1120" />
      <path d="M47 60 L56 70 L76 48" stroke="#22d3ee" strokeWidth="5"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function TaskItem({ task, onDelete, onToggle }) {
  const done = task.completed === 1;
  return (
    <div className="task-item">
      <button
        className={`task-checkbox ${done ? 'checked' : ''}`}
        onClick={() => onToggle(task)}
      >
        {done && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6 L5 9 L10 3" stroke="#080d1a" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <span className={`task-title ${done ? 'done' : ''}`}>{task.title}</span>

      {done && <span className="task-done-badge">done</span>}

      <button className="btn-delete" onClick={() => onDelete(task.id)} title="Delete">
        ✕
      </button>
    </div>
  );
}

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const navigate = useNavigate();

  const getTask = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await API.post('/tasks', { title });
      setTitle('');
      getTask();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      getTask();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleTask = async (task) => {
    try {
      await API.put(`/tasks/${task.id}`, { completed: task.completed === 1 ? 0 : 1 });
      getTask();
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleKey = (e) => { if (e.key === 'Enter') addTask(); };

  useEffect(() => { getTask(); }, []);

  const completed = tasks.filter(t => t.completed === 1).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="dashboard-page">

      <nav className="dashboard-nav">
        <div className="nav-logo">
          <FaviconIcon size={32} />
          <span className="nav-logo-text">HABITFLOW</span>
        </div>
        <button className="btn-logout" onClick={logout}>Sign out</button>
      </nav>

      <div className="dashboard-content">

        <div className="stats-row">
          <div className="stats-card">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="36" r="28" fill="none" stroke="#0d1526" strokeWidth="7" />
              <circle cx="36" cy="36" r="28" fill="none" stroke="#6366f1" strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="176"
                strokeDashoffset={total > 0 ? 176 - (176 * pct / 100) : 176}
                transform="rotate(-90 36 36)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <text x="36" y="41" textAnchor="middle" fill="#e2e8f0"
                fontSize="14" fontWeight="600" fontFamily="DM Sans, sans-serif">
                {pct}%
              </text>
            </svg>
            <div>
              <div className="stats-card-label">Today's progress</div>
              <div className="stats-card-value">{completed} / {total}</div>
              <div className="stats-card-sub">habits completed</div>
            </div>
          </div>

          <div className="streak-card">
            <div className="streak-number">14</div>
            <div className="streak-label">day streak</div>
            <div className="streak-flame">🔥</div>
          </div>
        </div>

        <div className={`add-task-row ${inputFocused ? 'focused' : ''}`}>
          <input
            type="text"
            className="add-task-input"
            placeholder="Add a new habit..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          <button className="btn-add" onClick={addTask}>+ Add</button>
        </div>

        <div className="tasks-header">
          <span className="tasks-header-label">Habits</span>
          {total > 0 && (
            <span className="tasks-done-badge">{completed} done</span>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            No habits yet. Add your first one above!
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
            />
          ))
        )}

      </div>
    </div>
  );
}

export default Dashboard;