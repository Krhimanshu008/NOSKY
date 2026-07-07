'use client';

import React from 'react';

export default function GlobalAurora() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="aurora" aria-hidden="true" style={{ position: 'absolute', inset: '-10%', filter: 'blur(70px)' }}>
        <div className="blob blob-amber"></div>
        <div className="blob blob-cyan"></div>
        <div className="blob blob-violet"></div>
      </div>
      <div className="grid-overlay" aria-hidden="true"></div>
      <div className="noise" aria-hidden="true"></div>
    </div>
  );
}
