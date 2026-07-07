'use client';

import { useState, useEffect } from 'react';

export default function HomeClient() {
  const [backupCount, setBackupCount] = useState(0);
  const [currentAction, setCurrentAction] = useState('Encrypting...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const actions = ['Encrypting...', 'Backing up...', 'Verifying integrity...', 'Write-locking...', 'Complete ✓'];
    let actionIndex = 0;

    const actionInterval = setInterval(() => {
      actionIndex = (actionIndex + 1) % actions.length;
      setCurrentAction(actions[actionIndex]);
    }, 2000);

    const countInterval = setInterval(() => {
      setBackupCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 15 + 5;
      });
    }, 1500);

    return () => {
      clearInterval(actionInterval);
      clearInterval(countInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="hero-illustration">
      {/* Dashboard mockup */}
      <div style={{
        width: '100%',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 'var(--space-3)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            NoSky Dashboard
          </div>
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
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
          <div style={{
            background: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-3)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-accent)' }}>
              {12 + Math.floor(backupCount / 10)}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Workloads</div>
          </div>
          <div style={{
            background: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-3)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-success)' }}>0</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Issues</div>
          </div>
          <div style={{
            background: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-3)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-blue)' }}>2m</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Last backup</div>
          </div>
        </div>

        {/* Current action */}
        <div style={{
          background: 'var(--color-bg-primary)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
          }}>
            🔒
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>
              {currentAction}
            </div>
            <div style={{
              height: 3,
              background: 'var(--color-bg-tertiary)',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(progress, 100)}%`,
                background: 'var(--gradient-accent)',
                borderRadius: 2,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Backup entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {[
            { name: 'production-db', size: '2.4 GB', status: '✓' },
            { name: 'mail-server', size: '890 MB', status: '✓' },
            { name: 'file-share', size: '12.1 GB', status: '⟳' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              padding: 'var(--space-2) 0',
              borderBottom: i < 2 ? '1px solid rgba(148,163,184,0.06)' : 'none',
            }}>
              <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                {item.name}
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>{item.size}</span>
              <span style={{ color: item.status === '✓' ? 'var(--color-success)' : 'var(--color-accent)' }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
