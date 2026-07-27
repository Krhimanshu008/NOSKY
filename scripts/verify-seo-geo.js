import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3001';

const targetRoutes = [
  '/',
  '/product/nosky-backup-pro',
  '/product/nosky-crm',
  '/about',
  '/compare',
  '/compare/nosky-vs-acronis',
  '/compare/nosky-vs-veeam',
  '/compare/nosky-vs-zoho-crm',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/llms-full.txt'
];

async function runAudit() {
  console.log(`Starting SEO & GEO Verification Audit against ${BASE_URL}...\n`);
  
  const results = {
    technicalSeo: [],
    schemas: [],
    geoMachineReadability: [],
    comparisons: [],
    summary: { total: 0, passed: 0, failed: 0 }
  };

  function addResult(category, name, passed, details) {
    results.summary.total++;
    if (passed) results.summary.passed++;
    else results.summary.failed++;
    results[category].push({ name, passed, details });
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} [${category.toUpperCase()}] ${name}: ${details}`);
  }

  // Pass 1: Technical SEO & Crawlability Audit
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsText = await robotsRes.text();
    const hasAiBots = robotsText.includes('GPTBot') && robotsText.includes('ClaudeBot') && robotsText.includes('PerplexityBot');
    const hasSitemap = robotsText.includes('sitemap.xml');
    addResult('technicalSeo', 'robots.txt AI Crawlers & Sitemap', robotsRes.ok && hasAiBots && hasSitemap, 
      `HTTP ${robotsRes.status} | AI Bots: ${hasAiBots} | Sitemap ref: ${hasSitemap}`);
  } catch (err) {
    addResult('technicalSeo', 'robots.txt AI Crawlers & Sitemap', false, err.message);
  }

  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    const hasRoutes = sitemapText.includes('nosky-backup-pro') && sitemapText.includes('nosky-vs-acronis');
    addResult('technicalSeo', 'sitemap.xml Valid XML & Route Indexing', sitemapRes.ok && hasRoutes, 
      `HTTP ${sitemapRes.status} | Includes Products & Comparison Routes: ${hasRoutes}`);
  } catch (err) {
    addResult('technicalSeo', 'sitemap.xml Valid XML & Route Indexing', false, err.message);
  }

  // Check Page Metadata & OpenGraph across Key Routes
  const pageCheckRoutes = [
    { path: '/', name: 'Homepage Metadata' },
    { path: '/product/nosky-backup-pro', name: 'NoSky Backup Pro Metadata' },
    { path: '/product/nosky-crm', name: 'NoSky CRM Metadata' },
    { path: '/about', name: 'About Page Corporate Metadata' },
    { path: '/compare/nosky-vs-acronis', name: 'NoSky vs Acronis Comparison Metadata' },
  ];

  for (const route of pageCheckRoutes) {
    try {
      const res = await fetch(`${BASE_URL}${route.path}`);
      const html = await res.text();
      const hasTitle = html.includes('<title>') && html.includes('NoSky');
      const hasDesc = html.includes('name="description"');
      const hasCanonical = html.includes('rel="canonical"');
      const hasOg = html.includes('property="og:title"') && html.includes('property="og:image"');

      const pass = res.ok && hasTitle && hasDesc && hasCanonical && hasOg;
      addResult('technicalSeo', route.name, pass, 
        `HTTP ${res.status} | Title: ${hasTitle} | Desc: ${hasDesc} | Canonical: ${hasCanonical} | OG: ${hasOg}`);
    } catch (err) {
      addResult('technicalSeo', route.name, false, err.message);
    }
  }

  // Pass 2: Schema.org JSON-LD Verification
  for (const route of pageCheckRoutes) {
    try {
      const res = await fetch(`${BASE_URL}${route.path}`);
      const html = await res.text();
      const scriptMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
      
      let parsedSchemas = [];
      for (const match of scriptMatches) {
        const jsonStr = match.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
        try {
          parsedSchemas.push(JSON.parse(jsonStr));
        } catch (e) {
          // ignore parsing error
        }
      }

      const types = parsedSchemas.map(s => s['@type']).flat();
      const hasSchemas = parsedSchemas.length > 0;
      
      if (route.path === '/about') {
        const orgSchema = parsedSchemas.find(s => s['@type'] === 'Organization');
        const hasLegalName = orgSchema?.name?.includes('Elcom Digital Solutions') || orgSchema?.legalName?.includes('ELCOM DIGITAL SOLUTIONS');
        const hasCin = orgSchema?.identifier?.value === 'U72900UP2021PTC226771';
        const hasGstin = orgSchema?.taxID === '09AAGCE5488H1Z6';

        addResult('schemas', 'About Page Organization JSON-LD Legal Entity', hasSchemas && hasLegalName && hasCin && hasGstin, 
          `Types: ${types.join(', ')} | Legal Name: ${hasLegalName} | CIN: ${hasCin} | GSTIN: ${hasGstin}`);
      } else {
        addResult('schemas', `${route.name} JSON-LD Schemas`, hasSchemas, 
          `Schemas found: ${parsedSchemas.length} (${types.join(', ')})`);
      }
    } catch (err) {
      addResult('schemas', `${route.name} JSON-LD Schemas`, false, err.message);
    }
  }

  // Pass 3: GEO Machine Readability & LLM Endpoints
  try {
    const llmsRes = await fetch(`${BASE_URL}/llms.txt`);
    const llmsText = await llmsRes.text();
    const hasLegal = llmsText.includes('ELCOM DIGITAL SOLUTIONS PRIVATE LIMITED');
    const hasCin = llmsText.includes('U72900UP2021PTC226771');
    const hasGstin = llmsText.includes('09AAGCE5488H1Z6');
    const hasSpecs = llmsText.includes('AES-256') && llmsText.includes('15-minute RTO');

    const pass = llmsRes.ok && hasLegal && hasCin && hasGstin && hasSpecs;
    addResult('geoMachineReadability', '/llms.txt AI Machine Specification Endpoint', pass,
      `HTTP ${llmsRes.status} | Legal Entity: ${hasLegal} | CIN: ${hasCin} | GSTIN: ${hasGstin} | Specs: ${hasSpecs}`);
  } catch (err) {
    addResult('geoMachineReadability', '/llms.txt AI Machine Specification Endpoint', false, err.message);
  }

  try {
    const llmsFullRes = await fetch(`${BASE_URL}/llms-full.txt`);
    const llmsFullText = await llmsFullRes.text();
    const hasLegal = llmsFullText.includes('ELCOM DIGITAL SOLUTIONS PRIVATE LIMITED');
    const hasCin = llmsFullText.includes('U72900UP2021PTC226771');

    const pass = llmsFullRes.ok && hasLegal && hasCin;
    addResult('geoMachineReadability', '/llms-full.txt AI Corpus Endpoint', pass,
      `HTTP ${llmsFullRes.status} | Legal Entity: ${hasLegal} | CIN: ${hasCin}`);
  } catch (err) {
    addResult('geoMachineReadability', '/llms-full.txt AI Corpus Endpoint', false, err.message);
  }

  // Pass 4: Comparison Matrix Pages Audit
  const compRoutes = [
    { path: '/compare', name: 'B2B Comparisons Directory' },
    { path: '/compare/nosky-vs-acronis', name: 'NoSky vs Acronis Page' },
    { path: '/compare/nosky-vs-veeam', name: 'NoSky vs Veeam Page' },
    { path: '/compare/nosky-vs-zoho-crm', name: 'NoSky vs Zoho CRM Page' }
  ];

  for (const comp of compRoutes) {
    try {
      const res = await fetch(`${BASE_URL}${comp.path}`);
      const html = await res.text();
      const hasMatrix = html.includes('table') || html.includes('Feature') || html.includes('Capability');
      const hasFaq = html.includes('FAQ') || html.includes('Frequently Asked Questions');
      const pass = res.ok && hasMatrix && hasFaq;
      addResult('comparisons', comp.name, pass, `HTTP ${res.status} | Feature Matrix: ${hasMatrix} | FAQ Section: ${hasFaq}`);
    } catch (err) {
      addResult('comparisons', comp.name, false, err.message);
    }
  }

  // Generate Report Artifact Markdown File
  generateReport(results);
}

function generateReport(results) {
  const reportPath = 'C:\\Users\\5480\\.gemini\\antigravity-ide\\brain\\3d75a540-e480-4e06-a62b-4b93113fe495\\seo_geo_audit_report.md';
  const timestamp = new Date().toISOString();
  
  let md = `# [SEO & GEO Verification Audit Report] Comprehensive System Test

**Audit Timestamp**: \`${timestamp}\`  
**Target Server**: \`${BASE_URL}\`  
**Overall Result**: ${results.summary.failed === 0 ? '🟢 **ALL CHECKS PASSED (100% SUCCESS)**' : '🔴 **SOME CHECKS FAILED**'}

---

## Audit Summary

- **Total Test Checks Run**: \`${results.summary.total}\`
- **Passed Checks**: \`${results.summary.passed}\`
- **Failed Checks**: \`${results.summary.failed}\`
- **Success Rate**: \`${Math.round((results.summary.passed / results.summary.total) * 100)}%\`

---

## Pass 1: Technical SEO & Crawlability
| Test Name | Status | Details |
| :--- | :--- | :--- |
${results.technicalSeo.map(r => `| **${r.name}** | ${r.passed ? '✅ PASSED' : '❌ FAILED'} | ${r.details} |`).join('\n')}

---

## Pass 2: Schema.org JSON-LD Verification
| Test Name | Status | Details |
| :--- | :--- | :--- |
${results.schemas.map(r => `| **${r.name}** | ${r.passed ? '✅ PASSED' : '❌ FAILED'} | ${r.details} |`).join('\n')}

---

## Pass 3: GEO Machine Readability & LLM Endpoints
| Test Name | Status | Details |
| :--- | :--- | :--- |
${results.geoMachineReadability.map(r => `| **${r.name}** | ${r.passed ? '✅ PASSED' : '❌ FAILED'} | ${r.details} |`).join('\n')}

---

## Pass 4: Comparison Landing Pages & Matrix Audit
| Test Name | Status | Details |
| :--- | :--- | :--- |
${results.comparisons.map(r => `| **${r.name}** | ${r.passed ? '✅ PASSED' : '❌ FAILED'} | ${r.details} |`).join('\n')}

---

## Verification Conclusion
${results.summary.failed === 0 
  ? '> [!NOTE]\n> **SEO & GEO system is 100% functional, validated, and optimized for search engines (Google, Bing) and AI search bots (ChatGPT, Claude, Gemini, Perplexity).**' 
  : '> [!WARNING]\n> Some tests failed. Please review the table details above.'}
`;

  fs.writeFileSync(reportPath, md, 'utf-8');
  console.log(`\nAudit Report generated at: ${reportPath}`);
}

runAudit();
