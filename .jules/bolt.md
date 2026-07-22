## 2025-02-28 - Removing Synchronous Layout Thrashing
**Learning:** Calling `getBoundingClientRect()` and reading `offsetHeight` repeatedly inside a scroll event loop forces the browser to recalculate layouts synchronously, leading to severe performance thrashing (scroll jank).
**Action:** Instead of measuring layouts dynamically on scroll, pre-calculate measurements beforehand (e.g., in a resize listener or before scroll loop starts) and combine them with `window.scrollY` to compute absolute offsets.
