import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [streak, setStreak] = useState({
    currentStreak: 0,
    bestStreak: 0,
  });
  const [achievements, setAchievements] = useState({});

  const getTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  const getHeatmap = async () => {
    try {
      const res = await API.get("/heatmap");
      setHeatmapData(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  const getStreak = async () => {
    try {
      const res = await API.get("/streak");
      setStreak(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAchievements = async () => {
    try {
      const res = await API.get("/achievements");
      setAchievements(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTasks();
    getHeatmap();
    getStreak();
    getAchievements();
  }, []);

  const totalHabits = tasks.length;

  const totalCompletions = heatmapData.reduce(
    (sum, item) => sum + Number(item.count),
    0
  );

  const activeDays = heatmapData.length;

  const achievementCount = Object.values(achievements).filter(
    (item) => item.unlocked
  ).length;

  const totalAchievements = Object.keys(achievements).length;

  const completionRate =
    totalHabits > 0 && activeDays > 0
      ? Math.round((totalCompletions / (totalHabits * activeDays)) * 100)
      : 0;

  return (
    <div className="profile-page">

      <div className="profile-header">
        <h1>👤 My Profile</h1>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>🔥 Current Streak</h3>
          <p>{streak.currentStreak}</p>
        </div>

        <div className="stat-card">
          <h3>🏆 Best Streak</h3>
          <p>{streak.bestStreak}</p>
        </div>

        <div className="stat-card">
          <h3>📋 Total Habits</h3>
          <p>{totalHabits}</p>
        </div>

        <div className="stat-card">
          <h3>✅ Total Completions</h3>
          <p>{totalCompletions}</p>
        </div>

        <div className="stat-card">
          <h3>📅 Active Days</h3>
          <p>{activeDays}</p>
        </div>

        <div className="stat-card">
          <h3>🏅 Achievements</h3>
          <p>{achievementCount} / {totalAchievements}</p>
        </div>

      </div>

      <div className="completion-section">

        <h2>📈 Completion Rate</h2>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>

        <p>{completionRate}%</p>

      </div>

      <div className="achievement-section">

        <h2>🏆 Achievement Progress</h2>

        {Object.entries(achievements).map(([key, value]) => (
          <div
            key={key}
            className={`achievement-item ${
              value.unlocked ? "unlocked" : "locked"
            }`}
          >
            <div className="achievement-title">
              {key.replace(/([A-Z])/g, " $1")}
            </div>

            {"progress" in value && (
              <div className="achievement-progress">
                {value.progress} / {value.target}
              </div>
            )}

            <div className="achievement-status">
              {value.unlocked ? "✅" : "🔒"}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Profile;