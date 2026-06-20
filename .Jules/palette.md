
## 2023-10-25 - Dynamic List Item Accessibility
**Learning:** Icon-only buttons within dynamic lists (like cart quantities) must use context-aware `aria-label`s that interpolate the item's name (e.g., "Decrease quantity of Burger" instead of just "Decrease"). Otherwise, screen reader users hear repetitive, ambiguous actions.
**Action:** Always interpolate item context into ARIA labels for repeatable list actions and use `aria-live` on containers showing dynamic values.
