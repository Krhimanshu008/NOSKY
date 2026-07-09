export default function Loading() {
  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + var(--space-12))', paddingBottom: 'var(--space-24)' }}>
      <div className="container">
        {/* Header Skeleton */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: 'var(--space-16)' }}>
          <div className="pill-wrap" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="skeleton" style={{ width: '140px', height: '28px', borderRadius: '999px', margin: '0 auto' }}></div>
          </div>
          <div className="skeleton skeleton-text-lg" style={{ height: '48px', width: '70%', margin: '0 auto', marginBottom: 'var(--space-4)' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '20px', width: '50%', margin: '0 auto' }}></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid-3" style={{ gap: 'var(--space-6)' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass skeleton-card" style={{ padding: 0 }}>
              <div className="skeleton skeleton-image"></div>
              <div style={{ padding: 'var(--space-6)' }}>
                <div className="skeleton skeleton-text-sm" style={{ marginBottom: 'var(--space-4)' }}></div>
                <div className="skeleton skeleton-text-lg" style={{ width: '85%' }}></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '75%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
