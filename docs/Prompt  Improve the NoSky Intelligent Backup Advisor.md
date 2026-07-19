# Prompt: Improve the NoSky Intelligent Backup Advisor

Copy everything below this line into your IDE's AI agent (Cursor / Copilot / Windsurf) with the repo open.

---

You are working on the **NoSky Intelligent Backup Advisor**, a feature inside a Next.js (App Router) + Tailwind site. The relevant files are:

```
app/advisor/page.tsx
app/api/advisor/analyze/route.ts     # LLM endpoint for AI mode
app/api/leads/route.ts
components/advisor/AdvisorApp.tsx    # state machine: intro → wizard/ai → analyzing → report
components/advisor/Intro.tsx         # mode-choice cards
components/advisor/Wizard.tsx        # 5-step guided wizard
components/advisor/AiMode.tsx        # free-text "describe your business" mode
components/advisor/Analyzing.tsx
components/advisor/Report.tsx        # recommendation report
components/advisor/HealthScorePanel.tsx
components/advisor/ui.tsx            # shared primitives
lib/advisor/types.ts
lib/advisor/softwareDb.ts            # ~100 software profiles with backup traits
lib/advisor/rulesEngine.ts           # deterministic recommendation engine
lib/advisor/keywordMatch.ts          # fallback parser for AI mode
lib/advisor/healthScore.ts
```

