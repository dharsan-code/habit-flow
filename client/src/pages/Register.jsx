import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/register.css';

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

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/register', formData);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-logo">
          <FaviconIcon />
          <div>
            <div className="register-logo-text">HABITFLOW</div>
            <div className="register-logo-sub">daily tracker</div>
          </div>
        </div>

        <h1 className="register-heading">Start your journey</h1>
        <p className="register-subheading">Build habits that last a lifetime</p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Username" icon="✦" type="text" name="username"
            placeholder="Your username" onChange={handleChange}
          />
          <InputField
            label="Email" icon="@" type="email" name="email"
            placeholder="you@example.com" onChange={handleChange}
          />
          <InputField
            label="Password" icon="⊕" type="password" name="password"
            placeholder="••••••••" onChange={handleChange}
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="terms-text">
          By creating an account you agree to our{' '}
          <span className="terms-link">Terms</span>
          {' & '}
          <span className="terms-link">Privacy Policy</span>
        </p>

        <p className="switch-text">
          Already have an account?{' '}
          <Link to="/" className="switch-link">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;