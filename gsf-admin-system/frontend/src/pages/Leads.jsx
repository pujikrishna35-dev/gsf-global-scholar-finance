import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LeadTable from '../components/LeadTable';
import ClassificationBadge from '../components/ClassificationBadge';
import { api } from '../lib/api';
import { useNotifications } from '../context/NotificationContext';
import { Filter, Search, Plus, Flame, Sun, Snowflake, RefreshCw } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [classificationFilter, setClassificationFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { lastLeadEvent } = useNotifications();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads(classificationFilter, searchQuery);
      if (res.success) {
        setLeads(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [classificationFilter, searchQuery]);

  // Real-time live update on new lead submission
  useEffect(() => {
    if (lastLeadEvent) {
      fetchLeads();
    }
  }, [lastLeadEvent]);

  const handleStatusChange = async (id, newStatus) => {
    await api.updateLead(id, { status: newStatus });
    fetchLeads();
  };

  const filterTabs = [
    { key: 'ALL', label: 'All Inquiries' },
    { key: 'HOT', label: '🔥 HOT Leads' },
    { key: 'MEDIUM', label: '🟡 WARM Leads' },
    { key: 'COLD', label: '🔵 COLD Leads' }
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header
          title="Lead Management CRM"
          searchVal={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Filter Bar & Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setClassificationFilter(tab.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: classificationFilter === tab.key ? '#FFFFFF' : '#334155',
                    backgroundColor: classificationFilter === tab.key ? '#005C5B' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={fetchLeads}
                className="admin-input"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </div>

          {/* Lead Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Loading student leads...</div>
          ) : (
            <LeadTable leads={leads} onStatusChange={handleStatusChange} />
          )}

        </div>
      </div>
    </div>
  );
};

export default Leads;
