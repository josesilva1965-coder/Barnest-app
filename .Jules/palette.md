
## 2024-04-18 - Accessible Cart Quantity Controls
**Learning:** Icon-only buttons for adjusting quantities in dynamic list items (like cart rows) need context-aware `aria-label`s that interpolate the item's name (e.g., "Increase quantity of Wagyu Burger"). Otherwise, screen reader users only hear "Increase" repeatedly without knowing which item it applies to. Additionally, displaying numeric quantities requires `aria-live="polite"` and `aria-atomic="true"` on the wrapper so changes are announced accurately without requiring the user to re-focus the element.
**Action:** Always interpolate item names into ARIA labels for action buttons in loops/lists. Always use `aria-live` on containers that dynamically update values as a result of user action.
