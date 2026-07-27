'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import JsonLdScript from './JsonLdScript';
import { getFaqSchema } from '@/lib/schema';

export default function FaqSection({ faqs = [], title = "Frequently Asked Questions", subtitle = "Find clear answers to common questions about NoSky solutions." }) {
  const [openIndices, setOpenIndices] = useState([0]);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const schema = getFaqSchema(faqs);

  return (
    <section className="section bg-opacity-30 my-12" id="faq">
      <JsonLdScript data={schema} />
      <div className="container container-narrow">
        <div className="text-center mb-10">
          <div className="badge badge-accent mb-4 inline-flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>FAQ & Specifications</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">{title}</h2>
          {subtitle && <p className="text-gray-400 max-w-xl mx-auto">{subtitle}</p>}
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="border border-white/10 rounded-xl bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-lg text-white pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-gray-300 text-base leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
