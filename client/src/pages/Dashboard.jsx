import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";


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
  const [heatmapData, setHeatmapData] = useState([]);
  const [streak, setStreak] = useState({ currentStreak: 0, bestStreak: 0, })
  const [achievements, setAchievements] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
      await API.put(`/tasks/${task.id}`, { 
        completed: task.completed === 1 ? 0 : 1 
      });

      getTask();
      getHeatmap();
      getStreak();
      getAchievements();

    } catch (err) {
      console.log(err);
    }
  };

  const getAchivements = async() => {
    try{
      const res = await API.get('/achievements');
      setAchievements(res.data);
    }
    catch(err){
     console.log(err);
    }
  }
  const formatDate = (date) => {
    if (typeof date === "string") {
      return date.split("T")[0];
    }

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const isCompleted = (val) => Number(val) === 1;
  const getHistory = async (date) => {
  try {
    const res = await API.get(`/history/${date}`);
    console.log("History:", res.data);
    setHistory(res.data);
    setSelectedDate(date);
    setShowModal(true);
  } catch (err) {
    console.log(err);
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleKey = (e) => { if (e.key === 'Enter') addTask(); };

  const completed = tasks.filter(t => t.completed === 1).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const getHeatmap = async () => {
      const res = await API.get("/heatmap");
      setHeatmapData(res.data);
  };

  const getStreak = async () => {
    try{
      const res = await API.get("/streak");
      setStreak(res.data);
    }
    catch(err){
      console.log(err);
    }
     
  }

  useEffect(() => {
    getTask();
    getHeatmap();
    getStreak();
    getAchivements()
  }, []);

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-logo">
          <FaviconIcon size={32} />
          <span className="nav-logo-text">HABITFLOW</span>
        </div>
        <div className="nav-actions">
          <button className="btn-profile" onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button className="btn-profile" onClick={() => navigate("/settings")}>
            Settings
          </button>

          <button className="btn-logout" onClick={logout}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-row">
          <div className="stats-card">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <circle
                cx="36"
                cy="36"
                r="28"
                fill="none"
                stroke="#0d1526"
                strokeWidth="7"
              />
              <circle
                cx="36"
                cy="36"
                r="28"
                fill="none"
                stroke="#6366f1"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="176"
                strokeDashoffset={total > 0 ? 176 - (176 * pct) / 100 : 176}
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
              <text
                x="36"
                y="41"
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="14"
                fontWeight="600"
                fontFamily="DM Sans, sans-serif"
              >
                {pct}%
              </text>
            </svg>
            <div>
              <div className="stats-card-label">Today's progress</div>
              <div className="stats-card-value">
                {completed} / {total}
              </div>
              <div className="stats-card-sub">habits completed</div>
            </div>
          </div>

          <div className="streak-card">
            <div className="streak-number">{streak.currentStreak}</div>
            <div className="streak-label">day streak</div>
            <div className="best-streak">🏆 Best: {streak.bestStreak}</div>
            <div className="streak-flame">🔥</div>
          </div>
        </div>

        <CalendarHeatmap
          startDate={new Date("2026-01-01")}
          endDate={new Date("2026-12-31")}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count >= 4) return "color-scale-4";
            if (value.count >= 3) return "color-scale-3";
            if (value.count >= 2) return "color-scale-2";
            return "color-scale-1";
          }}
          tooltipDataAttrs={(value) => ({
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": value?.date
              ? `${value.count} habits completed`
              : "No activity",
          })}
          onClick={(value) => {
            if (!value || !value.date) return;
            const formattedDate = formatDate(value.date);
            console.log("Selected date:", formattedDate);
            getHistory(formattedDate);
          }}
        />
        <Tooltip id="heatmap-tooltip" />

        {showModal && (
          <div className="history-modal-overlay">
            <div className="history-modal">
              <div className="history-header">
                <h2>📅 {selectedDate}</h2>

                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              {history.length === 0 ? (
                <p>No habits found.</p>
              ) : (
                history.map((habit) => (
                  <div key={habit.id} className="history-item">
                    <span>{habit.completed ? "✅" : "❌"}</span>
                    <span>{habit.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className={`add-task-row ${inputFocused ? "focused" : ""}`}>
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
          <button className="btn-add" onClick={addTask}>
            + Add
          </button>
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

        <div className="achievement-card">
          <h3>🏆 Achievements</h3>
          <div
            className={`achievement ${achievements.firstStep?.unlocked ? "unlocked" : "locked"}`}
          >
            🥉 First Step
          </div>

          <div
            className={`achievement ${achievements.streak7?.unlocked ? "unlocked" : "locked"}`}
          >
            🔥 7 Day Streak
            <span>
              {achievements.streak7?.progress}/{achievements.streak7?.target}
            </span>
          </div>

          <div
            className={`achievement ${achievements.streak30?.unlocked ? "unlocked" : "locked"}`}
          >
            🚀 30 Day Streak
            <span>
              {achievements.streak30?.progress}/{achievements.streak30?.target}
            </span>
          </div>

          <div
            className={`achievement ${achievements.century?.unlocked ? "unlocked" : "locked"}`}
          >
            💯 Century
            <span>
              {achievements.century?.progress}/{achievements.century?.target}
            </span>
          </div>

          <div
            className={`achievement ${achievements.perfectDay?.unlocked ? "unlocked" : "locked"}`}
          >
            ⭐ Perfect Day
            <span>
              {achievements.perfectDay?.progress}/
              {achievements.perfectDay?.target}
            </span>
          </div>

          <div
            className={`achievement ${achievements.consistent?.unlocked ? "unlocked" : "locked"}`}
          >
            📅 Consistent
            <span>
              {achievements.consistent?.progress}/
              {achievements.consistent?.target}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;