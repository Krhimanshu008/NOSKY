import re

with open('src/app/admin/analytics/page.js', 'r') as f:
    content = f.read()


search_str = """
      <div className="neo-grid-2" style={{ gap: '1.5rem', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {/* Scroll Depth Chart (simulated with bars) */}
        <div className="neo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MoveDown size={20}/> Scroll Depth Analytics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(() => {
              const milestones = stats.scrollMilestones || [];
              const milestoneMap = new Map();
              let maxCount = 1;

              for (const m of milestones) {
                milestoneMap.set(m._id, m);
                if (m.count > maxCount) maxCount = m.count;

              }

              return [25, 50, 75, 100].map(depth => {
                const stat = milestoneMap.get(depth) || { count: 0 };
                const width = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
                return (
                  <div key={depth}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                      <span>Scrolled {depth}%</span>
                      <span style={{ fontWeight: 600 }}>{stat.count} hits</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${width}%`, height: '100%', background: 'var(--color-blue)', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
"""

replace_str = """
      <div className="neo-grid-2" style={{ gap: '1.5rem', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {/* Scroll Depth Chart (simulated with bars) */}
        <div className="neo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MoveDown size={20}/> Scroll Depth Analytics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ScrollDepthChart milestones={stats.scrollMilestones} />
          </div>
        </div>
"""

content = content.replace(search_str[1:-1], replace_str[1:-1])

component = """

function ScrollDepthChart({ milestones = [] }) {
  const milestoneMap = new Map();
  let maxCount = 1;

  for (const m of milestones) {
    milestoneMap.set(m._id, m);
    if (m.count > maxCount) maxCount = m.count;
  }

  return (
    <>
      {[25, 50, 75, 100].map(depth => {
        const stat = milestoneMap.get(depth) || { count: 0 };
        const width = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
        return (
          <div key={depth}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
              <span>Scrolled {depth}%</span>
              <span style={{ fontWeight: 600 }}>{stat.count} hits</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${width}%`, height: '100%', background: 'var(--color-blue)', borderRadius: '4px' }}></div>
            </div>
          </div>
        );
      })}
    </>
  );
}
"""

content = content + component

with open('src/app/admin/analytics/page.js', 'w') as f:
    f.write(content)
