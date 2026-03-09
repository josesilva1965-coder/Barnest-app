## 2024-01-01 - Initial Setup\n**Learning:** Created palette.md journal.\n**Action:** Will log critical learnings here.

## 2026-03-09 - Context-Aware ARIA Labels for Dynamic Lists
**Learning:** Icon-only buttons in dynamic list items (like cart quantity controls) require context-aware `aria-label`s (e.g., "Increase quantity of Burger") rather than generic labels like "Increase". Additionally, `aria-live="polite"` should be added to the container holding the dynamic value (the quantity) so screen readers announce the changes.
**Action:** Always interpolate item names into ARIA labels for list item actions and use `aria-live` on containers for dynamic numeric values.
