import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const EligibilityModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    targetCountry: 'USA',
    loanAmount: '30-50 Lakhs'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={56} color="#166534" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#0A4D4E', marginBottom: '8px' }}>Assessment Request Sent!</h3>
            <p style={{ color: '#64748B' }}>
              Our loan specialist will analyze your profile and contact you within 2 hours.
            </p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: '1.4rem', color: '#0A4D4E', marginBottom: '8px' }}>
              Check Education Loan Eligibility
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '20px' }}>
              Fill in your details for instant eligibility criteria matching across 15+ Banks & NBFCs.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anish Kumar"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Target Destination</label>
                <select
                  className="form-select"
                  value={formData.targetCountry}
                  onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                >
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Germany">Germany</option>
                  <option value="India">India</option>
                  <option value="Other">Other Country</option>
                </select>
              </div>

              <div className="form-group">
                <label>Required Loan Amount</label>
                <select
                  className="form-select"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                >
                  <option value="Below 20 Lakhs">Below ₹20 Lakhs</option>
                  <option value="20-35 Lakhs">₹20 - ₹35 Lakhs</option>
                  <option value="35-50 Lakhs">₹35 - ₹50 Lakhs</option>
                  <option value="50-75 Lakhs">₹50 - ₹75 Lakhs</option>
                  <option value="Above 75 Lakhs">Above ₹75 Lakhs</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary form-submit-btn" style={{ marginTop: '12px' }}>
                Check Instant Eligibility →
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EligibilityModal;
