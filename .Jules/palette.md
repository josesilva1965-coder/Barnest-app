## 2024-05-19 - Shopping Cart ARIA Labels

**Learning:** When displaying a shopping cart with list items, icon-only action buttons (increase/decrease/remove quantity) must include context-aware `aria-label` attributes that interpolate the item's name. Otherwise, screen reader users will encounter a confusing wall of "minus", "plus", "trash" buttons without knowing which item they affect. Using `aria-live="polite"` on the quantity display is also crucial for announcing changes gracefully.
**Action:** Always verify icon-only buttons in dynamic lists have specific, interpolated `aria-label`s and check for keyboard focus rings (`focus-visible`).
