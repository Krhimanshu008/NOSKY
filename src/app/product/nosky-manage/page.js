import Link from 'next/link';
import { 
  Users, CalendarDays, Clock, ShieldCheck, Database, Server, RefreshCcw, FileText, 
  Settings, UserPlus, MonitorPlay, HelpCircle, Activity, Building2, UserCircle, MessageSquare, Briefcase, Zap, GitCommit, CheckCircle, ArrowDown, LogOut, Laptop, Plane, MapPin
} from 'lucide-react';
import CTASection from '@/components/ui/CTASection';

export const metadata = {
  title: 'NoSky Manage 2.0 - Enterprise Workforce Management Platform',
  description: 'Empower Your Workforce. Simplify HR Operations. A modern workforce management platform for attendance, leave, payroll, and performance.',
};

const pipelineSteps = [
  "Candidate Selected",
  "Employee Onboarding",
  "Employee Profile Creation",
  "Attendance Tracking",
  "Leave Management",
  "Task & Ticket Management",
  "Performance Evaluation",
  "Payroll Processing",
  "Employee Communication",
  "Asset Management",
  "Exit Management"
];

const coreModules = [
  {
    icon: <Clock size={28} className="text-accent" />,
    title: "Attendance Management",
    desc: "Track employee attendance accurately with automated time logging, real-time visibility, shifts, and analytics.",
    items: ["Clock In / Clock Out", "Daily Attendance", "Weekly & Monthly Reports", "Late Arrival Tracking"]
  },
  {
    icon: <CalendarDays size={28} className="text-blue" />,
    title: "Leave Management",
    desc: "Simplify leave administration with configurable leave policies and digital multi-level approval workflows.",
    items: ["Leave Requests", "Approval Workflow", "Leave Balance Tracking", "Holiday Calendar"]
  },
  {
    icon: <UserCircle size={28} className="text-success" />,
    title: "Employee Self-Service",
    desc: "Empower employees to manage their own information, download documents, and apply for leave independently.",
    items: ["Update Profile", "Download Documents", "View Payroll Info", "Track Requests"]
  },
  {
    icon: <Building2 size={28} className="text-accent" />,
    title: "Organization Management",
    desc: "Maintain a centralized employee directory with organizational hierarchy and detailed reporting structures.",
    items: ["Employee Profiles", "Department Management", "Reporting Structure", "Organization Chart"]
  },
  {
    icon: <Activity size={28} className="text-blue" />,
    title: "Performance Management",
    desc: "Support continuous employee growth through structured performance tracking, feedback, and evaluations.",
    items: ["Performance Reviews", "Goals & KPIs", "Manager Feedback", "Review Cycles"]
  },
  {
    icon: <Laptop size={28} className="text-success" />,
    title: "Asset Management",
    desc: "Track company-owned assets assigned to employees from allocation through recovery.",
    items: ["Laptops & Devices", "Software Licenses", "Asset Allocation", "Asset Returns"]
  },
  {
    icon: <HelpCircle size={28} className="text-accent" />,
    title: "Employee Helpdesk",
    desc: "Enable employees to raise internal requests through a centralized IT, HR, or Admin ticketing system.",
    items: ["HR Support", "IT Support", "Facilities", "Ticket Resolution"]
  },
  {
    icon: <FileText size={28} className="text-blue" />,
    title: "Payroll Integration",
    desc: "Provide employees with secure access to payroll-related information, earnings, and deductions.",
    items: ["Salary Slips", "Payroll History", "Earnings Breakdown", "Tax Information"]
  },
  {
    icon: <MessageSquare size={28} className="text-success" />,
    title: "Employee Communication",
    desc: "Keep everyone informed through a centralized communication hub for notices and policies.",
    items: ["Company Notices", "Announcements", "Policy Updates", "Events"]
  },
  {
    icon: <LogOut size={28} className="text-accent" />,
    title: "Onboarding & Exit",
    desc: "Digitize employee joining and separation processes with automated checklists and clearance workflows.",
    items: ["Document Collection", "Policy Acceptance", "Clearance Workflow", "Asset Recovery"]
  }
];

