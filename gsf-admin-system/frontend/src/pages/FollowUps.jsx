import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FollowUpCard from '../components/FollowUpCard';
import { api } from '../lib/api';
import { CalendarClock, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const FollowUps = () => {
  const [data, setData] = useState({ all: [], today: [], upcoming: [], overdue: [] });
  const [activeTab, setActiveTab] = useState('TODAY');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const res = await api.getFollowUps();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch follow-ups:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowUps();
  }, []);

  const getActiveList = () => {
    if (activeTab === 'TODAY') return data.today;
    if (activeTab === 'UPCOMING') return data.upcoming;
    if (activeTab === 'OVERDUE') return data.overdue;
    return data.all;
  };

  const list = getActiveList();

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header title="Follow-up Reminders & Schedule" />

        <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Tab Navigation Bar */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setActiveTab('TODAY')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                backgroundColor: activeTab === 'TODAY' ? '#005C5B' : '#FFFFFF',
                color: activeTab === 'TODAY' ? '#FFFFFF' : '#334155',
                border: '1px solid #E2E8F0'
              }}
            >
              Today's Follow-ups ({data.today.length})
            </button>

            <button
              onClick={() => setActiveTab('UPCOMING')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                backgroundColor: activeTab === 'UPCOMING' ? '#005C5B' : '#FFFFFF',
                color: activeTab === 'UPCOMING' ? '#FFFFFF' : '#334155',
                border: '1px solid #E2E8F0'
              }}
            >
              Upcoming ({data.upcoming.length})
            </button>

            <button
              onClick={() => setActiveTab('OVERDUE')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                backgroundColor: activeTab === 'OVERDUE' ? '#B91C1C' : '#FFFFFF',
                color: activeTab === 'OVERDUE' ? '#FFFFFF' : '#B91C1C',
                border: '1px solid #FEE2E2'
              }}
            >
              Overdue ({data.overdue.length})
            </button>
          </div>

          {/* Follow-up Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {list.length === 0 ? (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: '#64748B' }}>
                No follow-ups scheduled in this view category.
              </div>
            ) : (
              list.map((item) => (
                <FollowUpCard key={item.id} followup={item} />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FollowUps;
