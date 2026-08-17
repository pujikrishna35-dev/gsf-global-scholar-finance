import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import LeadTable from '../components/LeadTable';
import { api } from '../lib/api';
import { 
  Users, 
  Flame, 
  Sun, 
  Snowflake, 
  Sparkles, 
  CalendarClock, 
  FileCheck, 
  Award, 
  Banknote,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getLeads('ALL', '')
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (leadsRes.success) setRecentLeads(leadsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await api.updateLead(id, { status: newStatus });
    fetchDashboardData();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header title="Admin Dashboard Overview" />

        <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Top Row Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <StatsCard
              title="Total Leads"
              value={stats?.totalLeads || 0}
              subtitle="All registered inquiries"
              icon={Users}
              color="#07324A"
              bg="#E2E8F0"
            />
            <StatsCard
              title="HOT LEADS"
              value={stats?.hotLeads || 0}
              subtitle="Urgent & Documentation Ready"
              icon={Flame}
              color="#DC2626"
              bg="#FEE2E2"
            />
            <StatsCard
              title="MEDIUM LEADS"
              value={stats?.mediumLeads || 0}
              subtitle="Moderate intake timeline"
              icon={Sun}
              color="#D97706"
              bg="#FEF3C7"
            />
            <StatsCard
              title="COLD LEADS"
              value={stats?.coldLeads || 0}
              subtitle="Long term research"
              icon={Snowflake}
              color="#2563EB"
              bg="#DBEAFE"
            />
          </div>

          {/* Second Row Operational Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            <StatsCard
              title="New Inquiries"
              value={stats?.newLeads || 0}
              icon={Sparkles}
              color="#0369A1"
              bg="#E0F2FE"
            />
            <StatsCard
              title="Today's Follow-ups"
              value={stats?.todayFollowups || 0}
              icon={CalendarClock}
              color="#B45309"
              bg="#FEF3C7"
            />
            <StatsCard
              title="Applications"
              value={stats?.totalApplications || 0}
              icon={FileCheck}
              color="#4338CA"
              bg="#E0E7FF"
            />
            <StatsCard
              title="Sanctioned Loans"
              value={stats?.sanctionedLoans || 0}
              icon={Award}
              color="#15803D"
              bg="#DCFCE7"
            />
            <StatsCard
              title="Disbursed Loans"
              value={stats?.disbursedLoans || 0}
              subtitle={stats?.totalDisbursedAmount ? formatCurrency(stats.totalDisbursedAmount) : '₹0'}
              icon={Banknote}
              color="#005C5B"
              bg="#E6F4F3"
              highlightGold={true}
            />
          </div>

          {/* Recent Inquiries Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#07324A' }}>Recent Student Submissions</h3>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Showing 5 recent entries</span>
            </div>

            <LeadTable leads={recentLeads} onStatusChange={handleStatusChange} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
