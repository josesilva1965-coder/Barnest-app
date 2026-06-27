## 2024-11-20 - Accessible Cart Quantity Controls
**Learning:** Icon-only buttons used for cart quantity adjustments across different screens (POS, Customer view) lacked ARIA labels, making them completely opaque to screen reader users, and did not have proper keyboard focus rings.
**Action:** Always provide context-rich `aria-label`s and `title` attributes on icon-only buttons (e.g., `aria-label="Decrease quantity of Wagyu Burger"`). Also ensure `focus:ring` states are added for keyboard accessibility and use `aria-live="polite"` on dynamic quantity spans so changes are announced.
