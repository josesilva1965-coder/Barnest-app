## 2026-05-31 - Context-Aware ARIA Labels for Dynamic Lists
**Learning:** When using icon-only buttons in dynamic lists (like a shopping cart), generic labels like 'Decrease quantity' are insufficient for screen readers. Users lose context of which item they are modifying.
**Action:** Always interpolate the specific item's name into the `aria-label` (e.g., `Decrease quantity of Wagyu Burger`) and ensure these buttons have visible focus states (`focus:ring-2 focus:ring-brand-secondary`) for keyboard navigability.
