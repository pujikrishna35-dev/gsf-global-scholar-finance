import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ClassificationBadge from '../components/ClassificationBadge';
import StatusDropdown from '../components/StatusDropdown';
import ActivityTimeline from '../components/ActivityTimeline';
import { api } from '../lib/api';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  GraduationCap, 
  Landmark, 
  Calendar, 
  Banknote, 
  FileText, 
  Plus, 
  Clock, 
  AlertTriangle,
  Send
} from 'lucide-react';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followupDate, setFollowupDate] = useState('');
  const [followupTime, setFollowupTime] = useState('11:00 AM');
  const [followupNotes, setFollowupNotes] = useState('');

  // Student Broadcast & Document Management State
  const [studentMessage, setStudentMessage] = useState('');
  const [visibleToStudent, setVisibleToStudent] = useState(true);
  const [studentMsgSent, setStudentMsgSent] = useState(false);

  const [selectedDocName, setSelectedDocName] = useState('Admission Letter');
  const [selectedDocStatus, setSelectedDocStatus] = useState('VERIFIED');
  const [docVisibleToStudent, setDocVisibleToStudent] = useState(true);
  const [docMsgSent, setDocMsgSent] = useState(false);

  const fetchLeadDetails = async () => {
    try {
      const res = await api.getLeadById(id);
      if (res.success) {
        setLead(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch lead detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendStudentUpdate = async (e) => {
    e.preventDefault();
    if (!studentMessage) return;
    const res = await api.postStudentUpdate(id, studentMessage, visibleToStudent);
    if (res.success) {
      setStudentMessage('');
      setStudentMsgSent(true);
      setTimeout(() => setStudentMsgSent(false), 3000);
      fetchLeadDetails();
    }
  };

  const handleUpdateStudentDoc = async (e) => {
    e.preventDefault();
    const res = await api.updateStudentDocument(id, selectedDocName, selectedDocStatus, docVisibleToStudent);
    if (res.success) {
      setDocMsgSent(true);
      setTimeout(() => setDocMsgSent(false), 3000);
      fetchLeadDetails();
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const handleClassificationChange = async (newClassification) => {
    const res = await api.updateLead(id, { leadClassification: newClassification });
    if (res.success) fetchLeadDetails();
  };

  const handleStatusChange = async (newStatus) => {
    const res = await api.updateLead(id, { status: newStatus });
    if (res.success) fetchLeadDetails();
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText) return;
    const res = await api.addNote(id, noteText);
    if (res.success) {
      setNoteText('');
      fetchLeadDetails();
    }
  };

  const handleScheduleFollowUp = async (e) => {
    e.preventDefault();
    const res = await api.addFollowUp(id, {
      date: followupDate || new Date().toISOString().split('T')[0],
      time: followupTime,
      notes: followupNotes
    });
    if (res.success) {
      setShowFollowUpModal(false);
      setFollowupNotes('');
      fetchLeadDetails();
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <Header title="Student Details" />
          <div className="admin-content" style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
            Loading student details...
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <Header title="Student Not Found" />
          <div className="admin-content" style={{ padding: '40px' }}>
            <button onClick={() => navigate('/leads')} className="btn-admin-primary">
              <ArrowLeft size={16} /> Back to Leads
            </button>
            <p style={{ marginTop: '20px', color: '#B91C1C' }}>Student record not found or has been archived.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header title={`Student Profile: ${lead.name}`} />

        <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Back & Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => navigate('/leads')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#07324A' }}>
              <ArrowLeft size={18} /> Back to All Leads
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowFollowUpModal(true)} className="btn-admin-primary" style={{ backgroundColor: '#D97706' }}>
                <Clock size={16} /> Schedule Follow-up
              </button>
            </div>
          </div>

          {/* 2-Column Main Layout: Details Left (65%), Timeline Right (35%) */}
          <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: '24px', alignItems: 'start' }}>
            
            {/* LEFT COLUMN: Detailed Student Profiles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Classification & Status Admin Bar */}
              <div className="admin-card" style={{ backgroundColor: '#FEF9EE', border: '1px solid #FCD98B' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#07324A', marginBottom: '14px' }}>
                  ADMIN CONTROL: CLASSIFICATION & APPLICATION STATUS
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>
                      LEAD CLASSIFICATION (ADMIN OVERRIDE)
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['HOT', 'MEDIUM', 'COLD'].map((c) => (
                        <button
                          key={c}
                          onClick={() => handleClassificationChange(c)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            border: lead.leadClassification === c ? '2px solid #07324A' : '1px solid #CBD5E1',
                            backgroundColor: c === 'HOT' ? '#FEE2E2' : c === 'MEDIUM' ? '#FEF3C7' : '#DBEAFE',
                            color: c === 'HOT' ? '#DC2626' : c === 'MEDIUM' ? '#D97706' : '#2563EB',
                            cursor: 'pointer'
                          }}
                        >
                          {c === 'HOT' ? '🔥 HOT' : c === 'MEDIUM' ? '🟡 MEDIUM' : '🔵 COLD'}
                        </button>
                      ))}
                    </div>
                    {lead.studentSelectedClassification !== lead.leadClassification && (
                      <span style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} /> Student originally selected: {lead.studentSelectedClassification}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>
                      APPLICATION STAGE / STATUS
                    </label>
                    <StatusDropdown currentStatus={lead.status} onChange={handleStatusChange} />
                  </div>
                </div>
              </div>

              {/* 1. Personal Information */}
              <div className="admin-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '16px' }}>
                  <User size={20} className="text-teal" color="#005C5B" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#07324A' }}>Personal Information</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>STUDENT NAME</span>
                    <div style={{ fontWeight: 800, color: '#07324A', fontSize: '1rem', marginTop: '2px' }}>{lead.name}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>PHONE NUMBER</span>
                    <div style={{ fontWeight: 700, color: '#07324A', marginTop: '2px' }}>{lead.phone}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>EMAIL ADDRESS</span>
                    <div style={{ fontWeight: 700, color: '#07324A', marginTop: '2px' }}>{lead.email}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>PREFERRED CONTACT</span>
                    <div style={{ fontWeight: 700, color: '#005C5B', marginTop: '2px' }}>{lead.contactMethod || 'Phone Call'}</div>
                  </div>
                </div>
              </div>

              {/* 2. Study Information */}
              <div className="admin-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '16px' }}>
                  <GraduationCap size={20} color="#005C5B" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#07324A' }}>Study Abroad / Higher Ed Details</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>STUDY DESTINATION</span>
                    <div style={{ fontWeight: 800, color: '#005C5B', fontSize: '0.95rem', marginTop: '2px' }}>
                      {lead.studyDestination || lead.country || lead.destination}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>TARGET UNIVERSITY</span>
                    <div style={{ fontWeight: 800, color: '#07324A', marginTop: '2px' }}>
                      {lead.targetUniversity || lead.university}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>COURSE LEVEL & NAME</span>
                    <div style={{ fontWeight: 700, color: '#07324A', marginTop: '2px' }}>
                      {lead.courseLevel ? `${lead.courseLevel} - ` : ''}{lead.courseName || lead.course}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Financial Information */}
              <div className="admin-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '16px' }}>
                  <Banknote size={20} color="#005C5B" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#07324A' }}>Financial & Loan Requirements</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>REQUESTED LOAN AMOUNT</span>
                    <div style={{ fontWeight: 800, color: '#D9941E', fontSize: '1.1rem', marginTop: '2px' }}>
                      {lead.requestedLoanAmount || formatCurrency(lead.loanAmount)}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>APPROX TUITION FEE</span>
                    <div style={{ fontWeight: 700, color: '#07324A', marginTop: '2px' }}>
                      {lead.approxTuitionFee || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>CO-APPLICANT STATUS</span>
                    <div style={{ fontWeight: 700, color: lead.coApplicant === 'Yes' ? '#15803D' : '#64748B', marginTop: '2px' }}>
                      {lead.coApplicant || 'No'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>COLLATERAL STATUS</span>
                    <div style={{ fontWeight: 700, color: lead.collateral === 'Yes' || lead.hasCollateral ? '#15803D' : '#0369A1', marginTop: '2px' }}>
                      {lead.collateral || (lead.hasCollateral ? 'Yes' : 'No')}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Lead Source & Metadata */}
              <div className="admin-card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>SOURCE</span>
                    <div style={{ fontWeight: 700, color: '#07324A' }}>{lead.source}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>CAMPAIGN</span>
                    <div style={{ fontWeight: 700, color: '#07324A' }}>{lead.campaign || 'Direct'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>ASSIGNED TO</span>
                    <div style={{ fontWeight: 700, color: '#005C5B' }}>{lead.assignedEmployee || 'Unassigned'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>SUBMISSION DATE & TIME</span>
                    <div style={{ fontWeight: 700, color: '#07324A' }}>
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ''}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Activity Timeline & Note Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Add Activity Note Card */}
              <div className="admin-card">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#07324A', marginBottom: '10px' }}>Add Activity Note</h4>
                <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <textarea
                    rows={3}
                    placeholder="Enter counselor notes, bank discussion updates, or document requests..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid #E2E8F0',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn-admin-primary" style={{ justifyContent: 'center' }}>
                    <Send size={16} /> Log Internal Note
                  </button>
                </form>
              </div>

              {/* Student Panel Broadcast & Message Controls */}
              <div className="admin-card" style={{ border: '2px solid #005C5B', backgroundColor: '#F0FDFA' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#07324A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📢 Student Panel Broadcast Update
                  </h4>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#005C5B', backgroundColor: '#E6F4F3', padding: '2px 8px', borderRadius: '10px' }}>
                    Live Socket Sync
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>
                  Post a message or status update directly to {lead.name}'s Student Dashboard.
                </p>

                {studentMsgSent && (
                  <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>
                    ✓ Live update sent to student dashboard!
                  </div>
                )}

                <form onSubmit={handleSendStudentUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <textarea
                    rows={3}
                    placeholder="e.g. Your loan application is under review by our credit team. Sanction letter expected soon."
                    value={studentMessage}
                    onChange={(e) => setStudentMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid #005C5B',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#07324A', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={visibleToStudent}
                        onChange={(e) => setVisibleToStudent(e.target.checked)}
                        style={{ accentColor: '#005C5B', width: '16px', height: '16px' }}
                      />
                      ☑ Visible to Student
                    </label>

                    <button type="submit" className="btn-admin-primary" style={{ backgroundColor: '#005C5B', padding: '8px 16px', fontSize: '0.82rem' }}>
                      Send to Student →
                    </button>
                  </div>
                </form>
              </div>

              {/* Student Documents Management */}
              <div className="admin-card">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#07324A', marginBottom: '8px' }}>
                  Student Document Checklist
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>
                  Update verification status or request document uploads from the student.
                </p>

                {docMsgSent && (
                  <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>
                    ✓ Document status updated & synced to student!
                  </div>
                )}

                <form onSubmit={handleUpdateStudentDoc} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                      DOCUMENT TYPE
                    </label>
                    <select
                      value={selectedDocName}
                      onChange={(e) => setSelectedDocName(e.target.value)}
                      className="admin-input"
                      style={{ width: '100%' }}
                    >
                      <option value="Admission Letter">Admission Letter</option>
                      <option value="Academic Records">Academic Records</option>
                      <option value="Income Proof & IT Returns">Income Proof & IT Returns</option>
                      <option value="Passport Copy">Passport Copy</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                      STATUS
                    </label>
                    <select
                      value={selectedDocStatus}
                      onChange={(e) => setSelectedDocStatus(e.target.value)}
                      className="admin-input"
                      style={{ width: '100%' }}
                    >
                      <option value="VERIFIED">✓ Verified</option>
                      <option value="PENDING">🟡 Pending Review</option>
                      <option value="ACTION_REQUIRED">⚠ Action Required (Upload Needed)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#07324A', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={docVisibleToStudent}
                        onChange={(e) => setDocVisibleToStudent(e.target.checked)}
                        style={{ accentColor: '#005C5B', width: '16px', height: '16px' }}
                      />
                      ☑ Visible to Student
                    </label>

                    <button type="submit" className="btn-admin-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                      Update Document
                    </button>
                  </div>
                </form>
              </div>

              {/* Activity Timeline Card */}
              <div className="admin-card">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#07324A', marginBottom: '16px' }}>
                  Activity & Audit History Log
                </h4>
                <ActivityTimeline activities={lead.activities} />
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Schedule Follow-up Modal */}
      {showFollowUpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(7, 50, 74, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div className="admin-card" style={{ maxWidth: '420px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#07324A', marginBottom: '16px' }}>
              Schedule Student Follow-up
            </h3>
            
            <form onSubmit={handleScheduleFollowUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#07324A', marginBottom: '4px' }}>
                  Follow-up Date
                </label>
                <input
                  type="date"
                  required
                  className="admin-input"
                  style={{ width: '100%' }}
                  value={followupDate}
                  onChange={(e) => setFollowupDate(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#07324A', marginBottom: '4px' }}>
                  Follow-up Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 11:30 AM"
                  className="admin-input"
                  style={{ width: '100%' }}
                  value={followupTime}
                  onChange={(e) => setFollowupTime(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#07324A', marginBottom: '4px' }}>
                  Follow-up Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Call to confirm parent salary slip upload..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    fontFamily: 'inherit',
                    fontSize: '0.85rem'
                  }}
                  value={followupNotes}
                  onChange={(e) => setFollowupNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 700, color: '#64748B' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  Save Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeadDetail;
