"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Laptop, Search, GitBranch, CopyMinus, Archive, Lock, 
  ShieldCheck, Cloud, CheckCircle, History, LineChart 
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const steps = [
  { id: 1, title: "Client Device", desc: "Initiates secure backup process", icon: Laptop },
  { id: 2, title: "File Scanner", desc: "Scans for selected data blocks", icon: Search },
  { id: 3, title: "Change Detection", desc: "Identifies modified blocks (CBT)", icon: GitBranch },
  { id: 4, title: "Deduplication Engine", desc: "Removes redundant data", icon: CopyMinus },
  { id: 5, title: "Compression Engine", desc: "Shrinks data payload size", icon: Archive },
  { id: 6, title: "AES-256 Encryption", desc: "Secures data at rest and transit", icon: Lock },
  { id: 7, title: "Secure TLS Transfer", desc: "Encrypted network transmission", icon: ShieldCheck },
  { id: 8, title: "AWS Storage", desc: "Stored in secure cloud repository", icon: Cloud },
  { id: 9, title: "Backup Verification", desc: "Validates data integrity", icon: CheckCircle },
  { id: 10, title: "Recovery Point", desc: "Creates snapshot for restoration", icon: History },
  { id: 11, title: "Monitoring & Reporting", desc: "Logs metrics and health status", icon: LineChart }
];

export default function BackupPipeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // To handle responsiveness without media queries in inline styles
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Initialize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Avoid hydration mismatch by not rendering the desktop-only layout until mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Or a simple skeleton

  return (
    <div ref={containerRef} style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: 'var(--space-8) 0' }}>
      
      {/* Central Animated Line */}
      <div style={{ 
        position: 'absolute', 
        top: 'var(--space-8)', 
        bottom: 'var(--space-8)', 
        left: isMobile ? '30px' : '50%', 
        width: '2px', 
        background: 'var(--color-border)', 
        transform: isMobile ? 'none' : 'translateX(-50%)', 
        zIndex: 1 
      }}>
        <motion.div 
          style={{ 
            width: '100%', 
            height: lineHeight,
            background: 'var(--color-accent)', 
            boxShadow: '0 0 10px var(--color-accent)'
          }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isEven = idx % 2 === 0;
          
          return (
            <div key={step.id} style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'row' : (isEven ? 'row' : 'row-reverse'), 
              alignItems: 'center', 
              width: '100%', 
              position: 'relative', 
              zIndex: 2,
              gap: isMobile ? 'var(--space-6)' : '0'
            }}>
              
              {/* Content Side */}
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: isMobile ? 'flex-start' : (isEven ? 'flex-end' : 'flex-start'), 
                padding: isMobile ? '0' : (isEven ? '0 var(--space-8) 0 0' : '0 0 0 var(--space-8)'),
                order: isMobile ? 2 : 0
              }}>
                <motion.div 
                  initial={{ opacity: 0, x: isMobile ? 30 : (isEven ? -50 : 50), y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="card"
                  style={{ 
                    padding: 'var(--space-4) var(--space-6)', 
                    width: '100%', 
                    maxWidth: '350px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-secondary)',
                    position: 'relative'
                  }}
                  whileHover={{ borderColor: 'var(--color-accent)', boxShadow: 'var(--shadow-glow)' }}
                >
                  <h4 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-text-primary)' }}>{step.title}</h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{step.desc}</p>
                </motion.div>
              </div>
              
              {/* Center Node */}
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'var(--color-bg-primary)', 
                border: '2px solid var(--color-border)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                zIndex: 3,
                flexShrink: 0,
                transition: 'all 0.3s ease',
                order: isMobile ? 1 : 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.boxShadow = '0 0 15px var(--color-accent)';
                e.currentTarget.children[0].style.color = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.children[0].style.color = 'var(--color-text-muted)'; // Reverts to inherited color
              }}
              >
                <Icon size={24} style={{ color: 'var(--color-text-muted)', transition: 'color 0.3s ease' }} />
              </div>
              
              {/* Empty Space Side */}
              {!isMobile && <div style={{ flex: 1 }} />}
              
            </div>
          )
        })}
      </div>
    </div>
  )
}
