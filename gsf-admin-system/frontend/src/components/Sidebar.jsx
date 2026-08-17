import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarClock, 
  FileText, 
  Settings, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('gsf_admin_token');
    localStorage.removeItem('gsf_admin_user');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads', label: 'Lead Management', icon: Users },
    { path: '/students', label: 'Student Directory', icon: GraduationCap },
    { path: '/follow-ups', label: 'Follow-ups', icon: CalendarClock },
    { path: '/settings', label: 'Settings & Config', icon: Settings },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#07324A',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      <div>
        {/* Brand Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#005C5B',
            color: '#F4B63F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.2rem'
          }}>
            GSF
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>GSF Admin</h3>
            <span style={{ fontSize: '0.72rem', color: '#F4B63F', fontWeight: 700, letterSpacing: '0.5px' }}>CRM & API SYSTEM</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: isActive ? '#005C5B' : 'transparent',
                  transition: 'all 0.2s ease'
                })}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div style={{ padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            color: '#FCA5A5',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fontSize: '0.88rem',
            fontWeight: 700
          }}
        >
          <LogOut size={18} />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
