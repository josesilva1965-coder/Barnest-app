## 2024-04-09 - POS Screen Screen Reader and Keyboard Navigation Fixes
**Learning:** Icon-only buttons used for cart quantity adjustments lacked context for screen readers and visible focus states for keyboard users.
**Action:** Always add context-aware `aria-label`s to icon-only buttons (e.g., "Decrease quantity of [item name]") and use `aria-live="polite"` on the quantity display itself to ensure real-time updates are announced. Ensure all interactive elements have visible focus states using utility classes like `focus:ring-2`.
