

# Fix Layout Shift on Row Expand/Collapse

## Problem
When expanding a provider row, the table columns shift horizontally because the browser auto-calculates column widths. The expanded detail row (which spans all 7 columns) changes the content distribution, triggering a width recalculation across all columns.

## Solution
Apply `table-layout: fixed` to the table and assign explicit percentage widths to each column header. This locks column widths regardless of content changes.

## Changes

**File: `src/pages/Index.tsx`**
- Add `table-fixed` class to the `<table>` element
- Add explicit width classes to each `<th>`:
  - Chevron column: `w-[40px]`
  - Provider: `w-[25%]`
  - Status: `w-[12%]`
  - Credentials: `w-[18%]`
  - Type: `w-[12%]`
  - Available: `w-[15%]`
  - Current Org: remaining space (auto)

**File: `src/components/ProviderRow.tsx`**
- No structural changes needed; fixed layout on the table handles it

This is a minimal, single-file fix that prevents any column resizing when rows expand or collapse.
