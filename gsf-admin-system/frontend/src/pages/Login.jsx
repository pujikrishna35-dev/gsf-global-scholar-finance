import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@gsf.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      if (data.success && data.token) {
        localStorage.setItem('gsf_admin_token', data.token);
        localStorage.setItem('gsf_admin_user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Authentication failed.');
      }
    } catch (err) {
      setError('Unable to connect to GSF Admin Backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#07324A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img 
            src="/images/logo/gsf-logo.png" 
            alt="GSF Global Scholar Finance" 
            style={{ height: '64px', width: 'auto', objectFit: 'contain', marginBottom: '16px' }} 
          />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#07324A' }}>Admin Portal Login</h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '4px' }}>
            GSF Global Scholar Finance Management CRM
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#07324A', marginBottom: '6px' }}>
              Admin Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#94A3B8' }} />
              <input
                type="email"
                required
                className="admin-input"
                style={{ width: '100%', paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#07324A', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#94A3B8' }} />
              <input
                type="password"
                required
                className="admin-input"
                style={{ width: '100%', paddingLeft: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-admin-primary"
            style={{ width: '100%', justifyContent: 'center', height: '46px', fontSize: '1rem', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '28px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', textAlign: 'center', fontSize: '0.78rem', color: '#64748B' }}>
          🔒 Restricted access. Unauthenticated requests to `/dashboard` automatically redirect to `/login`.
        </div>
      </div>
    </div>
  );
};

export default Login;
