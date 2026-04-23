## 2024-04-23 - Dynamic Quantity Control Accessibility
**Learning:** Cart controls with generic plus/minus icons lack context for screen readers when managing multiple items in an order list. The quantity spans also require `aria-live` attributes to announce dynamic state changes properly.
**Action:** Always interpolate the item name into the `aria-label`s for quantity adjustments and remove buttons. Add `aria-live="polite"` and `aria-atomic="true"` to quantity readout elements to ensure screen readers announce changes interactively.
