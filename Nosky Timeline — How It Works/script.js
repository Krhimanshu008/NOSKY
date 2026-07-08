(function () {
  const steps = document.querySelectorAll('.step');
  const timeline = document.getElementById('timeline');
  const progressFill = document.querySelector('.progress-fill');
  const progressSvg = document.querySelector('.progress-svg');

  if (!progressFill) return;

  // Reveal cards when they enter viewport
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -80px 0px' });

  steps.forEach(step => revealObserver.observe(step));

  // Progress line + active node based on scroll position
  function updateProgress() {
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // Progress: 0 when timeline top hits viewport bottom,
    // 1 when timeline bottom hits viewport center.
    const start = viewportH * 0.9;         // start filling once timeline is 10% into view
    const end   = viewportH * 0.3;         // stop when timeline top is near top

    const total = rect.height;
    let progress = (start - rect.top) / (total + start - end);
    progress = Math.max(0, Math.min(1, progress));

    // Set stroke-dashoffset based on progress. Use actual path length via viewBox height.
    // Our viewBox is 0 0 4 1000, so length ≈ 1000
    const length = 1000;
    progressFill.style.strokeDasharray = length;
    progressFill.style.strokeDashoffset = length * (1 - progress);

    // Determine which step should be "active" — the one whose node is closest to viewport center
    const centerY = viewportH * 0.45;
    let activeIdx = -1;
    let minDist = Infinity;
    steps.forEach((step, i) => {
      const node = step.querySelector('.step-node');
      const r = node.getBoundingClientRect();
      const nodeCenter = r.top + r.height / 2;
      const dist = Math.abs(nodeCenter - centerY);
      // only consider steps whose node has been reached (top < centerY + some slack)
      if (nodeCenter < centerY + 80 && dist < minDist) {
        minDist = dist;
        activeIdx = i;
      }
    });

    steps.forEach((step, i) => {
      step.classList.toggle('active', i === activeIdx);
    });
  }

  // Adjust the SVG viewBox height to the actual timeline pixel height for consistent scaling
  function syncSvgHeight() {
    const h = timeline.offsetHeight;
    if (h > 0) {
      progressSvg.setAttribute('viewBox', `0 0 4 ${h}`);
      const track = document.querySelector('.progress-track');
      const fill = document.querySelector('.progress-fill');
      track.setAttribute('y2', h);
      fill.setAttribute('y2', h);
      // update dasharray for the new length
      fill.style.strokeDasharray = h;
      fill.style.strokeDashoffset = h;
    }
  }

  window.addEventListener('load', () => {
    syncSvgHeight();
    updateProgress();
  });
  window.addEventListener('resize', () => {
    syncSvgHeight();
    updateProgress();
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Kickoff (in case load already fired)
  syncSvgHeight();
  updateProgress();
})();
