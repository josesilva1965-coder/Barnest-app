
## 2025-03-01 - Dynamic Action Buttons within List Items
**Learning:** Action buttons within dynamic list items (like cart quantity increment/decrement/remove buttons) often lack context when isolated by screen readers, announcing only "Minus" or "Plus".
**Action:** Always provide `aria-label` attributes that interpolate the item's name (e.g., `aria-label="Decrease quantity of Wagyu Burger"`) to ensure context. Additionally, apply `aria-live="polite"` and `aria-atomic="true"` to the numeric container to dynamically announce changes.
