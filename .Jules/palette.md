## 2024-06-22 - Accessible Cart Quantity Controls
**Learning:** Icon-only buttons in dynamic lists (like cart quantities) lack context for screen readers and tooltips for mouse users, and dynamic quantities aren't announced when changed.
**Action:** Always include context-aware `aria-label`s (interpolating item name), native `title` attributes, visible focus states (`focus-visible`), and wrap dynamic values in `aria-live="polite"` containers.
