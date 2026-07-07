const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const crypto = require('crypto');

async function main() {
  const db = await open({
    filename: './dev.db',
    driver: sqlite3.Database
  });

  const id = crypto.randomBytes(16).toString('hex');
  const title = "NIRC of ICAI Signs MoU with NoSky for Financial Data Protection";
  const slug = "nirc-icai-mou-nosky";
  const content = `The Northern India Regional Council (NIRC) of the Institute of Chartered Accountants of India signed a memorandum of understanding with NoSky, a financial data-protection company, agreeing to work together to encourage Indian businesses to back up and protect their financial records in line with tightening compliance norms.

The agreement was signed on Chartered Accountants Day, observed by the profession to mark the founding of ICAI in 1949. NIRC is one of the institute’s five regional councils and represents members and students across northern India.

Under the arrangement, the two sides said they would run joint awareness programs and help member firms advise clients on data retention, backup and recovery. Those areas, once treated as IT housekeeping, have moved closer to the core of statutory compliance as accounting has gone almost entirely digital.

The shift is visible in how Indian businesses now keep their books. Most small and mid-sized firms run Tally, an ERP system, or accounting software, yet still depend on a local hard drive and the occasional manual copy for backup. That setup holds until it does not. NoSky said its work with clients over the past four years repeatedly surfaced the same exposure: financial data lost to a hardware failure, a ransomware attack, or a deletion no one noticed, often discovered only when records are demanded during an audit or assessment.

For a business, the consequences are practical rather than abstract. Eight years of accounting history can vanish with a single failed disk. GST records that cannot be produced on the day they are sought can stall a filing or an assessment. Audit documentation that disappears leaves a firm explaining a gap it cannot fill.

That exposure now carries a regulatory edge. The Income Tax Act, 2025, read with its rules, points to electronic books being kept accessible in India, with daily backups maintained on servers located in the country. Section 128 of the Companies Act, 2013 requires electronic records to remain accessible and available for future reference. GST law imposes its own multi-year retention obligations on returns and supporting records. And the Digital Personal Data Protection Act and Rules, notified in 2025, extend duties of care over the customer, vendor and employee data that businesses hold, with enforcement being phased in.

Read together, the obligations push in one direction: financial records that stay protected, accessible and recoverable for years, not months.

NoSky positions its platform, FinVault, as a single system meant to address those obligations rather than four separate tools. The company says it offers automated daily backup, retention of up to ten years, recovery of records exactly as they stood on a past date, encryption, and disaster recovery, and that it operates as a data processor on behalf of its clients.

The partnership rests on a distribution logic the company has been unusually candid about.

Business owners tend to tune out advertising and cold sales calls, but rarely ignore their Chartered Accountant. By routing the offering through CAs rather than around them, NoSky is betting that an advisor’s existing trust is what opens the conversation about protecting records. Under its advisor program, participating accountants earn a 20 percent recurring revenue share on clients they refer, paid monthly, and are kept out of billing and customer support, which NoSky says it handles directly. For a practice that signs up a few dozen clients, the company frames this as a recurring income line that renews each year.

NoSky describes itself as already working with a network of thousands of advisors across the country, though independent figures on its size were not available. The four-year-old company has built its pitch around a single category it calls financial data protection, distinct from generic cloud storage or backup.`;

  const metaDescription = "The NIRC of ICAI signs a memorandum of understanding with NoSky to encourage Indian businesses to securely backup and protect financial records.";
  const metaKeywords = "ICAI, NoSky, MoU, financial backup, data protection, CA, NIRC";
  const coverImage = "/images/icai-mou.jpeg";
  const geoRegion = "Northern India";
  const cityLocation = "New Delhi";

  await db.run(`
    INSERT INTO Article (
      id, title, slug, content, metaDescription, metaKeywords, coverImage, geoRegion, cityLocation, published
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, title, slug, content, metaDescription, metaKeywords, coverImage, geoRegion, cityLocation, 1
  ]);

  console.log("Article published successfully.");
}

main().catch(console.error);
