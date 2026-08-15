# 🚀 Habit Flow

A full-stack Habit Tracking Application built using React.js, Node.js, Express.js, and MySQL to help users manage daily habits, track progress, build streaks, and improve productivity.

---

## ✨ Features

### 🔐 Authentication
- ✅ User Registration
- ✅ User Login
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ Secure Password Hashing using bcrypt
- ✅ Automatic authentication through JWT token

### 📋 Habit Management
- ✅ Create new habits
- ✅ View all habits
- ✅ Mark habits as completed
- ✅ Mark habits as incomplete
- ✅ Delete habits
- ✅ Daily habit completion tracking

### 📊 Progress Tracking
- ✅ GitHub-style yearly habit heatmap
- ✅ Daily completion count
- ✅ Click a heatmap date to view completed habits
- ✅ Habit history by date
- ✅ Current streak tracking
- ✅ Best streak tracking

### 🏆 Achievements
- ✅ First Step achievement
- ✅ 7 Day Streak achievement
- ✅ 30 Day Streak achievement
- ✅ 100 Completions achievement
- ✅ Perfect Day achievement
- ✅ Consistent achievement
- ✅ Achievement progress tracking
- ✅ Locked / Unlocked achievement status

### 👤 User Profile
- ✅ User profile page
- ✅ Default profile avatar
- ✅ Username and email display
- ✅ Lifetime habit statistics
- ✅ Total habits
- ✅ Total completions
- ✅ Active days
- ✅ Current streak
- ✅ Best streak
- ✅ Achievement statistics
- ✅ Overall completion rate

### ⚙️ Settings
- ✅ View account information
- ✅ Update profile information
- ✅ Change password
- ✅ Delete account
- ✅ Account settings page

### 🌙 Theme
- ✅ Dark Mode
- ✅ Light Mode
- ✅ Theme toggle
- ✅ Theme preference stored in localStorage
- ✅ CSS variable based theme system
- ✅ Theme persists after page refresh

### 🎨 User Interface
- ✅ Modern dashboard UI
- ✅ Progress indicators
- ✅ Achievement cards
- ✅ Profile dashboard
- ✅ Settings page
- ✅ Heatmap tooltips
- ✅ History modal
- ✅ Default profile avatar

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS
- react-calendar-heatmap
- react-tooltip

### Backend
- Node.js
- Express.js
- REST API

### Database
- MySQL

### Authentication & Security
- JWT (JSON Web Token)
- bcrypt
- Protected API routes

---

## 📁 Project Structure

```bash
habit-flow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── public/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── Models/
│   ├── config/
│   └── server.js
│
└── README.md
