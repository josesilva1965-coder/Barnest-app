## 2024-05-23 - Accessible Icon-Only Buttons and Dynamic Quantities
**Learning:** Icon-only buttons for quantity adjustments (like +/- in a cart) often lack proper labels for screen readers and tooltips for mouse users, and screen readers may miss dynamic quantity updates if `aria-live` is not used.
**Action:** Always add `aria-label` and `title` to icon-only buttons, include visible focus states (`focus-visible:ring-2 focus-visible:outline-none`), and use `aria-live="polite"` with `aria-atomic="true"` on elements displaying dynamic numeric values.
