
## 2026-05-28 - Dynamic List Control Accessibility
**Learning:** In dynamic cart lists (like POS and Customer Order), generic icon buttons ("+" / "-") and simple text quantity displays present major barriers for screen reader users. They cannot discern which item is being modified or reliably hear quantity updates.
**Action:** Always interpolate item names into `aria-label`s for list item controls (e.g., `Decrease quantity of Wagyu Burger`), ensure visible keyboard focus states (e.g. `focus:ring-2`), and wrap numeric states in `aria-live="polite"` containers so screen readers announce changes dynamically.
