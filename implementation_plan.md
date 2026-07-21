# Plan: Fix Remaining Sidebar UI Issues 🔧

Based on the screenshot, there are 4 distinct issues to fix in the collapsed sidebar.

---

## Issues & Fixes

### 1. Scrollbar showing in collapsed nav area
**Root cause:** `.admin-sidebar-nav` has `overflow-y: auto` which creates a visible scrollbar in the narrow 72px column.  
**Fix:** Change to `overflow-y: hidden` when collapsed, or switch to `overflow: hidden` on the sidebar-level and only allow scroll in expanded mode.

#### [MODIFY] [admin.css](file:///f:/GIT-HUB/Projects/NOSKY/src/app/admin/admin.css)
- Add `.admin-sidebar.collapsed .admin-sidebar-nav { overflow-y: hidden; }` to suppress the scrollbar.

---

### 2. Overview (active nav) box overflowing — showing border/shadow outside the sidebar
**Root cause:** The `.admin-nav-item.active` has `box-shadow: 3px 3px 0px 0px` and `border: 2px solid` which extends beyond the 72px collapsed width. The `.collapsed-item` class sets `width: 100%` but the shadow and border still overflow.  
**Fix:** Remove `box-shadow` on collapsed active items. Use a simpler visual indicator (a solid background fill instead of a 3D box) when collapsed.

#### [MODIFY] [admin.css](file:///f:/GIT-HUB/Projects/NOSKY/src/app/admin/admin.css)
- Add `.admin-nav-item.collapsed-item.active { box-shadow: none; border: 2px solid var(--color-ink); background-color: #FFCC00; }` — golden yellow fill with no shadow overflow.

---

### 3. "Return to Site" — home icon and text not in a single horizontal row
**Root cause:** The `.admin-return-link` wraps because `.admin-sidebar-footer` uses `flex-direction: column` and the link itself doesn't enforce `flex-direction: row` + `flex-wrap: nowrap`.  
**Fix:** Add explicit `flex-direction: row; flex-wrap: nowrap;` to `.admin-return-link` so the home icon and text always sit side by side.

#### [MODIFY] [admin.css](file:///f:/GIT-HUB/Projects/NOSKY/src/app/admin/admin.css)
- Update `.admin-return-link` to include `flex-direction: row; flex-wrap: nowrap;`.

---

### 4. Collapsed state — should show ONLY the home icon button (no text)
**Root cause:** The JS already conditionally hides text with `{!isCollapsed && <span>...</span>}`, but the `.collapsed-return` class doesn't properly size the link to just fit the icon.  
**Fix:** Ensure `.admin-return-link.collapsed-return` has `width: auto; padding: 0.5rem;` so it snugly wraps the home icon only, centred in the footer.

#### [MODIFY] [admin.css](file:///f:/GIT-HUB/Projects/NOSKY/src/app/admin/admin.css)
- Update `.admin-return-link.collapsed-return` to `width: auto; padding: 0.5rem; margin: 0 auto;` for icon-only centred display.
- Update `.admin-sidebar.collapsed .admin-sidebar-footer` to `display: flex; align-items: center; justify-content: center;`.

---

## Files Changed

| File | Changes |
|---|---|
| [admin.css](file:///f:/GIT-HUB/Projects/NOSKY/src/app/admin/admin.css) | Fix scrollbar, active nav overflow, return link row layout, collapsed footer centering |

## Verification Plan
1. Open `http://localhost:3000/admin/content`
2. **Expanded:** Verify "Return to Site" shows home icon + text in a single row inside a 3D box
3. **Collapsed:** Click `«` — verify no scrollbar, active item is a clean golden pill (no shadow overflow), and only the home icon button shows at the bottom (centred, no text)
