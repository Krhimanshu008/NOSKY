## 2024-08-03 - SWR Mutate with Local State Replacement
**Learning:** When refactoring React components to replace local state (`useState`) with `useSWR` for data fetching, the old state setter (`setIsAuthenticated(false)`) is deleted. If other functions (like `handleLogout`) relied on this setter, deleting it causes a regression.
**Action:** Always scan the entire component for usages of the deleted state setter and replace them with SWR's `mutate('/api/path')` function to maintain correct UI synchronization and prevent functional regressions.

## 2024-08-03 - SWR Cache Key for Route Independence
**Learning:** Appending dynamic variables like `pathname` to an SWR key (e.g. `['/api/auth/check', pathname]`) to force a re-fetch on route change busts the cache and causes UI flashing (e.g., flash of unauthenticated state), defeating the purpose of the caching optimization.
**Action:** Keep the SWR key static (e.g., `'/api/auth/check'`) to share the cached state globally across the application without refetching and flashing on every route change.
