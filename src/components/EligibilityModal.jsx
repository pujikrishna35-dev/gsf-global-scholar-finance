import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, ShieldCheck, Check, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EligibilityModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Real Twilio OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'USA',
    loanAmount: '2000000',
    qualificationLevel: 'PG',    // 'UG' | 'PG'
    admissionStatus: 'CONFIRMED', // 'CONFIRMED' | 'PROCESSING'
    planningStage: 'CURRENT',     // 'CURRENT' | 'NEXT' | 'FUTURE'
    collegeSelected: 'No',        // 'Yes' | 'No'
    collegeName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Handle 30-second Resend OTP Cooldown Timer
  useEffect(() => {
    if (cooldownSec > 0) {
      const timer = setTimeout(() => setCooldownSec((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSec]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const classificationMap = {
    CURRENT: 'HOT',
    NEXT: 'MEDIUM',
    FUTURE: 'COLD'
  };

  // Reset OTP verification immediately if student modifies mobile number
  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setFormData((prev) => ({ ...prev, phone: newPhone }));

    if (otpVerified || otpSent) {
      setOtpVerified(false);
      setOtpSent(false);
      setOtpInput('');
      setCooldownSec(0);
      setOtpError('Mobile number changed. Please verify your new mobile number.');
    } else {
      setOtpError('');
    }
  };

  // Request Twilio OTP Send
  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.trim().length < 8) {
      setOtpError('Please enter a valid mobile number first.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch(`${API_BASE}/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setCooldownSec(30); // 30s cooldown
      } else {
        setOtpError(data.message || 'Failed to send OTP. Please check your phone number.');
      }
    } catch (err) {
      setOtpError('Network error connecting to backend OTP service.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP via Backend / Twilio Verify
  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.trim().length < 4) {
      setOtpError('Please enter the verification code sent to your mobile.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch(`${API_BASE}/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, code: otpInput })
      });
      const data = await res.json();

      if (data.success) {
        setOtpVerified(true);
        setOtpError('');
      } else {
        setOtpError(data.message || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      setOtpError('Network error verifying OTP code.');
    } finally {
      setOtpLoading(false);
    }
  };

  const submitLead = async (data) => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to submit loan application.');
    }
    return await res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // CRITICAL SUBMISSION BLOCK: Reject submission if mobile OTP is not verified
    if (!otpVerified) {
      setOtpError('Please verify your mobile number with OTP before submitting your application.');
      return;
    }

    setLoading(true);

    const leadClassification = classificationMap[formData.planningStage] || 'MEDIUM';

    const payload = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      otpVerified: true,
      destination: formData.country,
      country: formData.country,
      university: formData.collegeSelected === 'Yes' ? formData.collegeName : '',
      course: formData.qualificationLevel === 'PG' ? 'Postgraduate (PG)' : 'Undergraduate (UG)',
      intake: formData.planningStage === 'CURRENT' ? 'Current/Immediate' : formData.planningStage === 'NEXT' ? 'Next Intake' : 'Future Intake',
      loanAmount: Number(formData.loanAmount) || 2000000,
      loanType: 'Non-Collateral',
      hasCollateral: false,
      studentSelectedClassification: leadClassification,
      leadClassification: leadClassification,
      planningStage: formData.planningStage,
      collegeSelected: formData.collegeSelected,
      collegeName: formData.collegeName,
      qualificationLevel: formData.qualificationLevel,
      admissionStatus: formData.admissionStatus,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      source: 'GSF Website Popup'
    };

    try {
      await submitLead(payload);
      setSubmitted(true);
    } catch (err) {
      setOtpError(err.message || 'Application submission failed. Ensure mobile is verified.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpInput('');
    setOtpError('');
    setCooldownSec(0);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: 'USA',
      loanAmount: '2000000',
      qualificationLevel: 'PG',
      admissionStatus: 'CONFIRMED',
      planningStage: 'CURRENT',
      collegeSelected: 'No',
      collegeName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={handleResetAndClose}
          aria-label="Close form"
        >
          &times;
        </button>

        {submitted ? (
          <div className="success-container">
            <div className="success-icon">
              <CheckCircle size={40} />
            </div>
            <h3 className="success-title">Thank You!</h3>
            <p className="success-desc">
              Your verified application details have been received. Our education loan expert will contact you shortly.
            </p>
            <button
              onClick={handleResetAndClose}
              className="popup-submit-btn"
              style={{ marginTop: '16px', height: '42px', width: '200px' }}
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2 className="modal-title">Study Abroad Loan Application</h2>
              <p className="modal-subtitle">Fill in your details to check eligibility and get expert guidance</p>
            </div>

            <form onSubmit={handleSubmit} className="popup-form">

              {/* Field 1: Full Name */}
              <div className="popup-form-group">
                <label className="popup-label">Full Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  className="popup-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              {/* Field 2: Email */}
              <div className="popup-form-group">
                <label className="popup-label">Email*</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  className="popup-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Field 3: Mobile Number & Twilio OTP Verification */}
              <div className="popup-form-group">
                <label className="popup-label">Mobile Number*</label>

                {!otpVerified ? (
                  <div className="otp-input-wrapper">
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="popup-input"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                    />

                    <button
                      type="button"
                      disabled={otpLoading || cooldownSec > 0}
                      onClick={handleSendOtp}
                      className="otp-action-btn"
                      style={{ opacity: (otpLoading || cooldownSec > 0) ? 0.6 : 1 }}
                    >
                      {otpLoading
                        ? 'Sending...'
                        : cooldownSec > 0
                          ? `Resend in ${cooldownSec}s`
                          : otpSent
                            ? 'Resend OTP'
                            : 'Send OTP'}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="tel"
                      readOnly
                      className="popup-input"
                      value={formData.phone}
                      style={{ backgroundColor: '#F8FAFC', color: '#07324A', fontWeight: 700, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setOtpVerified(false);
                        setOtpSent(false);
                      }}
                      style={{ fontSize: '0.78rem', color: '#64748B', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Change Number
                    </button>
                  </div>
                )}

                {/* OTP Verification Step */}
                {otpSent && !otpVerified && (
                  <div style={{ marginTop: '8px', backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <label className="popup-label" style={{ fontSize: '0.82rem', marginBottom: '6px' }}>Enter SMS OTP*</label>
                    <div className="otp-input-wrapper">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit code"
                        className="popup-input"
                        style={{ height: '42px', letterSpacing: '2px', fontWeight: 700 }}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                      />
                      <button
                        type="button"
                        disabled={otpLoading}
                        onClick={handleVerifyOtp}
                        className="otp-action-btn"
                        style={{ height: '42px', backgroundColor: '#005C5B' }}
                      >
                        {otpLoading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Verified Success Badge */}
                {otpVerified && (
                  <div className="otp-verified-badge">
                    <Check size={16} /> Mobile Number Verified
                  </div>
                )}

                {otpError && (
                  <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 700, marginTop: '4px' }}>
                    ⚠️ {otpError}
                  </span>
                )}
              </div>

              {/* Field 4: Destination Country */}
              <div className="popup-form-group">
                <label className="popup-label">Select Destination Country*</label>
                <select
                  required
                  className="popup-select"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ireland">Ireland</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Field 5: Required Loan Amount */}
              <div className="popup-form-group">
                <label className="popup-label">How much loan amount do you require?*</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '11px', fontWeight: 700, color: '#07324A' }}>₹</span>
                  <input
                    type="number"
                    required
                    min="100000"
                    step="50000"
                    placeholder="20,00,000"
                    className="popup-input"
                    style={{ paddingLeft: '32px' }}
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                  />
                </div>
              </div>

              {/* Field 6: Qualification Level */}
              <div className="popup-form-group">
                <label className="popup-label">What are you planning to study?*</label>
                <div className="choice-button-group">
                  <button
                    type="button"
                    className={`choice-btn ${formData.qualificationLevel === 'UG' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, qualificationLevel: 'UG' })}
                  >
                    Undergraduate (UG)
                  </button>
                  <button
                    type="button"
                    className={`choice-btn ${formData.qualificationLevel === 'PG' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, qualificationLevel: 'PG' })}
                  >
                    Postgraduate (PG)
                  </button>
                </div>
              </div>

              {/* Field 7: Admission Status */}
              <div className="popup-form-group">
                <label className="popup-label">Admission Status*</label>
                <div className="choice-button-group">
                  <button
                    type="button"
                    className={`choice-btn ${formData.admissionStatus === 'CONFIRMED' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, admissionStatus: 'CONFIRMED' })}
                  >
                    Confirmed
                  </button>
                  <button
                    type="button"
                    className={`choice-btn ${formData.admissionStatus === 'PROCESSING' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, admissionStatus: 'PROCESSING' })}
                  >
                    Processing
                  </button>
                </div>
              </div>

              {/* Field 8: Lead Planning Stage */}
              <div className="popup-form-group">
                <label className="popup-label">When are you planning to study abroad?*</label>
                <div className="planning-stage-options">

                  {/* Option 1: Current / Immediate */}
                  <div
                    className={`planning-card ${formData.planningStage === 'CURRENT' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, planningStage: 'CURRENT' })}
                  >
                    <input
                      type="radio"
                      name="planningStage"
                      checked={formData.planningStage === 'CURRENT'}
                      onChange={() => setFormData({ ...formData, planningStage: 'CURRENT' })}
                      className="planning-radio"
                    />
                    <div className="planning-text">
                      <span className="planning-title">🔥 Current / Immediate Intake</span>
                      <span className="planning-desc">
                        I have selected my college/university and want to go in the current or nearest intake.
                      </span>
                    </div>
                  </div>

                  {/* Option 2: Next Intake */}
                  <div
                    className={`planning-card ${formData.planningStage === 'NEXT' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, planningStage: 'NEXT' })}
                  >
                    <input
                      type="radio"
                      name="planningStage"
                      checked={formData.planningStage === 'NEXT'}
                      onChange={() => setFormData({ ...formData, planningStage: 'NEXT' })}
                      className="planning-radio"
                    />
                    <div className="planning-text">
                      <span className="planning-title">🟡 Next Intake</span>
                      <span className="planning-desc">
                        I am planning to go in the next intake.
                      </span>
                    </div>
                  </div>

                  {/* Option 3: Future Intake */}
                  <div
                    className={`planning-card ${formData.planningStage === 'FUTURE' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, planningStage: 'FUTURE' })}
                  >
                    <input
                      type="radio"
                      name="planningStage"
                      checked={formData.planningStage === 'FUTURE'}
                      onChange={() => setFormData({ ...formData, planningStage: 'FUTURE' })}
                      className="planning-radio"
                    />
                    <div className="planning-text">
                      <span className="planning-title">🔵 Planning for Future</span>
                      <span className="planning-desc">
                        I am interested in studying abroad but planning for a future intake.
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Conditional College Field (Shown when Current / Immediate Intake is selected) */}
              {formData.planningStage === 'CURRENT' && (
                <div className="popup-form-group" style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <label className="popup-label">Have you selected your college/university?*</label>
                  <div className="choice-button-group">
                    <button
                      type="button"
                      className={`choice-btn ${formData.collegeSelected === 'Yes' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, collegeSelected: 'Yes' })}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`choice-btn ${formData.collegeSelected === 'No' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, collegeSelected: 'No' })}
                    >
                      No
                    </button>
                  </div>

                  {formData.collegeSelected === 'Yes' && (
                    <div style={{ marginTop: '12px' }}>
                      <label className="popup-label" style={{ fontSize: '0.8rem' }}>College / University Name*</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Northeastern University"
                        className="popup-input"
                        style={{ height: '40px', marginTop: '4px' }}
                        value={formData.collegeName}
                        onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Field 9: Student Address Information */}
              <div className="popup-form-group" style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
                <label className="popup-label" style={{ fontSize: '0.92rem', marginBottom: '8px' }}>Student Residence Address</label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Address Line 1 (Flat, House No., Street)*"
                    className="popup-input"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  />

                  <input
                    type="text"
                    placeholder="Address Line 2 (Apartment, Area - Optional)"
                    className="popup-input"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  />

                  <div className="form-row-2col">
                    <input
                      type="text"
                      required
                      placeholder="City*"
                      className="popup-input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    <input
                      type="text"
                      required
                      placeholder="State*"
                      className="popup-input"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>

                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    placeholder="PIN Code (6 digits)*"
                    className="popup-input"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit CTA - Strictly Disabled Unless OTP is Verified */}
              <button
                type="submit"
                disabled={!otpVerified || loading}
                className="popup-submit-btn"
                style={{
                  opacity: !otpVerified ? 0.6 : 1,
                  cursor: !otpVerified ? 'not-allowed' : 'pointer',
                  backgroundColor: !otpVerified ? '#94A3B8' : '#005C5B'
                }}
              >
                {!otpVerified
                  ? 'Verify Mobile OTP to Submit'
                  : loading
                    ? 'Submitting Application...'
                    : 'Submit Loan Application →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EligibilityModal;
