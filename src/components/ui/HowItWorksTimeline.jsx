'use client';

import React, { useEffect, useRef } from 'react';
import './HowItWorksTimeline.css';

export default function HowItWorksTimeline() {
  const timelineRef = useRef(null);
  const progressFillRef = useRef(null);
  const progressSvgRef = useRef(null);
  const trackRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const timeline = timelineRef.current;
    const progressFill = progressFillRef.current;
    const progressSvg = progressSvgRef.current;
    const track = trackRef.current;
    const stepEls = stepsRef.current.filter(Boolean);

    if (!progressFill || !timeline) return;

    // Reveal cards when they enter viewport
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -80px 0px' });

    stepEls.forEach(step => revealObserver.observe(step));

    // Cache node measurements to avoid querying the DOM and calculating layouts on every scroll event
    let nodeMeasurements = [];

    function measureNodes() {
      const timelineRect = timeline.getBoundingClientRect();
      nodeMeasurements = stepEls.map(step => {
        const node = step.querySelector('.how-step-node');
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return {
          offset: r.top - timelineRect.top,
          height: r.height
        };
      });
    }

    // Progress line + active node based on scroll position
    function updateProgress() {
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;

      const start = viewportH * 0.9;
      const end = viewportH * 0.3;

      const total = rect.height;
      let progress = (start - rect.top) / (total + start - end);
      progress = Math.max(0, Math.min(1, progress));

      const length = timeline.offsetHeight || 1000;
      progressFill.style.strokeDasharray = length;
      progressFill.style.strokeDashoffset = length * (1 - progress);

      // Determine active step
      const centerY = viewportH * 0.45;
      let activeIdx = -1;
      let minDist = Infinity;

      stepEls.forEach((step, i) => {
        const m = nodeMeasurements[i];
        if (!m) return;

        const nodeTop = rect.top + m.offset;
        const nodeCenter = nodeTop + m.height / 2;
        const dist = Math.abs(nodeCenter - centerY);

        if (nodeCenter < centerY + 80 && dist < minDist) {
          minDist = dist;
          activeIdx = i;
        }
      });

      stepEls.forEach((step, i) => {
        step.classList.toggle('active', i === activeIdx);
      });
    }

    // Sync SVG viewBox to timeline height
    function syncSvgHeight() {
      const h = timeline.offsetHeight;
      if (h > 0 && progressSvg && track && progressFill) {
        progressSvg.setAttribute('viewBox', `0 0 4 ${h}`);
        track.setAttribute('y2', h);
        progressFill.setAttribute('y2', h);
        progressFill.style.strokeDasharray = h;
        progressFill.style.strokeDashoffset = h;
      }
    }

    measureNodes();
    syncSvgHeight();
    updateProgress();

    const handleResize = () => {
      measureNodes();
      syncSvgHeight();
      updateProgress();
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
    };
  }, []);

  return (
    <section className="how-section" id="how-it-works">
      {/* Background ambience */}
      <div className="how-bg-glow" aria-hidden="true"></div>


      <div className="how-section-inner">
        <div className="how-head">
          <span className="how-pill">
            <span className="how-pill-dot"></span>
            SIMPLE SETUP
          </span>
          <h2 className="how-title">How <span className="how-title-brand">Nosky</span> works</h2>
          <p className="how-subtitle">Three steps. Ten minutes. Complete protection.</p>
        </div>

        {/* Timeline */}
        <div className="how-timeline" id="how-timeline" ref={timelineRef}>

          {/* Progress line SVG */}
          <svg className="how-progress-svg" ref={progressSvgRef} viewBox="0 0 4 1000" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="howProgressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee"/>
                <stop offset="50%" stopColor="#22d3ee"/>
                <stop offset="100%" stopColor="#ffb84d"/>
              </linearGradient>
            </defs>
            <line className="how-progress-track" ref={trackRef} x1="2" y1="0" x2="2" y2="1000"/>
            <line className="how-progress-fill" ref={progressFillRef} x1="2" y1="0" x2="2" y2="1000"/>
          </svg>

          {/* STEP 1 */}
          <article className="how-step how-step-left" data-step="1" ref={el => stepsRef.current[0] = el}>
            <div className="how-step-node">
              <div className="how-node-ring"></div>
              <div className="how-node-core">
                <span className="how-node-num">01</span>
              </div>
            </div>

            <div className="how-step-card">
              <div className="how-step-meta">
                <span className="how-step-kicker">Step 01</span>
                <span className="how-step-time">~10 min</span>
              </div>
              <h3 className="how-step-title">Install the agent</h3>
              <p className="how-step-desc">Deploy the lightweight Nosky agent on any server or endpoint. Works on Windows, macOS, and Linux — no reboots, no downtime.</p>

              {/* Visual: install dashboard */}
              <div className="how-step-visual how-visual-install">
                <div className="how-install-head">
                  <div className="how-install-title-row">
                    <div className="how-install-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v12"/>
                        <path d="M7 10l5 5 5-5"/>
                        <path d="M5 21h14"/>
                      </svg>
                    </div>
                    <div className="how-install-title-text">
                      <div className="how-install-title">Nosky Agent</div>
                      <div className="how-install-sub">v4.2.1 &middot; 24.6 MB</div>
                    </div>
                  </div>
                  <span className="how-install-badge">
                    <span className="how-install-badge-dot"></span>
                    Installing
                  </span>
                </div>

                <div className="how-install-progress">
                  <div className="how-install-bar">
                    <div className="how-install-fill"></div>
                  </div>
                  <div className="how-install-meta">
                    <span>68% complete</span>
                    <span>~14s remaining</span>
                  </div>
                </div>

                <ul className="how-install-steps">
                  <li className="how-is-done">
                    <span className="how-is-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                    </span>
                    <span className="how-is-label">Detect platform</span>
                    <span className="how-is-value">linux/amd64</span>
                  </li>
                  <li className="how-is-done">
                    <span className="how-is-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                    </span>
                    <span className="how-is-label">Verify checksum</span>
                    <span className="how-is-value">SHA-256 ✓</span>
                  </li>
                  <li className="how-is-active">
                    <span className="how-is-icon how-is-spin">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 019 9"/></svg>
                    </span>
                    <span className="how-is-label">Configure services</span>
                    <span className="how-is-value">running…</span>
                  </li>
                  <li className="how-is-pending">
                    <span className="how-is-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg>
                    </span>
                    <span className="how-is-label">Start agent</span>
                    <span className="how-is-value">queued</span>
                  </li>
                </ul>
              </div>

              <div className="how-step-tags">
                <span className="how-tag">Windows</span>
                <span className="how-tag">macOS</span>
                <span className="how-tag">Linux</span>
                <span className="how-tag">Docker</span>
              </div>
            </div>
          </article>

          {/* STEP 2 */}
          <article className="how-step how-step-right" data-step="2" ref={el => stepsRef.current[1] = el}>
            <div className="how-step-node">
              <div className="how-node-ring"></div>
              <div className="how-node-core">
                <span className="how-node-num">02</span>
              </div>
            </div>

            <div className="how-step-card">
              <div className="how-step-meta">
                <span className="how-step-kicker">Step 02</span>
                <span className="how-step-time">Continuous</span>
              </div>
              <h3 className="how-step-title">Backups run automatically</h3>
              <p className="how-step-desc">Files, folders, databases, and VMs are backed up continuously to encrypted, immutable storage. Set policies once — Nosky handles the rest.</p>

              {/* Visual: live dashboard */}
              <div className="how-step-visual how-visual-dashboard">
                <div className="how-dash-row how-dash-header">
                  <span>Live backup jobs</span>
                  <span className="how-dash-status">
                    <span className="how-status-dot"></span>
                    Running
                  </span>
                </div>
                <div className="how-dash-job">
                  <div className="how-job-info">
                    <span className="how-job-name">production-db</span>
                    <span className="how-job-size">142 GB</span>
                  </div>
                  <div className="how-job-bar">
                    <div className="how-job-fill" style={{'--pct': '84%'}}></div>
                  </div>
                  <span className="how-job-pct">84%</span>
                </div>
                <div className="how-dash-job">
                  <div className="how-job-info">
                    <span className="how-job-name">web-server-01</span>
                    <span className="how-job-size">28 GB</span>
                  </div>
                  <div className="how-job-bar">
                    <div className="how-job-fill" style={{'--pct': '100%'}}></div>
                  </div>
                  <span className="how-job-pct done">Done</span>
                </div>
                <div className="how-dash-job">
                  <div className="how-job-info">
                    <span className="how-job-name">crm-vm-04</span>
                    <span className="how-job-size">76 GB</span>
                  </div>
                  <div className="how-job-bar">
                    <div className="how-job-fill" style={{'--pct': '47%'}}></div>
                  </div>
                  <span className="how-job-pct">47%</span>
                </div>
              </div>

              <div className="how-step-tags">
                <span className="how-tag">AES-256</span>
                <span className="how-tag">Immutable</span>
                <span className="how-tag">Policy-based</span>
              </div>
            </div>
          </article>

          {/* STEP 3 */}
          <article className="how-step how-step-left" data-step="3" ref={el => stepsRef.current[2] = el}>
            <div className="how-step-node">
              <div className="how-node-ring"></div>
              <div className="how-node-core">
                <span className="how-node-num">03</span>
              </div>
            </div>

            <div className="how-step-card">
              <div className="how-step-meta">
                <span className="how-step-kicker">Step 03</span>
                <span className="how-step-time">&lt; 15 min</span>
              </div>
              <h3 className="how-step-title">Recover in one click</h3>
              <p className="how-step-desc">Restore a single file or spin up a full VM in under 15 minutes from any point in time. Zero data loss, zero drama.</p>

              {/* Visual: restore panel */}
              <div className="how-step-visual how-visual-restore">
                <div className="how-restore-head">
                  <div className="how-restore-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1015-6.7"/>
                      <path d="M18 3v4h-4"/>
                    </svg>
                  </div>
                  <div className="how-restore-info">
                    <div className="how-restore-title">Restore point</div>
                    <div className="how-restore-time">Jun 12, 2026 · 14:32 UTC</div>
                  </div>
                  <span className="how-restore-badge">Verified</span>
                </div>
                <div className="how-restore-timeline">
                  <div className="how-rt-tick"></div>
                  <div className="how-rt-tick"></div>
                  <div className="how-rt-tick how-rt-active"></div>
                  <div className="how-rt-tick"></div>
                  <div className="how-rt-tick"></div>
                  <div className="how-rt-tick"></div>
                  <div className="how-rt-tick"></div>
                </div>
                <button className="how-restore-btn" type="button">
                  <span>Restore now</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>
                  </svg>
                </button>
              </div>

              <div className="how-step-tags">
                <span className="how-tag">Point-in-time</span>
                <span className="how-tag">Instant VM</span>
                <span className="how-tag">One-click</span>
              </div>
            </div>
          </article>

          {/* Final destination pin */}
          <div className="how-finish" aria-hidden="true">
            <div className="how-finish-pulse"></div>
            <div className="how-finish-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7"/>
              </svg>
            </div>
            <div className="how-finish-label">Complete protection</div>
          </div>
        </div>
      </div>
    </section>
  );
}
