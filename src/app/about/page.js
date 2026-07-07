export default function AboutPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1>About Us</h1>
      <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)' }}>
        Learn more about NoSky and our mission.
      </p>
    </div>
  );
}
