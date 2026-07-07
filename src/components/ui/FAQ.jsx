'use client';

import { useState } from 'react';

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
    <section className="section" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container">
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
