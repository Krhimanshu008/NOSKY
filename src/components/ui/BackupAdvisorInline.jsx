'use client';
import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import Lottie from 'lottie-react';
import activityAnim from '../../../public/Micro Animations/activity.json';
import alertCircleAnim from '../../../public/Micro Animations/alertCircle.json';
import {
  hC, IC, UV, GV, _V, Rb, lq, JV
} from './advisorData';

export default function BackupAdvisorInline() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState('selection');
  const [step, setStep] = useState(1);
  const [aiText, setAiText] = useState('');
  
  // Lock body scroll when modal is expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isExpanded]);

  // Guided state
  const [industry, setIndustry] = useState(null);
  const [softwareIds, setSoftwareIds] = useState([]);
  const [customSoftware, setCustomSoftware] = useState([]);
  const [dataLocations, setDataLocations] = useState([]);
  const [teamSize, setTeamSize] = useState(null);
  const [criticality, setCriticality] = useState(null);
  
  // AI structured state
  const [aiFormats, setAiFormats] = useState([]);
  const [aiSizeBand, setAiSizeBand] = useState('');
  const [aiLocations, setAiLocations] = useState([]);
  const [aiRetention, setAiRetention] = useState('');
  const [assumptions, setAssumptions] = useState([]);

  // Search state for step 2
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState('');

  const handleStartWizard = () => {
    setMode('guided');
    setStep(1);
  };
  const handleStartAi = () => setMode('ai');

  const handleSelectIndustry = (id) => {
    setIndustry(prev => {
      const arr = Array.isArray(prev) ? prev : (prev ? [prev] : []);
      if (arr.includes(id)) return arr.filter(x => x !== id);
      if (arr.length >= 3) return arr;
      return [...arr, id];
    });
  };

  const toggleSoftware = (id) => {
    setSoftwareIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addCustomSoftware = () => {
    if (customInput.trim() && !customSoftware.includes(customInput.trim())) {
      setCustomSoftware(prev => [...prev, customInput.trim()]);
      setCustomInput('');
    }
  };

  const toggleLocation = (loc) => {
    setDataLocations(prev => 
      prev.includes(loc) ? prev.filter(x => x !== loc) : [...prev, loc]
    );
  };

  const startAnalysis = async (fromAi = false) => {
    setMode('analyzing');
    if (fromAi) {
      try {
        const payload = {
          description: aiText,
          structured: {
            formats: aiFormats,
            currentSizeBand: aiSizeBand,
            locations: aiLocations,
            retention: aiRetention
          }
        };
        const res = await fetch('/api/advisor/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error('API failed');
        const parsed = await res.json();
        
        setIndustry(parsed.industry?.[0] || 'other');
        setSoftwareIds(parsed.softwareIds || []);
        setCustomSoftware(parsed.customSoftware || []);
        setTeamSize(parsed.teamSize || '1-5');
        setCriticality(parsed.criticality || 'few-days');
        setDataLocations(parsed.dataLocations || ['Local computers']);
        setAssumptions(parsed.assumptions || []);
      } catch (err) {
        console.warn("LLM failed, using fallback JV", err);
        const parsed = JV(aiText);
        setIndustry(parsed.industry);
        setSoftwareIds(parsed.softwareIds);
        setCustomSoftware(parsed.customSoftware);
        setTeamSize(parsed.teamSize);
        setCriticality(parsed.criticality);
        setDataLocations(parsed.dataLocations || ['Local computers']);
        setAssumptions(["Used fallback system due to AI timeout. Provided details may not be fully utilized."]);
      }
      setMode('result');
      return;
    }
    setTimeout(() => {
      setMode('result');
    }, 2500);
  };

  const closeExpanded = () => {
    setIsExpanded(false);
    setTimeout(() => {
      setMode('selection');
      setStep(1);
      setIndustry(null);
      setSoftwareIds([]);
      setCustomSoftware([]);
      setDataLocations([]);
      setTeamSize(null);
      setCriticality(null);
      setAiText('');
      setAiFormats([]);
      setAiSizeBand('');
      setAiLocations([]);
      setAiRetention('');
      setAssumptions([]);
    }, 300);
  };

  // RENDERERS
  const renderSelection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ textAlign: 'center', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        Answer 5 quick questions or describe your business, and get a tailored backup plan in under a minute. Zero data loss, zero drama.
      </h3>
      
      <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
        <div style={{ background: 'var(--color-bg-tertiary)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245, 166, 35, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            </div>
            <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px' }}>5 steps</span>
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Guided Advisor</h4>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', flexGrow: 1 }}>
            Pick your industry, software and data — we map it to a precise plan.
          </p>
          <button onClick={handleStartWizard} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Start the wizard →</button>
        </div>

        <div style={{ background: 'var(--color-bg-tertiary)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245, 166, 35, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
            </div>
            <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px' }}>AI</span>
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Describe your business</h4>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', flexGrow: 1 }}>
            Tell us in plain English what you do. Our AI drafts your strategy.
          </p>
          <button onClick={handleStartAi} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Describe it →</button>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto var(--space-8) auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
        <span>Step {step} of 5</span>
        <span style={{ color: 'var(--color-accent)' }}>{step * 20}%</span>
      </div>
      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${step * 20}%`, height: '100%', background: 'var(--color-accent)', transition: 'width 0.3s' }} />
      </div>
    </div>
  );

  const renderStep1 = () => {
    const indArr = Array.isArray(industry) ? industry : (industry ? [industry] : []);
    return (
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '4px' }}>What do you do?</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Pick up to 3 industries that best match your business.</p>
        
        <div className="grid grid-3" style={{ gap: '16px' }}>
          {IC.map(ind => {
            const isSelected = indArr.includes(ind.id);
            return (
              <button key={ind.id} onClick={() => handleSelectIndustry(ind.id)} style={{
                background: isSelected ? 'rgba(245, 166, 35, 0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isSelected ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'left',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{ind.label}</span>
              </button>
            )
          })}
        </div>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => setMode('selection')} className="btn btn-ghost">← Back</button>
          <button onClick={() => indArr.length > 0 && setStep(2)} className="btn btn-primary" disabled={indArr.length === 0}>Next →</button>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    const indArr = Array.isArray(industry) ? industry : (industry ? [industry] : []);
    const topCategories = new Set();
    indArr.forEach(i => {
      const selectedInd = IC.find(ic => ic.id === i);
      if (selectedInd && selectedInd.categories) {
        selectedInd.categories.forEach(c => topCategories.add(c));
      }
    });
    const topCategoriesArr = Array.from(topCategories);
    
    // Group all software by category
    const grouped = {};
    hC.forEach(sw => {
      if (searchTerm && !sw.name.toLowerCase().includes(searchTerm.toLowerCase())) return;
      if (!grouped[sw.category]) grouped[sw.category] = [];
      grouped[sw.category].push(sw);
    });

    return (
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '4px' }}>Select your software</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Search or tap the tools you use. Add anything we&apos;re missing.</p>
        
        <input 
          type="text" 
          placeholder="Search software (e.g. Tally, Premiere, SQL Server)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'white', marginBottom: '16px' }}
        />

        <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-6)' }}>
          <input 
            type="text" 
            placeholder="+ Add other software"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomSoftware()}
            style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 'var(--radius-md)', color: 'white' }}
          />
          <button onClick={addCustomSoftware} className="btn btn-secondary">Add</button>
        </div>

        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '12px', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '400px' }}>
          {customSoftware.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>CUSTOM ADDED</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {customSoftware.map(cs => (
                  <button key={cs} onClick={() => setCustomSoftware(prev => prev.filter(x => x !== cs))} style={{
                    padding: '8px 16px', background: 'rgba(245, 166, 35, 0.1)', border: '1px solid var(--color-accent)', borderRadius: '24px', color: 'white', fontSize: '13px', cursor: 'pointer'
                  }}>
                    {cs} ✕
                  </button>
                ))}
              </div>
            </div>
          )}

          {Object.entries(Rb).map(([catKey, catName]) => {
            const list = grouped[catKey];
            if (!list || list.length === 0) return null;
            const isTop = topCategories.has(catKey);
            
            // If searching, show all matching categories, otherwise prioritize top ones or if user selected one
            if (!searchTerm && !isTop && !list.some(sw => softwareIds.includes(sw.id))) return null;

            return (
              <div key={catKey}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {catName} 
                  {isTop && <span style={{ background: 'rgba(245, 166, 35, 0.2)', color: 'var(--color-accent)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>for you</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {list.map(sw => {
                    const isSelected = softwareIds.includes(sw.id);
                    return (
                      <button key={sw.id} onClick={() => toggleSoftware(sw.id)} style={{
                        padding: '8px 16px', 
                        background: isSelected ? 'rgba(245, 166, 35, 0.1)' : 'rgba(255,255,255,0.03)', 
                        border: `1px solid ${isSelected ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`, 
                        borderRadius: '24px', color: 'white', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                        {sw.name} {isSelected && '✕'}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => setStep(1)} className="btn btn-ghost">← Back</button>
          <button onClick={() => setStep(3)} className="btn btn-primary" disabled={softwareIds.length === 0 && customSoftware.length === 0}>Next →</button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '4px' }}>Where does your data live?</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Select all that apply.</p>
      
      <div className="grid grid-2" style={{ gap: '16px' }}>
        {UV.map(loc => (
          <label key={loc} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px',
            background: dataLocations.includes(loc) ? 'rgba(245, 166, 35, 0.1)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${dataLocations.includes(loc) ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)'}`,
            borderRadius: 'var(--radius-md)', cursor: 'pointer'
          }}>
            <span style={{ fontSize: '15px' }}>{loc}</span>
            <input type="checkbox" checked={dataLocations.includes(loc)} onChange={() => toggleLocation(loc)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }} />
          </label>
        ))}
      </div>
      <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setStep(2)} className="btn btn-ghost">← Back</button>
        <button onClick={() => dataLocations.length > 0 && setStep(4)} className="btn btn-primary" disabled={dataLocations.length === 0}>Next →</button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '4px' }}>How large is your team?</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>This helps us estimate device coverage and data growth.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {GV.map(ts => (
          <button key={ts.id} onClick={() => { setTeamSize(ts.id); setStep(5); }} style={{
            padding: '20px', textAlign: 'left', fontSize: '16px', fontWeight: 600,
            background: teamSize === ts.id ? 'rgba(245, 166, 35, 0.1)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${teamSize === ts.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            {ts.label} {ts.label === '100+' ? 'people' : 'people'}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'flex-start' }}>
        <button onClick={() => setStep(3)} className="btn btn-ghost">← Back</button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '4px' }}>What happens if you lose this data?</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>This determines your recovery time objective (RTO).</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {_V.map(crit => (
          <button key={crit.id} onClick={() => { setCriticality(crit.id); }} style={{
            display: 'flex', flexDirection: 'column', gap: '4px', padding: '20px', textAlign: 'left',
            background: criticality === crit.id ? 'rgba(245, 166, 35, 0.1)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${criticality === crit.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '16px', fontWeight: 700 }}>{crit.label}</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{crit.desc}</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setStep(4)} className="btn btn-ghost">← Back</button>
        <button onClick={() => criticality && startAnalysis()} className="btn btn-primary" disabled={!criticality}>Analyze & Generate Plan →</button>
      </div>
    </div>
  );

  const appendToAiText = (text) => {
    setAiText(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? text : ' ' + text));
  };

  const renderAi = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px', margin: '0 auto', gap: 'var(--space-6)' }}>
      <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, textAlign: 'center' }}>Describe your business</h3>
      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>Answer a few quick prompts about what you do, what data you create and where it lives. Our AI turns it into a precise backup strategy.</p>
      
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Help our AI help you — try to mention:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button onClick={() => appendToAiText('We are a ____ business.')} className="badge badge-accent" style={{ cursor: 'pointer' }}>+ What you do</button>
          <button onClick={() => appendToAiText('We mainly use ____.')} className="badge badge-accent" style={{ cursor: 'pointer' }}>+ Software you use</button>
          <button onClick={() => appendToAiText('Our data is mostly ____ files.')} className="badge badge-accent" style={{ cursor: 'pointer' }}>+ Data formats</button>
          <button onClick={() => appendToAiText('We currently have about ____ GB/TB of data.')} className="badge badge-accent" style={{ cursor: 'pointer' }}>+ Data size today</button>
          <button onClick={() => appendToAiText('It is stored on ____ (local PCs / NAS / server / cloud).')} className="badge badge-accent" style={{ cursor: 'pointer' }}>+ Where it lives</button>
          <button onClick={() => appendToAiText('We need to keep data for ____.')} className="badge badge-accent" style={{ cursor: 'pointer' }}>+ How long to keep</button>
        </div>
      </div>

      <textarea 
        value={aiText}
        onChange={(e) => setAiText(e.target.value)}
        placeholder="e.g., We are a medical clinic with 30 staff. We run specialized local servers for patient records and use Microsoft 365. Around 2TB of data."
        style={{ width: '100%', height: '160px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-md)', padding: '20px', color: 'white', fontSize: '16px', resize: 'none', fontFamily: 'inherit' }}
      />

      <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Optional — improves accuracy</h4>
        <div className="grid grid-2" style={{ gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Primary data formats</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {["Documents & spreadsheets", "Design files (PSD/AI)", "Photos (RAW/JPEG)", "Video footage", "Databases", "Code repositories", "Email archives", "CAD/3D models", "Scans & PDFs"].map(fmt => {
                const isSel = aiFormats.includes(fmt);
                return (
                  <button key={fmt} onClick={() => setAiFormats(prev => isSel ? prev.filter(x => x !== fmt) : [...prev, fmt])} style={{
                    padding: '4px 10px', fontSize: '12px', borderRadius: '12px', border: `1px solid ${isSel ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`, background: isSel ? 'rgba(245, 166, 35, 0.1)' : 'transparent', color: isSel ? 'white' : 'var(--color-text-secondary)', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    {fmt}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Where data lives</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {["Local computers", "NAS", "External drives", "Server", "Cloud", "Virtual machines"].map(loc => {
                const isSel = aiLocations.includes(loc);
                return (
                  <button key={loc} onClick={() => setAiLocations(prev => isSel ? prev.filter(x => x !== loc) : [...prev, loc])} style={{
                    padding: '4px 10px', fontSize: '12px', borderRadius: '12px', border: `1px solid ${isSel ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`, background: isSel ? 'rgba(245, 166, 35, 0.1)' : 'transparent', color: isSel ? 'white' : 'var(--color-text-secondary)', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    {loc}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Approximate data size</label>
            <select value={aiSizeBand} onChange={(e) => setAiSizeBand(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '6px', fontSize: '14px', outline: 'none' }}>
              <option value="">Select size...</option>
              <option value="Under 50 GB">Under 50 GB</option>
              <option value="50–250 GB">50–250 GB</option>
              <option value="250 GB–1 TB">250 GB–1 TB</option>
              <option value="1–5 TB">1–5 TB</option>
              <option value="5–20 TB">5–20 TB</option>
              <option value="20 TB+">20 TB+</option>
              <option value="Not sure">Not sure</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>Retention requirement</label>
            <select value={aiRetention} onChange={(e) => setAiRetention(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '6px', fontSize: '14px', outline: 'none' }}>
              <option value="">Select retention...</option>
              <option value="No specific need">No specific need</option>
              <option value="90 days">90 days</option>
              <option value="1 year">1 year</option>
              <option value="7 years (compliance)">7 years (compliance)</option>
              <option value="Forever">Forever</option>
            </select>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', width: '100%', gap: '12px', marginTop: 'var(--space-4)' }}>
        <button onClick={() => setMode('selection')} className="btn btn-secondary" style={{ flex: 1, padding: '14px' }}>Cancel</button>
        <button 
          onClick={() => startAnalysis(true)} 
          className="btn btn-primary" 
          style={{ flex: 2, padding: '14px', opacity: aiText.trim().length < 5 ? 0.5 : 1, cursor: aiText.trim().length < 5 ? 'not-allowed' : 'pointer' }} 
          disabled={aiText.trim().length < 5}
        >
          {aiText.trim().length < 5 ? 'Type more to analyze...' : 'Analyze & Generate Plan →'}
        </button>
      </div>
    </div>
  );

  const renderAnalyzing = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '400px', gap: 'var(--space-6)' }}>
      <Lottie animationData={activityAnim} loop={true} style={{ width: 80, height: 80 }} />
      <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Engineering your backup strategy...</h3>
      <p style={{ color: 'var(--color-text-secondary)' }}>Mapping your exact requirements to our infrastructure.</p>
    </div>
  );

  const renderResult = () => {
    // Generate actual results using the imported lq algorithm
    const payload = {
      industry,
      softwareIds,
      customSoftware,
      dataLocations,
      teamSize: teamSize || '1-5',
      criticality: criticality || 'few-days'
    };
    
    const res = lq(payload);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1000px', margin: '0 auto', gap: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ background: 'var(--color-success-light)', color: 'var(--color-success)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analysis Complete</span>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: 'var(--space-4)' }}>Your Tailored Backup Strategy</h2>
        </div>
        
        {assumptions && assumptions.length > 0 && (
          <div style={{ background: 'rgba(245, 166, 35, 0.05)', border: '1px solid var(--color-accent)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', width: '100%' }}>
            <h4 style={{ color: 'var(--color-accent)', fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lottie animationData={alertCircleAnim} loop={false} style={{ width: 24, height: 24, filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(350deg)' }} />
              What we assumed
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)', listStyle: 'disc', paddingLeft: '20px', marginBottom: '12px' }}>
              {assumptions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Not right? Re-run the advisor with more detail for a sharper plan.</p>
          </div>
        )}

        {res.segments && res.segments.length > 1 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', gap: '16px', overflowX: 'auto', width: '100%', marginBottom: 'var(--space-6)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Your Workloads</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {res.segments.map((seg, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '12px', minWidth: '160px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{seg.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>+{Math.round(seg.monthlyGrowthGB)} GB/mo • {seg.share * 100}% staff</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-2" style={{ gap: 'var(--space-6)', width: '100%' }}>
          {/* Main Plan Card */}
          <div style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-accent)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--color-accent)' }} />
            <h4 style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Plan</h4>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>{res.plan.tier} Tier</div>
            <div style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              Base capacity: <strong>{res.plan.minStorageGB >= 1000 ? (res.plan.minStorageGB/1000).toFixed(1) + ' TB' : res.plan.minStorageGB + ' GB'}</strong>
            </div>

            {res.storageBreakdown && (
              <details style={{ marginBottom: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <summary style={{ padding: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, userSelect: 'none', color: 'var(--color-accent)' }}>
                  How we calculated your storage
                </summary>
                <div style={{ padding: '12px', paddingTop: 0, fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Initial Base Data ({res.storageBreakdown.baseDataSource}):</span>
                    <span>{res.storageBreakdown.baseDataGB} GB</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Projected Growth (12 months @ {res.storageBreakdown.monthlyGrowthGB}GB):</span>
                    <span>+ {res.storageBreakdown.projectedGB - res.storageBreakdown.baseDataGB} GB</span>
                  </div>
                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Raw Total:</span>
                    <span>{res.storageBreakdown.projectedGB} GB</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Safety Buffer (x{res.storageBreakdown.safetyBuffer}):</span>
                    <span>{res.storageBreakdown.rawTotalGB} GB</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 700, marginTop: '4px' }}>
                    <span>Rounded to plan size:</span>
                    <span>{res.storageBreakdown.roundedTo}</span>
                  </div>
                </div>
              </details>
            )}

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--color-success)', marginTop: '2px' }}>✓</span> 
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{res.plan.backupInterval} Incremental</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{res.plan.backupType}</div>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--color-success)', marginTop: '2px' }}>✓</span> 
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{res.plan.retentionDays} Days Retention</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{res.plan.versioningDays} days of active versioning</div>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: 'var(--color-success)', marginTop: '2px' }}>✓</span> 
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>Ransomware Protection</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{res.plan.immutableStorage ? "Immutable WORM storage enabled" : "Standard protection"}</div>
                </div>
              </li>
              {res.plan.extras.map((ex, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: 'var(--color-accent)', marginTop: '2px' }}>✦</span> 
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{ex.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{ex.value}</div>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>Start Free 14-Day Trial</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Reasoning Box */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Why this strategy?
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, listStyle: 'disc', paddingLeft: '20px' }}>
                {res.reasoning.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            {/* DR Scores */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Disaster Resilience Scores</h4>
              <div className="grid grid-2" style={{ gap: '16px' }}>
                {Object.entries(res.drScores).map(([k, score]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                      {k.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(star => (
                        <div key={star} style={{ width: '20px', height: '6px', borderRadius: '3px', background: star <= score ? 'var(--color-success)' : 'rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={closeExpanded} className="btn btn-secondary" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>← Restart Advisor</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="section" id="backup-advisor" style={{ position: 'relative', overflow: 'hidden', paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)', background: 'linear-gradient(180deg, #05070a 0%, #0a0e16 50%, #05070a 100%)', minHeight: '600px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(rgba(245, 166, 35, 0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '500px', background: 'radial-gradient(ellipse at center, rgba(245, 166, 35, 0.06) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <GlassCard interactive={false} style={{ padding: 'var(--space-10)', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(245, 166, 35, 0.12)' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="badge badge-accent" style={{ fontSize: '11px', letterSpacing: '0.08em', marginBottom: 'var(--space-6)' }}>Free Tool · No Signup</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(245, 166, 35, 0.15), rgba(245, 166, 35, 0.05))', border: '1px solid rgba(245, 166, 35, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(245, 166, 35, 0.15)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, lineHeight: 1.2, maxWidth: '600px', background: 'linear-gradient(to right, #fff, #f5a623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 'var(--space-6)' }}>Get Your Personalized Backup Strategy</h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', maxWidth: '520px', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
                Tell us the software you use — we&apos;ll engineer a complete backup plan with storage estimates, recovery targets, and encryption recommendations. <strong style={{ color: 'var(--color-text-primary)' }}>Takes under 60 seconds.</strong>
              </p>
              <button onClick={() => setIsExpanded(true)} className="btn btn-primary btn-lg" style={{ padding: '16px 36px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 40px rgba(245, 166, 35, 0.2)', cursor: 'pointer' }}>
                Launch Backup Advisor
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

      {isExpanded && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}>
          <GlassCard className="hide-scrollbar" interactive={false} style={{ width: '90vw', height: '90vh', maxWidth: '1200px', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', overflowY: 'auto', border: '1px solid rgba(245, 166, 35, 0.3)', boxShadow: '0 20px 80px rgba(0,0,0,0.8)' }}>
            <div style={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ paddingBottom: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', position: 'sticky', top: '-32px', zIndex: 10, margin: '-32px -32px 0 -32px', padding: '16px 32px' }}>
                <button onClick={closeExpanded} className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Close Advisor
                </button>
              </div>
              
              {mode === 'guided' && renderProgress()}

              <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'var(--space-6)' }}>
                {mode === 'selection' && renderSelection()}
                {mode === 'guided' && step === 1 && renderStep1()}
                {mode === 'guided' && step === 2 && renderStep2()}
                {mode === 'guided' && step === 3 && renderStep3()}
                {mode === 'guided' && step === 4 && renderStep4()}
                {mode === 'guided' && step === 5 && renderStep5()}
                {mode === 'ai' && renderAi()}
                {mode === 'analyzing' && renderAnalyzing()}
                {mode === 'result' && renderResult()}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}
