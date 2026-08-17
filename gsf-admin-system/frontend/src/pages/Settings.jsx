import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ShieldCheck, MessageSquare, Mail, Smartphone, Database, CheckCircle2, BellRing, Volume2, VolumeX, Play, Square, Save, Sliders } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { SOUND_OPTIONS, notificationSoundService } from '../services/notificationSoundService';

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const {
    soundEnabled,
    selectedSound: contextSelectedSound,
    notificationVolume: contextVolume,
    saveSoundSettings,
    triggerTestNotification
  } = useNotifications();

  // Local form state for settings section
  const [localEnabled, setLocalEnabled] = useState(soundEnabled);
  const [localSelectedSound, setLocalSelectedSound] = useState(contextSelectedSound);
  const [localVolume, setLocalVolume] = useState(contextVolume);
  const [playingPreviewId, setPlayingPreviewId] = useState(null);

  const handlePreviewToggle = (soundId) => {
    if (playingPreviewId === soundId) {
      notificationSoundService.stopPreview();
      setPlayingPreviewId(null);
    } else {
      setPlayingPreviewId(soundId);
      notificationSoundService.previewNotificationSound(soundId, localVolume, () => {
        setPlayingPreviewId(null);
      });
    }
  };

  const handleSaveSoundSettings = (e) => {
    e.preventDefault();
    notificationSoundService.stopPreview();
    setPlayingPreviewId(null);

    saveSoundSettings(localEnabled, localSelectedSound, localVolume);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header title="System Settings & API Configurations" />

        <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '840px' }}>
          
          {saved && (
            <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '12px 16px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> Notification sound settings saved successfully!
            </div>
          )}

          {/* Notification Settings -> New Loan Enquiry Notifications */}
          <div className="admin-card">
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#07324A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <BellRing size={22} color="#005C5B" /> Notification Settings
              </h2>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#005C5B' }}>
                New Loan Enquiry Notifications
              </span>
            </div>

            <form onSubmit={handleSaveSoundSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* 1. Enable / Disable Sound */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.96rem', fontWeight: 800, color: '#07324A' }}>
                    {localEnabled ? <Volume2 size={20} color="#005C5B" /> : <VolumeX size={20} color="#94A3B8" />} Notification Sound
                  </label>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
                    Play an audio chime when a new student loan enquiry is submitted.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setLocalEnabled(!localEnabled)}
                  style={{
                    backgroundColor: localEnabled ? '#005C5B' : '#CBD5E1',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '24px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: localEnabled ? '0 2px 8px rgba(0, 92, 91, 0.3)' : 'none'
                  }}
                >
                  {localEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* 2. Select Notification Sound (6 Uploaded Options) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, color: '#07324A', marginBottom: '12px' }}>
                  Select Notification Sound
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {SOUND_OPTIONS.map((sound) => {
                    const isSelected = localSelectedSound === sound.id;
                    const isPlaying = playingPreviewId === sound.id;

                    return (
                      <div
                        key={sound.id}
                        onClick={() => setLocalSelectedSound(sound.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #005C5B' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#F0FDFA' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="radio"
                            name="selectedNotificationSound"
                            value={sound.id}
                            checked={isSelected}
                            onChange={() => setLocalSelectedSound(sound.id)}
                            style={{ accentColor: '#005C5B', cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                          <div>
                            <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: isSelected ? 800 : 600, color: '#07324A' }}>
                              {sound.name}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                              {sound.format.split('/')[1]}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewToggle(sound.id);
                          }}
                          style={{
                            backgroundColor: isPlaying ? '#07324A' : '#E6F4F3',
                            color: isPlaying ? '#FFFFFF' : '#005C5B',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isPlaying ? <Square size={12} fill="#FFF" /> : <Play size={12} fill="#005C5B" />}
                          {isPlaying ? 'Stop' : 'Preview'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Notification Volume Slider */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.92rem', fontWeight: 800, color: '#07324A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={18} color="#005C5B" /> Notification Volume
                  </label>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#005C5B', backgroundColor: '#E6F4F3', padding: '2px 10px', borderRadius: '12px' }}>
                    {Math.round(localVolume * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={localVolume}
                  onChange={(e) => setLocalVolume(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#005C5B', cursor: 'pointer' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={triggerTestNotification}
                  style={{
                    backgroundColor: '#07324A',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <BellRing size={16} /> Test Notification
                </button>

                <button
                  type="submit"
                  className="btn-admin-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>

            </form>
          </div>

          {/* Website API Integration Status */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#07324A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="#005C5B" /> GSF Website API Endpoint Readiness
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '16px' }}>
              The backend REST API is configured to receive student lead submissions directly from the main website form.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.88rem', color: '#07324A', border: '1px solid #E2E8F0' }}>
              POST http://localhost:5000/api/leads
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
