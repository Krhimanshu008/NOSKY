export default function Loading() {
  return (
    <article className="article-detail" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-12))', paddingBottom: 'var(--space-24)' }}>
      {/* Hero Skeleton */}
      <header className="article-hero" style={{ textAlign: 'center', padding: 'var(--space-12) 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="skeleton skeleton-text" style={{ width: '120px', height: '20px', margin: '0 auto', marginBottom: 'var(--space-6)', borderRadius: '999px' }}></div>
          <div className="skeleton skeleton-text-lg" style={{ height: '60px', width: '90%', margin: '0 auto', marginBottom: 'var(--space-6)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)' }}>
            <div className="skeleton skeleton-text" style={{ width: '120px', height: '16px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '120px', height: '16px' }}></div>
          </div>
        </div>
      </header>

      <div className="container" style={{ maxWidth: '800px', marginTop: 'var(--space-12)' }}>
        <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-12)' }}></div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
        </div>
      </div>
    </article>
  );
}
