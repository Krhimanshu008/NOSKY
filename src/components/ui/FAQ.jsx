'use client';

import { useState } from 'react';
import { sanitizeJsonLd } from '@/lib/sanitize';

export default function FAQ({ items, sectionTitle, sectionSub }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Generate FAQPage schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="section" id="faq" style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0a0d14 0%, #050608 100%)',
      borderTop: '1px solid rgba(255,255,255,0.03)'
    }}>
      {/* Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '600px',
        background: 'radial-gradient(ellipse at top, rgba(245, 166, 35, 0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(faqSchema) }}
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {sectionTitle && (
          <div className="section-header">
            <span className="badge badge-accent">FAQ</span>
            <h2>{sectionTitle}</h2>
            {sectionSub && <p>{sectionSub}</p>}
          </div>
        )}
        <div className="faq-list">
          {items.map((item, index) => (
            <div
              key={index}
              className={`faq-item glass ${activeIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggle(index)}
                aria-expanded={activeIndex === index}
                id={`faq-question-${index}`}
              >
                <span>{item.question}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer" role="region" aria-labelledby={`faq-question-${index}`}>
                <div className="faq-answer-content">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
