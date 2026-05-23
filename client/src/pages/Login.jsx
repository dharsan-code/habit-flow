import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/login.css';

function FaviconIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 120 120" fill="none">
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

function InputField({ label, icon, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className={`field-wrap ${focused ? 'focused' : ''}`}>
        <span className="field-icon">{icon}</span>
        <input
          {...props}
          className="field-input"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <FaviconIcon />
          <div>
            <div className="login-logo-text">HABITFLOW</div>
            <div className="login-logo-sub">daily tracker</div>
          </div>
        </div>

        <h1 className="login-heading">Welcome back</h1>
        <p className="login-subheading">Sign in to continue your streak</p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email" icon="@" type="email" name="email"
            placeholder="you@example.com" onChange={handleChange}
          />
          <InputField
            label="Password" icon="⊕" type="password" name="password"
            placeholder="••••••••" onChange={handleChange}
          />

          {/* <div className="forgot-row">
            <button type="button" className="forgot-link">Forgot password?</button>
          </div> */}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* <div className="divider">or continue with</div> */}

        {/* <div className="social-row">
          <button className="btn-social">Google</button>
          <button className="btn-social">Apple</button>
        </div> */}

        <p className="switch-text">
          Don't have an account?{' '}
          <Link to="/register" className="switch-link">Sign up free</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;