const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'admin', 'analytics', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove Sidebar
content = content.replace(/<div className="admin-layout">[\s\S]*?{([^}]+)} ━━━ MAIN CONTENT ━━━[^}]+}\s*<main className="admin-main">/, '<section className="space-y-10 w-full max-w-7xl mx-auto">');

// Remove closing tags for main and div
content = content.replace(/<\/main>\s*<\/div>/, '</section>');

// 2. Fix Header
content = content.replace(/<div style={{ marginBottom: 'var\(--space-6\)' }}>[\s\S]*?<\/div>/, `<div className="relative pb-6 border-b border-ink/20">
          <span className="absolute -bottom-2 -left-2 text-ink opacity-40 font-heading text-lg">+</span>
          <h1 className="font-heading text-4xl font-bold text-ink tracking-tight uppercase">Enterprise Command Center</h1>
          <p className="text-sm text-muted font-body mt-2">Advanced tracking, behavioral analytics, and engagement metrics.</p>
        </div>`);

// 3. Fix Tabs
content = content.replace(/<div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba\(255,255,255,0.1\)', marginBottom: '2rem' }}>/g, '<div className="flex gap-4 border-b-2 border-ink pb-4 mb-8">');
content = content.replace(/style={{ padding: '0\.75rem 1\.5rem', background: 'none', border: 'none', color: activeTab === '([^']+)' \? 'var\(--color-accent\)' : 'var\(--color-text-secondary\)', borderBottom: activeTab === '[^']+' \? '2px solid var\(--color-accent\)' : '2px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}/g, 'className={`font-heading font-bold text-xs tracking-wider px-4 py-2 border-2 uppercase transition-all ${activeTab === \'$1\' ? \'bg-ink text-white border-ink shadow-[3px_3px_0px_rgba(0,0,0,0.2)]\' : \'border-transparent text-muted hover:text-ink hover:border-ink\'}`}');

// 4. Fix Panels
content = content.replace(/className="admin-glass-panel"/g, 'className="bg-panel border-2 border-ink shadow-extruded-3d p-6"');
content = content.replace(/className="admin-table-container"/g, 'className="overflow-x-auto"');
content = content.replace(/className="admin-table"/g, 'className="w-full text-left border-collapse"');

// 5. Fix Inline text colors that assume dark mode
content = content.replace(/color: 'var\(--color-text-(muted|secondary|primary)\)'/g, 'color: \'#71717A\'');
content = content.replace(/color: 'var\(--color-(success|blue|warning|accent)\)'/g, 'color: \'#000000\'');
content = content.replace(/color: '#fff'/g, 'color: \'#000000\'');
content = content.replace(/rgba\(255,255,255,0\.[0-9]+\)/g, 'rgba(0,0,0,0.1)');

// 6. Fix table headers
content = content.replace(/<thead><tr><th>(.*?)<\/th><th style={{ textAlign: 'right' }}>(.*?)<\/th><\/tr><\/thead>/g, '<thead><tr className="bg-surface border-b-2 border-ink"><th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider">$1</th><th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider text-right">$2</th></tr></thead>');
content = content.replace(/<thead><tr><th>(.*?)<\/th><th>(.*?)<\/th><th>(.*?)<\/th><th(.*?)>(.*?)<\/th><\/tr><\/thead>/g, '<thead><tr className="bg-surface border-b-2 border-ink"><th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider">$1</th><th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider">$2</th><th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider">$3</th><th className="p-3 text-[10px] font-bold text-ink uppercase tracking-wider text-right"$4>$5</th></tr></thead>');


fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully refactored analytics/page.js');
