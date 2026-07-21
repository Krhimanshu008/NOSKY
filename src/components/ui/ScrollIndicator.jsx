'use client';
import Lottie from 'lottie-react';
import scrollDownAnim from '../../../public/Micro Animations/scrollDown.json';

export default function ScrollIndicator() {
  return (
    <div 
      style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-12)', paddingBottom: 'var(--space-4)', opacity: 0.6, cursor: 'pointer' }}
      onClick={() => window.scrollBy({ top: window.innerHeight - 100, behavior: 'smooth' })}
    >
      <Lottie animationData={scrollDownAnim} loop={true} style={{ width: 48, height: 48, filter: 'invert(1)' }} />
    </div>
  );
}
