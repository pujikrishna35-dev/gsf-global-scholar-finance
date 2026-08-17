import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, ChevronRight, Sparkles, Clock, Globe, GraduationCap } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const formatRelativeTime = (isoString) => {
  if (!isoString) return 'Just now';
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

const getBadgeStyle = (classification) => {
  switch (classification) {
    case 'HOT':
      return { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626', icon: '🔥' };
    case 'MEDIUM':
      return { bg: '#FEFCE8', border: '#FEF08A', color: '#CA8A04', icon: '🟡' };
    case 'COLD':
      return { bg: '#EFF6FF', border: '#BFDBFE', color: '#2563EB', icon: '🔵' };
    default:
      return { bg: '#F3F4F6', border: '#E5E7EB', color: '#4B5563', icon: '⚡' };
  }
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, newNotifAnim } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
    setIsOpen(false);
    navigate(`/leads/${notif.leadId}`);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/leads');
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Notification Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          backgroundColor: isOpen ? '#F1F5F9' : '#F8FAFC',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        title="Admin Notifications"
      >
        <Bell size={20} color={unreadCount > 0 ? '#07324A' : '#64748B'} />

        {unreadCount > 0 && (
          <span
            className={newNotifAnim ? 'notif-badge-pulse' : ''}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#E11D48',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 800,
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5px',
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(225, 29, 72, 0.4)'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '52px',
            width: '380px',
            maxHeight: '480px',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            boxShadow: '0 12px 32px rgba(7, 50, 74, 0.16), 0 2px 6px rgba(0,0,0,0.04)',
            border: '1px solid #E2E8F0',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInDown 0.2s ease-out'
          }}
        >
          {/* Panel Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#07324A' }}>Notifications</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#FFE4E6',
                    color: '#E11D48',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}
                >
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#005C5B',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'backgroundColor 0.15s'
                }}
                className="hover-bg-teal"
              >
                <CheckCheck size={14} /> Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#94A3B8' }}>
                <Bell size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const style = getBadgeStyle(notif.classification);
                const isUnread = !notif.isRead;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: isUnread ? '#F0F9FF' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}
                    className="notif-item-hover"
                  >
                    {/* Icon Badge */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: style.bg,
                        border: `1px solid ${style.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        flexShrink: 0
                      }}
                    >
                      {style.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: isUnread ? 800 : 600,
                            color: '#07324A'
                          }}
                        >
                          {notif.title}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} /> {formatRelativeTime(notif.createdAt)}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: isUnread ? 700 : 500, color: '#1E293B', marginBottom: '4px' }}>
                        {notif.studentName}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.76rem', color: '#64748B', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Globe size={12} color="#005C5B" /> {notif.country}
                        </span>
                        {notif.university && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <GraduationCap size={12} color="#005C5B" /> {notif.university}
                          </span>
                        )}
                        {notif.intake && (
                          <span style={{ color: '#005C5B', fontWeight: 600 }}>• {notif.intake}</span>
                        )}
                      </div>
                    </div>

                    {/* Unread dot indicator */}
                    {isUnread && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#0284C7',
                          marginTop: '6px',
                          flexShrink: 0
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Panel Footer */}
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              textAlign: 'center'
            }}
          >
            <button
              onClick={handleViewAll}
              style={{
                background: 'none',
                border: 'none',
                color: '#07324A',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View all leads & notifications <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
