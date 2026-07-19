'use client';

import React from 'react';

export default function GlassCard({ children, className = '', isHero = false, interactive = true, ...props }) {
  const handleCardMouseMove = (e) => {
    if (!interactive) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const maxTilt = isHero ? 4 : 8;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    // Shine position
    el.style.setProperty('--mx', px + '%');
    el.style.setProperty('--my', py + '%');

    // 3D tilt
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -maxTilt;
    const ry = ((x - cx) / cx) * maxTilt;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${isHero ? 0 : -6}px)`;
  };

  const handleCardMouseLeave = (e) => {
    if (!interactive) return;
    const el = e.currentTarget;
    el.style.transform = '';
  };

  return (
    <div 
      className={`glass ${className}`}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      {...props}
    >
      {interactive && <div className="card-shine"></div>}
      {children}
    </div>
  );
}
