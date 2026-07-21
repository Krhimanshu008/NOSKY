'use client';
import { useRef } from 'react';
import Lottie from 'lottie-react';
import settingsAnim from '../../../public/Micro Animations/settings.json';

export default function AdminSettingsIcon() {
  const lottieRef = useRef(null);
  return (
    <div 
      onMouseEnter={() => { lottieRef.current?.setDirection(1); lottieRef.current?.play(); }} 
      onMouseLeave={() => { lottieRef.current?.setDirection(-1); lottieRef.current?.play(); }}
      style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Lottie lottieRef={lottieRef} animationData={settingsAnim} loop={false} autoplay={false} style={{ width: '100%', height: '100%', opacity: 0.8 }} />
    </div>
  );
}
