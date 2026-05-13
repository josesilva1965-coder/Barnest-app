## 2024-05-18 - Dynamic Cart Quantity Accessibility
**Learning:** Icon-only buttons in dynamic lists (like "increase/decrease" buttons in a shopping cart) are confusing for screen reader users if they don't include the item's name in their `aria-label`. Similarly, the quantity number needs `aria-live="polite"` and `aria-atomic="true"` so screen readers announce it immediately when changed.
**Action:** Always interpolate the item's name into the `aria-label` (e.g. `Decrease quantity of Wagyu Burger`) and apply `aria-live` to the number container for dynamic list items.
