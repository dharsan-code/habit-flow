import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/settings.css";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();

  // Get user settings
  const getSettings = async () => {
    try {
      const res = await API.get("/settings");

      setUsername(res.data.username);
      setEmail(res.data.email);

    } catch (err) {
      console.log(err);
      setError("Unable to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  // Update username and email
  const updateProfile = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await API.put("/settings/profile", {
        username,
        email,
      });

      setMessage(res.data.message);

    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
        "Unable to update profile"
      );
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await API.put("/settings/password", {
        currentPassword,
        newPassword,
      });

      setMessage(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
        "Unable to change password"
      );
    }
  };

  // Delete account
  const deleteAccount = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await API.delete("/settings/account");

      localStorage.removeItem("token");

      navigate("/");

    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
        "Unable to delete account"
      );
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <p className="settings-loading">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>⚙️ Settings</h1>
          <p>Manage your HabitFlow account</p>
        </div>

        <button
          className="settings-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      {message && <div className="settings-message">{message}</div>}

      {error && <div className="settings-error">{error}</div>}

      {/* Account */}
      <section className="settings-card">
        <div className="settings-card-header">
          <h2>👤 Account</h2>
          <p>Update your personal information</p>
        </div>

        <form onSubmit={updateProfile}>
          <div className="settings-field">
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="settings-field">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <button type="submit" className="settings-primary-btn">
            Save Changes
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="settings-card">
        <div className="settings-card-header">
          <h2>🔐 Security</h2>
          <p>Change your account password</p>
        </div>

        <form onSubmit={changePassword}>
          <div className="settings-field">
            <label>Current Password</label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="settings-field">
            <label>New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="settings-field">
            <label>Confirm New Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className="settings-primary-btn">
            Change Password
          </button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="settings-card danger-card">
        <div className="settings-card-header">
          <h2>⚠️ Danger Zone</h2>

          <p>
            Permanently delete your HabitFlow account and all associated data.
          </p>
        </div>

        <button className="delete-account-btn" onClick={deleteAccount}>
          Delete Account
        </button>
      </section>
      <section className="settings-card">
        <div className="settings-card-header">
          <h2>🌙 Appearance</h2>
          <p>Customize your HabitFlow experience</p>
        </div>

        <div className="theme-row">
          <div>
            <strong>Theme</strong>
            <p>
              {theme === "dark"
                ? "Dark mode is currently enabled"
                : "Light mode is currently enabled"}
            </p>
          </div>

          <button className={`theme-toggle ${theme}`} onClick={toggleTheme}>
            <span className="theme-toggle-thumb">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Settings;