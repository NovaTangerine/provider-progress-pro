

# List View Aesthetic and Structural Updates

## Overview
Four changes to the list view: update the "in progress" color from yellow to blue, add a provider journey stage toggle bar, introduce pre-credentialing category grouping for credentials, and restructure the expanded row layout to prioritize credentials while softening secondary info.

---

## 1. Change "In Progress" Status Color to Blue

Update the CSS custom properties for `--status-in-progress` from the current amber/yellow (`38 92% 50%`) to a calming blue tone.

**Files changed:** `src/index.css`
- Light mode: `--status-in-progress: 210 60% 50%` and `--status-in-progress-bg: 210 70% 95%`
- Dark mode: `--status-in-progress: 210 55% 55%` and `--status-in-progress-bg: 210 40% 15%`
- Also update the `urgencyStyles` in `RoleHeader.tsx` since the "urgent" badge currently references `status-in-progress` colors -- it should use its own amber/orange token so it remains visually distinct from the now-blue "in progress" status.

---

## 2. Provider Journey Stage Toggles

Add a row of toggle buttons above the table header: **Presented**, **Confirmed**, **Credentialing**, **On Assignment**. These represent the provider's stage in the recruiting pipeline (distinct from credential status).

**Files changed:**
- `src/types/recruiting.ts` -- Add a new `ProviderStage` type: `"presented" | "confirmed" | "credentialing" | "on_assignment"` (union type for easy future extension). Add a `stage` field to the `Provider` interface.
- `src/data/mockData.ts` -- Assign a `stage` to each mock provider.
- `src/pages/Index.tsx` -- Add state for the active stage filter. Render a toggle group (using the existing Radix toggle-group component) in the bar above the table. Filter the displayed providers based on the selected stage. Default to showing all if none selected, or highlight "Credentialing" as active.
- A new `StageToggle` component (or inline in Index) with pill-style buttons showing the stage name and a count of providers in that stage.

---

## 3. Pre-Credentialing Category Grouping

Before a provider reaches the "Credentialing" stage, their status is derived from three categories: **Identity Verification**, **State Licenses**, and **Board Certifications**. This requires grouping credentials into these buckets.

**Files changed:**
- `src/types/recruiting.ts` -- Add a `category` field to the `Credential` interface: `"identity_verification" | "state_license" | "board_certification" | "other"`.
- `src/data/mockData.ts` -- Add `category` values to each mock credential (e.g., State Medical License gets `"state_license"`, Board Certification gets `"board_certification"`, DEA/BLS/ACLS/Malpractice get `"other"` or `"identity_verification"` as appropriate).
- `src/components/ProviderRow.tsx` -- In the expanded view, group credentials under labeled section headers (Identity Verification, State Licenses, Board Certifications, Other) rather than a flat list. Each group shows its own aggregate status indicator.

---

## 4. Restructure Expanded Row Layout -- Credentials First, Softer Secondary Info

Redesign the expanded row from a 3-equal-column grid to a layout that gives credentials visual dominance.

**Files changed:** `src/components/ProviderRow.tsx`

**New layout:**
- Switch from `grid-cols-3` to a 2-column layout where credentials take roughly 60% width (left/main) and contact + education take 40% (right/sidebar).
- **Credentials column (left, ~60%):** Organized by category groups (from item 3 above). Each group has a header with an aggregate status dot. Credential cards remain clickable with modal triggers.
- **Secondary info column (right, ~40%):** Contact, education, and experience rendered with `text-muted-foreground` and smaller text (`text-xs`). Use lighter border colors and reduced font weights. Section headers use a softer gray rather than the current uppercase bold style. Icons use a more muted tone (`text-muted-foreground/60`).

---

## Technical Details

| File | Changes |
|------|---------|
| `src/index.css` | Update `--status-in-progress` HSL values from amber to blue (both light and dark themes) |
| `tailwind.config.ts` | No changes needed (already references the CSS variables) |
| `src/types/recruiting.ts` | Add `ProviderStage` type, add `stage` to `Provider`, add `category` to `Credential` |
| `src/data/mockData.ts` | Add `stage` and credential `category` values to mock data |
| `src/components/RoleHeader.tsx` | Decouple urgent badge color from `status-in-progress` (use a standalone amber token) |
| `src/pages/Index.tsx` | Add stage filter state, render stage toggle bar, filter providers |
| `src/components/ProviderRow.tsx` | Restructure expanded layout: credentials-first 60/40 split, grouped by category; softer styling for secondary info |