const roadmapFeatures = [
  "Workflow Automation Engine",
  "Document Management & e-Signatures",
  "Recruitment & Applicant Tracking (ATS)",
  "AI-powered HR Assistant",
  "Timesheets & Project Tracking",
  "Shift & Rostering Management",
  "Geo-fenced Attendance with Face Recognition",
  "Visitor & Reception Management",
  "Expense & Travel Claims",
  "Training & Learning Management (LMS)",
  "OKR/KPI & Goal Management",
  "Employee Surveys & Engagement",
  "API Integrations with ERP, CRM",
  "Mobile Apps (Android & iOS)",
  "Multi-company & Multi-branch support",
  "Comprehensive Audit Trails"
];

const benefits = [
  "Centralized Workforce Management",
  "Improved Employee Experience",
  "Reduced Administrative Work",
  "Faster HR Operations",
  "Paperless Workflows",
  "Better Team Collaboration",
  "Real-Time Workforce Visibility",
  "Secure Employee Data Management",
  "Scalable Cloud Architecture",
  "Enterprise-Ready Platform"
];

const industries = [
  "Information Technology",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Education",
  "Financial Services",
  "Professional Services",
  "Logistics",
  "Construction",
  "Government Organizations"
];

export default function NoskyManagePage() {
  return (
    <div className="manage-page">
      {/* ── HERO ── */}
      <section className="section section-lg" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-20))', textAlign: 'center', background: 'var(--gradient-hero)' }}>
        <div className="container container-narrow flex-col flex-center">
          <div className="badge badge-accent" style={{ marginBottom: 'var(--space-6)' }}>
            Enterprise Workforce Management Platform
          </div>
          
          <h1 style={{ marginBottom: 'var(--space-6)' }}>
            NoSky <span className="text-gradient-blue">Manage 2.0</span>
          </h1>
          
          <h4 style={{ marginBottom: 'var(--space-8)', color: 'var(--color-text-primary)' }}>
            Empower Your Workforce. Simplify HR Operations.
          </h4>
          
          <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)', maxWidth: '800px', color: 'var(--color-text-secondary)' }}>
            NoSky Manage 2.0 is a modern workforce management platform that centralizes attendance, leave, payroll, employee records, performance, assets, helpdesk, onboarding, and organizational communication into one secure digital workspace.
          </p>
          
          <div className="card card-highlight" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-4) var(--space-8)' }}>
            <span style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-primary)' }}>
              Designed for organizations of every size, Manage 2.0 helps HR teams automate routine operations while providing employees with a seamless self-service experience.
            </span>
          </div>

          <div className="flex flex-center flex-gap-4">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Book a Demo
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW & DASHBOARD ── */}
      <section className="section section-border">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 'var(--space-12)' }}>
            <div>
              <div className="badge" style={{ marginBottom: 'var(--space-4)' }}>Overview</div>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>One Platform. Every Employee Journey.</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Managing people shouldn&apos;t require multiple applications or spreadsheets. NoSky Manage 2.0 brings together every stage of the employee lifecycle—from recruitment and onboarding to attendance, payroll, performance, and exit management—into a unified, cloud-based platform.
              </p>
              <br/>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Whether your workforce operates from a single office or multiple locations, Manage 2.0 ensures complete visibility, improved collaboration, and efficient workforce administration.
              </p>
            </div>
            
            <div>
              <div className="badge badge-accent" style={{ marginBottom: 'var(--space-4)' }}>The Dashboard</div>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Everything You Need, Right on Your Dashboard</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                The personalized dashboard gives employees and managers instant access to the information that matters most.
              </p>
              <br/>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {["Today's attendance", "Working hours", "Leave balance", "Weekly summary", "Team availability", "Company announcements", "Pending requests", "Quick actions"].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <CheckCircle size={16} className="text-success" /> <span style={{ fontSize: 'var(--text-sm)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── EMPLOYEE LIFECYCLE (PIPELINE) ── */}
      <section className="section section-alt section-border">
        <div className="container">
          <div className="section-header text-center">
            <h2>The Employee Lifecycle</h2>
            <p>A structured, end-to-end digital experience for your workforce.</p>
          </div>

          <div style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
            {pipelineSteps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="badge badge-blue" style={{ padding: 'var(--space-3) var(--space-8)', fontSize: 'var(--text-sm)', minWidth: '300px', justifyContent: 'center' }}>
                  {step}
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <ArrowDown className="text-muted" style={{ margin: 'var(--space-2) 0' }} size={20} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE MODULES MEGA-GRID ── */}
      <section className="section section-border">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-accent">Core Modules</span>
            <h2>Comprehensive HR Capabilities</h2>
            <p>Everything your organization needs to scale operations and empower teams.</p>
          </div>

          <div className="grid grid-3" style={{ marginTop: 'var(--space-12)' }}>
            {coreModules.map((mod, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: 'var(--space-4)' }}>{mod.icon}</div>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>{mod.title}</h3>
                <p className="card-desc" style={{ flexGrow: 1, marginBottom: 'var(--space-4)' }}>{mod.desc}</p>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {mod.items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW & ANALYTICS ── */}
      <section className="section section-alt section-border">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 'var(--space-12)' }}>
            <div>
              <div className="card" style={{ height: '100%' }}>
                <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Zap className="text-accent" /> Workflow Automation</h3>
                <p className="card-desc" style={{ marginBottom: 'var(--space-6)' }}>
                  NoSky Manage 2.0 eliminates repetitive administrative work by digitizing approval workflows and employee processes.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {["Leave Approval", "Attendance Regularization", "Ticket Assignment", "Asset Requests", "Onboarding Tasks", "Exit Clearances", "Payroll Requests"].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <GitCommit size={16} className="text-accent" /> <span style={{ fontWeight: 500 }}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="card" style={{ height: '100%' }}>
                <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Activity className="text-blue" /> Analytics & Reporting</h3>
                <p className="card-desc" style={{ marginBottom: 'var(--space-6)' }}>
                  Generate comprehensive reports across all HR operations. Interactive dashboards provide leadership with actionable insights for better workforce planning.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {["Attendance Trends", "Leave Utilization", "Employee Productivity", "Department Statistics", "Workforce Strength", "Asset Allocation", "Ticket Resolution"].map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <MonitorPlay size={16} className="text-blue" /> <span style={{ fontWeight: 500 }}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY, BENEFITS & INDUSTRIES ── */}
      <section className="section section-border">
        <div className="container">
          <div className="grid grid-3" style={{ gap: 'var(--space-8)' }}>
            <div>
              <h3 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><ShieldCheck className="text-success"/> Enterprise Security</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {["Role-Based Access Control (RBAC)", "Secure Authentication", "Audit Logs", "Activity Tracking", "Data Encryption", "Secure Cloud Infrastructure", "Backup & Recovery"].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-md)' }}>
                    <CheckCircle size={16} className="text-success" style={{ flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Zap className="text-accent"/> Why Choose Manage 2.0</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {benefits.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-md)' }}>
                    <CheckCircle size={16} className="text-accent" style={{ flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Building2 className="text-blue"/> Industries We Serve</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {industries.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-md)' }}>
                    <Briefcase size={16} className="text-blue" style={{ flexShrink: 0 }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FUTURE-READY ROADMAP ── */}
      <section className="section section-alt section-border">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-accent">Product Vision</span>
            <h2>The Digital Workplace Roadmap</h2>
            <p>We are continuously evolving Manage 2.0 to be the most comprehensive Digital Workplace Platform. Here is what&apos;s coming.</p>
          </div>

          <div className="card" style={{ marginTop: 'var(--space-12)' }}>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {roadmapFeatures.map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ padding: 'var(--space-2)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <Zap size={14} className="text-accent" />
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        title="Transform the Way You Manage Your Workforce"
        subtitle="Streamline HR operations, empower employees, and build a more connected organization with NoSky Manage 2.0."
        primaryText="Book a Demonstration"
        primaryHref="/contact"
        secondaryText="Contact Sales"
        secondaryHref="/contact"
      />
    </div>
  );
}
