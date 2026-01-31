import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import '../styles/auth.css';

const Login = () => {
  const { login, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password, userRole);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Hero Section */}
      <div className="auth-hero">
        <img
          src="https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=2000&auto=format&fit=crop"
          alt="KEC Food Court"
          className="auth-hero-image"
        />
        <div className="auth-hero-content">
          <h2>Fuel Your Ambition</h2>
          <p>Fresh, nutritious, and delicious meals at the heart of Kongu Engineering College. Login to manage your orders.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="auth-form-container">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h1>Welcome Back</h1>
            <p>Enter your credentials to access the Food Court portal.</p>
          </div>

          <div className="auth-demo-box">
            <h4>Demo Credentials:</h4>
            <p>
              <strong>User:</strong> user@example.com / user123<br />
              <strong>Admin:</strong> admin@example.com / admin123
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem', borderRadius: '12px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <FiMail className="auth-input-icon" />
                <input
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="form-label">Password</label>
              <div className="auth-input-wrapper">
                <FiLock className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="auth-link">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <footer className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Create one now</Link>
            </p>
          </footer>

          <div className="auth-role-switch">
            Want to switch to {userRole === 'user' ? 'admin' : 'user'} mode?
            <button
              onClick={() => {
                localStorage.removeItem('userRole');
                window.location.reload();
              }}
            >
              Switch Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;