## 2024-05-18 - Accessible Cart Quantity Controls
**Learning:** Icon-only action buttons in high-traffic areas like carts need both `aria-label` and `title` to serve screen readers and mouse users, while dynamic numeric fields (like quantity) need `aria-live="polite"` to correctly announce updates.
**Action:** Always pair `aria-label` with `title` for icon-only buttons, use visible focus states, and apply `aria-live` on dynamically updating text quantities to ensure comprehensive accessibility.
