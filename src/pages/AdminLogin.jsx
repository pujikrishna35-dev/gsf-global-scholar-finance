import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ADMIN_PORTAL_URL = import.meta.env.VITE_ADMIN_DASHBOARD_URL || 'http://localhost:5174';

const AdminLogin = () => {
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
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('gsf_admin_token', data.token);
        localStorage.setItem('gsf_admin_user', JSON.stringify(data.user));
        
        // Redirect to Admin Panel App
        window.location.href = `${ADMIN_PORTAL_URL}/leads`;
      } else {
        setError(data.message || 'Authentication failed. Invalid email or password.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      // Fallback redirect to local admin dashboard if available
      window.location.href = `${ADMIN_PORTAL_URL}/login`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      backgroundColor: '#07324A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#E6F4F3',
            color: '#005C5B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#07324A' }}>Admin Portal Login</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '6px' }}>
            GSF Global Scholar Finance Super Admin Management
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#991B1B',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={18} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#07324A', marginBottom: '8px' }}>
              Admin Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gsf.com"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#07324A', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#005C5B',
              color: '#FFFFFF',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
          <a
            href={ADMIN_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#005C5B',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            Open Standalone Admin Portal <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
