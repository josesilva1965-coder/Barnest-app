## 2024-06-28 - Dynamic List Item Actions Accessibility
**Learning:** Icon-only action buttons within dynamic list items (like cart quantity controls) lack context for screen readers and tooltips for mouse users, and dynamic values like quantity aren't announced when they change.
**Action:** Use context-aware `aria-label` and `title` attributes that interpolate the item's name (e.g., "Increase quantity of Wagyu Burger"). Add `aria-live="polite"` and `aria-atomic="true"` to dynamic numeric values to ensure screen readers announce updates. Ensure focus states are visible.
