import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, BarChart, Settings, FileText, CreditCard, 
  MessageSquare, Calendar, Kanban, CheckCircle, ArrowRight,
  TrendingUp, RefreshCw, Zap, Search, Shield, Factory, Code, Truck, HeartPulse, GraduationCap, Building2, Home, ShoppingBag, Landmark, Briefcase
} from 'lucide-react';

export const metadata = {
  title: 'NoSky CRM - Turn Every Lead into a Long-Term Customer',
  description: 'Manage leads, streamline your sales pipeline, automate follow-ups, and gain complete visibility into your sales process.',
};

export default function NoskyCRMPage() {
  return (
    <div className="crm-page">
      {/* Hero Section */}
      <section className="section section-lg" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-20))', textAlign: 'center', background: 'var(--gradient-hero)' }}>
        <div className="container container-narrow flex-col flex-center">
          <div className="badge badge-accent" style={{ marginBottom: 'var(--space-6)' }}>
            Customer Relationship Management
          </div>
          <Image 
            src="/logos/CRM - White.png" 
            alt="Nosky CRM Logo" 
            width={120} 
            height={120} 
            style={{ objectFit: 'contain', marginBottom: 'var(--space-6)' }} 
          />
          <h1 style={{ marginBottom: 'var(--space-6)' }}>
            Turn Every Lead into a <br />
            <span className="text-gradient">Long-Term Customer</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)', maxWidth: '600px' }}>
            Manage leads, streamline your sales pipeline, automate follow-ups, and gain complete visibility into your sales process—all from one centralized platform.
          </p>
          <div className="badge badge-blue" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-2) var(--space-4)' }}>
            Whether you&apos;re a startup, SME, distributor, manufacturer, or enterprise, our CRM adapts to your business.
          </div>
          <div className="flex flex-center flex-gap-4">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Request Demo
            </Link>
            <Link href="/product/nosky-crm#features" className="btn btn-secondary btn-lg">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Our CRM */}
      <section className="section section-alt section-border">
        <div className="container container-narrow" style={{ textAlign: 'center' }}>
          <div className="section-header">
            <h2>Why Choose Our CRM?</h2>
            <p>Businesses lose opportunities not because they don&apos;t have customers, but because they lose track of them.</p>
          </div>
          <div className="card card-highlight" style={{ textAlign: 'left', marginTop: 'var(--space-8)' }}>
            <p style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
              Our CRM helps your sales team capture, organize, nurture, and convert leads through a structured workflow while giving management complete visibility into every opportunity.
            </p>
            <p>
              With customizable workflows, real-time reporting, and seamless collaboration, your entire sales cycle becomes faster, more efficient, and easier to manage. Stop managing sales in Excel or WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Standard Sales Workflow */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Complete Sales Pipeline Management</h2>
            <p>Track every opportunity from the very first inquiry until the payment is received.</p>
          </div>
          
          <div style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
            {[
              "Prospecting",
              "Marketing Qualified Lead (MQL)",
              "Lead Qualification (SQL)",
              "Need Analysis",
              "Product Demonstration",
              "Proposal",
              "Negotiation",
              "Sales Order",
              "Payment & Invoice",
              "Lead Won"
            ].map((stage, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="card" style={{ padding: 'var(--space-4) var(--space-8)', textAlign: 'center', minWidth: '300px', border: '1px solid var(--color-border-accent)' }}>
                  <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{stage}</span>
                </div>
                {idx < 9 && (
                  <ArrowRight className="text-accent" style={{ margin: 'var(--space-2) 0', transform: 'rotate(90deg)' }} size={24} />
                )}
              </div>
            ))}
          </div>
          
          <div className="container-narrow" style={{ marginTop: 'var(--space-10)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-lg)' }}>
              Every stage records customer interactions, activities, notes, documents, and follow-up history so your team always knows the next action.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="section section-alt section-border">
        <div className="container">
          <div className="section-header">
            <h2>Key Features</h2>
            <p>Everything you need to manage your sales cycle from start to finish.</p>
          </div>
          
          <div className="grid grid-3" style={{ marginTop: 'var(--space-12)' }}>
            <div className="card">
              <div className="card-icon"><Users /></div>
              <h3 className="card-title">Lead Management</h3>
              <p className="card-desc">Capture leads from multiple sources (Website, Walk-in, Phone, Email, Campaigns) and manage them from one centralized dashboard.</p>
            </div>
            
            <div className="card">
              <div className="card-icon"><Kanban /></div>
              <h3 className="card-title">Sales Pipeline</h3>
              <p className="card-desc">Visualize every opportunity using customizable sales stages. Features drag-and-drop pipeline, stage-wise filtering, and forecasting.</p>
            </div>
            
            <div className="card card-highlight">
              <div className="card-icon"><Settings /></div>
              <h3 className="card-title">Customizable CRM</h3>
              <p className="card-desc">Every business is different. Customize pipeline stages, fields, forms, modules, approval workflows, user roles, and dashboards.</p>
            </div>
            
            <div className="card">
              <div className="card-icon"><Search /></div>
              <h3 className="card-title">Customer 360° View</h3>
              <p className="card-desc">Access complete customer information from a single screen. No more searching through emails or spreadsheets for past interactions.</p>
            </div>
            
            <div className="card">
              <div className="card-icon"><Calendar /></div>
              <h3 className="card-title">Activity Management</h3>
              <p className="card-desc">Never miss an important interaction. Schedule and track calls, meetings, follow-ups, tasks, site visits, and product demos.</p>
            </div>
            
            <div className="card">
              <div className="card-icon"><FileText /></div>
              <h3 className="card-title">Proposal & Quotation</h3>
              <p className="card-desc">Generate professional quotations quickly. Maintain complete version history, price approvals, product catalogs, and tax calculations.</p>
            </div>
            
            <div className="card">
              <div className="card-icon"><BarChart /></div>
              <h3 className="card-title">Sales Analytics</h3>
              <p className="card-desc">Make informed decisions with real-time reports. Track conversion rates, revenue forecast, team productivity, and win ratios.</p>
            </div>
            
            <div className="card">
              <div className="card-icon"><CreditCard /></div>
              <h3 className="card-title">Invoice & Payment Tracking</h3>
              <p className="card-desc">Monitor the financial progress of every deal. Track sales orders, payments received, pending payments, and outstanding amounts.</p>
            </div>
            
            <div className="card">
              <div className="card-icon"><MessageSquare /></div>
              <h3 className="card-title">Team Collaboration</h3>
              <p className="card-desc">Keep everyone aligned. Sales reps, managers, and executives can collaborate through internal notes, activity logs, and document sharing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Benefits & Why Businesses Prefer */}
      <section className="section section-border">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <h2 style={{ marginBottom: 'var(--space-6)' }}>Business Benefits</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[
                  "Improve lead conversion rates",
                  "Reduce manual follow-ups",
                  "Shorten the sales cycle",
                  "Increase team productivity",
                  "Improve customer satisfaction",
                  "Track every sales opportunity",
                  "Make data-driven decisions",
                  "Eliminate spreadsheet dependency",
                  "Centralize customer information",
                  "Enhance sales forecasting accuracy"
                ].map((benefit, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <CheckCircle className="text-success" size={20} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 style={{ marginBottom: 'var(--space-6)' }}>Why Businesses Prefer Our CRM</h2>
              <div className="grid" style={{ gap: 'var(--space-6)' }}>
                <div className="card" style={{ padding: 'var(--space-5)' }}>
                  <h4 style={{ marginBottom: 'var(--space-2)' }}>Fully Customizable</h4>
                  <p className="card-desc">Designed around your business processes—not the other way around.</p>
                </div>
                <div className="card" style={{ padding: 'var(--space-5)' }}>
                  <h4 style={{ marginBottom: 'var(--space-2)' }}>Easy to Use</h4>
                  <p className="card-desc">Clean, intuitive interface that enables quick adoption with minimal training.</p>
                </div>
                <div className="card" style={{ padding: 'var(--space-5)' }}>
                  <h4 style={{ marginBottom: 'var(--space-2)' }}>Scalable</h4>
                  <p className="card-desc">Suitable for startups, growing businesses, and large enterprises alike.</p>
                </div>
                <div className="card" style={{ padding: 'var(--space-5)' }}>
                  <h4 style={{ marginBottom: 'var(--space-2)' }}>Real-Time Visibility</h4>
                  <p className="card-desc">Gain instant insights into pipeline performance, sales progress, and team productivity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="section section-alt section-border">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-header">
            <h2>Industries We Serve</h2>
            <p>Our CRM is suitable for businesses across diverse industries.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
            {[
              { name: "Manufacturing", icon: <Factory size={16} /> },
              { name: "IT & Software", icon: <Code size={16} /> },
              { name: "Wholesale & Distribution", icon: <Truck size={16} /> },
              { name: "Healthcare", icon: <HeartPulse size={16} /> },
              { name: "Education", icon: <GraduationCap size={16} /> },
              { name: "Construction", icon: <Building2 size={16} /> },
              { name: "Real Estate", icon: <Home size={16} /> },
              { name: "Retail", icon: <ShoppingBag size={16} /> },
              { name: "Logistics", icon: <Truck size={16} /> },
              { name: "Financial Services", icon: <Landmark size={16} /> },
              { name: "Professional Services", icon: <Briefcase size={16} /> },
              { name: "Consulting", icon: <Users size={16} /> }
            ].map((industry, idx) => (
              <div key={idx} className="badge" style={{ padding: 'var(--space-3) var(--space-5)', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
                <span className="text-accent">{industry.icon}</span>
                <span style={{ marginLeft: 'var(--space-2)' }}>{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section section-border">
        <div className="container container-narrow">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="grid" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
            {[
              {
                q: "Can the CRM be customized for our business process?",
                a: "Yes. Pipeline stages, fields, workflows, reports, dashboards, approval processes, and user roles can all be customized according to your business requirements."
              },
              {
                q: "Can multiple sales teams use the CRM?",
                a: "Yes. The CRM supports multiple departments, user roles, and access permissions for collaborative selling."
              },
              {
                q: "Does the CRM support quotation and invoice tracking?",
                a: "Yes. From proposal creation to invoice generation and payment tracking, every stage can be managed within the CRM."
              },
              {
                q: "Can management monitor sales performance?",
                a: "Absolutely. Managers have access to dashboards, analytics, pipeline reports, conversion rates, and team performance metrics in real time."
              }
            ].map((faq, idx) => (
              <div key={idx} className="card" style={{ padding: 'var(--space-6)' }}>
                <h4 style={{ marginBottom: 'var(--space-3)' }}>{faq.q}</h4>
                <p className="card-desc">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="section section-alt section-border">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'var(--space-10)' }}>
            <h2>Enterprise-Ready Features</h2>
            <p>Advanced capabilities built to scale with your growing business.</p>
          </div>
          <div className="grid grid-4" style={{ gap: 'var(--space-4)' }}>
            {[
              "Lead Capture from Website Forms", "Email Integration (Outlook/Gmail)", "WhatsApp Integration", "Call Logging & Telephony",
              "Marketing Campaign Management", "Workflow Automation", "Approval Workflows", "Task & Calendar Management",
              "Customer Support Ticketing", "Service Request Management", "Document Management", "Product & Price Book",
              "Territory & Branch Management", "Multi-company / Multi-branch", "Role-Based Access Control (RBAC)", "Audit Logs",
              "Mobile Application", "REST API & Webhooks", "ERP Integration", "Accounting Integration",
              "Inventory Integration", "AI-powered Lead Scoring", "Sales Forecasting", "KPI Dashboards"
            ].map((feature, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                <Zap className="text-accent" size={16} style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="section section-border" style={{ textAlign: 'center', background: 'var(--color-bg-tertiary)' }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to transform your sales process?</h2>
          <p style={{ marginBottom: 'var(--space-8)' }}>Join the businesses taking their customer relationships to the next level.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">
            Request Demo Today
          </Link>
        </div>
      </section>

    </div>
  );
}
