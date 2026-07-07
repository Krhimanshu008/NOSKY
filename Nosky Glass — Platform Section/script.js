// Mouse-follow shine on cards + subtle 3D tilt
(function () {
  const tiltables = document.querySelectorAll('[data-tilt]');

  tiltables.forEach((el) => {
    const isHero = el.classList.contains('hero-card');
    const maxTilt = isHero ? 4 : 8; // hero tilts less

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;

      // Shine position
      el.style.setProperty('--mx', px + '%');
      el.style.setProperty('--my', py + '%');

      // 3D tilt
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -maxTilt;
      const ry = ((x - cx) / cx) * maxTilt;
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${isHero ? 0 : -6}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // Parallax on aurora blobs — soft response to mouse position
  const blobs = document.querySelectorAll('.blob');
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    blobs.forEach((b, i) => {
      const strength = (i + 1) * 12;
      b.style.translate = `${dx * strength}px ${dy * strength}px`;
    });
  });
})();
