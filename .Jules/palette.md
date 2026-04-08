## 2026-04-08 - Dynamic Cart Updates A11y
**Learning:** Icon-only action buttons (increase/decrease/remove quantity) within dynamic list items, and containers displaying dynamic numeric values (like cart quantities), need context-aware `aria-label`s and ARIA live regions respectively to ensure clear feedback for screen reader users when quantities update.
**Action:** Always add context-aware `aria-label`s (interpolating the item's name) to action buttons in carts, and use `aria-live="polite"` and `aria-atomic="true"` on containers displaying dynamic numeric values.
