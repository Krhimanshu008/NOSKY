const fs = require('fs');
const path = require('path');

const directory = 'src/app/admin';

// Mapping of common Tailwind patterns to Vanilla CSS semantic classes
const replacements = [
  // Layouts
  { regex: /className="space-y-10 w-full max-w-7xl mx-auto"/g, replacement: 'className="neo-container neo-section-spacing"' },
  { regex: /className="space-y-10 w-full max-w-6xl mx-auto"/g, replacement: 'className="neo-container neo-section-spacing"' },
  
  // Headers
  { regex: /className="relative pb-6 border-b border-ink\/20"/g, replacement: 'className="neo-header"' },
  { regex: /className="absolute -bottom-2 -left-2 text-ink opacity-40 font-heading text-lg"\s*\+<\/span>/g, replacement: 'className="neo-header-plus">+</span>' },
  { regex: /className="font-heading text-4xl font-bold text-ink tracking-tight uppercase"/g, replacement: 'className="neo-title"' },
  { regex: /className="text-sm text-muted font-body mt-2"/g, replacement: 'className="neo-subtitle"' },
  
  // Tabs
  { regex: /className={`font-heading font-bold text-xs tracking-wider px-4 py-2 border-2 uppercase transition-all \${activeTab === '([^']+)' \? 'bg-ink text-white border-ink shadow-\[3px_3px_0px_rgba\(0,0,0,0\.2\)\]' : 'border-transparent text-muted hover:text-ink hover:border-ink'}`}/g, replacement: 'className={`neo-tab ${activeTab === \'$1\' ? \'active\' : \'\'}`}' },
  
  // Grids
  { regex: /className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6"/g, replacement: 'className="neo-grid-4"' },
  { regex: /className="grid grid-cols-1 lg:grid-cols-2 gap-6"/g, replacement: 'className="neo-grid-2"' },
  
  // Cards
  { regex: /className="bg-panel border-2 border-ink shadow-extruded-3d p-6"/g, replacement: 'className="neo-card-inner"' },
  { regex: /className="bg-panel border-2 border-ink shadow-[^"]+"/g, replacement: 'className="neo-card"' },
  
  // Loaders
  { regex: /className="animate-spin" size={32}/g, replacement: 'className="animate-spin text-ink" size={32}' },
];

// Instead of regex replacing everything, I will use a generic function to swap specific long tailwind strings
const exactReplacements = {
  'bg-panel border-2 border-ink shadow-extruded-3d p-6 flex flex-col justify-center': 'neo-card neo-card-inner',
  'bg-panel border-2 border-ink shadow-extruded-3d p-4': 'neo-card',
  'w-full h-full flex items-center justify-center': 'neo-flex-center w-full h-full',
  'overflow-x-auto': 'neo-table-wrapper',
  'w-full text-left border-collapse': 'neo-table',
  'bg-surface border-b-2 border-ink': 'table-head-row',
  'p-3 text-[10px] font-bold text-ink uppercase tracking-wider': '', // we handle th in css
  'p-3 text-[10px] font-bold text-ink uppercase tracking-wider text-right': '',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Manual generic class replacements
  content = content.replace(/className="([^"]+)"/g, (match, classes) => {
    let newClasses = classes;
    Object.keys(exactReplacements).forEach(tw => {
      if (newClasses === tw) {
        newClasses = exactReplacements[tw];
      }
    });
    return `className="${newClasses}"`;
  });

  // Regex replacements
  replacements.forEach(rep => {
    content = content.replace(rep.regex, rep.replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      if (!fullPath.includes('dashboard')) { // skip dashboard as it's already done
        processFile(fullPath);
      }
    }
  });
}

walkDir(directory);
console.log('Refactoring complete.');
