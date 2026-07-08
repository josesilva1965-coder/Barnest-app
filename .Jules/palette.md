
## 2024-07-08 - Accessible Tooltips and Live Regions for Quantity Controls
**Learning:** Icon-only quantity controls (like plus, minus, and trash buttons) lack explicit hover tooltips for mouse users and ARIA labels for screen readers. Furthermore, dynamic numeric displays like cart quantities require `aria-live` regions to announce updates accurately to screen reader users without redundant context.
**Action:** Always combine `title` and `aria-label` on icon-only buttons for comprehensive accessibility. Use `focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:outline-none` for visible focus states. Apply `aria-live="polite"` and `aria-atomic="true"` to containers displaying dynamic numeric values.
