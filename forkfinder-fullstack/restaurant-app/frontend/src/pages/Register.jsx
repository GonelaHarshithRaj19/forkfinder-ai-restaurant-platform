import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CUISINE_OPTIONS } from '../utils/helpers';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [cuisines, setCuisines] = useState([]);
  const [error, setError] = useState('');

  const toggleCuisine = (c) => {
    setCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-header">
          <h1>Create account</h1>
          <p>Set up your taste profile to get personalized picks</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-error">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Favourite cuisines (optional)</label>
            <div className="cuisine-picker">
              {CUISINE_OPTIONS.slice(0, 10).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`cuisine-tag-btn ${cuisines.includes(c.toLowerCase()) ? 'selected' : ''}`}
                  onClick={() => toggleCuisine(c.toLowerCase())}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
