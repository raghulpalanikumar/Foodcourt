import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import '../styles/auth.css';

const Register = () => {
  const { register, userRole } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userRole
      };

      const result = await register(userData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Hero Section */}
      <div className="auth-hero">
        <img
          src="https://images.unsplash.com/photo-1574966739982-2b7849df982b?q=80&w=2670&auto=format&fit=crop"
          alt="Fresh Food"
          className="auth-hero-image"
          style={{ transform: 'scaleX(-1)' }} // Flip for variation
        />
        <div className="auth-hero-content">
          <h2>Join the KEC Dining Community</h2>
          <p>Create an account to access student meal plans, daily specials, and quick checkout at campus food zones.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="auth-form-container">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p>Join us today as a {userRole} and start your journey.</p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem', borderRadius: '12px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="form-label">Full Name</label>
              <div className="auth-input-wrapper">
                <FiUser className="auth-input-icon" />
                <input
                  type="text"
                  name="name"
                  className="auth-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <FiMail className="auth-input-icon" />
                <input
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="john@example.com"
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

            <div className="auth-input-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <FiLock className="auth-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="auth-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="auth-checkbox" style={{ alignItems: 'flex-start' }}>
                <input type="checkbox" required style={{ marginTop: '0.25rem' }} />
                <span>
                  I agree to the{' '}
                  <a href="#" className="auth-link">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="auth-link">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  Create Account <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <footer className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in here</Link>
            </p>
          </footer>

          <div className="auth-role-switch">
            Want to register as {userRole === 'user' ? 'admin' : 'user'}?
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

export default Register;