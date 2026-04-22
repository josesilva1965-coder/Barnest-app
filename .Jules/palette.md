## 2024-05-18 - Dynamic Item Context in ARIA Labels
**Learning:** Found that generic icon buttons (e.g., "+" or "-") in dynamic lists like the POS/Cart lack context for screen readers when items share the same visual structure. Simply adding `aria-label="Increase quantity"` is insufficient as it doesn't specify *which* item is being targeted.
**Action:** Always interpolate the dynamic item's name into the `aria-label` for list actions (e.g., `aria-label="Increase quantity of ${item.name}"`) to provide unambiguous context to assistive technologies.