Implement the following three improvements. Keep the existing dark-navy + amber (#F5B841) NoSky styling, Inter/JetBrains Mono fonts, and the framework-portable style of the components (plain React + Tailwind, no new UI libraries). Do not break the existing wizard flow, report layout, or API contracts more than specified below.

---

## Task 1 — Make AI mode a guided intake, not a bare textarea

**Problem:** `AiMode.tsx` currently shows one textarea with the copy "Tell us in plain English what you do. Our AI drafts your strategy." Users don't know WHAT to tell us, so descriptions miss critical facts (data formats, volume, where data lives, retention needs) and the AI has to guess.

**Changes:**

1. In `AiMode.tsx`, replace the single bare textarea with a **structured intake** that still feels conversational:
   - Keep one main textarea ("What does your business do?") but add above it a short helper checklist titled **"Help our AI help you — try to mention:"** with 6 pill-style hint chips. Clicking a chip appends a starter sentence into the textarea at the cursor:
     - "What you do" → `We are a ____ business. `
     - "Software you use" → `We mainly use ____. `
     - "Data formats" → `Our data is mostly ____ files (e.g. PSD, MP4, DB, XLSX, PDF). `
     - "Data size today" → `We currently have about ____ GB/TB of data. `
     - "Where it lives" → `It is stored on ____ (local PCs / NAS / server / cloud). `
     - "How long to keep" → `We need to keep data for ____ (e.g. 90 days / 7 years). `
   - Below the textarea, add 4 **optional quick-answer fields** (compact selects/inputs in a 2×2 grid, all optional, labeled "Optional — improves accuracy"):
     - **Primary data formats** (multi-select chips): Documents & spreadsheets · Design files (PSD/AI) · Photos (RAW/JPEG) · Video footage · Databases · Code repositories · Email archives · CAD/3D models · Scans & PDFs
     - **Approximate current data size**: select — Under 50 GB / 50–250 GB / 250 GB–1 TB / 1–5 TB / 5–20 TB / 20 TB+ / Not sure
     - **Where data lives** (multi-select): Local computers / NAS / External drives / Server / Cloud / Virtual machines
     - **Retention requirement**: select — No specific need / 90 days / 1 year / 7 years (compliance) / Forever
   - Update the mode-card copy in `Intro.tsx` for AI mode to: **"Describe your business — answer a few quick prompts about what you do, what data you create and where it lives. Our AI turns it into a precise backup strategy."**

2. **Client → API contract:** send `{ description, structured: { formats[], currentSizeBand, locations[], retention } }` to `/api/advisor/analyze`. All structured fields optional.

3. In `app/api/advisor/analyze/route.ts`:
   - Merge structured answers into the LLM prompt as authoritative facts ("The user explicitly stated: current data ≈ X, formats: Y, ..."). Explicit user facts MUST override inferred values (e.g. if the user says 20 TB, never recommend less than ~1.5× that).
   - Add to the system prompt an instruction to return a new field `assumptions: string[]` — every fact the model had to ASSUME because the user didn't provide it (e.g. "Assumed ~5 employees — not specified").
   - Extend the zod schema and `lib/advisor/types.ts` accordingly (`assumptions?: string[]` on the recommendation/profile).
   - Keep the keyword fallback in `keywordMatch.ts` working: it should also consume the structured fields (they're deterministic — use them directly) and populate `assumptions` for anything missing.

4. In `Report.tsx`, when `assumptions` is non-empty, render an amber-bordered note card **"What we assumed"** listing them, with a line: "Not right? Re-run the advisor with more detail for a sharper plan."

---

## Task 2 — Show HOW storage is calculated in the report

**Problem:** The report shows "Recommended Storage: 500 GB" as a magic number. Users (and sales calls) need the math.

**Changes:**

1. In `lib/advisor/rulesEngine.ts`, extend the output type with a `storageBreakdown` object computed alongside the recommendation:

```ts
storageBreakdown: {
  baseDataGB: number;            // estimated/declared current data
  baseDataSource: 'user-stated' | 'estimated-from-software';
  perSoftware: { name: string; monthlyGrowthGB: number }[];  // top contributors, descending
  teamMultiplier: number;        // and the team-size band it came from
  locationFactor: number;        // e.g. 1.3 for NAS/server/VM
  monthlyGrowthGB: number;       // Σ perSoftware × teamMultiplier × locationFactor
  projectionMonths: number;      // 12
  projectedGB: number;           // baseData + months × monthlyGrowth
  safetyBuffer: number;          // e.g. 1.25 for versioning/retention overhead — make retention-aware (7-year retention ⇒ larger buffer, e.g. 1.5)
  rawTotalGB: number;
  roundedTo: string;             // "500 GB" — round UP to the next friendly tier, never down
}
```

2. In `Report.tsx`, add a collapsible section **"How we calculated your storage"** directly under the storage rows:
   - A step-by-step receipt in JetBrains Mono, e.g.:
     ```
     Current data (estimated)              120 GB
     Growth: Premiere Pro                  +40 GB/mo
     Growth: Photoshop                     +6 GB/mo
     Growth: Lightroom                     +4 GB/mo
     Team factor (6–20 people)             × 8
     Storage factor (NAS)                  × 1.3
     ───────────────────────────────────────────
     Projected 12-month growth             ~520 GB
     Versioning & retention buffer         × 1.25
     ───────────────────────────────────────────
     Total                                 ~800 GB → rounded to 1 TB
     ```
   - One plain-English sentence under it: "We size for 12 months of growth plus versioning overhead, so you don't outgrow your plan mid-year."
   - AI mode must populate the same breakdown (LLM returns its numbers into this structure; the zod schema clamps them; fallback computes it via the rules engine).

3. **Sanity-check the math while you're in there** (Task 3 fixes deeper logic, but verify here): per-user monthly growth × team multiplier must not double-count — `monthlyGrowthGB` in `softwareDb.ts` is per-user, the team multiplier converts to org-wide. Add a comment stating this convention. Cap absurd outputs (e.g. a 1-person "Excel only" business should never exceed 250 GB recommended).

---

## Task 3 — Handle multi-industry firms and unrelated software stacks

**Problem:** Step 1 of `Wizard.tsx` forces ONE industry, and profile detection assumes a coherent stack. Real firms are hybrids (e.g. an architecture firm that also does video walkthroughs and runs Tally for accounts), and some stacks look "unrelated". The engine must handle heterogeneous inputs logically.

**Changes:**

1. **Wizard Step 1 → multi-select.** In `Wizard.tsx`, allow selecting **up to 3 industries** (chips show "Primary" on the first selection; user can reorder by clicking). Update copy: "What do you do? Select all that apply — many firms do more than one thing." Update `Intro.tsx` guided-mode card copy to: "Pick your industries, software and data — even a mixed stack maps to one precise plan."

2. **Software picker (Step 2):** already shows all categories, but float ALL selected industries' categories to the top (not just one). Never hide or filter out software just because it doesn't match the chosen industries — unrelated selections are valid signal, not noise.

3. **`lib/advisor/rulesEngine.ts` — segment-based engine.** Refactor profile detection and aggregation:
   - Group selected software into **workload segments** by category (e.g. finance, video, cad, database, dev, office). A segment = category + its software + its aggregated traits.
   - **Business type**: derive from industries (multi) + dominant segments. If industries = [Architecture, Media] → "Architecture & Media Studio". If software segments strongly disagree with the chosen industry (e.g. industry=Retail but 80% of growth comes from video software), append the detected workload: "Retail Business · heavy video workload". Never error or force a single label.
   - **Storage**: sum per-segment growth (this already works additively — verify), but apply the team multiplier **per segment with a usage share**, not globally: assume not every employee uses every tool. Default shares: office/email/finance = 100% of team; specialist tools (video, cad, dev, design) = 40% of team unless that segment's industry was selected (then 70%). Round shares to at least 1 user. Document this in comments and reflect it in the Task 2 breakdown (`perSoftware` becomes per-segment lines with their effective user counts, e.g. "Growth: Video segment (8 of 20 staff) +320 GB/mo").
   - **Backup interval**: keep min-across-segments for the headline interval, but add per-segment schedules to `plan.extras` when segments differ meaningfully, e.g. "Accounting data (Tally): every 30 min", "Video projects: every 15 min, SSD cache", "Databases: every 15 min, db-aware". This is more honest than one global number.
   - **Retention**: take the MAX across segments/industries (compliance wins). If one segment forces 7 years, note in `reasoning` that it applies to that data class, e.g. "7-year retention driven by your accounting/legal data; media projects use 180-day versioning."
   - **Risk level & DR scores**: worst-case across segments (a critical segment makes the firm's risk High even if other segments are relaxed).
   - **Plan tier**: evaluate against the combined totals (post-refactor storage + team + compliance), same thresholds as now.
4. **`Report.tsx`**: when there are ≥2 segments, add a compact **"Your workloads"** strip above the plan table: one row per segment (icon, name, growth/mo, interval, retention) so mixed businesses see themselves reflected.
5. **AI route + fallback**: pass the same segment logic — `keywordMatch.ts` should map matched software into segments and reuse the engine; the LLM prompt should mention segments exist so its JSON aligns.

---

## Acceptance tests (verify all before finishing)

1. **Hybrid firm:** Wizard with industries [Architecture, Media & Video] + software [AutoCAD, Revit, Premiere Pro, Tally, Excel], NAS, 6–20 staff, "Business stops" → report shows a blended business type, a workloads strip with ≥3 segments, per-segment schedules in extras, retention driven by Tally (90d+) with media versioning noted, and a storage breakdown whose lines multiply out to the shown total.
2. **Unrelated stack:** industry [Retail] + software [DaVinci Resolve, SQL Server] → no crash, business type appends detected workloads, interval ≤15 min (db + video), sane storage.
3. **Tiny business floor:** [Accounting], [Excel] only, 1–5 staff, "Can recreate" → recommended storage ≤ 250 GB, Starter tier.
4. **AI mode with structured answers:** description "wedding videography" + formats [Video footage], size 5–20 TB, NAS, 7 years → recommendation ≥ 1.5× stated size, `assumptions` empty for provided facts, storage breakdown shows user-stated base, "What we assumed" hidden or minimal.
5. **AI mode sparse input:** description "small shop" and nothing else → fallback still renders a full report with several `assumptions` listed and the assumed-values note card visible.
6. **Math audit:** for each canonical case, manually multiply the breakdown lines and confirm they equal `rawTotalGB`, and `roundedTo` only rounds UP.
7. Mobile 375px: intake grid stacks to 1 column, breakdown receipt scrolls horizontally instead of wrapping mid-number, workloads strip stacks.

Run the type-checker and existing build; fix all errors. Do not introduce localStorage/sessionStorage. Keep all copy in the same tone as the rest of the site.
