## 2024-08-04 - SWR for Auth State on Route Navigation
**Learning:** In Next.js client components like the global `Header.jsx`, checking auth state directly with `fetch()` inside a `useEffect` dependent on `[pathname]` causes redundant API calls on every route change (which busts cache).
**Action:** Replace `useState` + `fetch` inside `useEffect` with `useSWR` (e.g. `const { data } = useSWR('/api/auth/check', fetcher)`). SWR automatically caches the result and deduplicates requests across route changes, significantly reducing network overhead while maintaining sync.
