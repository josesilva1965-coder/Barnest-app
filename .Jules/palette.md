## 2024-05-08 - Accessible Cart Quantity Controls
**Learning:** Icon-only buttons used for cart quantity adjustments (e.g., Plus/Minus/Trash icons) were missing accessible names, and dynamic quantity displays weren't announced to screen readers when updated.
**Action:** Added context-aware `aria-label`s (interpolating item names), visible focus rings (`focus:ring-2 focus:ring-brand-secondary focus:outline-none`), and applied `aria-live="polite"` and `aria-atomic="true"` to quantity spans. This pattern should be applied to all dynamic list item action buttons.
