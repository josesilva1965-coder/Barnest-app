## 2026-04-05 - Cart and Order Quantities Need aria-live
**Learning:** Dynamic quantity updates in carts or order summaries are not automatically announced by screen readers. Using just `aria-label` on buttons is insufficient if the updated quantity isn't conveyed.
**Action:** Apply `aria-live="polite"` and `aria-atomic="true"` to the `<span>` elements containing the item quantity to ensure the changed values are narrated to screen reader users when modified via increment/decrement buttons.
