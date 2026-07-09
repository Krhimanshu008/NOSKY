'use client';

import { useState, useEffect, useRef } from 'react';

export default function HomeClient() {
  const [backupCount, setBackupCount] = useState(0);
  const [networkSpeed, setNetworkSpeed] = useState({ up: 450, down: 12 });
  const [totalStorageGB, setTotalStorageGB] = useState(45200);
  
  // Track active backup with target and current size
  // Unified state for backups to prevent StrictMode side-effect duplication
  const [backupState, setBackupState] = useState({
    active: { name: 'file-share', current: 4.2, target: 7.5 },
    completed: [
      { name: 'archive-vol-1', size: '12.8 GB', status: '✓' },
      { name: 'redis-memory-dump', size: '4.1 GB', status: '✓' },
      { name: 'production-db', size: '2.4 GB', status: '✓' },
      { name: 'mail-server', size: '890 MB', status: '✓' },
    ],
    logs: [
      { id: 1, time: '10:42:01', type: '[SYSTEM]', color: 'var(--color-success)', message: 'production-db object-lock applied (7 days)', highlight: true },
      { id: 2, time: '10:41:15', type: '[AUTH]', color: 'var(--color-blue)', message: 'Access key rotated (user: admin@nosky)', highlight: false },
      { id: 3, time: '10:35:12', type: '[BACKUP]', color: 'var(--color-success)', message: 'file-share incremental backup completed (45MB)', highlight: true },
      { id: 4, time: '10:15:00', type: '[SYSTEM]', color: 'var(--color-blue)', message: 'Integrity check passed for 14 workloads', highlight: false },
      { id: 5, time: '09:55:22', type: '[ALERT]', color: 'var(--color-accent)', message: '⚠ Unusual read volume detected on mail-server (Investigating)', highlight: true, bg: 'rgba(245, 166, 35, 0.05)' },
      { id: 6, time: '09:56:05', type: '[SYSTEM]', color: 'var(--color-success)', message: 'Threat neutralized. No ransomware signatures found.', highlight: false }
    ]
  });
  
  // Derived state for synchronized animation
  const percentage = Math.min(100, (backupState.active.current / backupState.active.target) * 100);
  const progress = percentage;
  let currentAction = 'Encrypting...';
  if (percentage >= 100) currentAction = 'Complete ✓';
  else if (percentage > 95) currentAction = 'Verifying integrity...';
  else if (percentage > 40) currentAction = `Backing up... (${backupState.active.current.toFixed(1)} GB / ${backupState.active.target.toFixed(1)} GB)`;
  else if (percentage > 20) currentAction = 'Write-locking...';
  
  const totalStorageTB = (totalStorageGB / 1000).toFixed(4);
  const percentageStorage = Math.min(100, (totalStorageGB / 100000) * 100);

  const backupListRef = useRef(null);
  
  // Auto-scroll backup list to bottom when new items are added
  useEffect(() => {
    if (backupListRef.current) {
      backupListRef.current.scrollTop = backupListRef.current.scrollHeight;
    }
  }, [backupState.completed.length]);
  
  // New state for interactive views: 'dashboard', 'audit', or 'keys'
  const [activeView, setActiveView] = useState('dashboard');
  
  // State for interactive key rotation
  const [isRotatingKey, setIsRotatingKey] = useState(false);
  const [keySuccess, setKeySuccess] = useState(false);
  const [masterKey, setMasterKey] = useState('nsk_live_8f7d6a5c4b3a2e1d0f9g8h7j6k5l4m3n2p1q');



  const handleRotateKey = () => {
    setIsRotatingKey(true);
    setKeySuccess(false);
    
    // Simulate complex cryptographic operation
    setTimeout(() => {
      // Generate a new random-looking hash
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let newHash = 'nsk_live_';
      for (let i = 0; i < 32; i++) {
        newHash += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      setMasterKey(newHash);
      setIsRotatingKey(false);
      setKeySuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setKeySuccess(false), 3000);
    }, 2000);
  };

  useEffect(() => {
    const actions = ['Encrypting...', 'Backing up...', 'Verifying integrity...', 'Write-locking...', 'Complete ✓'];
    let actionIndex = 0;
    let taskIndex = 0;
    
    const taskNames = [
      'archive-vol-3', 'media-assets', 'db-replica-2', 'user-uploads-04', 'analytics-dump',
      'cdn-cache-nodes', 'auth-server-logs', 'crm-database-prod', 'payment-gateway-tx', 'k8s-cluster-state',
      'legacy-storage-vm', 'syslog-archives', 'elasticsearch-index', 'redis-memory-dump', 'docker-registry-vol'
    ];
    const countInterval = setInterval(() => {
      setBackupCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    const networkInterval = setInterval(() => {
      const newUp = Math.floor(Math.random() * 150) + 350;
      setNetworkSpeed({
        up: newUp,
        down: Math.floor(Math.random() * 20) + 5
      });
      
      setBackupState(prev => {
        // networkSpeed is MB/s. Interval is 0.5s. Total MB transferred = newUp * 0.5
        // Convert to GB: MB / 1024
        const increment = (newUp * 0.5) / 1024;
        setTotalStorageGB(prev => prev + increment);
        const newCurrent = prev.active.current + increment;
        
        // Rollover logic: we let the current value overshoot the target by 0.6 to create a ~1.5s "Complete ✓" pause
        if (newCurrent >= prev.active.target + 0.6) {
          const nextName = taskNames[taskIndex];
          taskIndex = (taskIndex + 1) % taskNames.length;
          
          const newTarget = Math.random() * (45 - 5) + 5; // 5-45 GB target
          const newStart = Math.random() * (2 - 0.5) + 0.5; // Starts from 0.5-2 GB
          
          const newlyCompleted = { name: prev.active.name, size: `${prev.active.target.toFixed(1)} GB`, status: '✓' };
          const nextCompleted = [...prev.completed, newlyCompleted];
          
          // Keep up to 20 completed items for scrolling
          if (nextCompleted.length > 20) {
            nextCompleted.shift();
          }
          
          const now = new Date();
          const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          
          const newLog = {
            id: Date.now(),
            time: timeString,
            type: '[BACKUP]',
            color: 'var(--color-success)',
            message: `${prev.active.name} fully encrypted and synced (${prev.active.target.toFixed(1)} GB)`,
            highlight: true
          };
          const nextLogs = [newLog, ...prev.logs].slice(0, 50);
          
          return {
            active: { name: nextName, current: newStart, target: newTarget },
            completed: nextCompleted,
            logs: nextLogs
          };
        }
        
        return {
          ...prev,
          active: { ...prev.active, current: newCurrent }
        };
      });
    }, 500);

    return () => {
      clearInterval(countInterval);
      clearInterval(networkInterval);
    };
  }, []);

  return (
    <div className="hero-illustration">
      <div style={{
        width: '100%',
        height: '100%',
        minHeight: '480px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        
        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 'var(--space-3)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{ 
            fontSize: 'var(--text-xl)', 
            fontWeight: 800, 
            fontFamily: 'var(--font-sans)',
            letterSpacing: 'var(--tracking-tight)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            cursor: 'pointer'
          }} onClick={() => setActiveView('dashboard')}>
            <span style={{ color: 'var(--color-accent)', filter: 'drop-shadow(0 0 8px var(--color-accent-glow))' }}>⬡</span>
            <span className="text-gradient">{
              activeView === 'audit' ? 'Audit Logs' : 
              activeView === 'keys' ? 'Key Management' : 
              'NoSky Dashboard'
            }</span>
          </div>
          {activeView === 'dashboard' && (
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)',
                display: 'inline-block', animation: 'pulse 2s infinite'
              }} />
              All systems operational
            </div>
          )}
          {activeView !== 'dashboard' && (
            <button onClick={() => setActiveView('dashboard')} style={{
              background: 'var(--color-bg-tertiary)', border: 'none', color: 'var(--color-text-primary)',
              padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '11px', cursor: 'pointer',
              fontWeight: 600, transition: 'background 0.2s'
            }}>
              ← Back
            </button>
          )}
        </div>

        {/* --- MAIN DASHBOARD VIEW --- */}
        {activeView === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', animation: 'fadeIn 0.3s ease-in-out', flex: 1, justifyContent: 'space-between' }}>
            {/* 1. Storage Capacity & Usage Visualizer */}
            <div style={{
              background: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-2) var(--space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>Encrypted Storage Used</span>
                <span>{totalStorageTB} TB / 100 TB</span>
              </div>
              <div style={{ height: 4, background: 'var(--color-bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percentageStorage}%`, background: 'var(--color-blue)', borderRadius: 2 }} />
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
              <div style={{ background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-accent)' }}>{12 + Math.floor(backupCount / 10)}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Workloads</div>
              </div>
              <div style={{ background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-success)' }}>0</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Issues</div>
              </div>
              <div style={{ background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-blue)' }}>2m</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Last backup</div>
              </div>
            </div>

            {/* 2. Network Activity & Current Action */}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <div style={{ flex: 2, background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🔒</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>{currentAction}</div>
                  <div style={{ height: 3, background: 'var(--color-bg-tertiary)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, background: 'var(--gradient-accent)', borderRadius: 2, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1, background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                 <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Network I/O</div>
                 <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-success)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>⬆ {networkSpeed.up}</span><span style={{ fontSize: '9px', color: 'var(--color-text-secondary)' }}>MB/s</span>
                 </div>
                 <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-blue)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>⬇ {networkSpeed.down}</span><span style={{ fontSize: '9px', color: 'var(--color-text-secondary)' }}>MB/s</span>
                 </div>
              </div>
            </div>



            {/* Backup entries */}
            <div ref={backupListRef} className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '168px', overflowY: 'auto', paddingRight: '4px', scrollBehavior: 'smooth' }}>
              {[
                ...backupState.completed,
                { name: backupState.active.name, size: `${backupState.active.current.toFixed(1)} GB`, status: 'sync' },
              ].map((item, i) => (
                <div key={i} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr', 
                  alignItems: 'center', 
                  fontSize: '11px', 
                  padding: '6px 0', 
                  borderBottom: i < backupState.completed.length ? '1px solid rgba(148,163,184,0.06)' : 'none' 
                }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{item.name}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '10px', textAlign: 'center' }}>{item.size}</span>
                  <span style={{ 
                    color: item.status === '✓' ? 'var(--color-success)' : 'var(--color-accent)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                  }}>
                    {item.status === 'sync' ? (
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        style={{ width: '12px', height: '12px', animation: 'spin 2s linear infinite' }}
                      >
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                      </svg>
                    ) : (
                      item.status
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* 4. Recent Activity Log */}
            <div style={{ background: '#040508', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: '9px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: 2 }}>Recent Activity</div>
              {backupState.logs.slice(0, 2).map((log, i) => (
                <div key={log.id} style={{ color: 'var(--color-text-secondary)', display: 'flex', gap: '4px' }}>
                  <span style={{ color: 'var(--color-text-muted)', minWidth: '45px' }}>[{log.time}]</span>
                  <span style={{ color: log.color, minWidth: '10px' }}>{log.type === '[BACKUP]' ? '✓' : log.type === '[ALERT]' ? '⚠' : 'ℹ'}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- AUDIT LOGS VIEW --- */}
        {activeView === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', animation: 'fadeIn 0.3s ease-in-out', flex: 1 }}>
            
            {/* Mock Toolbar */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <div style={{ flex: 1, background: '#040508', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>🔍</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>Search events...</span>
              </div>
              <div style={{ background: '#040508', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>All Severities</span>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>▼</span>
              </div>
            </div>

            <div className="hide-scrollbar" style={{ background: '#040508', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'flex', flexDirection: 'column', height: '370px', overflowY: 'auto' }}>
              
              {backupState.logs.map((log) => (
                <div key={log.id} style={{ display: 'flex', padding: '8px', borderBottom: '1px solid rgba(148,163,184,0.1)', background: log.bg || (log.highlight ? 'rgba(16, 185, 129, 0.05)' : 'transparent') }}>
                  <span style={{ width: '60px', color: 'var(--color-text-muted)' }}>{log.time}</span>
                  <span style={{ width: '60px', color: log.color, fontWeight: 600 }}>{log.type}</span>
                  <span style={{ flex: 1, color: log.highlight ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>{log.message}</span>
                </div>
              ))}

            </div>
            <button style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', padding: '8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
              <span>Download CSV Report</span>
              <span style={{ color: 'var(--color-text-muted)' }}>↓</span>
            </button>
          </div>
        )}

        {/* --- MANAGE KEYS VIEW --- */}
        {activeView === 'keys' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', animation: 'fadeIn 0.3s ease-in-out', flex: 1 }}>
            
            {/* Premium Vault Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <div style={{ width: 48, height: 48, background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                🔐
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Zero-Knowledge Architecture</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Your private keys never leave your infrastructure.</div>
              </div>
            </div>
            
            {/* Frosted Glass Key Container */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', position: 'relative', overflow: 'hidden' }}>
              
              {/* Decorative Glow */}
              <div style={{ position: 'absolute', top: -50, right: -50, width: 100, height: 100, background: 'var(--color-accent)', filter: 'blur(60px)', opacity: 0.15, borderRadius: '50%' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Active Master Key</div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  Military Grade
                </div>
              </div>
              
              <div style={{ background: '#040508', padding: 'var(--space-3)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-primary)', wordBreak: 'break-all', border: '1px solid var(--color-border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                {masterKey}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: 'var(--color-blue)' }}>⚡</span> Algorithm: AES-256-GCM</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⏱ Expires in: 89 days</span>
              </div>
            </div>

            {/* Interactive Rotation Button */}
            <button 
              onClick={handleRotateKey}
              disabled={isRotatingKey}
              style={{ 
                background: isRotatingKey ? 'var(--color-bg-tertiary)' : keySuccess ? 'rgba(16, 185, 129, 0.1)' : 'var(--gradient-accent)', 
                border: keySuccess ? '1px solid var(--color-success)' : 'none', 
                color: isRotatingKey ? 'var(--color-text-muted)' : keySuccess ? 'var(--color-success)' : '#0A0E1A', 
                padding: '12px', 
                borderRadius: 'var(--radius-sm)', 
                fontSize: '12px', 
                fontWeight: 700, 
                cursor: isRotatingKey ? 'not-allowed' : 'pointer', 
                boxShadow: isRotatingKey || keySuccess ? 'none' : 'var(--shadow-glow)', 
                transition: 'all 0.3s ease', 
                marginTop: 'var(--space-2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isRotatingKey ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                  Generating Entropy...
                </>
              ) : keySuccess ? (
                <>
                  <span>✓</span> Key Rotated Successfully
                </>
              ) : (
                'Rotate Master Key Now'
              )}
            </button>
            
            {/* Note about spinning animation - inline style animation requires keyframes which we add via globals.css normally, 
                but simple text rotation works ok for mockup, or we just rely on text change */}
          </div>
        )}

        {/* 5. Quick Action Buttons (Always visible at bottom for dashboard view) */}
        {activeView === 'dashboard' && (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button style={{
              flex: 1, background: 'var(--color-accent-light)', color: 'var(--color-accent)',
              border: '1px solid rgba(245, 166, 35, 0.2)', borderRadius: 'var(--radius-sm)',
              padding: '6px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}>Force Sync</button>
            <button onClick={() => setActiveView('audit')} style={{
              flex: 1, background: 'transparent', color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
              padding: '6px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}>Audit Logs</button>
            <button onClick={() => setActiveView('keys')} style={{
              flex: 1, background: 'transparent', color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
              padding: '6px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}>Manage Keys</button>
          </div>
        )}

      </div>
    </div>
  );
}
